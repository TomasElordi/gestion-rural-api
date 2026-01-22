import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordService } from '../services/password.service';
import { TokenService } from '../services/token.service';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class RefreshUseCase {
  constructor(
    private readonly users: UserRepository,
    private password: PasswordService,
    private tokens: TokenService,
  ) {}

  async execute(refreshToken: string) {
    let payload: { sub: string; email: string };
    try {
      payload = this.tokens.verifyRefresh(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.users.findById(payload.sub);
    if (!user || !user.refreshTokenHash)
      throw new UnauthorizedException('Invalid refresh token');

    const ok = await this.password.verify(user.refreshTokenHash, refreshToken);
    if (!ok) throw new UnauthorizedException('Invalid refresh token');

    const membership = await this.users.getOrganizationForUser(user.id);

    const accessToken = this.tokens.signAccess({
      sub: user.id,
      email: user.email,
      orgId: membership?.organizationId,
      role: membership?.role,
    });

    // rotación opcional (recomendado): emitir nuevo refresh y guardar hash nuevo
    const newRefreshToken = this.tokens.signRefresh({
      sub: user.id,
      email: user.email,
    });
    const newRefreshHash = await this.password.hash(newRefreshToken);
    await this.users.setRefreshTokenHash(user.id, newRefreshHash);

    return { accessToken, refreshToken: newRefreshToken };
  }
}
