import { formatDate } from 'src/shared/utils/format-date.util';
import { ReportDto } from '../dtos';
import { ReportStrategy } from '../interfaces/report-strategy.interface';
import * as ExcelJS from 'exceljs';
import * as mime from 'mime-types';
import { getTimeFromDateTime } from 'src/shared/utils/get-time-from-date-time.util';
import { ReportType } from 'src/reservations/enums/report-types.enum';
import { BadRequestException } from '@nestjs/common';

export class ExcelCsvReportStrategy implements ReportStrategy {
  async generateReport(reportDto: ReportDto): Promise<{
    contentType: string;
    filename: string;
    data: Buffer;
  }> {
    const { reservationsRepository, companyCurrency, reportType } = reportDto;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reservaciones');

    // Header styles
    const font: Partial<ExcelJS.Font> = { bold: true };
    const alignment: Partial<ExcelJS.Alignment> = {
      vertical: 'middle',
      horizontal: 'center',
    };

    const row1 = worksheet.getRow(1);
    row1.font = font;
    row1.alignment = alignment;

    // Header columns
    worksheet.columns = [
      {
        key: 'reservationHolderName',
        header: 'Nombre del titular',
        width: 20,
      },
      {
        key: 'reservationContactPhone',
        header: 'Número de contacto',
        width: 20,
      },
      {
        key: 'reservationEmail',
        header: 'Correo electrónico',
        width: 24,
      },
      {
        key: 'courtName',
        header: 'Cancha',
        width: 16,
      },
      {
        key: 'reservationDate',
        header: 'Fecha de reservación',
        width: 18,
      },
      {
        key: 'reservationStartTime',
        header: 'Hora de inicio',
        width: 16,
      },
      {
        key: 'reservarionEndTime',
        header: 'Hora de finalización',
        width: 16,
      },
      {
        key: 'reservationTotalPrice',
        header: 'Precio total',
        width: 16,
        style: {
          numFmt: `"${companyCurrency}"#,##0.00`,
        },
      },
      {
        key: 'reservationStatusName',
        header: 'Estado',
        width: 16,
      },
    ];

    const reservations = reservationsRepository.map(
      ({
        reservationHolderName,
        reservationContactPhone,
        reservationEmail,
        Court,
        reservationDate,
        reservationStartTime,
        reservarionEndTime,
        reservationTotalPrice,
        ReservationStatus,
      }) => {
        return {
          reservationHolderName,
          reservationContactPhone,
          reservationEmail,
          courtName: Court.courtName,
          reservationDate: formatDate(reservationDate),
          reservationStartTime: getTimeFromDateTime(reservationStartTime),
          reservarionEndTime: getTimeFromDateTime(reservarionEndTime),
          reservationTotalPrice: Number(reservationTotalPrice),
          reservationStatusName: ReservationStatus.reservationStatusName,
        };
      },
    );

    worksheet.addRows(reservations);

    let buffer: ExcelJS.Buffer;
    let fileExtension: '.xlsx' | '.csv';
    switch (reportType) {
      case ReportType.EXCEL:
        buffer = await workbook.xlsx.writeBuffer();
        fileExtension = '.xlsx';
        break;
      case ReportType.CSV:
        buffer = await workbook.csv.writeBuffer();
        fileExtension = '.csv';
        break;
      default:
        throw new BadRequestException('Tipo de reporte inválido');
    }

    return {
      contentType: mime.contentType(fileExtension) as string,
      filename: `Reservaciones${fileExtension}`,
      data: Buffer.from(buffer),
    };
  }
}
