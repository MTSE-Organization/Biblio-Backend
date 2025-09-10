import * as fs from 'fs';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { MulterModuleAsyncOptions } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

export const fileConfig: MulterModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const uploadDir = configService.get<string>('UPLOAD_DIR') || './uploads';

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    return {
      storage: diskStorage({
        destination: uploadDir,
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        }
      }),
      limits: {
        fileSize: configService.get<number>('MAX_SIZE')
      }
    };
  }
};
