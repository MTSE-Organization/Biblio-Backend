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
import { ProductImageService } from './product-image.service';
import { JwtAuthGuard, AuthorizationGuard } from '../auth/guards';
import {
  ApiListResponse,
  ApiResponse,
  ApiResponseNoData,
  PCode
} from '@/common/decorators';
import { MapperUtil } from '@/utils';
import { ResponseListDto } from '@/common/interfaces';
import {
  CreateProductImageForm,
  FilterProductImageForm,
  UpdateDefaultImageForm
} from './form';
import { UpdateOrderingForm } from '@/common/forms';
import { ProductImageDto } from './dtos';

@Controller('product-image')
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @ApiResponseNoData({ objectName: 'product image', type: 'create' })
  @PCode('PRD_IMG_C')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Post('create')
  async create(@Body() form: CreateProductImageForm) {
    return await this.productImageService.create(form);
  }

  @ApiListResponse(ProductImageDto, { objectName: 'product image' })
  @PCode('PRD_IMG_L')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('list')
  async list(@Query() form: FilterProductImageForm) {
    const { productImages, count } = await this.productImageService.list(form);

    const response: ResponseListDto<ProductImageDto[]> = {
      content: MapperUtil.toDtoList(productImages, ProductImageDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };

    return response;
  }

  @ApiResponse(ProductImageDto, { objectName: 'product image' })
  @PCode('PRD_IMG_V')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('get/:id')
  async get(@Param('id') id: bigint) {
    const productImage = await this.productImageService.get(id);
    return MapperUtil.toDto(productImage, ProductImageDto);
  }

  @ApiResponseNoData({ objectName: 'product image', type: 'delete' })
  @PCode('PRD_IMG_D')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: bigint) {
    return await this.productImageService.delete(id);
  }

  @ApiResponseNoData({ objectName: 'product image', type: 'update' })
  @PCode('PRD_IMG_U')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('update-ordering')
  async updateOrdering(@Body() form: UpdateOrderingForm[]) {
    return await this.productImageService.updateOrdering(form);
  }

  @ApiResponseNoData({ message: 'Set default product image successfully' })
  @PCode('PRD_IMG_U')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('set-default')
  async updateDefault(@Body() form: UpdateDefaultImageForm) {
    return await this.productImageService.updateDefault(form);
  }
}
