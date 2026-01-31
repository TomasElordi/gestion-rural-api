import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtUser } from '../../../common/decorators/current-user.decorator';

import { CreateFarmDto } from './dto/create-farm.dto';
import { FarmMapLayersResponseDto } from './dto/farm-map-layers-response.dto';
import { CreateFarmUseCase } from '../application/use-cases/create-farm.usecase';
import { ListFarmsUseCase } from '../application/use-cases/list-farms.usecase';
import { GetFarmUseCase } from '../application/use-cases/get-farm.usecase';
import { GetFarmMapLayersUseCase } from '../application/use-cases/get-farm-map-layers.usecase';
import { PrismaService } from '@prisma/prisma.service';

@ApiTags('Farms')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('farms')
export class FarmsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly createFarmUC: CreateFarmUseCase,
    private readonly listFarmsUC: ListFarmsUseCase,
    private readonly getFarmUC: GetFarmUseCase,
    private readonly getFarmMapLayersUC: GetFarmMapLayersUseCase,
  ) {}

  private async getCurrentOrganizationId(userId: string): Promise<string> {
    const m = await this.prisma.membership.findFirst({
      where: { userId, deletedAt: null },
      select: { organizationId: true },
      orderBy: { createdAt: 'asc' },
    });
    if (!m) throw new Error('User has no organization'); // después lo hacemos NotFoundException
    return m.organizationId;
  }

  @Post()
  @ApiOperation({ summary: 'Create a farm (campo)' })
  async create(@CurrentUser() user: JwtUser, @Body() dto: CreateFarmDto) {
    const organizationId = await this.getCurrentOrganizationId(user.sub);

    const center =
      dto.center && dto.center.type === 'Point'
        ? { lng: dto.center.coordinates[0], lat: dto.center.coordinates[1] }
        : undefined;

    return this.createFarmUC.execute({
      organizationId,
      name: dto.name,
      center,
    });
  }

  @Get()
  @ApiOperation({ summary: 'List farms for current organization' })
  async list(@CurrentUser() user: JwtUser) {
    const organizationId = await this.getCurrentOrganizationId(user.sub);
    return this.listFarmsUC.execute(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get farm by id (must belong to current org)' })
  async get(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    const organizationId = await this.getCurrentOrganizationId(user.sub);
    return this.getFarmUC.execute({ farmId: id, organizationId });
  }

  @Get(':id/map-layers')
  @ApiOperation({
    summary: 'Get map layers (paddocks + water points) for a farm',
  })
  async getMapLayers(
    @CurrentUser() user: JwtUser,
    @Param('id') id: string,
  ): Promise<FarmMapLayersResponseDto> {
    const organizationId = await this.getCurrentOrganizationId(user.sub);
    return this.getFarmMapLayersUC.execute(id, organizationId);
  }
}
