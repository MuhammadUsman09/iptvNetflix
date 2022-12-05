import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
// import { Category, CategoryDocument, CategorySchema } from './category.schema';
import { Season,SeasonDocument,SeasonSchema } from './season.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions/index';
import type { Optional } from '../../types';
import { identity } from 'rxjs';


@Injectable()
export class SeasonService {
    constructor(
    @InjectModel(Season.name) private seasonModel: Model<SeasonDocument>,
  ) {}
  /**
        * Get One Season
        * @param pageOptionsDto 
        * @returns 
        */

   async getOne(id: string):Promise<any>{
    return  await this.seasonModel
      .aggregate([
          {
            $match:{
              _id: new ObjectId(id),
            },
          },
          {
            $lookup:{
              from: "series", // collection to join
              localField: "seriesId",//field from the input documents
              foreignField: "_id",//field from the documents of the "from" collection
              as: "series"// output array field
            }
          },
          {
            $lookup: {
              from: "episodes", // collection to join
              localField: "_id",//field from the input documents
              foreignField: "seasonId",//field from the documents of the "from" collection
              as: "episodes"// output array field
           },
          }
        ])
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }

 /**
  * get all Seasons
  * @param pageOptionsDto 
  * @returns 
  */

  async getSeason(pageOptionsDto: PageOptionsDto): Promise<Season[]> {
    const queryBuilder = await this.seasonModel
      .aggregate([
        {
          $lookup: {
            from: "series", // collection to join
            localField: "seriesId",//field from the input documents
            foreignField: "_id",//field from the documents of the "from" collection
            as: "series"// output array field
         },
        },
        {
          $lookup: {
            from: "episodes", // collection to join
            localField: "_id",//field from the input documents
            foreignField: "seasonId",//field from the documents of the "from" collection
            as: "episodes"// output array field
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
   * @param seasonDto 
   * @returns 
   */
  async create(seasonDto:Season): Promise<SeasonDocument> {
    
    const create: SeasonDocument = new this.seasonModel(seasonDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
}

   /**
   * patch the seaspn
   * @param id 
   * @param seasonDto object 
   * @returns 
   */
  async update(id: string, seasonDto: Season):Promise<SeasonDocument>{
    return  await this.seasonModel.findByIdAndUpdate(
      { _id: id },seasonDto).catch((err) => {console.log('in error')
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
  /**
   * delete the season
   * @param id 
   * @returns 
   */

  async delete(id: string):Promise<any>{
    return  await this.seasonModel.findByIdAndRemove(
      {  _id: id })
        .catch((err) => {
            console.log('in delete');
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
