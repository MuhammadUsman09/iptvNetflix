import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Role, RoleDocument } from "../model/role.schema";
import { Seeder, DataFactory } from "nestjs-seeder";
import { RoleType } from '../../constants/role-type';

@Injectable()
export class RoleSeeder implements Seeder {
  constructor(@InjectModel(Role.name) private readonly role: Model<Role>) {}

  async seed(): Promise<any> {
    // Insert into the database.
    const rolesArr=Object.keys(RoleType);
    for(let i=0;i<rolesArr.length;i++){
        const create: RoleDocument = new this.role({role:rolesArr[i],permissions:[]});
          await create.save().catch((err)=>{
            throw new HttpException(err.message, 400);
           });
    }
    return
    
  }

  async drop(): Promise<any> {
    //return this.user.deleteMany({});
  }
}

