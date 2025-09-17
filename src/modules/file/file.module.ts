import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { fileConfig } from '@/config';

@Module({
  imports: [MulterModule.registerAsync(fileConfig)],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService]
})
export class FileModule {}
