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
export type SeriesDocument = Series & Document;
@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Series {
//   id:string

  
  @ApiProperty()
  @Prop({ type: "string", trim: true })
  title: string;

 
  @ApiProperty()
  @Prop({ type: "string", trim: true })
  storyline: string;

  
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' })
  genreId: string;

  
  @ApiProperty()
  @Prop({ type: "string", trim: true })
  rating: string;

  
  @ApiProperty()
  @Prop({ type: "string",  trim: true })
  episodes: string;


  @ApiProperty()
  @Prop({ type: "string", trim: true })
  trailer: string;

  
  @ApiProperty()
  @Prop({ type: "string", trim: true })
  image: string;
  
}

 const SeriesSchema = SchemaFactory.createForClass(Series);



// GenreSchema.virtual('id').get(function (this: GenreDocument) {
//   return this._id.toString()
// });
export {SeriesSchema}
// export const userJsonSchema = validationMetadatasToSchemas();
//console.log('schemas=>', JSON.stringify(userJsonSchema)); logger , exclude fileds, test cases
