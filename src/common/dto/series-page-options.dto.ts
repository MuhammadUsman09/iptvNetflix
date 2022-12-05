import { Order } from '../../constants';
import { Transform, Type, Expose } from 'class-transformer';
import {  IsInt,IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
export class SeriesPageOptionsDto {
  @Transform(value => {
    if(value.value===Order.DESC){
      return -1
    }else if(value.value===Order.ASC){
      return 1
    }
    return "Order must be ASC or DESC"
  })
  @IsInt({
    message: 'Order must be ASC or DESC',
  })
  readonly order: 1 |-1 = 1;

  @IsOptional()
  @IsString()
  readonly column: string = '';

  @IsOptional()
  @IsString()
  readonly genreName: string = '';

  @IsOptional()
  @IsString()
  readonly genreId: string = '';



  @IsInt()
  @Type(() => Number)
  readonly take: number = 10;


  @IsInt()
  @Type(() => Number)
  readonly skip: number = 0;

  @IsOptional()
  @IsString()
  readonly q?: string;
}
