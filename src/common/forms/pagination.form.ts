import { NumberDecorator } from '@/common/decorators';
import { Type } from 'class-transformer';
import { Min } from 'class-validator';

export class PaginationForm {
  @Type(() => Number)
  @NumberDecorator('page')
  @Min(0)
  page: number = 0;

  @Type(() => Number)
  @NumberDecorator('size')
  @Min(1)
  size: number = 20;

  getPagination(): { limit: number; offset: number } {
    const limit = this.size;
    const offset = this.page * this.size;
    return { limit, offset };
  }
}
