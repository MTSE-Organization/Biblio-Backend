import { Module } from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { ProductImageController } from './product-image.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { ProductImage } from '@/models';

@Module({
  controllers: [ProductImageController],
  imports: [SequelizeModule.forFeature([ProductImage]), AuthModule],
  providers: [ProductImageService],
})
export class ProductImageModule {}
