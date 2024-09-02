import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { CreateCourtRepositoryDto } from './dtos/index.dto';

@Injectable()
export class CourtsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createCourt(createCourtRepositoryDto: CreateCourtRepositoryDto) {
    const {
      courtName,
      sportCourtTypeId,
      branchId,
      courtStatusId,
      courtPricing,
    } = createCourtRepositoryDto;
    return this.prismaService.court.create({
      data: {
        courtName,
        sportCourtTypeId,
        branchId,
        courtStatusId,
        CourtPricing: {
          createMany: {
            data: courtPricing,
          },
        },
      },
      select: {
        courtId: true,
      },
    });
  }

  getCourts(companyId: string) {
    return this.prismaService.court.findMany({
      orderBy: {
        courtName: 'asc',
      },
      where: {
        Branch: {
          companyId,
        },
      },
      select: {
        courtId: true,
        courtName: true,
        SportCourtType: {
          select: {
            sportCourtTypeId: true,
            sportCourtTypeName: true,
          },
        },
        Branch: {
          select: {
            branchId: true,
            branchName: true,
          },
        },
        CourtStatus: {
          select: {
            courtStatusId: true,
            courtStatusName: true,
          },
        },
        CourtPricing: {
          orderBy: [
            {
              courtPricingDayOfWeek: 'asc',
            },
            {
              courtPricingStartTime: 'asc',
            },
          ],
          select: {
            courtPricingId: true,
            courtPricingPerHour: true,
            courtPricingDayOfWeek: true,
            courtPricingStartTime: true,
            courtPricingEndTime: true,
          },
        },
      },
    });
  }

  getCourtById(courtId: string) {
    return this.prismaService.court.findUniqueOrThrow({
      where: {
        courtId,
      },
      select: {
        courtId: true,
        courtName: true,
        SportCourtType: {
          select: {
            sportCourtTypeId: true,
            sportCourtTypeName: true,
          },
        },
        Branch: {
          select: {
            branchId: true,
            branchName: true,
          },
        },
        CourtStatus: {
          select: {
            courtStatusId: true,
            courtStatusName: true,
          },
        },
        CourtPricing: {
          orderBy: [
            {
              courtPricingDayOfWeek: 'asc',
            },
            {
              courtPricingStartTime: 'asc',
            },
          ],
          select: {
            courtPricingId: true,
            courtPricingPerHour: true,
            courtPricingDayOfWeek: true,
            courtPricingStartTime: true,
            courtPricingEndTime: true,
          },
        },
      },
    });
  }
}
