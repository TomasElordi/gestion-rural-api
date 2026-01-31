import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtUser } from '../../../common/decorators/current-user.decorator';
import { CreatePaddockDto } from './dto/create-paddock.dto';
import { UpdatePaddockDto } from './dto/update-paddock.dto';
import { PaddockResponseDto } from './dto/paddock-response.dto';
import { CreatePaddockUseCase } from '../application/use-cases/create-paddock.use-case';
import { ListPaddocksUseCase } from '../application/use-cases/list-paddocks.use-case';
import { GetPaddockUseCase } from '../application/use-cases/get-paddock.use-case';
import { UpdatePaddockUseCase } from '../application/use-cases/update-paddock.use-case';
import { DeletePaddockUseCase } from '../application/use-cases/delete-paddock.use-case';

@ApiTags('Paddocks')
@ApiBearerAuth()
@Controller('farms/:farmId/paddocks')
export class PaddocksController {
  constructor(
    private createPaddockUseCase: CreatePaddockUseCase,
    private listPaddocksUseCase: ListPaddocksUseCase,
    private getPaddockUseCase: GetPaddockUseCase,
    private updatePaddockUseCase: UpdatePaddockUseCase,
    private deletePaddockUseCase: DeletePaddockUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un paddock (potrero virtual)' })
  async create(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @Body() dto: CreatePaddockDto,
    @CurrentUser() user: JwtUser,
  ): Promise<PaddockResponseDto> {
    return this.createPaddockUseCase.execute(farmId, user.orgId!, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar paddocks de un farm' })
  async findAll(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @CurrentUser() user: JwtUser,
  ): Promise<PaddockResponseDto[]> {
    return this.listPaddocksUseCase.execute(farmId, user.orgId!);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un paddock por ID' })
  async findOne(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtUser,
  ): Promise<PaddockResponseDto> {
    return this.getPaddockUseCase.execute(id, farmId, user.orgId!);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un paddock' })
  async update(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePaddockDto,
    @CurrentUser() user: JwtUser,
  ): Promise<PaddockResponseDto> {
    return this.updatePaddockUseCase.execute(id, farmId, user.orgId!, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un paddock (soft delete)' })
  async remove(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtUser,
  ): Promise<{ message: string }> {
    await this.deletePaddockUseCase.execute(id, farmId, user.orgId!);
    return { message: 'Paddock deleted successfully' };
  }
}
