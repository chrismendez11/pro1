import { ReportDto } from './dtos';
import { ReportStrategy } from './interfaces/report-strategy.interface';

export class ReportContext {
  private reportStrategy: ReportStrategy;

  constructor(reportStrategy: ReportStrategy) {
    this.reportStrategy = reportStrategy;
  }

  public setStrategy(reportStrategy: ReportStrategy) {
    this.reportStrategy = reportStrategy;
  }

  public generateReport(reportDto: ReportDto): Promise<{
    contentType: string;
    filename: string;
    data: Buffer;
  }> {
    return this.reportStrategy.generateReport(reportDto);
  }
}
