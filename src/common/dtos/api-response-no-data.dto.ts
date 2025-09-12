import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseNoDataDto<T> {
  @ApiProperty({ example: true, description: 'Result' })
  result: boolean;

  @ApiProperty({ example: 'Successfully', description: 'Message' })
  message: string;

  @ApiProperty({
    example: '01/01/1970 00:00:00',
    description: 'Date'
  })
  date: string;

  @ApiProperty({ example: '/path', description: 'Request path' })
  path: string;

  @ApiProperty({ example: '0ms', description: 'Execution time' })
  takenTime: string;
}
