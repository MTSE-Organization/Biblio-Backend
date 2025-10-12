import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { AuthorizationGuard, JwtAuthGuard } from '@/modules/auth/guards';
import { ReviewForm } from './forms/review.form';
import { FilterReviewForm } from './forms/filter-review.form';
import { MapperUtil } from '@/utils';
import { ReviewDto, ReviewStatsDto } from './dtos';
import { ResponseListDto } from '@/common/interfaces';
import { ApiListResponse, ApiResponseNoData, PCode } from '@/common/decorators';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiListResponse(ReviewDto, { objectName: 'review' })
  @Get('list')
  async list(@Query() form: FilterReviewForm) {
    const { reviews, count } = await this.reviewService.findAll(form);
    const response: ResponseListDto<ReviewDto[]> = {
      content: MapperUtil.toDtoList(reviews, ReviewDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };
    return response;
  }

  @ApiListResponse(ReviewDto, { objectName: 'review' })
  @PCode('REV_L')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('private/list')
  async adminList(@Query() form: FilterReviewForm) {
    const { reviews, count } = await this.reviewService.findAll(form);
    const response: ResponseListDto<ReviewDto[]> = {
      content: MapperUtil.toDtoList(reviews, ReviewDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };
    return response;
  }

  @ApiListResponse(ReviewStatsDto, { objectName: 'reviewStats' })
  @Get('/summary/:productId')
  async summary(@Param('productId') productId: bigint) {
    return {
      content: await this.reviewService.getReviewStats(productId)
    };
  }

  @ApiResponseNoData({ objectName: 'review', type: 'create' })
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Req() req: any, @Body() form: ReviewForm) {
    const accountId = req.user.id;
    return this.reviewService.create(accountId, form);
  }

  @ApiResponseNoData({ objectName: 'review', type: 'delete' })
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async delete(@Req() req: any, @Param('id') id: bigint) {
    const accountId = req.user.id;
    return this.reviewService.delete(id, accountId);
  }
}
