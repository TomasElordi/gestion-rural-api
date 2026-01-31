import { PartialType } from '@nestjs/swagger';
import { CreatePaddockDto } from './create-paddock.dto';

export class UpdatePaddockDto extends PartialType(CreatePaddockDto) {}
