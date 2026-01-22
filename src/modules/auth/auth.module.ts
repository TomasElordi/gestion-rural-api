import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presentation/auth.controller';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { PasswordService } from './application/services/password.service';
import { TokenService } from './application/services/token.service';
import { RegisterUseCase } from './application/use-cases/register.usecase';
import { LoginUseCase } from './application/use-cases/login.usecase';
import { RefreshUseCase } from './application/use-cases/refresh.usecase';
import { LogoutUseCase } from './application/use-cases/logout.usecase';
import { JwtStrategy } from './infrastructure/strategies/jwt-refresh.strategy';
import { JwtRefreshStrategy } from './infrastructure/strategies/jwt.strategy';
import { UserRepository } from './domain/repositories/user.repository';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    // repo binding
    { provide: UserRepository, useClass: PrismaUserRepository },

    // services
    PasswordService,
    TokenService,

    // usecases
    RegisterUseCase,
    LoginUseCase,
    RefreshUseCase,
    LogoutUseCase,

    // strategies
    JwtStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
