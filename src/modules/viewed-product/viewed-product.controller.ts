import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { ViewedProductService } from './viewed-product.service';
import { ViewedProductForm } from '@/modules/viewed-product/forms/viewed-product.form';
import { JwtAuthGuard } from '@/modules/auth/guards';
import { FilterViewedProductForm } from '@/modules/viewed-product/forms/filter-viewed-product.form';
import { MapperUtil } from '@/utils';
import { ResponseListDto } from '@/common/interfaces';
import { ViewedProductDto } from '@/modules/viewed-product/dtos/viewed-product.dto';
import { ApiListResponse, ApiResponseNoData } from '@/common/decorators';

@Controller('viewed-product')
export class ViewedProductController {
  constructor(private readonly viewedProductService: ViewedProductService) {}

  @ApiListResponse(ViewedProductDto, { objectName: 'viewed product' })
  @UseGuards(JwtAuthGuard)
  @Get('list')
  async getViewedProductList(
    @Req() req: any,
    @Query() form: FilterViewedProductForm
  ) {
    const accountId = req.user.id;
    const { viewedProducts, count } = await this.viewedProductService.findAll(
      accountId,
      form
    );
    const response: ResponseListDto<ViewedProductDto[]> = {
      content: MapperUtil.toDtoList(viewedProducts, ViewedProductDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };

    return response;
  }

  @ApiResponseNoData({ objectName: 'viewed product', type: 'create' })
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createViewedProduct(@Body() form: ViewedProductForm, @Req() req: any) {
    const accountId = req.user.id;
    return this.viewedProductService.create(accountId, form);
  }

  @ApiResponseNoData({ objectName: 'viewed product', type: 'delete' })
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async deleteViewedProduct(@Param('id') id: bigint) {
    return this.viewedProductService.delete(id);
  }
}
