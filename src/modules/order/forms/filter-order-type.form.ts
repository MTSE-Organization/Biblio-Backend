import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class FilterOrderType {
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  fromDate?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  toDate?: Date;
}
