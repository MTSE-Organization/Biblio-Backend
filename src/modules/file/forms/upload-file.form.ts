import { NumberDecorator, StringDecorator } from '@/common/decorators';

export class UploadFileForm {
  @StringDecorator('file', true)
  file: string;

  @NumberDecorator('kind', true)
  kind: number;
}
