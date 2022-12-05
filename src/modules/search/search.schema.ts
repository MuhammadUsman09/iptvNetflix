import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';
import {generateHash} from '../../common/utils';
import {  IsInt,IsString, MinLength, MaxLength, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { Exclude, Transform } from 'class-transformer';
import { RoleType } from '../../constants/role-type';
import { Rule } from '@casl/ability/dist/types/Rule';
export type searchDocument = search & Document;
@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class search {
//   id:string

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true })
  name: string;


  @Prop({type: 'boolean', required: true, default: true})
  isActive: boolean;
}

 const searchSchema = SchemaFactory.createForClass(search);



// searchSchema.virtual('id').get(function (this: searchDocument) {
//   return this._id.toString()
// });
export {searchSchema}
// export const userJsonSchema = validationMetadatasToSchemas();
//console.log('schemas=>', JSON.stringify(userJsonSchema)); logger , exclude fileds, test cases
