import { BadRequestException, Injectable } from '@nestjs/common';
import { BranchesRepository } from './branches.repository';
import {
  CreateBranchDto,
  CreateBranchRepositoryDto,
} from './dtos/create-branch.dto';
import * as dayjs from 'dayjs';
import { User } from 'src/shared/interfaces/user.interface';
import { getDayOfTheWeek } from 'src/shared/utils/get-day-of-the-week.util';

@Injectable()
export class BranchesService {
  constructor(private readonly branchesRepository: BranchesRepository) {}

  async createBranch(createBranchDto: CreateBranchDto, user: User) {
    const companyId = user.companyId;
    const { branchName, branchAddress, countryId, branchHours } =
      createBranchDto;

    branchHours.forEach((branchHour) => {
      const { branchHourOpeningTime, branchHourClosingTime } = branchHour;
      const standardDate = '2000-01-01';
      if (
        !dayjs
          .utc(`${standardDate} ${branchHourOpeningTime}`)
          .isBefore(
            dayjs.utc(`${standardDate} ${branchHourClosingTime}`),
            'hours',
          )
      ) {
        throw new BadRequestException(
          'La hora de apertura debe ser anterior a la hora de cierre.',
        );
      }
      // Prisma does not support time only fields, so we need to convert the time to a date
      branchHour.branchHourOpeningTime = dayjs
        .utc(`${standardDate} ${branchHourOpeningTime}`)
        .toDate();
      branchHour.branchHourClosingTime = dayjs
        .utc(`${standardDate} ${branchHourClosingTime}`)
        .toDate();
    });

    const createBranchRepositoryDto: CreateBranchRepositoryDto = {
      branchName,
      branchAddress,
      branchHours,
      countryId,
      companyId,
    };
    const { branchId } = await this.branchesRepository.createBranch(
      createBranchRepositoryDto,
    );

    return {
      message: 'Sede creada exitosamente',
      branchId,
    };
  }

  async getBranches(user: User) {
    const companyId = user.companyId;
    const branchesRepository =
      await this.branchesRepository.getBranches(companyId);

    const branches = branchesRepository.map(
      ({ branchId, branchName, branchAddress, BranchHour }) => {
        const branchHours = BranchHour.map(
          ({
            branchHourId,
            branchHourDayOfWeek,
            branchHourOpeningTime,
            branchHourClosingTime,
          }) => {
            return {
              branchHourId,
              branchHourDayOfWeek: getDayOfTheWeek(branchHourDayOfWeek),
              branchHourOpeningTime: dayjs
                .utc(branchHourOpeningTime)
                .format('HH:mm'),
              branchHourClosingTime: dayjs
                .utc(branchHourClosingTime)
                .format('HH:mm'),
            };
          },
        );

        return {
          branchId,
          branchName,
          branchAddress,
          branchHours,
        };
      },
    );

    return branches;
  }

  async getBranchById(branchId: string) {
    const branchRepository =
      await this.branchesRepository.getBranchById(branchId);
    const { branchName, branchAddress, BranchHour } = branchRepository;

    const branchHours = BranchHour.map(
      ({
        branchHourId,
        branchHourDayOfWeek,
        branchHourOpeningTime,
        branchHourClosingTime,
      }) => {
        return {
          branchHourId,
          branchHourDayOfWeek: getDayOfTheWeek(branchHourDayOfWeek),
          branchHourOpeningTime: dayjs
            .utc(branchHourOpeningTime)
            .format('HH:mm'),
          branchHourClosingTime: dayjs
            .utc(branchHourClosingTime)
            .format('HH:mm'),
        };
      },
    );

    const branch = {
      branchId,
      branchName,
      branchAddress,
      branchHours,
    };

    return branch;
  }
}
