import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CourtsService } from './courts.service';
import { CreateCourtDto } from './dtos/index.dto';
import { GetUser } from 'src/shared/modules/auth/decorators/get-user.decorator';
import { User } from 'src/shared/interfaces/user.interface';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard())
@Controller('courts')
export class CourtsController {
  constructor(private readonly courtsService: CourtsService) {}

  @Post()
  createCourt(@Body() createCourtDto: CreateCourtDto) {
    return this.courtsService.createCourt(createCourtDto);
  }

  @Get()
  getCourts(@GetUser() user: User) {
    return this.courtsService.getCourts(user);
  }

  @Get(':courtId')
  getCourtById(@Param('courtId', new ParseUUIDPipe()) courtId: string) {
    return this.courtsService.getCourtById(courtId);
  }
}
