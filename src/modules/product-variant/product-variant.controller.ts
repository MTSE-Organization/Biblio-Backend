import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { ProductVariantService } from './product-variant.service';
import {
  CreateProductVariantForm,
  FilterProductVariantForm,
  UpdateProductVariantForm
} from './forms';
import { ResponseListDto } from '@/common/interfaces';
import { MapperUtil } from '@/utils';
import { ProductVariantAutoCompleteDto, ProductVariantDto } from './dtos';

@Controller('product-variant')
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @Post('create')
  async create(@Body() form: CreateProductVariantForm) {
    return await this.productVariantService.create(form);
  }

  @Get('list')
  async adminList(@Query() form: FilterProductVariantForm) {
    const { productVariants, count } =
      await this.productVariantService.findAll(form);

    const response: ResponseListDto<ProductVariantAutoCompleteDto[]> = {
      content: MapperUtil.toDtoList(
        productVariants,
        ProductVariantAutoCompleteDto
      ),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };

    return response;
  }

  @Get('get/:id')
  async get(@Param('id') id: bigint) {
    return MapperUtil.toDto(
      await this.productVariantService.findById(id),
      ProductVariantDto
    );
  }

  @Put('update')
  async update(@Body() form: UpdateProductVariantForm) {
    return await this.productVariantService.update(form);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: bigint) {
    return await this.productVariantService.delete(id);
  }
}
