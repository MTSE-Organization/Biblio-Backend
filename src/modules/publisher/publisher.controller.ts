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
import {
  ApiListResponse,
  ApiResponse,
  ApiResponseNoData,
  PCode
} from '@/common/decorators';
import { Constant } from '@/constants';

@Controller('publisher')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @ApiResponseNoData({ objectName: 'publisher', type: 'create' })
  @PCode('PUB_C')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Post('create')
  async create(@Body() form: CreatePublisherForm) {
    return await this.publisherService.create(form);
  }

  @ApiListResponse(PublisherAutoCompleteDto, { objectName: 'publisher' })
  @Get('list')
  async list(@Query() form: FilterPublisherForm) {
    form.status = Constant.STATUS_ACTIVE;
    const { publishers, count } = await this.publisherService.findAll(form);

    const response: ResponseListDto<PublisherAutoCompleteDto[]> = {
      content: MapperUtil.toDtoList(publishers, PublisherAutoCompleteDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };

    return response;
  }

  @ApiResponse(PublisherDto, { objectName: 'publisher' })
  @Get('get/:id')
  async get(@Param('id') id: bigint) {
    return MapperUtil.toDto(
      await this.publisherService.findByIdAndStatus(id, Constant.STATUS_ACTIVE),
      PublisherDto
    );
  }

  @ApiListResponse(PublisherAutoCompleteDto, { objectName: 'publisher' })
  @PCode('PUB_L')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('private/list')
  async adminList(@Query() form: FilterPublisherForm) {
    const { publishers, count } = await this.publisherService.findAll(form);

    const response: ResponseListDto<PublisherAutoCompleteDto[]> = {
      content: MapperUtil.toDtoList(publishers, PublisherAutoCompleteDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };

    return response;
  }

  @ApiResponse(PublisherDto, { objectName: 'publisher' })
  @PCode('PUB_V')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('private/get/:id')
  async adminGet(@Param('id') id: bigint) {
    return MapperUtil.toDto(
      await this.publisherService.findById(id),
      PublisherDto
    );
  }

  @ApiResponseNoData({ objectName: 'publisher', type: 'update' })
  @PCode('PUB_U')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('update')
  async update(@Body() form: UpdatePublisherForm) {
    return await this.publisherService.update(form);
  }

  @ApiResponseNoData({ objectName: 'publisher', type: 'delete' })
  @PCode('PUB_D')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: bigint) {
    return await this.publisherService.delete(id);
  }

  @ApiResponseNoData({
    message: 'Recover publisher successfully'
  })
  @PCode('PUB_U')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('recover/:id')
  async recover(@Param('id') id: bigint) {
    return await this.publisherService.recover(id);
  }
}
