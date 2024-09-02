import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class CourtPricingDto {
  @IsNotEmpty()
  @IsPositive()
  courtPricingPerHour: number;

  @IsNotEmpty()
  @IsInt()
  courtPricingDayOfWeek: number;

  @IsNotEmpty()
  @IsString()
  courtPricingStartTime: string | Date;

  @IsNotEmpty()
  @IsString()
  courtPricingEndTime: string | Date;
}

export class CreateCourtDto {
  @IsNotEmpty()
  @IsString()
  courtName: string;

  @IsNotEmpty()
  @IsUUID()
  sportCourtTypeId: string;

  @IsNotEmpty()
  @IsUUID()
  branchId: string;

  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CourtPricingDto)
  courtPricing: CourtPricingDto[];
}

export class CreateCourtRepositoryDto extends CreateCourtDto {
  courtStatusId: string;
}
