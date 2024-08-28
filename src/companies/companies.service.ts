import { ConflictException, Injectable } from '@nestjs/common';
import { CompaniesRepository } from './companies.repository';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';

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

  getCompanies() {
    return this.companiesRepository.getCompanies();
  }

  async updateCompanyById(
    companyId: string,
    updateCompanyDto: UpdateCompanyDto,
  ) {
    const { companyName, companyEmail } = updateCompanyDto;

    const companyNameExists =
      await this.companiesRepository.getCompanyByName(companyName);
    if (companyNameExists && companyNameExists.companyId !== companyId) {
      throw new ConflictException(
        'Ya existe una compañia con el nombre proporcionado',
      );
    }

    const companyEmailExists =
      await this.companiesRepository.getCompanyByEmail(companyEmail);
    if (companyEmailExists && companyEmailExists.companyId !== companyId) {
      throw new ConflictException(
        'Ya existe una compañia con el correo proporcionado',
      );
    }

    await this.companiesRepository.updateCompanyById(
      companyId,
      updateCompanyDto,
    );

    return {
      message: 'Compañia actualizada exitosamente!',
      companyId,
    };
  }
}
