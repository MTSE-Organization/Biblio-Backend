import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Delete,
  Param,
  Query
} from '@nestjs/common';
import { FavoriteProductService } from './favorite-product.service';
import { FavoriteProductForm } from '@/modules/favorite-product/forms/favorite-product.form';
import { JwtAuthGuard } from '@/modules/auth/guards';
import { FilterFavoriteProductForm } from '@/modules/favorite-product/forms/filter-favorite-product.form';
import { ResponseListDto } from '@/common/interfaces';
import { FavoriteProductDto } from '@/modules/favorite-product/dto/favorite-product.dto';
import { ApiListResponse, ApiResponseNoData } from '@/common/decorators';
import { FavoriteProductMapper } from '@/modules/favorite-product/favorite-product.mapper';
import { TopFavoriteFilterForm } from '@/modules/favorite-product/forms/top-favorite-filter.form';
import { TopFavoriteProductDto } from '@/modules/favorite-product/dto/top-favorite-product.dto';

@Controller('favorite-product')
export class FavoriteProductController {
  constructor(
    private readonly favoriteProductService: FavoriteProductService
  ) {}

  @ApiListResponse(FavoriteProductDto, { objectName: 'favorite product' })
  @UseGuards(JwtAuthGuard)
  @Get('list')
  async listFavoriteProducts(
    @Req() req: any,
    @Query() form: FilterFavoriteProductForm
  ) {
    const accountId = req.user.id;
    const { favoriteProducts, count } =
      await this.favoriteProductService.findAll(accountId, form);
    const response: ResponseListDto<FavoriteProductDto[]> = {
      content: FavoriteProductMapper.toDtoList(favoriteProducts),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };

    return response;
  }

  @ApiResponseNoData({ objectName: 'favorite product', type: 'create' })
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createFavoriteProduct(
    @Body() form: FavoriteProductForm,
    @Req() req: any
  ) {
    const accountId = req.user.id;
    return await this.favoriteProductService.create(accountId, form);
  }

  @ApiResponseNoData({ objectName: 'favorite product', type: 'delete' })
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async deleteFavoriteProduct(@Param('id') id: bigint) {
    return await this.favoriteProductService.delete(id);
  }

  @ApiListResponse(TopFavoriteProductDto, {
    objectName: 'top favorite product'
  })
  @UseGuards(JwtAuthGuard)
  @Get('top-favorite')
  async getTopFavorite(@Query() form: TopFavoriteFilterForm) {
    return await this.favoriteProductService.getTopFavorite(form);
  }
}
