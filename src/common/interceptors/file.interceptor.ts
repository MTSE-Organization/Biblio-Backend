import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';
import { BadRequestException } from '@/common/exceptions';
import { ErrorCode } from '@/constants/error-code.constant';
import { fileFolders } from '@/constants/constant';

@Injectable()
export class FileRenameInterceptor implements NestInterceptor {
  constructor(private readonly rootDir: string = './uploads') {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    if (req.file && req.body) {
      const kind = req.body.kind;

      if (!kind) {
        await fs.promises.unlink(req.file.path).catch(() => {});
        throw new BadRequestException(
          'Kind is required',
          ErrorCode.FILE_ERROR_KIND_REQUIRED
        );
      }

      if (!(kind in fileFolders)) {
        await fs.promises.unlink(req.file.path).catch(() => {});
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
      }

      const uploadDir = path.join(this.rootDir, folder);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const ext = path.extname(req.file.originalname);
      const finalName = req.body.fileName
        ? `${req.body.fileName}${ext}`
        : req.file.filename;

      const newPath = path.join(uploadDir, finalName);

      await fs.promises.rename(req.file.path, newPath);

      req.file.destination = folder;
      req.file.filename = finalName;
      req.file.path = newPath;
    }

    return next.handle();
  }
}
