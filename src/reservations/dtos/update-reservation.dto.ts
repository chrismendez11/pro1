import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './index.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  @IsOptional()
  @IsUUID()
  reservationStatusId?: string;
}
