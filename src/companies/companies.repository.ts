import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { CreateCompanyDto } from './dtos/create-company.dto';

@Injectable()
export class CompaniesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createCompany(createCompanyDto: CreateCompanyDto) {
    const { companySetting, ...createCompanyRepositoryDto } = createCompanyDto;

    return await this.prismaService.company.create({
      data: {
        ...createCompanyRepositoryDto,
        CompanySetting: {
          create: companySetting,
        },
      },
      select: { companyId: true },
    });
  }

  async getCompanyByName(companyName: string) {
    return await this.prismaService.company.findFirst({
      where: { companyName },
    });
  }
}
