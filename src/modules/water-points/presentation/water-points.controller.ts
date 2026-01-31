import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtUser } from '../../../common/decorators/current-user.decorator';
import { CreateWaterPointUseCase } from '../application/use-cases/create-water-point.use-case';
import { ListWaterPointsUseCase } from '../application/use-cases/list-water-points.use-case';
import { GetWaterPointUseCase } from '../application/use-cases/get-water-point.use-case';
import { UpdateWaterPointUseCase } from '../application/use-cases/update-water-point.use-case';
import { DeleteWaterPointUseCase } from '../application/use-cases/delete-water-point.use-case';
import { CreateWaterPointDto } from './dto/create-water-point.dto';
import { UpdateWaterPointDto } from './dto/update-water-point.dto';
import { WaterPointResponseDto } from './dto/water-point-response.dto';

@ApiTags('Water Points')
@ApiBearerAuth()
@Controller('farms/:farmId/water-points')
export class WaterPointsController {
  constructor(
    private createWaterPointUseCase: CreateWaterPointUseCase,
    private listWaterPointsUseCase: ListWaterPointsUseCase,
    private getWaterPointUseCase: GetWaterPointUseCase,
    private updateWaterPointUseCase: UpdateWaterPointUseCase,
    private deleteWaterPointUseCase: DeleteWaterPointUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un punto de agua (bebedero, tanque, molino)',
  })
  async create(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @Body() dto: CreateWaterPointDto,
    @CurrentUser() user: JwtUser,
  ): Promise<WaterPointResponseDto> {
    return this.createWaterPointUseCase.execute(farmId, user.orgId!, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los puntos de agua de un campo' })
  async list(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @CurrentUser() user: JwtUser,
  ): Promise<WaterPointResponseDto[]> {
    return this.listWaterPointsUseCase.execute(farmId, user.orgId!);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un punto de agua por ID' })
  async getOne(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtUser,
  ): Promise<WaterPointResponseDto> {
    return this.getWaterPointUseCase.execute(id, farmId, user.orgId!);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un punto de agua' })
  async update(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWaterPointDto,
    @CurrentUser() user: JwtUser,
  ): Promise<WaterPointResponseDto> {
    return this.updateWaterPointUseCase.execute(id, farmId, user.orgId!, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un punto de agua (soft delete)' })
  async delete(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtUser,
  ): Promise<void> {
    await this.deleteWaterPointUseCase.execute(id, farmId, user.orgId!);
  }
}
