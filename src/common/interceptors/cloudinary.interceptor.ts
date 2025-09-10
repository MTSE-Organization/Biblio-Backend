import { BadRequestException } from '@/common/exceptions';
import { fileFolders } from '@/constants/constant';
import { ErrorCode } from '@/constants/error-code.constant';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FileRenameInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    if (req.file && req.body) {
      const kind = req.body.kind;

      if (!kind) {
        throw new BadRequestException(
          'Kind is required',
          ErrorCode.FILE_ERROR_KIND_REQUIRED
        );
      }

      if (!(kind in fileFolders)) {
        throw new BadRequestException(
          'Kind is invalid',
          ErrorCode.FILE_ERROR_KIND_INVALID
        );
      }

      let folder = '';
      switch (kind) {
        case '1':
          folder = 'systems';
          break;
        case '2':
          folder = 'avatars';
          break;
        default:
          folder = 'others';
      }

      const ext = req.file.originalname
        ? req.file.originalname.split('.').pop()
        : '';
      const finalName = req.body.fileName
        ? `${req.body.fileName}.${ext}`
        : req.file.originalname;

      req.file.cloudinaryOptions = {
        folder: `bsw-uploads/${folder}`,
        public_id: finalName.replace(/\.[^/.]+$/, ''),
        format: 'webp',
        resource_type: 'image'
      };
    }

    return next.handle();
  }
}
