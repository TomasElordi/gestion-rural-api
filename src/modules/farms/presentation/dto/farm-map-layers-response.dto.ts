import { ApiProperty } from '@nestjs/swagger';
import { PaddockResponseDto } from '../../../paddocks/presentation/dto/paddock-response.dto';
import { WaterPointResponseDto } from '../../../water-points/presentation/dto/water-point-response.dto';
import { HerdGroupResponseDto } from '../../../herd-groups/presentation/dto/herd-group-response.dto';
import { GrazingEventResponseDto } from '../../../grazing-events/presentation/dto/grazing-event-response.dto';

export class FarmMapLayersResponseDto {
  @ApiProperty({
    type: [PaddockResponseDto],
    description: 'Lista de paddocks del campo',
  })
  paddocks: PaddockResponseDto[];

  @ApiProperty({
    type: [WaterPointResponseDto],
    description: 'Lista de puntos de agua del campo',
  })
  waterPoints: WaterPointResponseDto[];

  @ApiProperty({
    type: [HerdGroupResponseDto],
    description: 'Lista de grupos de hacienda del campo (opcional)',
    required: false,
  })
  herdGroups?: HerdGroupResponseDto[];

  @ApiProperty({
    type: [GrazingEventResponseDto],
    description: 'Lista de eventos de pastoreo activos del campo (opcional)',
    required: false,
  })
  grazingEvents?: GrazingEventResponseDto[];
}
