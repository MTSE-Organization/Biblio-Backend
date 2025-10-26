import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class TopFavoriteFilterForm {
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false, type: String, description: 'fromDate' })
  fromDate?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false, type: String, description: 'toDate' })
  toDate?: Date;
}
