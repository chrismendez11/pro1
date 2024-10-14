import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import {
  CreateReservationRepositoryDto,
  GetReservationsDto,
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
    return this.prismaService.reservation.findUniqueOrThrow({
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
        reservationCreatedAt: true,
        ReservationStatus: true,
        Court: {
          select: {
            courtId: true,
            courtName: true,
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
}
