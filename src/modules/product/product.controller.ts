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
import { ProductAutoCompleteDto, ProductDto } from './dtos';
import { ResponseListDto } from '@/common/interfaces';
import { MapperUtil } from '@/utils';
import { AuthorizationGuard, JwtAuthGuard } from '../auth/guards';
import { ProductMapper } from './product.mapper';
import { ApiListResponse, PCode } from '@/common/decorators';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @PCode('PRD_C')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Post('create')
  async create(@Body() form: CreateProductForm) {
    return await this.productService.create(form);
  }

  @ApiListResponse(ProductDto, { objectName: 'product' })
  @PCode('PRD_L')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('private/list')
  async privateList(@Query() form: FilterProductForm) {
    const { products, count } = await this.productService.findAll(form);

    const response: ResponseListDto<ProductDto[]> = {
      content: ProductMapper.toList(products),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };

    return response;
  }

  @PCode('PRD_V')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('private/get/:id')
  async privateGet(@Param('id') id: bigint) {
    return MapperUtil.toDto(await this.productService.findById(id), ProductDto);
  }

  @PCode('PRD_U')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('update')
  async update(@Body() form: UpdateProductForm) {
    return await this.productService.update(form);
  }

  @PCode('PRD_D')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: bigint) {
    return await this.productService.delete(id);
  }

  @Get('get/:id')
  async get(@Param('id') id: bigint) {
    return MapperUtil.toDto(await this.productService.findById(id), ProductDto);
  }

  @Get('list')
  async list(@Query() form: FilterProductForm) {
    const { products, count } = await this.productService.findAll(form);

    const response: ResponseListDto<ProductAutoCompleteDto[]> = {
      content: ProductMapper.toAutoCompleteDtoList(products),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };

    return response;
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
