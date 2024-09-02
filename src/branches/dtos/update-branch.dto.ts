import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

class BranchHourDto {
  @IsNotEmpty()
  @IsInt()
  branchHourDayOfWeek: number;

  @IsNotEmpty()
  @IsString()
  branchHourOpeningTime: string | Date;

  @IsNotEmpty()
  @IsString()
  branchHourClosingTime: string | Date;
}

export class UpdateBranchDto {
  @IsOptional()
  @IsString()
  branchName?: string;

  @IsOptional()
  @IsString()
  branchAddress?: string;

  @IsOptional()
  @IsPositive()
  countryId?: number;

  @IsOptional()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BranchHourDto)
  branchHours?: BranchHourDto[];
}
