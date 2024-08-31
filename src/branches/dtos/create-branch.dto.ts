import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsInt,
  IsNotEmpty,
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

export class CreateBranchDto {
  @IsNotEmpty()
  @IsString()
  branchName: string;

  @IsNotEmpty()
  @IsString()
  branchAddress: string;

  @IsNotEmpty()
  @IsPositive()
  countryId: number;

  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BranchHourDto)
  branchHours: BranchHourDto[];
}

export class CreateBranchRepositoryDto extends CreateBranchDto {
  companyId: string;
}
