import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import * as fs from 'fs';

@Injectable()
export class FileService {
  private readonly rootDir: string;

  constructor(private readonly configService: ConfigService) {
    this.rootDir = this.configService.get<string>('UPLOAD_DIR')!;
  }

  async deleteFile(fileName: string): Promise<void> {
    const filePath = path.join(this.rootDir, fileName);

    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.error(`File ${fileName} not found`);
      } else {
        console.error(`Error: `, err.message);
      }
    }
  }
}
