import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/client';

export class HerdGroupResponseDto {
  @ApiProperty({ example: 'c7e9c8a0-1234-5678-9abc-def012345678' })
  id: string;

  @ApiProperty({ example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab' })
  farmId: string;

  @ApiProperty({ example: 'Terneros 2024' })
  name: string;

  @ApiProperty({ example: 'Terneros', required: false })
  category: string | null;

  @ApiProperty({
    example: 4500.5,
    description: 'Total live weight of the herd group in kilograms',
  })
  liveWeightKg: number;

  @ApiProperty({
    example: 10.0011,
    description: 'UGM (Unidad Ganadera Mayor) calculated from live weight',
  })
  ugm: number;

  @ApiProperty({
    example: 25,
    required: false,
    description: 'Number of animals',
  })
  headCount: number | null;

  @ApiProperty({ example: 'Lote de terneros de destete', required: false })
  notes: string | null;

  @ApiProperty({ example: '2024-01-20T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-20T15:45:00.000Z' })
  updatedAt: Date;

  static fromPrisma(herdGroup: {
    id: string;
    farmId: string;
    name: string;
    category: string | null;
    liveWeightKg: Decimal;
    ugm: Decimal;
    headCount: number | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): HerdGroupResponseDto {
    return {
      id: herdGroup.id,
      farmId: herdGroup.farmId,
      name: herdGroup.name,
      category: herdGroup.category,
      liveWeightKg: herdGroup.liveWeightKg.toNumber(),
      ugm: herdGroup.ugm.toNumber(),
      headCount: herdGroup.headCount,
      notes: herdGroup.notes,
      createdAt: herdGroup.createdAt,
      updatedAt: herdGroup.updatedAt,
    };
  }
}
