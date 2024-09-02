import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { CreateBranchRepositoryDto, UpdateBranchDto } from './dtos/index.dto';

@Injectable()
export class BranchesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createBranch(createBranchRepositoryDto: CreateBranchRepositoryDto) {
    const { branchName, branchAddress, branchHours, companyId, countryId } =
      createBranchRepositoryDto;
    return this.prismaService.branch.create({
      data: {
        branchName,
        branchAddress,
        countryId,
        companyId,
        BranchHour: {
          createMany: {
            data: branchHours,
          },
        },
      },
      select: {
        branchId: true,
      },
    });
  }

  getBranches(companyId: string) {
    return this.prismaService.branch.findMany({
      where: {
        companyId,
      },
      select: {
        branchId: true,
        branchName: true,
        branchAddress: true,
        BranchHour: {
          orderBy: {
            branchHourDayOfWeek: 'asc',
          },
          select: {
            branchHourId: true,
            branchHourDayOfWeek: true,
            branchHourOpeningTime: true,
            branchHourClosingTime: true,
          },
        },
      },
    });
  }

  getBranchById(branchId: string) {
    return this.prismaService.branch.findUniqueOrThrow({
      where: {
        branchId,
      },
      select: {
        branchId: true,
        branchName: true,
        branchAddress: true,
        BranchHour: {
          orderBy: {
            branchHourDayOfWeek: 'asc',
          },
          select: {
            branchHourId: true,
            branchHourDayOfWeek: true,
            branchHourOpeningTime: true,
            branchHourClosingTime: true,
          },
        },
      },
    });
  }

  updateBranch(branchId: string, updateBranchRepositoryDto: UpdateBranchDto) {
    const { branchName, branchAddress, countryId, branchHours } =
      updateBranchRepositoryDto;

    return this.prismaService.branch.update({
      where: {
        branchId,
      },
      data: {
        branchName,
        branchAddress,
        countryId,
        BranchHour: branchHours && {
          deleteMany: {
            branchHourDayOfWeek: {
              notIn: branchHours.map(
                (branchHour) => branchHour.branchHourDayOfWeek,
              ),
            },
          },
          createMany: {
            data: branchHours,
            skipDuplicates: true,
          },
          updateMany: branchHours.map(
            ({
              branchHourDayOfWeek,
              branchHourOpeningTime,
              branchHourClosingTime,
            }) => ({
              where: {
                branchHourDayOfWeek,
              },
              data: {
                branchHourDayOfWeek,
                branchHourOpeningTime,
                branchHourClosingTime,
              },
            }),
          ),
        },
      },
      select: {
        branchId: true,
      },
    });
  }

  getBranchHours(branchId: string) {
    return this.prismaService.branchHour.findMany({
      orderBy: {
        branchHourDayOfWeek: 'asc',
      },
      where: {
        branchId,
      },
      select: {
        branchHourId: true,
        branchHourDayOfWeek: true,
        branchHourOpeningTime: true,
        branchHourClosingTime: true,
      },
    });
  }
}
