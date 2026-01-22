import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtUser } from '../../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterUseCase } from '../application/use-cases/register.usecase';
import { LoginUseCase } from '../application/use-cases/login.usecase';
import { RefreshUseCase } from '../application/use-cases/refresh.usecase';
import { LogoutUseCase } from '../application/use-cases/logout.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    private registerUC: RegisterUseCase,
    private loginUC: LoginUseCase,
    private refreshUC: RefreshUseCase,
    private logoutUC: LogoutUseCase,
  ) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.registerUC.execute(dto);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.loginUC.execute(dto);
  }

  @Public()
  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.refreshUC.execute(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@CurrentUser() user: JwtUser) {
    return this.logoutUC.execute(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: JwtUser) {
    return user;
  }
}
