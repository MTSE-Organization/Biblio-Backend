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
import { ProductService } from './product.service';
import {
  CreateProductForm,
  FilterProductForm,
  UpdateProductForm
} from './forms';
import { ProductDto } from './dtos';
import { ResponseListDto } from '@/common/interfaces';
import { MapperUtil } from '@/utils';
import { JwtAuthGuard } from '../auth/guards';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() form: CreateProductForm) {
    return await this.productService.create(form);
  }

  @Get('list')
  async list(@Query() form: FilterProductForm) {
    const { products, count } = await this.productService.findAll(form);
    const response: ResponseListDto<ProductDto[]> = {
      content: MapperUtil.toDtoList(products, ProductDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };
    return response;
  }

  @Get('get/:id')
  async get(@Param('id') id: bigint) {
    return MapperUtil.toDto(await this.productService.findById(id), ProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async update(@Body() form: UpdateProductForm) {
    return await this.productService.update(form);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: bigint) {
    return await this.productService.delete(id);
  }

  @Get('latest')
  async getLatest() {
    return {
      content: MapperUtil.toDtoList(
        await this.productService.findLatest(),
        ProductDto
      )
    };
  }

  @Get('best-seller')
  async getBestSeller() {
    return {
      content: MapperUtil.toDtoList(
        await this.productService.findBestSeller(),
        ProductDto
      )
    };
  }

  @Get('top-discount')
  async getTopDiscount() {
    return {
      content: MapperUtil.toDtoList(
        await this.productService.findTopDiscount(),
        ProductDto
      )
    };
  }
}
