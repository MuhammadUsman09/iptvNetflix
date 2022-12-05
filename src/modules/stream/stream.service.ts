import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { Category, CategoryDocument, CategorySchema } from './category.schema';
import { Stream,StreamDocument,StreamSchema } from './stream.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions/index';
import type { Optional } from '../../types';
import { ObjectId } from 'mongodb';

@Injectable()
export class StreamService {
    constructor(
    @InjectModel(Stream.name) private streamModel: Model<StreamDocument>,
  ) {}
  /**
  * get stream by moviedid or episode id
  * @param pageOptionsDto 
  * @returns 
  */

   async getSpecificStream(pageOptionsDto: PageOptionsDto): Promise<Stream[]> {
    console.log(pageOptionsDto['movieId']);
    if(pageOptionsDto['movieId']){
      const queryBuilder = await this.streamModel
      .aggregate([
        { $match: {
         
            movieId: new ObjectId(pageOptionsDto['movieId']) 
        }
       }
      ])
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
    }else if(pageOptionsDto['episodeId']){
      const queryBuilder = await this.streamModel
      .aggregate([
        { $match:{
         
          episodeId: new ObjectId(pageOptionsDto['episodeId']) 
        }
       }
      ])
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
    }
    return [];
    
  }
        /**
    * get One STream
    * @param id 
    * @returns 
    */

         async getOne(id: string):Promise<Stream>{
          return  await this.streamModel.findById({ _id: id })
            .catch((err) => {console.log('in error')
              throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
            });
        }
  /**
  * get all Streams
  * @param pageOptionsDto 
  * @returns 
  */

   async getStream(pageOptionsDto: PageOptionsDto): Promise<Stream[]> {
    const queryBuilder = await this.streamModel
      .aggregate([
        
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
   * @param streamDto 
   * @returns 
   */
  async create(streamDto:Stream): Promise<StreamDocument> {
    
    const create: StreamDocument = new this.streamModel(streamDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
}

   /**
   * patch the Stream
   * @param id 
   * @param streamDto object 
   * @returns 
   */
  async update(id: string, streamDto: Stream):Promise<StreamDocument>{
    console.log(streamDto)
    if(streamDto['movieId']){
      console.log('movieid')
      return  await this.streamModel.findOneAndUpdate(
        { movieId: streamDto['movieId'] },streamDto).catch((err) => {console.log('in error')
          throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
        });
    }else if(streamDto['episodeId']){
      console.log('epsodeId')
      return  await this.streamModel.findOneAndUpdate(
        { episodeId: streamDto['episodeId'] },streamDto).catch((err) => {console.log('in error')
          throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
        });
    }
  }
  /**
   * delete the Stream
   * @param id
   * @returns 
   */

  async delete(id: string,streamDto: Stream):Promise<any>{
    if(streamDto['movieId'] ){
      return  await this.streamModel.findOneAndDelete(
        {  movieId: streamDto['movieId'] })
          .catch((err) => {
              console.log('in delete');
          throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
        });
    }else if(streamDto['episodeId']){
      return  await this.streamModel.findOneAndDelete(
        {  episodeId: streamDto['episodeId'] })
          .catch((err) => {
              console.log('in delete');
          throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
        });
    }
    
  }
}