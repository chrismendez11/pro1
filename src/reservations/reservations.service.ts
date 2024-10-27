import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ReservationsRepository } from './reservations.repository';
import {
  CreateReservationDto,
  CreateReservationRepositoryDto,
  GetReservationsDto,
  UpdateReservationDto,
} from './dtos/index.dto';
import { ReservationStatusConstants } from './constants/reservation-status.constant';
import * as dayjs from 'dayjs';
import { getTimeFromDateTime } from 'src/shared/utils/get-time-from-date-time.util';
import { formatDate } from 'src/shared/utils/format-date.util';
import { getTimezoneByCountryId } from 'src/shared/constants/dayjs-timezones.constants';
import { formatDatetime } from 'src/shared/utils/format-datetime.util';
import { CompaniesService } from 'src/companies/companies.service';
import { User } from 'src/shared/interfaces/user.interface';
import { CourtStatusConstants } from 'src/courts/constants/court-status.constants';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    private readonly companiesService: CompaniesService,
  ) {}

  async createReservation(createReservationDto: CreateReservationDto) {
    const {
      reservationDate,
      reservationStartTime,
      reservarionEndTime,
      courtId,
    } = createReservationDto;

    // Prisma does not support time only fields, so we need to convert the time to a datetime
    const standardDate = dayjs.utc().format('YYYY-MM-DD');
    const startTime = dayjs
      .utc(`${standardDate} ${reservationStartTime}`)
      .toDate();
    const endTime = dayjs.utc(`${standardDate} ${reservarionEndTime}`).toDate();

    if (!dayjs.utc(startTime).isBefore(dayjs.utc(endTime))) {
      throw new BadRequestException(
        'La hora de finalización debe ser posterior a la hora de inicio.',
      );
    }

    const reservationDateFormatted = dayjs.utc(reservationDate).toDate();

    // Reservations status that are considered as active
    const reservationStatusIds = [
      ReservationStatusConstants.ACTIVE,
      ReservationStatusConstants.IN_PROGRESS,
    ];

    // Validating if there is already a reservation for the same court, date and time
    const reservationExists =
      await this.reservationsRepository.getReservationByCourtAndDateTime(
        courtId,
        reservationDateFormatted,
        startTime,
        endTime,
        reservationStatusIds,
      );
    if (reservationExists) {
      throw new ConflictException(
        'Ya existe una reservación para la misma cancha, fecha y hora.',
      );
    }

    // Initial status for the reservation
    const reservationStatusId = ReservationStatusConstants.ACTIVE;

    const createReservationRepositoryDto: CreateReservationRepositoryDto = {
      ...createReservationDto,
      reservationDate: reservationDateFormatted,
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
    const reservationRepository =
      await this.reservationsRepository.getReservationById(reservationId);

    if (!reservationRepository) {
      throw new BadRequestException('Reservación no encontrada.');
    }

    const companySettings = await this.companiesService.getCompanySettings(
      reservationRepository.Court.Branch.companyId,
    );

    const companyCurrency = companySettings?.Currency.currencySymbol || '$';

    const {
      reservationHolderName,
      Court,
      ReservationStatus,
      reservarionEndTime,
      reservationContactPhone,
      reservationCreatedAt,
      reservationtUpdatedAt,
      reservationDate,
      reservationEmail,
      reservationNote,
      reservationStartTime,
      reservationTotalPrice,
    } = reservationRepository;

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
      reservationCurrency: companyCurrency,
      reservationTotalPrice: Number(reservationTotalPrice),
      reservationTotalPriceFormatted: `${companyCurrency} ${reservationTotalPrice}`,
      reservationNote,
      reservationCreatedAt: formatDatetime(reservationCreatedAt, timezone),
      reservarionUpdatedAt: formatDatetime(reservationtUpdatedAt, timezone),
      court: {
        courtId: Court.courtId,
        courtName: Court.courtName,
      },
    };

    return reservation;
  }

  async updateReservation(
    reservationId: string,
    updateReservationDto: UpdateReservationDto,
  ) {
    const {
      reservationDate,
      reservationStartTime,
      reservarionEndTime,
      courtId,
    } = updateReservationDto;

    const reservation =
      await this.reservationsRepository.getReservationById(reservationId);
    if (!reservation) {
      throw new BadRequestException('Reservación no encontrada.');
    }

    // Prisma does not support time only fields, so we need to convert the time to a datetime
    const standardDate = dayjs.utc().format('YYYY-MM-DD');
    const startTime =
      reservationStartTime &&
      dayjs.utc(`${standardDate} ${reservationStartTime}`).toDate();
    const endTime =
      reservarionEndTime &&
      dayjs.utc(`${standardDate} ${reservarionEndTime}`).toDate();

    // Validating that the end time is after the start time. If one of them is being updated but the other is not, we will use the current value
    if (
      startTime &&
      endTime &&
      !dayjs.utc(startTime).isBefore(dayjs.utc(endTime))
    ) {
      throw new BadRequestException(
        'La hora de finalización debe ser posterior a la hora de inicio.',
      );
    } else if (
      startTime &&
      !dayjs
        .utc(startTime)
        .isBefore(
          dayjs
            .utc(
              `${standardDate} ${dayjs.utc(reservation.reservarionEndTime).format('HH:mm:ss')}`,
            )
            .toDate(),
        )
    ) {
      throw new BadRequestException(
        'La hora de finalización debe ser posterior a la hora de inicio.',
      );
    } else if (
      endTime &&
      !dayjs
        .utc(
          dayjs
            .utc(
              `${standardDate} ${dayjs.utc(reservation.reservationStartTime).format('HH:mm:ss')}`,
            )
            .toDate(),
        )
        .isBefore(endTime)
    ) {
      throw new BadRequestException(
        'La hora de finalización debe ser posterior a la hora de inicio.',
      );
    }

    // If the reservation date, startTime or endTime is being updated, we will use the new value for validating if there is already a reservation for the same court, date and time
    let reservationDateFormatted = dayjs
      .utc(reservation.reservationDate)
      .toDate();
    if (
      reservationDate &&
      !dayjs.utc(reservationDate).isSame(dayjs.utc(reservation.reservationDate))
    ) {
      reservationDateFormatted = dayjs.utc(reservationDate).toDate();
    }

    let reservationStartTimeFormatted = dayjs
      .utc(reservation.reservationStartTime)
      .toDate();
    if (
      startTime &&
      !dayjs.utc(startTime).isSame(dayjs.utc(reservation.reservationStartTime))
    ) {
      reservationStartTimeFormatted = startTime;
    }

    let reservationEndTimeFormatted = dayjs
      .utc(reservation.reservarionEndTime)
      .toDate();
    if (
      endTime &&
      !dayjs.utc(endTime).isSame(dayjs.utc(reservation.reservarionEndTime))
    ) {
      reservationEndTimeFormatted = endTime;
    }

    // Reservations status that are considered as active
    const reservationStatusIds = [
      ReservationStatusConstants.ACTIVE,
      ReservationStatusConstants.IN_PROGRESS,
    ];

    // Validating if there is already a reservation for the same court, date and time
    const reservationExists =
      await this.reservationsRepository.getReservationByCourtAndDateTime(
        courtId,
        reservationDateFormatted,
        reservationStartTimeFormatted,
        reservationEndTimeFormatted,
        reservationStatusIds,
      );
    if (
      reservationExists &&
      reservationExists.reservationId !== reservationId
    ) {
      throw new ConflictException(
        'Ya existe una reservación para la misma cancha, fecha y hora.',
      );
    }

    const updateReservationRepositoryDto: UpdateReservationDto = {
      ...updateReservationDto,
      reservationDate: reservationDateFormatted,
      reservationStartTime: reservationStartTimeFormatted,
      reservarionEndTime: reservationEndTimeFormatted,
    };
    await this.reservationsRepository.updateReservation(
      reservationId,
      updateReservationRepositoryDto,
    );

    return {
      message: 'Reservación actualizada exitosamente',
      reservationId,
    };
  }

  async getReservationStatus() {
    return await this.reservationsRepository.getReservationStatus();
  }

  async updateReservationStatus(
    reservationId: string,
    reservationStatusId: string,
  ) {
    const reservation =
      await this.reservationsRepository.getReservationStatusById(reservationId);
    if (!reservation) {
      throw new BadRequestException('Reservación no encontrada.');
    }

    const finalReservationStatus = [
      ReservationStatusConstants.CANCELLED,
      ReservationStatusConstants.COMPLETED,
    ];

    if (finalReservationStatus.includes(reservation.reservationStatusId)) {
      throw new ConflictException(
        'No es posible actualizar el estado de una reservación completada o cancelada.',
      );
    }

    let courtStatusId: string;

    switch (reservationStatusId) {
      case ReservationStatusConstants.ACTIVE:
        courtStatusId = CourtStatusConstants.AVAILABLE;
        break;
      case ReservationStatusConstants.IN_PROGRESS:
        courtStatusId = CourtStatusConstants.IN_USE;
        break;
      case ReservationStatusConstants.COMPLETED:
        courtStatusId = CourtStatusConstants.AVAILABLE;
        break;
      case ReservationStatusConstants.CANCELLED:
        courtStatusId = CourtStatusConstants.AVAILABLE;
        break;
      default:
        throw new BadRequestException('Estado de la reservación inválido');
    }

    await this.reservationsRepository.updateReservationStatus(
      reservationId,
      reservationStatusId,
      reservation.courtId,
      courtStatusId,
    );

    return {
      message: 'Estado de la reservación actualizado exitosamente.',
      reservationId,
    };
  }
}
