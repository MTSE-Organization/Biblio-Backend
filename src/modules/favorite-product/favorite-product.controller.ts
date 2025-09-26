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
import { MapperUtil } from '@/utils';

@Controller('favorite-product')
export class FavoriteProductController {
  constructor(
    private readonly favoriteProductService: FavoriteProductService
  ) {}

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
      content: MapperUtil.toDtoList(favoriteProducts, FavoriteProductDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };

    return {
      data: response,
      message: 'Get list favorite product successfully'
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addFavoriteProduct(
    @Body() addForm: FavoriteProductForm,
    @Req() req: any
  ) {
    const accountId = req.user.id;
    return this.favoriteProductService.add({
      ...addForm,
      accountId
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':productId')
  async deleteFavoriteProduct(
    @Body() form: FavoriteProductForm,
    @Req() req: any
  ) {
    const accountId = req.user.id;
    return this.favoriteProductService.delete(
      accountId,
      form.productId,
      form.productVariantId
    );
  }
}
