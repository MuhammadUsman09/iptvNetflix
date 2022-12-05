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
export type EpisodeDocument = Episode & Document;
@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Episode {
//   id:string

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Season' })
  seasonId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true })
  episode: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true })
  title: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true })
  description: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true })
  url: string;
  
}

 const EpisodeSchema = SchemaFactory.createForClass(Episode);



// GenreSchema.virtual('id').get(function (this: GenreDocument) {
//   return this._id.toString()
// });
export {EpisodeSchema}
// export const userJsonSchema = validationMetadatasToSchemas();
//console.log('schemas=>', JSON.stringify(userJsonSchema)); logger , exclude fileds, test cases
