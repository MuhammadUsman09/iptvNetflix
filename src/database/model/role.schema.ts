import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';
import {  IsInt,IsString, MinLength, MaxLength, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { RoleType } from '../../constants/role-type';
import {Permission} from './permission.schema'
export type RoleDocument = Role & Document;
@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Role {
  id:string

  @IsEnum(RoleType)
  @ApiProperty()
  @Prop({ enum : RoleType, default: RoleType.USER  })
  role: string;


  @ApiProperty()
  permissions: [Permission];
}

 const RoleSchema = SchemaFactory.createForClass(Role);
export {RoleSchema}

