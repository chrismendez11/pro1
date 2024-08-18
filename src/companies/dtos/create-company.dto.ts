import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class CreateCompanySettingDto {
  @IsNotEmpty()
  @IsUUID()
  companySettingCurrencyId: string;
}

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsOptional()
  @IsEmail()
  companyEmail?: string;

  @IsOptional()
  @IsString()
  companyContactPhone?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCompanySettingDto)
  companySetting?: CreateCompanySettingDto;
}
