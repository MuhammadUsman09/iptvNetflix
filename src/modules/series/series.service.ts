import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { Category, CategoryDocument, CategorySchema } from './category.schema';
import { Series,SeriesDocument,SeriesSchema } from './series.schema';
import { Cast,CastDocument } from '../cast/cast.schema';
import { Episode,EpisodeDocument } from '../episode/episode.schema';
import { Season,SeasonDocument } from '../season/season.schema';
import { Genre,GenreDocument } from '../genre/genre.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions/index';
import { ObjectId } from 'mongodb';
import type { Optional } from '../../types';
import { EpisodeService } from '../episode/episode.service';
import { EpisodeController } from '../episode/episode.controller';
import { EpisodeModule } from '../episode/episode.module';
import { GeneratorProvider } from 'src/providers';
import { SeriesSearchPageOptionsDto } from 'src/common/dto/series-search-page-options.dto';


@Injectable()
export class SeriesService {
    
    constructor(
      private episodeService:EpisodeService,
    @InjectModel(Series.name) private seriesModel: Model<SeriesDocument>,
    @InjectModel(Season.name) private seasonModel: Model<SeasonDocument>,
    @InjectModel(Cast.name) private castModel: Model<CastDocument>,
    @InjectModel(Episode.name) private episodeModel: Model<EpisodeDocument>,
    @InjectModel(Genre.name) private genreModel: Model<GenreDocument>
    
  ) {}

  async updateEpisodeLinks(seriesDto: any): Promise<any> {
    let seasonsBulk,seriesData,episodeId,episodeRow;
    let seriesName,seasonNumber,episodeNumber,episodeLink
    let episodeData=seriesDto[1];
    console.log(episodeData)
    episodeData=episodeData.split(',');
    seriesName=episodeData[0]
    
    console.log(seriesName)
    const  queryBuilder= await this.seriesModel
      .aggregate([
          {
            $match:{
              title: {$regex : new RegExp(seriesName,'i')},
            },
          },
          {
            $lookup: {
              from: 'seasons',
              let: { id: '$_id' },
              pipeline: [
                {
                  $match: {
                    $and: [
                      { $expr: { $eq: ['$seriesId', '$$id'] } },
                    ],
                  },
                },
                {
                  $lookup: {
                    from: "episodes", // collection to join
                    localField: "_id",//field from the input documents
                    foreignField: "seasonId",//field from the documents of the "from" collection
                    as: "episodes"// output array field
                 },
                }
              ],
              as: 'seasons',
            },
          }
        ])
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    
    
    // console.log(queryBuilder[0]['seasons'])
    seasonsBulk=queryBuilder[0]['seasons']
    console.log(seasonsBulk)
    // console.log(queryBuilder.seasons)
    for(let i=1; i <seriesDto.length-1;i++){
      episodeRow=seriesDto[i].split(',')
      console.log(episodeRow)
      seasonNumber=episodeRow[1]
      episodeNumber=episodeRow[2]
      episodeLink=episodeRow[3]
      console.log(episodeRow)
        // await updateEpisodeLink(seasonsBulk,seasonNumber,episodeNumber,episodeLink,this.episodeService)
        var getEpisodeArr,episodeObj
        for(let i=0;i<seasonsBulk.length;i++){
          if(seasonsBulk[i].season==seasonNumber){
            getEpisodeArr=seasonsBulk[i]['episodes']
            for(let j=0;j<getEpisodeArr.length;j++){
              if(getEpisodeArr[j].episode==episodeNumber){
                // console.log(seasonsBulk[i].season)
                episodeObj=getEpisodeArr[j]
                // console.log(episodeObj)
                console.log(episodeObj.url)
                console.log(episodeObj._id.toString())
                await this.episodeModel.updateOne(
                  { _id: episodeObj._id },{ $set: {url:episodeLink}}).catch((err) => {console.log('in error')
                    throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
                  });
              }
            }
          }
        }
      // console.log(seriesData[4])
    }
    // async function updateEpisodeLink(seasonsBulk,seasonNumber,episodeNumber,episodeLink,episodeService){
    //   var getEpisodeArr,episodeObj
    //   for(let i=0;i<seasonsBulk.length;i++){
    //     if(seasonsBulk[i].season==seasonNumber){
    //       getEpisodeArr=seasonsBulk[i]['episodes']
    //       for(let j=0;j<getEpisodeArr.length;j++){
    //         if(getEpisodeArr[j].episode==episodeNumber){
    //           console.log(seasonsBulk[i].season)
    //           episodeObj=getEpisodeArr[j]
    //           console.log(episodeObj)
    //           console.log(episodeObj.url)
    //           episodeObj.url=episodeLink
    //           console.log(episodeObj)
    //           console.log(episodeObj._id)
    //         //  episodeService.update(episodeObj._id,episodeObj)
    //          let id="630f4a44274b77b9a82ecd97"
    //           episodeService.findByIdAndUpdate(
    //             { _id: new ObjectId(id)  },episodeObj).catch((err) => {console.log('in error')
    //               throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    //             });
    //         }
    //       }
    //     }
    //   }
    // }
  }
  async updateOneEpisodeLink(seriesDto: any): Promise<any> {
    let seriesName=seriesDto["seriesName"];
    let seasonNumber=seriesDto["seasonNumber"];
    let episodeNumber=seriesDto["episodeNumber"];
    let episodeLink=seriesDto["episodeLink"];
    episodeLink=episodeLink.replace(/embed/g, "download")
    console.log(seasonNumber);
    
    const  queryBuilder= await this.seriesModel
      .aggregate([
          {
            $match:{
              title: {$regex : new RegExp(seriesName,'i')},
            },
          },
          {
            $lookup: {
              from: 'seasons',
              let: { id: '$_id' },
              pipeline: [
                {
                  $match: {
                    $and: [
                      { $expr: { $eq: ['$seriesId', '$$id'] } },
                    ],
                  },
                },
                {
                  $lookup: {
                    from: "episodes", // collection to join
                    localField: "_id",//field from the input documents
                    foreignField: "seasonId",//field from the documents of the "from" collection
                    as: "episodes"// output array field
                 },
                }
              ],
              as: 'seasons',
            },
          }
        ])
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    
    
    console.log(queryBuilder[0]['seasons'])
    let seasonsBulk=queryBuilder[0]['seasons']
  
        var getEpisodeArr,episodeObj
        for(let i=0;i<seasonsBulk.length;i++){
          if(seasonsBulk[i].season==seasonNumber){
            getEpisodeArr=seasonsBulk[i]['episodes']
            for(let j=0;j<getEpisodeArr.length;j++){
              if(getEpisodeArr[j].episode==episodeNumber){
                // console.log(seasonsBulk[i].season)
                episodeObj=getEpisodeArr[j]
                // console.log(episodeObj)
                console.log(episodeObj.url)
                console.log(episodeObj._id.toString())
                console.log(episodeNumber)
                console.log(episodeObj)
                await this.episodeModel.updateOne(
                  { _id: episodeObj._id },{ $set: {url:episodeLink}}).catch((err) => {console.log('in error')
                    throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
                  });
              }
            }
          }
        }
    
    
  }

  /**
  * get all Series
  * @param pageOptionsDto 
  * @returns 
  */

   async getSeriesByGenreId(pageOptionsDto: any): Promise<any> {
    const queryBuilder = await this.seriesModel
      .aggregate([
        { $match: {
          $and : [
            {genreId:new ObjectId(pageOptionsDto.genreId)}
          ]
        }
       },
        {
          $lookup: {
            from: "genres", // collection to join
            localField: "genreId",//field from the input documents
            foreignField: "_id",//field from the documents of the "from" collection
            as: "genres"// output array field
         },
        },
        { $unwind: { path: "$genres", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "casts", // collection to join
            localField: "_id",//field from the input documents
            foreignField: "streamId",//field from the documents of the "from" collection
            as: "casts"// output array field
         },
        },
        {
          $lookup: {
            from: 'seasons',
            let: { id: '$_id' },
            pipeline: [
              {
                $match: {
                  $and: [
                    { $expr: { $eq: ['$seriesId', '$$id'] } },
                  ],
                },
              },
              {
                $lookup: {
                  from: "episodes", // collection to join
                  localField: "_id",//field from the input documents
                  foreignField: "seasonId",//field from the documents of the "from" collection
                  as: "epsiodes"// output array field
               },
              }
            ],
            as: 'seasons',
          },
        },
        {
          $lookup: {
            from: "casts", // collection to join
            localField: "_id",//field from the input documents
            foreignField: "streamId",//field from the documents of the "from" collection
            as: "casts"// output array field
         },
        },
        {
          $lookup: {
            from: 'seasons',
            let: { id: '$_id' },
            pipeline: [
              {
                $match: {
                  $and: [
                    { $expr: { $eq: ['$seriesId', '$$id'] } },
                  ],
                },
              },
              {
                $lookup: {
                  from: "episodes", // collection to join
                  localField: "_id",//field from the input documents
                  foreignField: "seasonId",//field from the documents of the "from" collection
                  as: "epsiodes"// output array field
               },
              }
            ],
            as: 'seasons',
          },
        },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            series: [
              { $sort: { [pageOptionsDto.column]: pageOptionsDto.order } },
              { $skip: pageOptionsDto.skip },
              { $limit: pageOptionsDto.take },
            ],
          },
        },
        {
          $project: {
            series: 1,
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
        * Get One Series
        * @param pageOptionsDto 
        * @returns 
        */

   async getOne(id: string):Promise<any>{
    return  await this.seriesModel
      .aggregate([
          {
            $match:{
              _id: new ObjectId(id),
            },
          },
          {
            $lookup:{
              from: "genres", // collection to join
              localField: "genreId",//field from the input documents
              foreignField: "_id",//field from the documents of the "from" collection
              as: "genres"// output array field
            }
          },
          {
            $lookup: {
              from: "casts", // collection to join
              localField: "_id",//field from the input documents
              foreignField: "streamId",//field from the documents of the "from" collection
              as: "casts"// output array field
           },
          },
          {
            $lookup: {
              from: 'seasons',
              let: { id: '$_id' },
              pipeline: [
                {
                  $match: {
                    $and: [
                      { $expr: { $eq: ['$seriesId', '$$id'] } },
                    ],
                  },
                },
                {
                  $lookup: {
                    from: "episodes", // collection to join
                    localField: "_id",//field from the input documents
                    foreignField: "seasonId",//field from the documents of the "from" collection
                    as: "epsiodes"// output array field
                 },
                }
              ],
              as: 'seasons',
            },
          }
        ])
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }

  /**
        * Get Top Trending Ten Series On Genre Base
        * @param pageOptionsDto 
        * @returns 
        */

   async getTopTrendingTenSeriesOnGenreBase(pageOptionsDto):Promise<any>{
    return  await this.seriesModel
      .aggregate([
          {
            $match:{
              $and : [
                {genreId:new ObjectId(pageOptionsDto.genreId)}
              ]
            },
          },
          {
            $lookup:{
              from: "genres", // collection to join
              localField: "genreId",//field from the input documents
              foreignField: "_id",//field from the documents of the "from" collection
              as: "genres"// output array field
            }
          },
          {
            $lookup: {
              from: "casts", // collection to join
              localField: "_id",//field from the input documents
              foreignField: "streamId",//field from the documents of the "from" collection
              as: "casts"// output array field
           },
          },
          {
            $lookup: {
              from: 'seasons',
              let: { id: '$_id' },
              pipeline: [
                {
                  $match: {
                    $and: [
                      { $expr: { $eq: ['$seriesId', '$$id'] } },
                    ],
                  },
                },
                {
                  $lookup: {
                    from: "episodes", // collection to join
                    localField: "_id",//field from the input documents
                    foreignField: "seasonId",//field from the documents of the "from" collection
                    as: "epsiodes"// output array field
                 },
                }
              ],
              as: 'seasons',
            },
          },
          { $limit : 10 }
          // {
          //   $facet: {
          //     metadata: [{ $count: 'total' }],
          //     series: [
          //       { $sort: { [pageOptionsDto.column]: pageOptionsDto.order } },
          //       { $skip: pageOptionsDto.skip },
          //       { $limit: pageOptionsDto.take },
          //     ],
          //   },
          // },
          // {
          //   $project: {
          //     series: 1,
          //     // Get total from the first element of the metadata array
          //     total: { $arrayElemAt: ['$metadata.total', 0] },
          //   },
          // },
        ])
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }


  /**
        * Get Top Trending One Series On Genre Base
        * @param pageOptionsDto 
        * @returns 
        */

   async getTopTrendingOneSeriesOnGenreBase(pageOptionsDto):Promise<any>{
    return  await this.seriesModel
      .aggregate([
          {
            $match:{
              $and : [
                {genreId:new ObjectId(pageOptionsDto.genreId)}
              ]
            },
          },
          {
            $lookup:{
              from: "genres", // collection to join
              localField: "genreId",//field from the input documents
              foreignField: "_id",//field from the documents of the "from" collection
              as: "genres"// output array field
            }
          },
          {
            $lookup: {
              from: "casts", // collection to join
              localField: "_id",//field from the input documents
              foreignField: "streamId",//field from the documents of the "from" collection
              as: "casts"// output array field
           },
          },
          {
            $lookup: {
              from: 'seasons',
              let: { id: '$_id' },
              pipeline: [
                {
                  $match: {
                    $and: [
                      { $expr: { $eq: ['$seriesId', '$$id'] } },
                    ],
                  },
                },
                {
                  $lookup: {
                    from: "episodes", // collection to join
                    localField: "_id",//field from the input documents
                    foreignField: "seasonId",//field from the documents of the "from" collection
                    as: "epsiodes"// output array field
                 },
                }
              ],
              as: 'seasons',
            },
          },
          { $limit : 1 }
          // {
          //   $facet: {
          //     metadata: [{ $count: 'total' }],
          //     series: [
          //       { $sort: { [pageOptionsDto.column]: pageOptionsDto.order } },
          //       { $skip: pageOptionsDto.skip },
          //       { $limit: pageOptionsDto.take },
          //     ],
          //   },
          // },
          // {
          //   $project: {
          //     series: 1,
          //     // Get total from the first element of the metadata array
          //     total: { $arrayElemAt: ['$metadata.total', 0] },
          //   },
          // },
        ])
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
  

  /**
        * Get Top Trending One Series
        * @param pageOptionsDto 
        * @returns 
        */

   async getTopTrendingOneSeries(pageOptionsDto):Promise<any>{
    return  await this.seriesModel
      .aggregate([
          // {
          //   $match:{
          //     _id: new ObjectId(id),
          //   },
          // },
          {
            $lookup:{
              from: "genres", // collection to join
              localField: "genreId",//field from the input documents
              foreignField: "_id",//field from the documents of the "from" collection
              as: "genres"// output array field
            }
          },
          {
            $lookup: {
              from: "casts", // collection to join
              localField: "_id",//field from the input documents
              foreignField: "streamId",//field from the documents of the "from" collection
              as: "casts"// output array field
           },
          },
          {
            $lookup: {
              from: 'seasons',
              let: { id: '$_id' },
              pipeline: [
                {
                  $match: {
                    $and: [
                      { $expr: { $eq: ['$seriesId', '$$id'] } },
                    ],
                  },
                },
                {
                  $lookup: {
                    from: "episodes", // collection to join
                    localField: "_id",//field from the input documents
                    foreignField: "seasonId",//field from the documents of the "from" collection
                    as: "epsiodes"// output array field
                 },
                }
              ],
              as: 'seasons',
            },
          },
          { $limit : 1 }
          // {
          //   $facet: {
          //     metadata: [{ $count: 'total' }],
          //     series: [
          //       { $sort: { [pageOptionsDto.column]: pageOptionsDto.order } },
          //       { $skip: pageOptionsDto.skip },
          //       { $limit: pageOptionsDto.take },
          //     ],
          //   },
          // },
          // {
          //   $project: {
          //     series: 1,
          //     // Get total from the first element of the metadata array
          //     total: { $arrayElemAt: ['$metadata.total', 0] },
          //   },
          // },
        ])
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }

  /**
        * Get Top Trending Ten Series
        * @param pageOptionsDto 
        * @returns 
        */

   async getTopTrendingTenSeries(pageOptionsDto):Promise<any>{
    return  await this.seriesModel
      .aggregate([
          // {
          //   $match:{
          //     _id: new ObjectId(id),
          //   },
          // },
          {
            $lookup:{
              from: "genres", // collection to join
              localField: "genreId",//field from the input documents
              foreignField: "_id",//field from the documents of the "from" collection
              as: "genres"// output array field
            }
          },
          {
            $lookup: {
              from: "casts", // collection to join
              localField: "_id",//field from the input documents
              foreignField: "streamId",//field from the documents of the "from" collection
              as: "casts"// output array field
           },
          },
          {
            $lookup: {
              from: 'seasons',
              let: { id: '$_id' },
              pipeline: [
                {
                  $match: {
                    $and: [
                      { $expr: { $eq: ['$seriesId', '$$id'] } },
                    ],
                  },
                },
                {
                  $lookup: {
                    from: "episodes", // collection to join
                    localField: "_id",//field from the input documents
                    foreignField: "seasonId",//field from the documents of the "from" collection
                    as: "epsiodes"// output array field
                 },
                }
              ],
              as: 'seasons',
            },
          },
          { $limit : 10 },
          
          // {
          //   $facet: {
          //     metadata: [{ $count: 'total' }],
          //     series: [
          //       { $sort: { [pageOptionsDto.column]: pageOptionsDto.order } },
          //       { $skip: pageOptionsDto.skip },
          //       { $limit: pageOptionsDto.take },
          //     ],
          //   },
          // },
          // {
          //   $project: {
          //     series: 1,
          //     // Get total from the first element of the metadata array
          //     total: { $arrayElemAt: ['$metadata.total', 0] },
          //   },
          // },
        ])
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }

   /**
        * Get Top Trending Series On Genre Base With Pagination
        * @param pageOptionsDto 
        * @returns 
        */

    async getTopTrendingSeriesOnGenreBase(pageOptionsDto):Promise<any>{
      let objectId;
      objectId=pageOptionsDto.genreId
      console.log(objectId)
      // const geTGenre= await this.genreModel.findOne({ name: pageOptionsDto.genreName })
      // if(geTGenre){
      //   objectId=geTGenre._id
      // }else{
      //   objectId=new ObjectId('000000000000000000000000')
      // }
      return  await this.seriesModel
        .aggregate([
            {
              $match:{
                genreId: new ObjectId(objectId),
              },
            },
            {
              $lookup:{
                from: "genres", // collection to join
                localField: "genreId",//field from the input documents
                foreignField: "_id",//field from the documents of the "from" collection
                as: "genres"// output array field
              }
            },
            {
              $lookup: {
                from: "casts", // collection to join
                localField: "_id",//field from the input documents
                foreignField: "streamId",//field from the documents of the "from" collection
                as: "casts"// output array field
             },
            },
            {
              $lookup: {
                from: 'seasons',
                let: { id: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $and: [
                        { $expr: { $eq: ['$seriesId', '$$id'] } },
                      ],
                    },
                  },
                  {
                    $lookup: {
                      from: "episodes", // collection to join
                      localField: "_id",//field from the input documents
                      foreignField: "seasonId",//field from the documents of the "from" collection
                      as: "epsiodes"// output array field
                   },
                  }
                ],
                as: 'seasons',
              },
            },
            // { $limit : 1 }
            {
              $facet: {
                metadata: [{ $count: 'total' }],
                series: [
                  { $sort: { [pageOptionsDto.column]: pageOptionsDto.order } },
                  { $skip: pageOptionsDto.skip },
                  { $limit: pageOptionsDto.take },
                ],
              },
            },
            {
              $project: {
                series: 1,
                // Get total from the first element of the metadata array
                total: { $arrayElemAt: ['$metadata.total', 0] },
              },
            },
          ])
        .catch((err) => {
          throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
        });
    }
   /**
  * get Series By Series Name Search
  * @param pageOptionsDto 
  * @returns 
  */

    async getSeriesSearchBySeriesName(pageOptionsDto: SeriesSearchPageOptionsDto): Promise<Series[]> {
      // const {seriesName}= pageOptionsDto.seriesName
      console.log(pageOptionsDto)
      console.log(pageOptionsDto.seriesName)
      const queryBuilder = await this.seriesModel
        .aggregate([
          {
            $match: { title: { $regex: new RegExp(pageOptionsDto.seriesName, "i") } }
            // pageOptionsDto.seriesName ? { title: { $regex: new RegExp(pageOptionsDto.seriesName, "i") } } : {},
          },
          {
            $lookup: {
              from: "genres", // collection to join
              localField: "genreId",//field from the input documents
              foreignField: "_id",//field from the documents of the "from" collection
              as: "genres"// output array field
           },
          },
          { $unwind: { path: "$genres", preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: "casts", // collection to join
              localField: "_id",//field from the input documents
              foreignField: "streamId",//field from the documents of the "from" collection
              as: "casts"// output array field
           },
          },
          {
            $lookup: {
              from: 'seasons',
              let: { id: '$_id' },
              pipeline: [
                {
                  $match: {
                    $and: [
                      { $expr: { $eq: ['$seriesId', '$$id'] } },
                    ],
                  },
                },
                {
                  $lookup: {
                    from: "episodes", // collection to join
                    localField: "_id",//field from the input documents
                    foreignField: "seasonId",//field from the documents of the "from" collection
                    as: "epsiodes"// output array field
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
  * get Series Search
  * @param pageOptionsDto 
  * @returns 
  */

   async getSeriesSearch(pageOptionsDto: any): Promise<Series[]> {
    const queryBuilder = await this.seriesModel
      .aggregate([
        {
          $match: 
            
          pageOptionsDto.searchKeyword ? { title: { $regex: new RegExp(pageOptionsDto.searchKeyword, "i") } } : {},
            
          
        },
        {
          $lookup: {
            from: "genres", // collection to join
            localField: "genreId",//field from the input documents
            foreignField: "_id",//field from the documents of the "from" collection
            as: "genres"// output array field
         },
        },
        { $unwind: { path: "$genres", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "casts", // collection to join
            localField: "_id",//field from the input documents
            foreignField: "streamId",//field from the documents of the "from" collection
            as: "casts"// output array field
         },
        },
        {
          $lookup: {
            from: 'seasons',
            let: { id: '$_id' },
            pipeline: [
              {
                $match: {
                  $and: [
                    { $expr: { $eq: ['$seriesId', '$$id'] } },
                  ],
                },
              },
              {
                $lookup: {
                  from: "episodes", // collection to join
                  localField: "_id",//field from the input documents
                  foreignField: "seasonId",//field from the documents of the "from" collection
                  as: "epsiodes"// output array field
               },
              }
            ],
            as: 'seasons',
          },
        },
        {
          $lookup: {
            from: "casts", // collection to join
            localField: "_id",//field from the input documents
            foreignField: "streamId",//field from the documents of the "from" collection
            as: "casts"// output array field
         },
        },
        {
          $lookup: {
            from: 'seasons',
            let: { id: '$_id' },
            pipeline: [
              {
                $match: {
                  $and: [
                    { $expr: { $eq: ['$seriesId', '$$id'] } },
                  ],
                },
              },
              {
                $lookup: {
                  from: "episodes", // collection to join
                  localField: "_id",//field from the input documents
                  foreignField: "seasonId",//field from the documents of the "from" collection
                  as: "epsiodes"// output array field
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
  * get all Series
  * @param pageOptionsDto 
  * @returns 
  */

  async getSeries(pageOptionsDto: PageOptionsDto): Promise<Series[]> {
    const queryBuilder = await this.seriesModel
      .aggregate([
        {
          $lookup: {
            from: "genres", // collection to join
            localField: "genreId",//field from the input documents
            foreignField: "_id",//field from the documents of the "from" collection
            as: "genres"// output array field
         },
        },
        { $unwind: { path: "$genres", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "casts", // collection to join
            localField: "_id",//field from the input documents
            foreignField: "streamId",//field from the documents of the "from" collection
            as: "casts"// output array field
         },
        },
        {
          $lookup: {
            from: 'seasons',
            let: { id: '$_id' },
            pipeline: [
              {
                $match: {
                  $and: [
                    { $expr: { $eq: ['$seriesId', '$$id'] } },
                  ],
                },
              },
              {
                $lookup: {
                  from: "episodes", // collection to join
                  localField: "_id",//field from the input documents
                  foreignField: "seasonId",//field from the documents of the "from" collection
                  as: "epsiodes"// output array field
               },
              }
            ],
            as: 'seasons',
          },
        },
        {
          $lookup: {
            from: "casts", // collection to join
            localField: "_id",//field from the input documents
            foreignField: "streamId",//field from the documents of the "from" collection
            as: "casts"// output array field
         },
        },
        {
          $lookup: {
            from: 'seasons',
            let: { id: '$_id' },
            pipeline: [
              {
                $match: {
                  $and: [
                    { $expr: { $eq: ['$seriesId', '$$id'] } },
                  ],
                },
              },
              {
                $lookup: {
                  from: "episodes", // collection to join
                  localField: "_id",//field from the input documents
                  foreignField: "seasonId",//field from the documents of the "from" collection
                  as: "epsiodes"// output array field
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
  * get all Series
  * @param pageOptionsDto 
  * @returns 
  */

   async getTopTrendingSeries(pageOptionsDto: PageOptionsDto): Promise<Series[]> {
    const queryBuilder = await this.seriesModel
      .aggregate([
        {
          $lookup: {
            from: "genres", // collection to join
            localField: "genreId",//field from the input documents
            foreignField: "_id",//field from the documents of the "from" collection
            as: "genres"// output array field
         },
        },
        { $unwind: { path: "$genres", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "casts", // collection to join
            localField: "_id",//field from the input documents
            foreignField: "streamId",//field from the documents of the "from" collection
            as: "casts"// output array field
         },
        },
        {
          $lookup: {
            from: 'seasons',
            let: { id: '$_id' },
            pipeline: [
              {
                $match: {
                  $and: [
                    { $expr: { $eq: ['$seriesId', '$$id'] } },
                  ],
                },
              },
              {
                $lookup: {
                  from: "episodes", // collection to join
                  localField: "_id",//field from the input documents
                  foreignField: "seasonId",//field from the documents of the "from" collection
                  as: "epsiodes"// output array field
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
   * @param seriesDto 
   * @returns 
   */
  async create(seriesDto:Series): Promise<SeriesDocument> {
    
    const create: SeriesDocument = new this.seriesModel(seriesDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
}

   /**
   * patch the series
   * @param id 
   * @param seriesDto object 
   * @returns 
   */
  async update(id: string, seriesDto: Series):Promise<SeriesDocument>{
    return  await this.seriesModel.findByIdAndUpdate(
      { _id: id },seriesDto).catch((err) => {console.log('in error')
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
  /**
   * delete the series
   * @param id 
   * @returns 
   */

  async delete(id: string):Promise<any>{
    
    const seasonIds=  await this.seasonModel.find( { seriesId : id },{seriesId:1});
    for(let i=0;i<seasonIds.length;i++){
        console.log(seasonIds[i]._id)
        await this.episodeModel.deleteMany( { seasonId : seasonIds[i]._id } );
    }
    await this.castModel.deleteMany( { streamId : id } );
    await this.seasonModel.deleteMany( { seriesId : id } );
    return  await this.seriesModel.findByIdAndRemove(
      {  _id: id })
        .catch((err) => {
            console.log('in delete');
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
