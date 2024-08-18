import { ConflictException, Injectable } from '@nestjs/common';
import { CompaniesRepository } from './companies.repository';
import { CreateCompanyDto } from './dtos/create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly companiesRepository: CompaniesRepository) {}

  async createCompany(createCompanyDto: CreateCompanyDto) {
    const { companyName } = createCompanyDto;

    const company =
      await this.companiesRepository.getCompanyByName(companyName);
    if (company) {
      throw new ConflictException(
        'Ya existe una compañia con el nombre proporcionado',
      );
    }

    const { companyId } =
      await this.companiesRepository.createCompany(createCompanyDto);

    return {
      message: 'Compañia creada exitosamente!',
      companyId,
    };
  }
}
