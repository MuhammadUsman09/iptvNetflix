import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';
import {generateHash} from '../../common/utils';
import {  IsInt,IsString, MinLength, MaxLength, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { Exclude, Transform } from 'class-transformer';
import { RoleType } from '../../constants/role-type';
export type UserDocument = User & Document;
@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class User {
  id:string

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true })
  firstName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true })
  lastName: string;

  @IsEmail()
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true, unique: true, lowercase: true, })
  email: string;

  @IsString()
  @MinLength(5)
  @ApiProperty()
  @Prop({type: "string", required: true, trim: true })
  password: string;

  @IsString()
  @MinLength(11)
  @MaxLength(14)
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true })
  phone: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @ApiProperty()
  @Prop({type: "string", trim: true})
  avatar: string;

  @IsEnum(RoleType)
  @ApiProperty()
  @Prop({ enum : RoleType, default: RoleType.USER  })
  role: string;
}

 const UserSchema = SchemaFactory.createForClass(User);

// Hooks
UserSchema.pre<UserDocument>('save', async function (next) {
  this.password =generateHash(this.password);
  next();
});
export {UserSchema}
