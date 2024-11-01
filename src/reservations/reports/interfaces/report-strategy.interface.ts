import { ReportDto } from '../dtos';

export interface ReportStrategy {
  generateReport(reportDto: ReportDto): Promise<{
    contentType: string;
    filename: string;
    data: Buffer;
  }>;
}
