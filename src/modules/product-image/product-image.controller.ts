import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { CreateProductImageForm } from './form/create-product-image.form';
import { UpdateProductImageForm } from './form/update-product-image.form';
import { FilterProductImageForm } from './form/filter-product-image.form';
import { UpdateOrderingForm } from '../../common/forms/update-ordering.form';
import { JwtAuthGuard, AuthorizationGuard } from '../auth/guards';
import { PCode } from '@/common/decorators';
import { MapperUtil } from '@/utils';
import { ProductImageDto } from './dtos/product-image.dto';
import { ResponseListDto } from '@/common/interfaces';
import { UpdateDefaultImageForm } from './form/update-default-image.form';

@Controller('product-image')
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @PCode('PRD_IMG_C')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Post('create')
  async create(@Body() form: CreateProductImageForm) {
    return await this.productImageService.create(form);
  }

  @PCode('PRD_IMG_L')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('list')
  async list(@Query() form: FilterProductImageForm) {
    const { content, totalElements, totalPages } =
      await this.productImageService.list(form);

    const response: ResponseListDto<ProductImageDto[]> = {
      content: MapperUtil.toDtoList(content, ProductImageDto),
      totalElements,
      totalPages,
    };

    return response;
  }

  @PCode('PRD_IMG_V')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('get/:id')
  async get(@Param('id') id: bigint) {
    const productImage = await this.productImageService.get(id);
    return MapperUtil.toDto(productImage, ProductImageDto);
  }

  @PCode('PRD_IMG_U')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('update')
  async update(@Body() form: UpdateProductImageForm) {
    return await this.productImageService.update(form);
  }

  @PCode('PRD_IMG_D')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: bigint) {
    return await this.productImageService.delete(id);
  }

  @PCode('PRD_IMG_U')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('update-ordering')
  async updateOrdering(@Body() form: UpdateOrderingForm[]) {
    return await this.productImageService.updateOrdering(form);
  }
  @PCode('PIMG_U')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('update-default')
  async updateDefault(@Body() form: UpdateDefaultImageForm) {
    return await this.productImageService.updateDefault(form);
  }
}
