import { FileRenameInterceptor } from '@/common/interceptors/file.interceptor';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('file2')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage()
    }),
    new FileRenameInterceptor()
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const res = await this.cloudinaryService.uploadFile(file);
    return {
      filePath: res.secure_url
    };
  }
}
