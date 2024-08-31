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
import { BranchesService } from './branches.service';
import { GetUser } from 'src/shared/modules/auth/decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/shared/interfaces/user.interface';
import { CreateBranchDto, UpdateBranchDto } from './dtos/index.dto';

@UseGuards(AuthGuard())
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  createBranch(
    @Body() createBranchDto: CreateBranchDto,
    @GetUser() user: User,
  ) {
    return this.branchesService.createBranch(createBranchDto, user);
  }

  @Get()
  getBranches(@GetUser() user: User) {
    return this.branchesService.getBranches(user);
  }

  @Get(':branchId')
  getBranchById(@Param('branchId', new ParseUUIDPipe()) branchId: string) {
    return this.branchesService.getBranchById(branchId);
  }

  @Put(':branchId')
  updateBranch(
    @Param('branchId', new ParseUUIDPipe()) branchId: string,
    @Body() updateBranchDto: UpdateBranchDto,
  ) {
    return this.branchesService.updateBranch(branchId, updateBranchDto);
  }
}
