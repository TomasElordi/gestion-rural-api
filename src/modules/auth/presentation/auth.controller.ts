import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Public } from '../../../common/decorators/public.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtUser } from '../../../common/decorators/current-user.decorator';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

import { RegisterUseCase } from '../application/use-cases/register.usecase';
import { LoginUseCase } from '../application/use-cases/login.usecase';
import { RefreshUseCase } from '../application/use-cases/refresh.usecase';
import { LogoutUseCase } from '../application/use-cases/logout.usecase';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUC: RegisterUseCase,
    private readonly loginUC: LoginUseCase,
    private readonly refreshUC: RefreshUseCase,
    private readonly logoutUC: LogoutUseCase,
  ) {}

  // ---------- PUBLIC ----------

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user and create organization' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiBody({ type: RegisterDto })
  register(@Body() dto: RegisterDto) {
    return this.registerUC.execute(dto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiBody({ type: LoginDto })
  login(@Body() dto: LoginDto) {
    return this.loginUC.execute(dto);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, description: 'Token refreshed' })
  @ApiBody({ type: RefreshDto })
  refresh(@Body() dto: RefreshDto) {
    return this.refreshUC.execute(dto.refreshToken);
  }

  // ---------- PROTECTED ----------

  @ApiBearerAuth('access-token')
  @Post('logout')
  @ApiOperation({ summary: 'Logout current user (invalidate refresh token)' })
  logout(@CurrentUser() user: JwtUser) {
    return this.logoutUC.execute(user.sub);
  }

  @ApiBearerAuth('access-token')
  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user' })
  me(@CurrentUser() user: JwtUser) {
    return user;
  }
}
