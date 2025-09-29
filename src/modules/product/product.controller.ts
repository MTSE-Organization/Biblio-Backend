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
  SearchProductForm,
  UpdateProductForm
} from './forms';
import { ProductAutoCompleteDto, ProductDto } from './dtos';
import { ResponseListDto } from '@/common/interfaces';
import { MapperUtil } from '@/utils';
import { AuthorizationGuard, JwtAuthGuard } from '../auth/guards';
import { ProductMapper } from './product.mapper';
import {
  ApiListResponse,
  ApiResponse,
  ApiResponseNoData,
  PCode
} from '@/common/decorators';
import { Constant } from '@/constants';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiResponseNoData({ objectName: 'product', type: 'create' })
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

  @ApiResponse(ProductDto, { objectName: 'product' })
  @PCode('PRD_V')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('private/get/:id')
  async privateGet(@Param('id') id: bigint) {
    return MapperUtil.toDto(
      await this.productService.findDetail(id),
      ProductDto
    );
  }

  @ApiResponseNoData({ objectName: 'product', type: 'update' })
  @PCode('PRD_U')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('update')
  async update(@Body() form: UpdateProductForm) {
    return await this.productService.update(form);
  }

  @ApiResponseNoData({ objectName: 'product', type: 'update' })
  @PCode('PRD_U')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('recover/:id')
  async recover(@Param('id') id: bigint) {
    return await this.productService.recover(id);
  }

  @ApiResponseNoData({ objectName: 'product', type: 'delete' })
  @PCode('PRD_D')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: bigint) {
    return await this.productService.delete(id);
  }

  @ApiResponse(ProductDto, { objectName: 'product' })
  @Get('get/:id')
  async get(@Param('id') id: bigint) {
    return MapperUtil.toDto(
      await this.productService.findDetail(id, Constant.STATUS_ACTIVE),
      ProductDto
    );
  }

  @ApiListResponse(ProductDto, { objectName: 'product' })
  @Get('list')
  async list(@Query() form: FilterProductForm) {
    form.status = Constant.STATUS_ACTIVE;
    const { products, count } = await this.productService.findAll(form);

    const response: ResponseListDto<ProductAutoCompleteDto[]> = {
      content: ProductMapper.toAutoCompleteDtoList(products),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };

    return response;
  }

  @ApiListResponse(ProductDto, {
    objectName: 'latest product'
  })
  @Get('latest')
  async getLatest() {
    return {
      content: MapperUtil.toDtoList(
        await this.productService.findLatest(),
        ProductDto
      )
    };
  }

  @ApiListResponse(ProductDto, {
    objectName: 'best seller product'
  })
  @Get('best-seller')
  async getBestSeller() {
    return {
      content: MapperUtil.toDtoList(
        await this.productService.findBestSeller(),
        ProductDto
      )
    };
  }

  @ApiListResponse(ProductDto, {
    objectName: 'top discount product'
  })
  @Get('top-discount')
  async getTopDiscount() {
    return {
      content: MapperUtil.toDtoList(
        await this.productService.findTopDiscount(),
        ProductDto
      )
    };
  }

  @ApiResponseNoData({
    objectName: 'product',
    message: 'Sync data product successfully'
  })
  @Get('sync-data')
  async syncData() {
    return await this.productService.syncData();
  }

  @Get('search')
  async search(@Query() form: SearchProductForm) {
    const { hits, count } = await this.productService.search(form);

    const response: ResponseListDto<any[]> = {
      content: hits,
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };

    return response;
  }
}
