import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { PasswordService } from '../services/password.service';
import { TokenService } from '../services/token.service';
import { UserRepository } from '../../domain/repositories/user.repository';
import { RegisterDto } from '../../presentation/dto/register.dto';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly users: UserRepository,
    private password: PasswordService,
    private tokens: TokenService,
  ) {}

  async execute(dto: RegisterDto) {
    const exists = await this.users.findByEmail(dto.email);
    if (exists) throw new ConflictException('Email already registered');

    const passwordHash = await this.password.hash(dto.password);
    const organizationName = dto.organizationName?.trim() || 'Mi Organización';

    const { userId, organizationId } = await this.users.createUserWithOrg({
      email: dto.email,
      fullName: dto.fullName,
      passwordHash,
      organizationName,
    });

    const accessToken = this.tokens.signAccess({
      sub: userId,
      email: dto.email,
      orgId: organizationId,
      role: 'owner',
    });

    const refreshToken = this.tokens.signRefresh({
      sub: userId,
      email: dto.email,
    });

    // hash refresh
    const refreshHash = await this.password.hash(refreshToken);
    await this.users.setRefreshTokenHash(userId, refreshHash);

    return { accessToken, refreshToken };
  }
}
