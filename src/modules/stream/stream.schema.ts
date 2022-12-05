import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document, TypeExpressionOperatorReturningNumber } from 'mongoose';
import mongoose from 'mongoose';
import {generateHash} from '../../common/utils';
import {  IsInt,IsString, MinLength, MaxLength, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { Exclude, Transform } from 'class-transformer';
import { RoleType } from '../../constants/role-type';
import { Rule } from '@casl/ability/dist/types/Rule';
import { Timestamp } from 'rxjs';
export type StreamDocument = Stream & Document;
@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Stream {
//   id:string

  @IsString()
  @MaxLength(200)
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @IsString()
  @MaxLength(200)
  @ApiProperty()
  @IsOptional()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Episode' ,required:false})
  episodeId: string;

  @IsString()
  @MaxLength(200)
  @ApiProperty()
  @IsOptional()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' ,required:false})
  movieId: string;
  
  @MinLength(1)
  @MaxLength(200)
  @ApiProperty()
  @Prop({ type: "Number", required: true, trim: true })
  time: Number;
  
}

 const StreamSchema = SchemaFactory.createForClass(Stream);



// GenreSchema.virtual('id').get(function (this: GenreDocument) {
//   return this._id.toString()
// });
export {StreamSchema}
// export const userJsonSchema = validationMetadatasToSchemas();
//console.log('schemas=>', JSON.stringify(userJsonSchema)); logger , exclude fileds, test cases
