import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './index.dto';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {}
