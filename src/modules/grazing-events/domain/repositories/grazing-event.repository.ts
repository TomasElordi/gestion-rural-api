import { CreateGrazingEventDto } from '../../presentation/dto/create-grazing-event.dto';
import { UpdateGrazingEventDto } from '../../presentation/dto/update-grazing-event.dto';
import { GrazingEventResponseDto } from '../../presentation/dto/grazing-event-response.dto';
import { QueryGrazingEventsDto } from '../../presentation/dto/query-grazing-events.dto';

export abstract class GrazingEventRepository {
  abstract create(
    farmId: string,
    dto: CreateGrazingEventDto,
    status: string,
    ugmSnapshot: number | null,
  ): Promise<GrazingEventResponseDto>;

  abstract findAllByFarmId(
    farmId: string,
    query: QueryGrazingEventsDto,
  ): Promise<GrazingEventResponseDto[]>;

  abstract findById(
    id: string,
    farmId: string,
  ): Promise<GrazingEventResponseDto | null>;

  abstract update(
    id: string,
    farmId: string,
    dto: UpdateGrazingEventDto,
  ): Promise<GrazingEventResponseDto>;

  abstract delete(id: string, farmId: string): Promise<void>;

  abstract findActiveByHerdGroupId(
    herdGroupId: string,
    excludeEventId?: string,
  ): Promise<GrazingEventResponseDto[]>;

  abstract findActiveByPaddockId(
    paddockId: string,
    excludeEventId?: string,
  ): Promise<GrazingEventResponseDto[]>;
}
