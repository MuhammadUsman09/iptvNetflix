import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { Category, CategoryDocument, CategorySchema } from './category.schema';
import { Episode,EpisodeDocument,EpisodeSchema } from './episode.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions/index';
import { ObjectId } from 'mongodb';
import type { Optional } from '../../types';
import { AnyARecord } from 'dns';


@Injectable()
export class EpisodeService {
    constructor(
    @InjectModel(Episode.name) private episodeModel: Model<EpisodeDocument>,
  ) {}
  /**
        * Get One Episode
        * @param pageOptionsDto 
        * @returns 
        */

   async getOne(id: string):Promise<any>{
    return  await this.episodeModel
      .aggregate([
          {
            $match:{
              _id: new ObjectId(id),
            },
          },
          {
            $lookup: {
              from: 'seasons',
              let: { seasonId: '$seasonId' },
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
              ],
              as: 'seasons',
            },
          },
        ])
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
 /**
  * get all Episodes
  * @param pageOptionsDto 
  * @returns 
  */

  async getEpisode(pageOptionsDto: PageOptionsDto): Promise<Episode[]> {
    const queryBuilder = await this.episodeModel
      .aggregate([
        {
          $lookup: {
            from: 'seasons',
            let: { seasonId: '$seasonId' },
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
            ],
            as: 'seasons',
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
   * @param episodeDto 
   * @returns 
   */
  async create(episodeDto:Episode[]): Promise<Episode[]> {
    var episodeArray=new Array();
    var getOneEpisode;
    for(let i=0;i<episodeDto.length;i++){
      const create: EpisodeDocument = new this.episodeModel(episodeDto[i]);
      getOneEpisode=await create.save().catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
      episodeArray.push(getOneEpisode);
    }
    return  episodeArray;
}
/**
 * get all episodes
 * @param pageOptionsDto 
 * @returns 
 */

   /**
   * patch the episode
   * @param id 
   * @param episodeDto object 
   * @returns 
   */
  async update(id: any, episodeLink: string):Promise<any>{
    console.log("======")
    console.log(id)
    console.log(episodeLink)
    return  await this.episodeModel.updateOne(
      { _id: id },{ $set: {url:episodeLink}}).catch((err) => {console.log('in error')
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
  /**
   * delete the episode
   * @param id 
   * @returns 
   */

  async delete(id: string):Promise<any>{
    return  await this.episodeModel.findByIdAndRemove(
      {  _id: id })
        .catch((err) => {
            console.log('in delete');
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
