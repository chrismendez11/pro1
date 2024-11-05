import { Decimal } from '@prisma/client/runtime/library';

export class ReportDto {
  reportType?: string;
  reservationsRepository: {
    reservationId: string;
    reservationHolderName: string;
    reservationContactPhone: string;
    reservationEmail: string;
    reservationDate: Date;
    reservationStartTime: Date;
    reservarionEndTime: Date;
    reservationTotalPrice: Decimal;
    ReservationStatus: {
      reservationStatusId: string;
      reservationStatusName: string;
    };
    Court: {
      courtId: string;
      courtName: string;
    };
  }[];
  companyCurrency: string;
}
