import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import {
  CreateCourtRepositoryDto,
  GetCourtsDto,
  UpdateCourtDto,
} from './dtos/index.dto';

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

  getCourts(companyId: string, getCourtsDto: GetCourtsDto) {
    const { courtName, branchId, courtStatusId, sportCourtTypeId } =
      getCourtsDto;
    return this.prismaService.court.findMany({
      orderBy: {
        courtName: 'asc',
      },
      where: {
        courtName: {
          contains: courtName,
        },
        branchId,
        courtStatusId,
        sportCourtTypeId,
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

  updateCourt(courtId: string, updateCourtRepositoryDto: UpdateCourtDto) {
    const { courtName, sportCourtTypeId, branchId, courtPricing } =
      updateCourtRepositoryDto;
    return this.prismaService.court.update({
      where: {
        courtId,
      },
      data: {
        courtName,
        sportCourtTypeId,
        branchId,
        CourtPricing: courtPricing && {
          deleteMany: {},
          createMany: {
            data: courtPricing,
          },
        },
      },
    });
  }

  getBranchByCourtId(courtId: string) {
    return this.prismaService.court.findUniqueOrThrow({
      where: {
        courtId,
      },
      select: {
        branchId: true,
      },
    });
  }

  getCourtStatus() {
    return this.prismaService.courtStatus.findMany({
      orderBy: {
        courtStatusName: 'asc',
      },
    });
  }
}
