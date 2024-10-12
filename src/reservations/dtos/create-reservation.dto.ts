import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsString()
  reservationHolderName: string;

  @IsOptional()
  @IsString()
  reservationContactPhone?: string;

  @IsOptional()
  @IsEmail()
  reservationEmail?: string;

  @IsNotEmpty()
  @IsUUID()
  courtId: string;

  @IsNotEmpty()
  @IsDateString()
  reservationDate: Date;

  @IsNotEmpty()
  @IsString()
  reservationStartTime: string | Date;

  @IsNotEmpty()
  @IsString()
  reservarionEndTime: string | Date;

  @IsNotEmpty()
  @IsPositive()
  reservationTotalPrice: number;

  @IsOptional()
  @IsString()
  reservationNote?: string;
}

export class CreateReservationRepositoryDto extends CreateReservationDto {
  reservationStatusId: string;
}
