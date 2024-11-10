import { Module } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { CourtsController } from './courts.controller';
import { CourtsRepository } from './courts.repository';
import { BranchesModule } from 'src/branches/branches.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { ReservationsModule } from 'src/reservations/reservations.module';

@Module({
  imports: [BranchesModule, CompaniesModule, ReservationsModule],
  controllers: [CourtsController],
  providers: [CourtsService, CourtsRepository],
})
export class CourtsModule {}
