import { Module } from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { ProductImageController } from './product-image.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductImage } from '@/models';
import { ProductModule } from '../product/product.module';
import { FileModule } from '../file/file.module';

@Module({
  controllers: [ProductImageController],
  imports: [
    SequelizeModule.forFeature([ProductImage]),
    ProductModule,
    FileModule
  ],
  providers: [ProductImageService],
  exports: [ProductImageService]
})
export class ProductImageModule {}
