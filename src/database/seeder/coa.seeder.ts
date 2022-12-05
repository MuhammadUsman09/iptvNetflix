import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { COA, COADocument } from "../model/coa.schema";
import { Seeder, DataFactory } from "nestjs-seeder";
import {coaData} from  '../data/coa';

@Injectable()
export class COASeeder implements Seeder {
  constructor(@InjectModel(COA.name) private readonly coa: Model<COA>) {}

  async seed(): Promise<any> {
    // Insert into the database.
    return this.coa.insertMany(coaData);
    // let bb=coaData;
    // const create: COADocument = new this.coa(coaData);
    // return  await create.save().catch((err)=>{
    //   throw new HttpException(err.message, 400);
    //  });;
    
  }

  async drop(): Promise<any> {
    //return this.user.deleteMany({});
  }
}

