import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtUser } from '../../../common/decorators/current-user.decorator';

import { GetMyOrganizationUseCase } from '../application/use-cases/get-my-organization.usecase';

@ApiTags('Organizations')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly getMyOrgUC: GetMyOrganizationUseCase) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user organization and role' })
  me(@CurrentUser() user: JwtUser) {
    return this.getMyOrgUC.execute(user.sub);
  }
}
