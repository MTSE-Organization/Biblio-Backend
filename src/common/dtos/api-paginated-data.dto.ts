import { ApiProperty } from '@nestjs/swagger';

export class ApiPaginatedDataDto<T = any> {
  @ApiProperty({
    description: 'List data',
    type: 'array',
    items: { type: 'object' }
  })
  content: T[];

  @ApiProperty({ example: 0, description: 'Total elements' })
  totalElements: number;

  @ApiProperty({ example: 0, description: 'Total pages' })
  totalPages: number;
}
