import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtUser } from '../../../common/decorators/current-user.decorator';
import { CreateGrazingEventDto } from './dto/create-grazing-event.dto';
import { UpdateGrazingEventDto } from './dto/update-grazing-event.dto';
import { QueryGrazingEventsDto } from './dto/query-grazing-events.dto';
import { GrazingEventResponseDto } from './dto/grazing-event-response.dto';
import { CreateGrazingEventUseCase } from '../application/use-cases/create-grazing-event.use-case';
import { ListGrazingEventsUseCase } from '../application/use-cases/list-grazing-events.use-case';
import { GetGrazingEventUseCase } from '../application/use-cases/get-grazing-event.use-case';
import { UpdateGrazingEventUseCase } from '../application/use-cases/update-grazing-event.use-case';
import { DeleteGrazingEventUseCase } from '../application/use-cases/delete-grazing-event.use-case';

@ApiTags('Grazing Events')
@ApiBearerAuth()
@Controller('farms/:farmId/grazing-events')
export class GrazingEventsController {
  constructor(
    private createGrazingEventUseCase: CreateGrazingEventUseCase,
    private listGrazingEventsUseCase: ListGrazingEventsUseCase,
    private getGrazingEventUseCase: GetGrazingEventUseCase,
    private updateGrazingEventUseCase: UpdateGrazingEventUseCase,
    private deleteGrazingEventUseCase: DeleteGrazingEventUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a grazing event',
    description:
      'Creates a new grazing event. Status is automatically determined based on start/end dates. ' +
      'UGM snapshot is captured from the herd group at creation time.',
  })
  async create(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @Body() dto: CreateGrazingEventDto,
    @CurrentUser() user: JwtUser,
  ): Promise<GrazingEventResponseDto> {
    return this.createGrazingEventUseCase.execute(farmId, user.orgId!, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List grazing events for a farm' })
  @ApiQuery({
    name: 'from',
    required: false,
    type: String,
    description: 'Filter by start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    type: String,
    description: 'Filter by end date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['planned', 'active', 'done', 'canceled'],
    description: 'Filter by status',
  })
  async findAll(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @Query() query: QueryGrazingEventsDto,
    @CurrentUser() user: JwtUser,
  ): Promise<GrazingEventResponseDto[]> {
    return this.listGrazingEventsUseCase.execute(farmId, user.orgId!, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a grazing event by ID' })
  async findOne(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtUser,
  ): Promise<GrazingEventResponseDto> {
    return this.getGrazingEventUseCase.execute(id, farmId, user.orgId!);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a grazing event',
    description:
      'Updates a grazing event. Validates resource availability when changing status to active.',
  })
  async update(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGrazingEventDto,
    @CurrentUser() user: JwtUser,
  ): Promise<GrazingEventResponseDto> {
    return this.updateGrazingEventUseCase.execute(id, farmId, user.orgId!, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a grazing event (soft delete)' })
  async remove(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtUser,
  ): Promise<{ message: string }> {
    await this.deleteGrazingEventUseCase.execute(id, farmId, user.orgId!);
    return { message: 'Grazing event deleted successfully' };
  }
}
