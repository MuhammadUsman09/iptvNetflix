import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { Category, CategoryDocument, CategorySchema } from './category.schema';
import { Cast,CastDocument,CastSchema } from './cast.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions/index';
import type { Optional } from '../../types';
import { ObjectId } from 'mongodb';

@Injectable()
export class CastService {
    constructor(
    @InjectModel(Cast.name) private castModel: Model<CastDocument>,
  ) {}
  
       /**
        * Get One Cast
        * @param pageOptionsDto 
        * @returns 
        */
  async getOne(id: string):Promise<any>{
    return  await this.castModel
      .aggregate([
          {
            $match:{
              _id: new ObjectId(id),
            },
          },
          {
            $lookup:{
              from: "series", // collection to join
              localField: "streamId",//field from the input documents
              foreignField: "_id",//field from the documents of the "from" collection
              as: "series"// output array field
            }
            
          },
          {
            $lookup:{
              from: "movies", // collection to join
              localField: "streamId",//field from the input documents
              foreignField: "_id",//field from the documents of the "from" collection
              as: "movies"// output array field
            }
            
          }
        ])
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
     

 /**
  * get all Cast
  * @param pageOptionsDto 
  * @returns 
  */

  async getCast(pageOptionsDto: PageOptionsDto): Promise<Cast[]> {
    const queryBuilder = await this.castModel
      .aggregate([
        {
          $lookup: {
            from: "series", // collection to join
            localField: "streamId",//field from the input documents
            foreignField: "_id",//field from the documents of the "from" collection
            as: "series"// output array field
         },
       },
        {
            $lookup: {
              from: "movies", // collection to join
              localField: "streamId",//field from the input documents
              foreignField: "_id",//field from the documents of the "from" collection
              as: "movies"// output array field
          },
       },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              { $sort: { [pageOptionsDto.column]: pageOptionsDto.order } },
              { $skip: pageOptionsDto.skip },
              { $limit: pageOptionsDto.take },
            ],
          },
        },
        {
          $project: {
            data: 1,
            // Get total from the first element of the metadata array
            total: { $arrayElemAt: ['$metadata.total', 0] },
          },
        },
      ])
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
  }

  /**
   * post 
   * @param castDto 
   * @returns 
   */
  async create(castDto:Cast): Promise<CastDocument> {
    
    const create: CastDocument = new this.castModel(castDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
}

   /**
   * patch the cast
   * @param id 
   * @param castDto object 
   * @returns 
   */
  async update(id: string, castDto: Cast):Promise<CastDocument>{
    return  await this.castModel.findByIdAndUpdate(
      { _id: id },castDto).catch((err) => {console.log('in error')
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
  /**
   * delete the Cast
   * @param id 
   * @returns 
   */

  async delete(id: string):Promise<any>{
    return  await this.castModel.findByIdAndRemove(
      {  _id: id })
        .catch((err) => {
            console.log('in delete');
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
