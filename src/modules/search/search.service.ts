import { HttpException, Injectable, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { Category, CategoryDocument, CategorySchema } from './category.schema';
import { search,searchDocument,searchSchema } from './search.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions/index';
import type { Optional } from '../../types';
import { isEmpty } from 'class-validator';
import { count } from 'console';
import { MovieService } from '../movie/movie.service';
import { SeriesService } from '../series/series.service';
@Injectable()
export class searchService {
    constructor(private movieService: MovieService,
      private seriesService: SeriesService,
    @InjectModel(search.name) private searchModel: Model<searchDocument>,
  ) {}
      /**
    * get Movies and seasons and search
    * @param id 
    * @returns 
    */

       async getMoviesSeasonssearch(pageOptionsDto: PageOptionsDto):Promise<any>{
        const moviesFilter =await this.movieService.getMoviesSearch(pageOptionsDto);
        const seriesFilter =await this.seriesService.getSeriesSearch(pageOptionsDto);
        var result = {
          moviesFilter,
          seriesFilter
        }
        return  result;
      } 
          /**
    * get Movies and seasons by search id
    * @param id 
    * @returns 
    */

  //  async getMoviesAndSeasonsBysearchId(pageOptionsDto: PageOptionsDto):Promise<any>{
  //   const moviesFilter =await this.movieService.getMoviesBysearchId(pageOptionsDto);
  //   const seriesFilter =await this.seriesService.getSeriesBysearchId(pageOptionsDto);
  //   var result = {
  //     moviesFilter,
  //     seriesFilter
  //   }
  //   return  result;
  // }         

  async getsearchs(pageOptionsDto: PageOptionsDto): Promise<search[]> {
    const queryBuilder = await this.searchModel
      .aggregate([
        { $match: {
          $and : [
            {isActive:true}
          ]
        }
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
}
