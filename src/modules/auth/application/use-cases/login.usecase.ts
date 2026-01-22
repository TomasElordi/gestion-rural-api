import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordService } from '../services/password.service';
import { TokenService } from '../services/token.service';
import { LoginDto } from '../../presentation/dto/login.dto';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly password: PasswordService,
    private readonly tokens: TokenService,
  ) {}

  async execute(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await this.password.verify(user.passwordHash, dto.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const membership = await this.users.getOrganizationForUser(user.id);

    const accessToken = this.tokens.signAccess({
      sub: user.id,
      email: user.email,
      orgId: membership?.organizationId,
      role: membership?.role,
    });

    const refreshToken = this.tokens.signRefresh({
      sub: user.id,
      email: user.email,
    });

    const refreshHash = await this.password.hash(refreshToken);
    await this.users.setRefreshTokenHash(user.id, refreshHash);

    return { accessToken, refreshToken };
  }
}
