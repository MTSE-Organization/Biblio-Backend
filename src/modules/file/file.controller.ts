import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'path';
import * as fs from 'fs';
import { NotFoundException } from '@/common/exceptions';

@Controller('file')
export class FileController {
  constructor(private readonly configService: ConfigService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename,
    };
  }

  @Get('download/:fileName')
  downloadFile(@Param('fileName') fileName: string, @Res() res: Response) {
    const uploadDir =
      this.configService.get<string>('UPLOAD_DIR') || './uploads';
    const filePath = path.join(uploadDir, fileName);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`File ${fileName} not found`);
    }

    return res.download(filePath, fileName);
  }
}
