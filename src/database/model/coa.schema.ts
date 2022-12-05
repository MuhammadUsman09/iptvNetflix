import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {  IsInt,IsString, MinLength, MaxLength, IsEmail, IsEnum, IsOptional } from 'class-validator';



export type COADocument = COA & Document;
@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class COA {
  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @Prop({ type: "string", trim: true,required:true })
  key1:string

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @Prop({ type: "string", trim: true })
  key2:string

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @Prop({ type: "string", trim: true })
  key3:string

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @Prop({ type: "string", trim: true })
  key4:string

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @Prop({ type: "string", trim: true })
  key5:string

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @Prop({ type: "string", trim: true })
  key6:string

 
  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @Prop({ type: "string", trim: true,required:true })
  headCode:string

  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @Prop({ type: "string", trim: true,required:true })
  accountTitle:string

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @Prop({ type: "string", trim: true })
  headIdFK:string

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @Prop({ type: "number",default:0 })
  depreciationRate:number

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @Prop({ type: "date",default:new Date() })
  date:Date

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @Prop({ type: "boolean",default:true })
  isActive:boolean

}

 const COASchema = SchemaFactory.createForClass(COA);
export {COASchema}

