import { BadRequestException, Injectable } from '@nestjs/common';
import { CourtsRepository } from './courts.repository';
import { CreateCourtDto, CreateCourtRepositoryDto } from './dtos/index.dto';
import { CourtStatusConstants } from './constants/court-status.constants';
import { BranchesService } from 'src/branches/branches.service';
import * as dayjs from 'dayjs';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { User } from 'src/shared/interfaces/user.interface';
import { getDayOfTheWeek } from 'src/shared/utils/get-day-of-the-week.util';
import { getTimeFromDateTime } from 'src/shared/utils/get-time-from-date-time.util';

@Injectable()
export class CourtsService {
  constructor(
    private readonly courtsRepository: CourtsRepository,
    private readonly branchesService: BranchesService,
  ) {}

  async createCourt(createCourtDto: CreateCourtDto) {
    dayjs.extend(isSameOrBefore);
    dayjs.extend(isSameOrAfter);
    const courtStatusId = CourtStatusConstants.AVAILABLE;
    const { courtName, sportCourtTypeId, branchId, courtPricing } =
      createCourtDto;

    // To-do validate that courtPricing matches with the branch schedule
    const branchHours = await this.branchesService.getBranchHours(branchId);

    courtPricing.forEach((courtPrice) => {
      const {
        courtPricingDayOfWeek,
        courtPricingStartTime,
        courtPricingEndTime,
      } = courtPrice;
      const standardDate = '1970-01-01';
      if (
        !dayjs
          .utc(`${standardDate} ${courtPricingStartTime}`)
          .isBefore(
            dayjs.utc(`${standardDate} ${courtPricingEndTime}`),
            'hours',
          )
      ) {
        throw new BadRequestException(
          'La hora de inicio debe ser anterior a la hora de fin.',
        );
      }
      // Prisma does not support time only fields, so we need to convert the time to a date
      courtPrice.courtPricingStartTime = dayjs
        .utc(`${standardDate} ${courtPricingStartTime}`)
        .toDate();
      courtPrice.courtPricingEndTime = dayjs
        .utc(`${standardDate} ${courtPricingEndTime}`)
        .toDate();

      const isDayOfWeekValid = branchHours.find(
        (branchHour) =>
          branchHour.branchHourDayOfWeek === courtPricingDayOfWeek,
      );

      if (!isDayOfWeekValid) {
        throw new BadRequestException(
          'La sede no abre en el día de la semana seleccionado.',
        );
      }
      const isCourtPricingStartTimeValid = dayjs
        .utc(`${standardDate} ${courtPricingStartTime}`)
        .isSameOrAfter(
          dayjs.utc(isDayOfWeekValid.branchHourOpeningTime),
          'hours',
        );

      if (!isCourtPricingStartTimeValid) {
        throw new BadRequestException(
          'La hora de inicio no puede ser anterior a la hora de apertura de la sede.',
        );
      }

      const isCourtPricingEndTimeValid = dayjs
        .utc(`${standardDate} ${courtPricingEndTime}`)
        .isSameOrBefore(
          dayjs.utc(isDayOfWeekValid.branchHourClosingTime),
          'hours',
        );

      if (!isCourtPricingEndTimeValid) {
        throw new BadRequestException(
          'La hora de fin no puede ser posterior a la hora de cierre de la sede.',
        );
      }
    });

    const createCourtRepositoryDto: CreateCourtRepositoryDto = {
      courtName,
      sportCourtTypeId,
      branchId,
      courtStatusId,
      courtPricing,
    };
    const { courtId } = await this.courtsRepository.createCourt(
      createCourtRepositoryDto,
    );

    return {
      message: 'Cancha creada exitosamente',
      courtId,
    };
  }

  async getCourts(user: User) {
    const companyId = user.companyId;
    const courtsRepository = await this.courtsRepository.getCourts(companyId);

    const courts = courtsRepository.map((court) => {
      const {
        courtId,
        courtName,
        SportCourtType,
        Branch,
        CourtStatus,
        CourtPricing,
      } = court;
      const courtPricing = CourtPricing.map(
        ({
          courtPricingId,
          courtPricingDayOfWeek,
          courtPricingStartTime,
          courtPricingEndTime,
          courtPricingPerHour,
        }) => {
          return {
            courtPricingId,
            courtPricingPerHour: Number(courtPricingPerHour),
            courtPricingDayOfWeek: getDayOfTheWeek(courtPricingDayOfWeek),
            courtPricingStartTime: getTimeFromDateTime(courtPricingStartTime),
            courtPricingEndTime: getTimeFromDateTime(courtPricingEndTime),
          };
        },
      );

      return {
        courtId,
        courtName,
        sportCourtType: {
          sportCourtTypeId: SportCourtType.sportCourtTypeId,
          sportCourtTypeName: SportCourtType.sportCourtTypeName,
        },
        branch: {
          branchId: Branch.branchId,
          branchName: Branch.branchName,
        },
        courtStatus: {
          courtStatusId: CourtStatus.courtStatusId,
          courtStatusName: CourtStatus.courtStatusName,
        },
        courtPricing,
      };
    });

    return courts;
  }

  async getCourtById(courtId: string) {
    const courtRepository = await this.courtsRepository.getCourtById(courtId);

    const { courtName, SportCourtType, Branch, CourtStatus, CourtPricing } =
      courtRepository;

    const courtPricing = CourtPricing.map(
      ({
        courtPricingId,
        courtPricingDayOfWeek,
        courtPricingStartTime,
        courtPricingEndTime,
        courtPricingPerHour,
      }) => {
        return {
          courtPricingId,
          courtPricingPerHour: Number(courtPricingPerHour),
          courtPricingDayOfWeek: getDayOfTheWeek(courtPricingDayOfWeek),
          courtPricingStartTime: getTimeFromDateTime(courtPricingStartTime),
          courtPricingEndTime: getTimeFromDateTime(courtPricingEndTime),
        };
      },
    );

    return {
      courtId,
      courtName,
      sportCourtType: {
        sportCourtTypeId: SportCourtType.sportCourtTypeId,
        sportCourtTypeName: SportCourtType.sportCourtTypeName,
      },
      branch: {
        branchId: Branch.branchId,
        branchName: Branch.branchName,
      },
      courtStatus: {
        courtStatusId: CourtStatus.courtStatusId,
        courtStatusName: CourtStatus.courtStatusName,
      },
      courtPricing,
    };
  }
}
