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
import { AuthorizationGuard, JwtAuthGuard } from '../auth/guards';
import { MapperUtil } from '@/utils';
import { ResponseListDto } from '@/common/interfaces';
import { Constant } from '@/constants';
import { PCode } from '@/common/decorators';

@Controller('translator')
export class TranslatorController {
  constructor(private readonly contributorService: ContributorService) {}

  @PCode('TRANS_C')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
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
    form.status = Constant.STATUS_ACTIVE;
    const { contributors, count } = await this.contributorService.findAll(form);

    const response: ResponseListDto<ContributorDto[]> = {
      content: MapperUtil.toDtoList(contributors, ContributorDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };

    return response;
  }

  @Get('get/:id')
  async get(@Param('id') id: bigint) {
    return MapperUtil.toDto(
      await this.contributorService.findByIdAndKindAndStatus(
        id,
        Constant.CONTRIBUTOR_KIND_TRANSLATOR,
        Constant.STATUS_ACTIVE
      ),
      ContributorDto
    );
  }

  @PCode('TRANS_L')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('private/list')
  async adminList(@Query() form: FilterContributorForm) {
    form.kind = Constant.CONTRIBUTOR_KIND_TRANSLATOR;
    const { contributors, count } = await this.contributorService.findAll(form);

    const response: ResponseListDto<ContributorDto[]> = {
      content: MapperUtil.toDtoList(contributors, ContributorDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };

    return response;
  }

  @PCode('TRANS_V')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('private/get/:id')
  async adminGet(@Param('id') id: bigint) {
    return MapperUtil.toDto(
      await this.contributorService.findByIdAndKind(
        id,
        Constant.CONTRIBUTOR_KIND_TRANSLATOR
      ),
      ContributorDto
    );
  }

  @PCode('TRANS_U')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('update')
  async update(@Body() form: UpdateContributorForm) {
    return await this.contributorService.update(
      form,
      Constant.CONTRIBUTOR_KIND_TRANSLATOR
    );
  }

  @PCode('TRANS_D')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: bigint) {
    return await this.contributorService.delete(
      id,
      Constant.CONTRIBUTOR_KIND_TRANSLATOR
    );
  }

  @PCode('TRANS_U')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('recover/:id')
  async recover(@Param('id') id: bigint) {
    return await this.contributorService.recover(id);
  }
}
