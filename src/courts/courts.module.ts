import { Module } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { CourtsController } from './courts.controller';
import { CourtsRepository } from './courts.repository';
import { BranchesModule } from 'src/branches/branches.module';

@Module({
  imports: [BranchesModule],
  controllers: [CourtsController],
  providers: [CourtsService, CourtsRepository],
})
export class CourtsModule {}
