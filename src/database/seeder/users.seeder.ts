import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../model/user.schema";
import { Seeder, DataFactory } from "nestjs-seeder";
import { RoleType } from '../../constants/role-type';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(@InjectModel(User.name) private readonly user: Model<User>) {}

  async seed(): Promise<any> {
    // Insert into the database.
    const create: UserDocument = new this.user({firstName:'John',lastName:'Doe',phone:'03025434567',email:'admin@gmail.com',password:'admin123',role:RoleType.ADMIN});
    return  await create.save().catch((err)=>{
      throw new HttpException(err.message, 400);
     });;
    
  }

  async drop(): Promise<any> {
    //return this.user.deleteMany({});
  }
}

