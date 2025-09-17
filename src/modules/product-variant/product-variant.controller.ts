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
import { ProductVariantService } from './product-variant.service';
import {
  CreateProductVariantForm,
  FilterProductVariantForm,
  UpdateProductVariantForm
} from './forms';
import { ResponseListDto } from '@/common/interfaces';
import { MapperUtil } from '@/utils';
import { ProductVariantAutoCompleteDto, ProductVariantDto } from './dtos';
import {
  ApiListResponse,
  ApiResponse,
  ApiResponseNoData,
  PCode
} from '@/common/decorators';
import { AuthorizationGuard, JwtAuthGuard } from '../auth/guards';
import { Constant } from '@/constants';

@Controller('product-variant')
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @ApiResponseNoData({ objectName: 'product variant', type: 'create' })
  @PCode('PRD_V_C')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Post('create')
  async create(@Body() form: CreateProductVariantForm) {
    return await this.productVariantService.create(form);
  }

  @ApiListResponse(ProductVariantAutoCompleteDto, {
    objectName: 'product variant'
  })
  @Get('list')
  async list(@Query() form: FilterProductVariantForm) {
    form.status = Constant.STATUS_ACTIVE;
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

  @ApiResponse(ProductVariantDto, { objectName: 'product variant' })
  @PCode('PRD_V_V')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('private/get/:id')
  async adminGet(@Param('id') id: bigint) {
    return MapperUtil.toDto(
      await this.productVariantService.findById(id),
      ProductVariantDto
    );
  }

  @ApiListResponse(ProductVariantAutoCompleteDto, {
    objectName: 'product variant'
  })
  @PCode('PRD_V_L')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('private/list')
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

  @ApiResponse(ProductVariantDto, { objectName: 'product variant' })
  @Get('get/:id')
  async get(@Param('id') id: bigint) {
    return MapperUtil.toDto(
      await this.productVariantService.findByIdAndStatus(
        id,
        Constant.STATUS_ACTIVE
      ),
      ProductVariantDto
    );
  }

  @ApiResponseNoData({ objectName: 'product variant', type: 'update' })
  @PCode('PRD_V_U')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('update')
  async update(@Body() form: UpdateProductVariantForm) {
    return await this.productVariantService.update(form);
  }

  @ApiResponseNoData({ objectName: 'product variant', type: 'delete' })
  @PCode('PRD_V_D')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: bigint) {
    return await this.productVariantService.delete(id);
  }
}
