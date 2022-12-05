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
export type CastDocument = Cast & Document;
@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Cast {
  id:string
  docModel: {
    type: string;
    required: true;
    enum: [
      'Series',
      'Movie',
    ];
  };
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, refPath: "docModel" })
  streamId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true })
  name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true })
  role: string;

  @IsString()
  @MaxLength(200)
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true })
  episodes: string;

  @IsString()
  @MaxLength(200)
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true })
  year: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true })
  detail: string;
  
}

 const CastSchema = SchemaFactory.createForClass(Cast);



// GenreSchema.virtual('id').get(function (this: GenreDocument) {
//   return this._id.toString()
// });
export {CastSchema}
// export const userJsonSchema = validationMetadatasToSchemas();
//console.log('schemas=>', JSON.stringify(userJsonSchema)); logger , exclude fileds, test cases
