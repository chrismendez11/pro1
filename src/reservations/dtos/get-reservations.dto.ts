import { IsOptional, IsString, IsUUID } from 'class-validator';

export class GetReservationsDto {
  @IsOptional()
  @IsUUID()
  reservationStatusId?: string;

  @IsOptional()
  @IsString()
  reservationHolderName?: string;
}
