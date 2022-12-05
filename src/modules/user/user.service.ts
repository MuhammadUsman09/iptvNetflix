import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { userJsonSchema,User, UserDocument, UserSchema } from './user.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import {ResponseCode} from '../../exceptions/index';
import type { Optional } from '../../types';

@Injectable()
export class UserService {
    constructor(
          @InjectModel(User.name) private userModel: Model<UserDocument>
        ) {}

          /**
         * get user schema
         * @returns
         */
          async getSchema(){
            return await userJsonSchema.Category
          }
      /**
        * Get User
        * @param pageOptionsDto 
        * @returns 
        */

       async getOne(id: string):Promise<User>{
        return  await this.userModel.findById({ _id: id })
          .catch((err) => {console.log('in error')
            throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
          });
      }
        /**
         * Find single user
         * 
         * 
         */
        async findOne(findData: any):Promise<User | null> {
          const user = await this.userModel.findOne(findData).catch((err)=>{
            throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
          });
         return user
        }
        /**
         * Find single user by email
         * 
         * 
         */
         async findByEmail(
          options: Partial<{  email: string }>,
        ): Promise<Optional<User>> {
          //User.find({}, { createdAt: 0, updatedAt: 0, isActive: 0, _id : 1 }).then(...)
          const user = await this.userModel.findOne({email:options.email}).catch((err)=>{
            throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
          });
          return user!;
        }
         /**
         * Find single user by phone
         * 
         * 
         */
        async findByPhone(
          options: Partial<{  phone: string }>,
        ): Promise<Optional<User>> {
          //User.find({}, { createdAt: 0, updatedAt: 0, isActive: 0, _id : 1 }).then(...)
          const user = await this.userModel.findOne({phone:options.phone}).catch((err)=>{
            throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
          });
          return user!;
        }
       /**
         * create single user
         * 
         * 
         */
        async createUser(
          userRegisterDto: User,
        ): Promise<UserDocument> {
          const create: UserDocument = new this.userModel(userRegisterDto);
           return await create.save().catch((err)=>{
            throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
           })
        }
       /**
         * Find all users
         * 
         * 
         */
        async getUsers(
          pageOptionsDto: PageOptionsDto,
        ):Promise<User[]> {
          //let regex = new RegExp(value.searchQuery,'i');
         //{ $and: [ { $or: [{title: regex },{description: regex}] }, {category: value.category}, {city:value.city} ] }
          const queryBuilder = await this.userModel.aggregate([
            {
              $facet: {
                metadata: [ { $count: 'total' } ],
                data: [
                  {$sort:{ [pageOptionsDto.column]:pageOptionsDto.order  }},
                   { $skip: pageOptionsDto.skip }, 
                   { $limit: pageOptionsDto.take } ]
              }
            },
            {
              $project: { 
                data: 1,
                // Get total from the first element of the metadata array 
                total: { $arrayElemAt: [ '$metadata.total', 0 ] }
            }
          }
          ]).catch((err)=>{
            throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
           });
          return queryBuilder;
        }
}
