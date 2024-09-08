import { IsOptional, IsString, IsUUID } from 'class-validator';

export class GetCourtsDto {
  @IsOptional()
  @IsString()
  courtName?: string;

  @IsOptional()
  @IsUUID()
  branchId?: string;

  @IsOptional()
  @IsUUID()
  sportCourtTypeId?: string;

  @IsOptional()
  @IsUUID()
  courtStatusId?: string;
}
