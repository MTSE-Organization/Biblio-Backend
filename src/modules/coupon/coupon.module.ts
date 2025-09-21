import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Coupon } from '@/models/coupon.model';

@Module({
  controllers: [CouponController],
  providers: [CouponService],
  imports: [SequelizeModule.forFeature([Coupon])]
})
export class CouponModule {}
