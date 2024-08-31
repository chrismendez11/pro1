import { Module } from '@nestjs/common';
import { PrismaModule } from './shared/modules/prisma/prisma.module';
import { CompaniesModule } from './companies/companies.module';
import { AuthModule } from './shared/modules/auth/auth.module';
import { UsersModule } from './users/users.module';
import { WinstonModule } from 'nest-winston';
import { winstonLogger } from './shared/loggers/winston.logger';
import { BranchesModule } from './branches/branches.module';

@Module({
  imports: [
    WinstonModule.forRoot(winstonLogger),
    PrismaModule,
    AuthModule,
    CompaniesModule,
    UsersModule,
    BranchesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
