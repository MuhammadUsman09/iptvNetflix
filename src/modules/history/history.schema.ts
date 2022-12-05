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
export type HistoryDocument = History & Document;
@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class History {
//   id:string

  docModel: {
    type: string;
    required: true;
    enum: [
      'Episode',
      'Movie',
    ];
  };  

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, refPath: 'docModel' })
  streamId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  
  
  @ApiProperty()
  @Prop({ type: "number", required: true, trim: true })
  progressValue:number;

  @ApiProperty()
  @Prop({ type: "Date", required: true, trim: true })
  lastUpdate: Date;

  @ApiProperty()
  @Prop({ type: "Date", required: true, trim: true })
  enteredDate: Date;

  
}

 const HistorySchema = SchemaFactory.createForClass(History);



// GenreSchema.virtual('id').get(function (this: GenreDocument) {
//   return this._id.toString()
// });
export {HistorySchema}
// export const userJsonSchema = validationMetadatasToSchemas();
//console.log('schemas=>', JSON.stringify(userJsonSchema)); logger , exclude fileds, test cases
