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
import { Constant } from '@/constants/constant';

@Controller('translator')
export class TranslatorController {
  constructor(private readonly contributorService: ContributorService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() form: CreateContributorForm) {
    return await this.contributorService.create(
      form,
      Constant.CONTRIBUTOR_KIND_TRANSLATOR
    );
  }

  @Get('list')
  async list(@Query() form: FilterContributorForm) {
    form.kind = Constant.CONTRIBUTOR_KIND_TRANSLATOR;
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
      await this.contributorService.findByIdAndKind(
        id,
        Constant.CONTRIBUTOR_KIND_TRANSLATOR
      ),
      ContributorDto
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async update(@Body() form: UpdateContributorForm) {
    return await this.contributorService.update(
      form,
      Constant.CONTRIBUTOR_KIND_TRANSLATOR
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: bigint) {
    return await this.contributorService.delete(
      id,
      Constant.CONTRIBUTOR_KIND_TRANSLATOR
    );
  }
}
