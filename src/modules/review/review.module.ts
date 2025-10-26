import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from '@/models/review.model';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ProductModule } from '@/modules/product/product.module';
import { OrderModule } from '@/modules/order/order.module';
import { ProductVariantModule } from '@/modules/product-variant/product-variant.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Review]),
    ProductModule,
    ProductVariantModule,
    OrderModule
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService]
})
export class ReviewModule {}
