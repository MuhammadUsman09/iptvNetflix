import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import {generateHash} from '../../common/utils';
import {  IsInt,IsString, MinLength, MaxLength, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { Exclude, Transform } from 'class-transformer';
import { RoleType } from '../../constants/role-type';
import { Rule } from '@casl/ability/dist/types/Rule';
export type MovieDocument = Movie & Document;
@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Movie {
//   id:string

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true })
  title: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' })
  genreId: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true })
  description: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true })
  rating: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true })
  trailer: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true })
  year: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true })
  url: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true })
  duration: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true })
  image: string;
  
}

 const MovieSchema = SchemaFactory.createForClass(Movie);



// GenreSchema.virtual('id').get(function (this: GenreDocument) {
//   return this._id.toString()
// });
export {MovieSchema}
// export const userJsonSchema = validationMetadatasToSchemas();
//console.log('schemas=>', JSON.stringify(userJsonSchema)); logger , exclude fileds, test cases
