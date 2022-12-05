import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument, RoleSchema } from './role.schema';
import {ResponseCode} from '../exceptions/index';
@Injectable()
export class CaslService {
    constructor(
        @InjectModel(Role.name) private roleModel: Model<RoleDocument>
      ) {}

      async findAllPermissionsOfUser(role: any):Promise<Role | null> {
        const userRole = await this.roleModel.findOne(role).catch((err)=>{
          throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
        });
       return userRole
      }
}
