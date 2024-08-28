import { Module } from '@nestjs/common';
import { PrismaModule } from './shared/modules/prisma/prisma.module';
import { CompaniesModule } from './companies/companies.module';
import { AuthModule } from './shared/modules/auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, AuthModule, CompaniesModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
