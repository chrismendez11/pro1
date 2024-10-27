import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import {
  CreateReservationRepositoryDto,
  GetReservationsDto,
  UpdateReservationDto,
} from './dtos/index.dto';

@Injectable()
export class ReservationsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createReservation(
    createReservationRepositoryDto: CreateReservationRepositoryDto,
  ) {
    return this.prismaService.reservation.create({
      data: createReservationRepositoryDto,
      select: {
        reservationId: true,
      },
    });
  }

  getReservations(
    companyId: string,
    getReservationsRepositoryDto: GetReservationsDto,
  ) {
    const { reservationStatusId, reservationHolderName } =
      getReservationsRepositoryDto;
    return this.prismaService.reservation.findMany({
      orderBy: [
        {
          reservationDate: 'asc',
        },
        { reservationStartTime: 'asc' },
        { reservarionEndTime: 'asc' },
      ],
      where: {
        Court: {
          Branch: {
            companyId,
          },
        },
        reservationStatusId,
        reservationHolderName: {
          contains: reservationHolderName,
        },
      },
      select: {
        reservationId: true,
        reservationHolderName: true,
        reservationDate: true,
        reservationStartTime: true,
        reservarionEndTime: true,
        ReservationStatus: true,
        reservationCreatedAt: true,
        Court: {
          select: {
            Branch: {
              select: {
                countryId: true,
              },
            },
          },
        },
      },
    });
  }

  getReservationById(reservationId: string) {
    return this.prismaService.reservation.findUnique({
      where: {
        reservationId,
      },
      select: {
        reservationId: true,
        reservationHolderName: true,
        reservationContactPhone: true,
        reservationEmail: true,
        reservationDate: true,
        reservationStartTime: true,
        reservarionEndTime: true,
        reservationTotalPrice: true,
        reservationNote: true,
        courtId: true,
        reservationStatusId: true,
        reservationCreatedAt: true,
        reservationtUpdatedAt: true,
        ReservationStatus: true,
        Court: {
          select: {
            courtId: true,
            courtName: true,
            Branch: {
              select: {
                countryId: true,
                companyId: true,
              },
            },
          },
        },
      },
    });
  }

  updateReservation(
    reservationId: string,
    updateReservationRepositoryDto: UpdateReservationDto,
  ) {
    return this.prismaService.reservation.update({
      where: {
        reservationId,
      },
      data: updateReservationRepositoryDto,
      select: {
        reservationId: true,
      },
    });
  }

  getReservationStatus() {
    return this.prismaService.reservationStatus.findMany({
      orderBy: {
        reservationStatusName: 'asc',
      },
    });
  }

  getReservationByCourtAndDateTime(
    courtId: string,
    reservationDate: Date,
    reservationStartTime: Date | string,
    reservarionEndTime: Date | string,
    reservationStatusIds: string[],
  ) {
    return this.prismaService.reservation.findFirst({
      where: {
        courtId,
        reservationDate,
        reservationStatusId: {
          in: reservationStatusIds,
        },
        OR: [
          {
            reservationStartTime: {
              lte: reservationStartTime,
            },
            reservarionEndTime: {
              gte: reservarionEndTime,
            },
          },
          {
            reservationStartTime: {
              gte: reservationStartTime,
            },
            reservarionEndTime: {
              lte: reservarionEndTime,
            },
          },
          {
            reservarionEndTime: {
              gte: reservationStartTime,
              lte: reservarionEndTime,
            },
          },
          {
            reservationStartTime: {
              gte: reservationStartTime,
              lte: reservarionEndTime,
            },
          },
        ],
      },
      select: {
        reservationId: true,
      },
    });
  }

  getReservationStatusById(reservationId: string) {
    return this.prismaService.reservation.findUnique({
      where: {
        reservationId,
      },
      select: {
        reservationStatusId: true,
        courtId: true,
      },
    });
  }

  updateReservationStatus(
    reservationId: string,
    reservationStatusId: string,
    courtId: string,
    courtStatusId: string,
  ) {
    const reservation = this.prismaService.reservation.update({
      where: {
        reservationId,
      },
      data: {
        reservationStatusId,
      },
      select: {
        reservationId: true,
      },
    });
    const court = this.prismaService.court.update({
      where: {
        courtId,
      },
      data: {
        courtStatusId,
      },
      select: {
        courtId: true,
      },
    });

    return this.prismaService.$transaction([reservation, court]);
  }
}
