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
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/shared/modules/auth/decorators/get-user.decorator';

@UseGuards(AuthGuard())
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.createCompany(createCompanyDto);
  }

  @Get()
  getCompanies(@GetUser() user: any) {
    console.log(user);
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
