import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { Category, CategoryDocument, CategorySchema } from './category.schema';
import { History,HistoryDocument,HistorySchema } from './history.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions/index';
import type { Optional } from '../../types';
import { ObjectId } from 'mongodb';

@Injectable()
export class HistoryService {
    constructor(
    @InjectModel(History.name) private historyModel: Model<HistoryDocument>,
  ) {}
  /**
        * Get One History
        * @returns 
        */
   async getOne(id: string):Promise<any>{
    return  await this.historyModel
      .aggregate([
          {
            $match:{
              _id: new ObjectId(id),
            },
          },
          {
            $lookup: {
              from: 'episodes',
              let: { streamId: '$streamId' },
              pipeline: [
                {
                  $match: {
                    $and: [
                      { $expr: { $eq: ['$_id', '$$streamId'] } },
                    ],
                  },
                },
                {
                  $lookup: {
                    from: "seasons", // collection to join
                    let: { seasonId: '$seasonId' },//field from the input documents
                    pipeline: [
                      {
                        $match: {
                          $and: [
                            { $expr: { $eq: ['$_id', '$$seasonId'] } },
                          ],
                        },
                      },
                      {
                        $lookup: {
                          from: "series", // collection to join
                          localField: "seriesId",//field from the input documents
                          foreignField: "_id",//field from the documents of the "from" collection
                          as: "series"// output array field
                       },
                      }
                    ],//field from the documents of the "from" collection
                    as: "seasons"// output array field
                 },
                }
              ],
              as: 'episodes',
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
  * get all History Data
  * @param pageOptionsDto 
  * @returns 
  */

  async getHistory(pageOptionsDto: PageOptionsDto): Promise<History[]> {
    const queryBuilder = await this.historyModel
      .aggregate([
        {
          $lookup: {
            from: 'episodes',
            let: { streamId: '$streamId' },
            pipeline: [
              {
                $match: {
                  $and: [
                    { $expr: { $eq: ['$_id', '$$streamId'] } },
                  ],
                },
              },
              {
                $lookup: {
                  from: "seasons", // collection to join
                  let: { seasonId: '$seasonId' },//field from the input documents
                  pipeline: [
                    {
                      $match: {
                        $and: [
                          { $expr: { $eq: ['$_id', '$$seasonId'] } },
                        ],
                      },
                    },
                    {
                      $lookup: {
                        from: "series", // collection to join
                        localField: "seriesId",//field from the input documents
                        foreignField: "_id",//field from the documents of the "from" collection
                        as: "series"// output array field
                     },
                    }
                  ],//field from the documents of the "from" collection
                  as: "seasons"// output array field
               },
              }
            ],
            as: 'episodes',
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
        $lookup: {
          from: "users", // collection to join
          localField: "userId",//field from the input documents
          foreignField: "_id",//field from the documents of the "from" collection
          as: "users"// output array field
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
   * @param historyDto 
   * @returns 
   */
  async create(historyDto:History): Promise<HistoryDocument> {
    
    const create: HistoryDocument = new this.historyModel(historyDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
}

   /**
   * patch the history
   * @param id 
   * @param historyDto object 
   * @returns 
   */
  async update(id: string, historyDto: History):Promise<HistoryDocument>{
    return  await this.historyModel.findByIdAndUpdate(
      { _id: id },historyDto).catch((err) => {console.log('in error')
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
  /**
   * delete the history
   * @param id
   * @returns 
   */

  async delete(id: string):Promise<any>{
    return  await this.historyModel.findByIdAndRemove(
      {  _id: id })
        .catch((err) => {
            console.log('in delete');
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
