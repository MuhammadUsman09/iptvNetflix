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
export type SeasonDocument = Season & Document;
@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Season {
//   id:string

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Series' })
  seriesId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true })
  season: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true })
  name: string;

  @IsString()
  @MaxLength(5000)
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true })
  image: string;
  
}

 const SeasonSchema = SchemaFactory.createForClass(Season);



// GenreSchema.virtual('id').get(function (this: GenreDocument) {
//   return this._id.toString()
// });
export {SeasonSchema}
// export const userJsonSchema = validationMetadatasToSchemas();
//console.log('schemas=>', JSON.stringify(userJsonSchema)); logger , exclude fileds, test cases
