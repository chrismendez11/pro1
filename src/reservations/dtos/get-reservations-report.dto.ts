import { IsEnum, IsOptional } from 'class-validator';
import { GetReservationsDto } from './get-reservations.dto';
import { ReportType } from 'src/reservations/enums/report-types.enum';
import { Transform } from 'class-transformer';

export class GetReservationsReportDto extends GetReservationsDto {
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  @IsEnum(ReportType)
  reportType?: ReportType;
}
