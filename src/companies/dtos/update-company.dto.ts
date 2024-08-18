import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

class UpdateCompanySettingDto {
  @IsOptional()
  @IsUUID()
  companySettingCurrencyId: string;
}

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  companyEmail?: string;

  @IsOptional()
  @IsString()
  companyContactPhone?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateCompanySettingDto)
  companySetting?: UpdateCompanySettingDto;
}
