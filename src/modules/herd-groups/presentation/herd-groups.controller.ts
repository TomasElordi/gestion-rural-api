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
import { CreateHerdGroupDto } from './dto/create-herd-group.dto';
import { UpdateHerdGroupDto } from './dto/update-herd-group.dto';
import { HerdGroupResponseDto } from './dto/herd-group-response.dto';
import { CreateHerdGroupUseCase } from '../application/use-cases/create-herd-group.use-case';
import { ListHerdGroupsUseCase } from '../application/use-cases/list-herd-groups.use-case';
import { GetHerdGroupUseCase } from '../application/use-cases/get-herd-group.use-case';
import { UpdateHerdGroupUseCase } from '../application/use-cases/update-herd-group.use-case';
import { DeleteHerdGroupUseCase } from '../application/use-cases/delete-herd-group.use-case';

@ApiTags('Herd Groups')
@ApiBearerAuth()
@Controller('farms/:farmId/herd-groups')
export class HerdGroupsController {
  constructor(
    private createHerdGroupUseCase: CreateHerdGroupUseCase,
    private listHerdGroupsUseCase: ListHerdGroupsUseCase,
    private getHerdGroupUseCase: GetHerdGroupUseCase,
    private updateHerdGroupUseCase: UpdateHerdGroupUseCase,
    private deleteHerdGroupUseCase: DeleteHerdGroupUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a herd group (lote)',
    description:
      'Creates a new herd group for a farm. UGM is automatically calculated from live weight.',
  })
  async create(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @Body() dto: CreateHerdGroupDto,
    @CurrentUser() user: JwtUser,
  ): Promise<HerdGroupResponseDto> {
    return this.createHerdGroupUseCase.execute(farmId, user.orgId!, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all herd groups of a farm' })
  async findAll(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @CurrentUser() user: JwtUser,
  ): Promise<HerdGroupResponseDto[]> {
    return this.listHerdGroupsUseCase.execute(farmId, user.orgId!);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a herd group by ID' })
  async findOne(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtUser,
  ): Promise<HerdGroupResponseDto> {
    return this.getHerdGroupUseCase.execute(id, farmId, user.orgId!);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a herd group',
    description:
      'Updates a herd group. If live weight changes, UGM is automatically recalculated.',
  })
  async update(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateHerdGroupDto,
    @CurrentUser() user: JwtUser,
  ): Promise<HerdGroupResponseDto> {
    return this.updateHerdGroupUseCase.execute(id, farmId, user.orgId!, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a herd group (soft delete)' })
  async remove(
    @Param('farmId', ParseUUIDPipe) farmId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtUser,
  ): Promise<{ message: string }> {
    await this.deleteHerdGroupUseCase.execute(id, farmId, user.orgId!);
    return { message: 'Herd group deleted successfully' };
  }
}
