import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCompanyDto, UpdateCompanyDto } from './dtos/index.dto';

@UseGuards(AuthGuard())
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.createCompany(createCompanyDto);
  }

  @Get()
  getCompanies() {
    return this.companiesService.getCompanies();
  }

  @Put(':companyId')
  updateCompanyId(
    @Param('companyId', new ParseUUIDPipe()) companyId: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.updateCompanyById(companyId, updateCompanyDto);
  }
}
