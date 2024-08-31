import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { CreateBranchRepositoryDto } from './dtos/create-branch.dto';

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
}
