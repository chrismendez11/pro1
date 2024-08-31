import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dtos/index.dto';

@Injectable()
export class CompaniesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createCompany(createCompanyDto: CreateCompanyDto) {
    const { companySetting, ...createCompanyRepositoryDto } = createCompanyDto;

    return this.prismaService.company.create({
      data: {
        ...createCompanyRepositoryDto,
        CompanySetting: {
          create: companySetting,
        },
      },
      select: { companyId: true },
    });
  }

  getCompanies() {
    return this.prismaService.company.findMany();
  }

  getCompanyByName(companyName: string) {
    return this.prismaService.company.findFirst({
      where: { companyName },
    });
  }

  getCompanyByEmail(companyEmail: string) {
    return this.prismaService.company.findFirst({
      where: { companyEmail },
    });
  }

  updateCompanyById(companyId: string, updateCompanyDto: UpdateCompanyDto) {
    const { companySetting, ...updateCompanyRepositoryDto } = updateCompanyDto;

    return this.prismaService.company.update({
      where: { companyId },
      data: {
        ...updateCompanyRepositoryDto,
        CompanySetting: {
          upsert: {
            create: companySetting,
            update: companySetting,
          },
        },
      },
    });
  }
}
