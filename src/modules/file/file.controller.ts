import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'path';
import * as fs from 'fs';
import { NotFoundException } from '@/common/exceptions';
import { FileRenameInterceptor } from '@/common/interceptors/file.interceptor';
import { ApiResponse, PCode } from '@/common/decorators';
import { AuthorizationGuard, JwtAuthGuard } from '../auth/guards';
import { FileDto } from '@/modules/file/dtos/file.dto';

@Controller('file')
export class FileController {
  constructor(private readonly configService: ConfigService) {}

  @ApiResponse(FileDto, {
    objectName: 'file',
    message: 'Upload file successfully'
  })
  @PCode('FILE_U')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'), FileRenameInterceptor)
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      filePath: `/${file.destination.replace('\\', '/')}/${file.filename}`
    };
  }

  @Get('download/:folder/:fileName')
  downloadFile(
    @Param('folder') folder: string,
    @Param('fileName') fileName: string,
    @Res() res: Response
  ) {
    const uploadDir = this.configService.get<string>('UPLOAD_DIR')!;
    const filePath = path.join(uploadDir, `/${folder}/${fileName}`);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`File ${fileName} not found`);
    }

    return res.download(filePath, fileName);
  }
}
