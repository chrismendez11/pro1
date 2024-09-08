import {
  BadRequestException,
  ConflictException,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { CourtsRepository } from './courts.repository';
import {
  CreateCourtDto,
  CreateCourtRepositoryDto,
  UpdateCourtDto,
  CourtPricingDto,
  GetCourtsDto,
} from './dtos/index.dto';
import { CourtStatusConstants } from './constants/court-status.constants';
import { BranchesService } from 'src/branches/branches.service';
import * as dayjs from 'dayjs';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { User } from 'src/shared/interfaces/user.interface';
import { getDayOfTheWeek } from 'src/shared/utils/get-day-of-the-week.util';
import { getTimeFromDateTime } from 'src/shared/utils/get-time-from-date-time.util';

@Injectable()
export class CourtsService implements OnModuleInit {
  constructor(
    private readonly courtsRepository: CourtsRepository,
    private readonly branchesService: BranchesService,
  ) {}

  onModuleInit() {
    dayjs.extend(isSameOrBefore);
    dayjs.extend(isSameOrAfter);
  }

  async createCourt(createCourtDto: CreateCourtDto) {
    const courtStatusId = CourtStatusConstants.AVAILABLE;
    const { courtName, sportCourtTypeId, branchId, courtPricing } =
      createCourtDto;

    await this.courtPricingValidation(courtPricing, branchId);

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

  async getCourts(getCourtsDto: GetCourtsDto, user: User) {
    const companyId = user.companyId;
    const courtsRepository = await this.courtsRepository.getCourts(
      companyId,
      getCourtsDto,
    );

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

  async updateCourt(courtId: string, updateCourtDto: UpdateCourtDto) {
    const { branchId, courtPricing } = updateCourtDto;

    await this.courtPricingValidation(courtPricing, branchId);

    await this.courtsRepository.updateCourt(courtId, updateCourtDto);

    return { message: 'Cancha actualizada exitosamente', courtId };
  }

  private async courtPricingValidation(
    courtPricing: CourtPricingDto[],
    branchId: string,
  ): Promise<void> {
    // Validating the courtPricing matches with the branch schedule
    const branchHours = await this.branchesService.getBranchHours(branchId);

    courtPricing.forEach((courtPrice, index) => {
      const {
        courtPricingDayOfWeek,
        courtPricingStartTime,
        courtPricingEndTime,
      } = courtPrice;

      // Prisma does not support time only fields, so we need to convert the time to a date
      const standardDate = '1970-01-01';

      const startTime = dayjs.utc(`${standardDate} ${courtPricingStartTime}`);
      const endTime = dayjs.utc(`${standardDate} ${courtPricingEndTime}`);

      if (!startTime.isBefore(endTime, 'hours')) {
        throw new BadRequestException(
          'La hora de inicio debe ser anterior a la hora de fin.',
        );
      }

      const isDayOfWeekValid = branchHours.find(
        (branchHour) =>
          branchHour.branchHourDayOfWeek === courtPricingDayOfWeek,
      );
      if (!isDayOfWeekValid) {
        throw new ConflictException(
          `La sede seleccionada no opera los días ${getDayOfTheWeek(courtPricingDayOfWeek)}.`,
        );
      }

      const isCourtPricingStartTimeValid = startTime.isSameOrAfter(
        dayjs.utc(isDayOfWeekValid.branchHourOpeningTime),
        'hours',
      );
      if (!isCourtPricingStartTimeValid) {
        throw new ConflictException(
          'La hora de inicio debe ser igual o posterior a la hora de apertura de la sede seleccionada.',
        );
      }

      const isCourtPricingEndTimeValid = endTime.isSameOrBefore(
        dayjs.utc(isDayOfWeekValid.branchHourClosingTime),
        'hours',
      );
      if (!isCourtPricingEndTimeValid) {
        throw new ConflictException(
          'La hora de fin debe ser igual o anterior a la hora de cierre de la sede seleccionada.',
        );
      }

      // Validating that the courtPricing does not overlap with another courtPricing
      courtPricing.forEach((otherCourtPrice, otherIndex) => {
        if (index === otherIndex) return; // Skip the same courtPricing

        if (otherCourtPrice.courtPricingDayOfWeek === courtPricingDayOfWeek) {
          const otherStartTime = dayjs.utc(
            `${standardDate} ${otherCourtPrice.courtPricingStartTime}`,
          );
          const otherEndTime = dayjs.utc(
            `${standardDate} ${otherCourtPrice.courtPricingEndTime}`,
          );

          const isOverlapping =
            startTime.isBefore(otherEndTime) && endTime.isAfter(otherStartTime);

          if (isOverlapping) {
            throw new ConflictException(
              'El rango de horas de un precio se sobrepone con otro precio en el mismo día.',
            );
          }
        }
      });

      // Updating the courtPricing from string to date
      courtPrice.courtPricingStartTime = startTime.toDate();
      courtPrice.courtPricingEndTime = endTime.toDate();
    });
  }
}
