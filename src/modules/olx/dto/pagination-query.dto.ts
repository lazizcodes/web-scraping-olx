import { ApiProperty } from '@nestjs/swagger';
export class PaginationQuery {
  @ApiProperty({
    title: 'page',
    format: 'int32',
    default: 1,
  })
  page: number;

  @ApiProperty({
    format: 'int32',
    title: 'page size',
    example: 10,
    default: 10,
  })
  pageSize: number;
}
