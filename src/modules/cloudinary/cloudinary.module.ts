import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from '@/modules/cloudinary/providers/cloudinary.provider';
import { CloudinaryController } from '@/modules/cloudinary/cloudinary.controller';

@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  controllers: [CloudinaryController],
  exports: [CloudinaryProvider, CloudinaryService]
})
export class CloudinaryModule {}
