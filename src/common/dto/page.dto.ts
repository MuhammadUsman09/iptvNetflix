import { ApiProperty } from '@nestjs/swagger';
export class PageDto<T> {
  readonly total: number;
  readonly data: [];

  constructor(total: number, data: []) {
    this.total = total;
    this.data = data;
  }
}
