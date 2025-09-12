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
import { PublisherService } from './publisher.service';
import {
  CreatePublisherForm,
  FilterPublisherForm,
  UpdatePublisherForm
} from './forms';
import { PublisherDto, PublisherAutoCompleteDto } from './dtos';
import { AuthorizationGuard, JwtAuthGuard } from '../auth/guards';
import { MapperUtil } from '@/utils';
import { ResponseListDto } from '@/common/interfaces';
import { PCode } from '@/common/decorators';

@Controller('publisher')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @PCode('PUB_C')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Post('create')
  async create(@Body() form: CreatePublisherForm) {
    return await this.publisherService.create(form);
  }

  @Get('list')
  async list(@Query() form: FilterPublisherForm) {
    const { publishers, count } = await this.publisherService.findAll(form);

    const response: ResponseListDto<PublisherAutoCompleteDto[]> = {
      content: publishers.map((p) => ({ id: p.id, name: p.name })),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };

    return response;
  }

  @Get('get/:id')
  async get(@Param('id') id: bigint) {
    return MapperUtil.toDto(
      await this.publisherService.findById(id),
      PublisherDto
    );
  }

  @PCode('PUB_L')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('private/list')
  async adminList(@Query() form: FilterPublisherForm) {
    const { publishers, count } = await this.publisherService.findAll(form);

    const response: ResponseListDto<PublisherAutoCompleteDto[]> = {
      content: publishers.map((p) => ({ id: p.id, name: p.name })),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };

    return response;
  }

  @PCode('PUB_V')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('private/get/:id')
  async adminGet(@Param('id') id: bigint) {
    return MapperUtil.toDto(
      await this.publisherService.findById(id),
      PublisherDto
    );
  }

  @PCode('PUB_U')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('update')
  async update(@Body() form: UpdatePublisherForm) {
    return await this.publisherService.update(form);
  }

  @PCode('PUB_D')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: bigint) {
    return await this.publisherService.delete(id);
  }
}
