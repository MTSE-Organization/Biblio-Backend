import { ApiProperty } from '@nestjs/swagger';
import { ApiPaginatedDataDto } from './api-paginated-data.dto';

export class ApiResponseListDto {
  @ApiProperty({ example: true })
  result: boolean;

  @ApiProperty({ example: 'Get list successfully' })
  message: string;

  @ApiProperty({ type: () => ApiPaginatedDataDto })
  data: ApiPaginatedDataDto<any>;

  @ApiProperty({ example: '01/01/1970 00:00:00' })
  date: string;

  @ApiProperty({ example: '/path' })
  path: string;

  @ApiProperty({ example: '0ms' })
  takenTime: string;
}
