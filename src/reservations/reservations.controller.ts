import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import {
  CreateReservationDto,
  GetReservationsDto,
  UpdateReservationDto,
} from './dtos/index.dto';
import { GetUser } from 'src/shared/modules/auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard())
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  createReservation(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.createReservation(createReservationDto);
  }

  @Get()
  getReservations(
    @Query() getReservationsDto: GetReservationsDto,
    @GetUser() user: User,
  ) {
    return this.reservationsService.getReservations(getReservationsDto, user);
  }

  @Get('status')
  getReservationStatus() {
    return this.reservationsService.getReservationStatus();
  }

  @Get(':reservationId')
  getReservationById(
    @Param('reservationId', new ParseUUIDPipe()) reservationId: string,
  ) {
    return this.reservationsService.getReservationById(reservationId);
  }

  @Put(':reservationId')
  updateReservation(
    @Param('reservationId', new ParseUUIDPipe()) reservationId: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.updateReservation(
      reservationId,
      updateReservationDto,
    );
  }
}
