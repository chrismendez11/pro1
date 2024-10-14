import { Injectable } from '@nestjs/common';
import { ReservationsRepository } from './reservations.repository';
import {
  CreateReservationDto,
  CreateReservationRepositoryDto,
  GetReservationsDto,
} from './dtos/index.dto';
import { ReservationStatusConstants } from './constants/reservation-status.constant';
import * as dayjs from 'dayjs';
import { User } from '@prisma/client';
import { getTimeFromDateTime } from 'src/shared/utils/get-time-from-date-time.util';
import { formatDate } from 'src/shared/utils/format-date.util';
import { getTimezoneByCountryId } from 'src/shared/constants/dayjs-timezones.constants';
import { formatDatetime } from 'src/shared/utils/format-datetime.util';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
  ) {}

  async createReservation(createReservationDto: CreateReservationDto) {
    const reservationStatusId = ReservationStatusConstants.ACTIVE;

    const { reservationDate, reservationStartTime, reservarionEndTime } =
      createReservationDto;

    // Prisma does not support time only fields, so we need to convert the time to a date
    const standardDate = '1970-01-01';
    const startTime = dayjs
      .utc(`${standardDate} ${reservationStartTime}`)
      .toDate();
    const endTime = dayjs.utc(`${standardDate} ${reservarionEndTime}`).toDate();

    const createReservationRepositoryDto: CreateReservationRepositoryDto = {
      ...createReservationDto,
      reservationDate: dayjs.utc(reservationDate).toDate(),
      reservationStartTime: startTime,
      reservarionEndTime: endTime,
      reservationStatusId,
    };

    const { reservationId } =
      await this.reservationsRepository.createReservation(
        createReservationRepositoryDto,
      );

    return {
      message: 'Reservación creada exitosamente',
      reservationId,
    };
  }

  async getReservations(getReservationsDto: GetReservationsDto, user: User) {
    const companyId = user.companyId;
    const reservationsRepository =
      await this.reservationsRepository.getReservations(
        companyId,
        getReservationsDto,
      );

    const reservations = reservationsRepository.map(
      ({
        reservationId,
        reservationHolderName,
        reservationDate,
        reservationStartTime,
        reservarionEndTime,
        ReservationStatus,
        reservationCreatedAt,
        Court,
      }) => {
        const timezone = getTimezoneByCountryId(Court.Branch.countryId);
        return {
          reservationId,
          reservationHolderName,
          reservationDate: formatDate(reservationDate),
          reservationStartTime: getTimeFromDateTime(reservationStartTime),
          reservarionEndTime: getTimeFromDateTime(reservarionEndTime),
          reservationStatus: ReservationStatus,
          reservationCreatedAt: formatDatetime(reservationCreatedAt, timezone),
        };
      },
    );

    return reservations;
  }

  async getReservationById(reservationId: string) {
    const {
      reservationHolderName,
      Court,
      ReservationStatus,
      reservarionEndTime,
      reservationContactPhone,
      reservationCreatedAt,
      reservationDate,
      reservationEmail,
      reservationNote,
      reservationStartTime,
      reservationTotalPrice,
    } = await this.reservationsRepository.getReservationById(reservationId);

    const timezone = getTimezoneByCountryId(Court.Branch.countryId);
    const reservation = {
      reservationId,
      reservationHolderName,
      reservationContactPhone,
      reservationEmail,
      reservationDate: formatDate(reservationDate),
      reservationStartTime: getTimeFromDateTime(reservationStartTime),
      reservarionEndTime: getTimeFromDateTime(reservarionEndTime),
      reservationStatus: ReservationStatus,
      reservationTotalPrice: Number(reservationTotalPrice),
      reservationNote,
      reservationCreatedAt: formatDatetime(reservationCreatedAt, timezone),
      court: {
        courtId: Court.courtId,
        courtName: Court.courtName,
      },
    };

    return reservation;
  }
}
