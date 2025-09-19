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
import { CouponService } from './coupon.service';
import { CreateCouponForm, FilterCouponForm, UpdateCouponForm } from './forms';
import { CouponAutoCompleteDto, CouponDto } from './dtos';
import { AuthorizationGuard, JwtAuthGuard } from '../auth/guards';
import { MapperUtil } from '@/utils';
import { PCode } from '@/common/decorators';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @PCode('COUPON_CREATE')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Post('create')
  async create(@Body() form: CreateCouponForm) {
    return await this.couponService.create(form);
  }

  @Get('list')
  async list(@Query() form: FilterCouponForm) {
    const { coupons, count } = await this.couponService.findAll(form);
    return {
      content: MapperUtil.toDtoList(coupons, CouponAutoCompleteDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };
  }

  @Get('get/:id')
  async get(@Param('id') id: bigint) {
    return MapperUtil.toDto(await this.couponService.findById(id), CouponDto);
  }

  @PCode('COUPON_UPDATE')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('update')
  async update(@Body() form: UpdateCouponForm) {
    return await this.couponService.update(form);
  }

  @PCode('COUPON_DELETE')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: bigint) {
    return await this.couponService.delete(id);
  }

  @PCode('COUPON_RECOVER')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('recover/:id')
  async recover(@Param('id') id: bigint) {
    return await this.couponService.recover(id);
  }
}
