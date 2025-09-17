import { Expose } from 'class-transformer';

export class FileDto {
  @Expose()
  filePath: string;
}
