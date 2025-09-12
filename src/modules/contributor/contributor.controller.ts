import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { ContributorService } from './contributor.service';
import {
  CreateContributorForm,
  FilterContributorForm,
  UpdateContributorForm
} from './forms';
import { ContributorDto, ContributorAutoCompleteDto } from './dtos';
import { JwtAuthGuard } from '../auth/guards';
import { MapperUtil } from '@/utils';
import { ResponseListDto } from '@/common/interfaces';

@Controller('contributor')
export class ContributorController {
  constructor(private readonly contributorService: ContributorService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() form: CreateContributorForm) {
    return await this.contributorService.create(form);
  }

  @Get('list')
  async list(@Query() form: FilterContributorForm) {
    const { contributors, count } = await this.contributorService.findAll(form);

    const response: ResponseListDto<ContributorAutoCompleteDto[]> = {
      content: contributors.map((c) => ({
        id: c.id,
        name: c.name,
        avatarPath: c.avatarPath
      })),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };

    return response;
  }

  @Get('get/:id')
  async get(@Param('id') id: bigint) {
    return MapperUtil.toDto(
      await this.contributorService.findById(id),
      ContributorDto
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async update(@Body() form: UpdateContributorForm) {
    return await this.contributorService.update(form);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: bigint) {
    return await this.contributorService.delete(id);
  }
}
