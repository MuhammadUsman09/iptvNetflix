import { HttpException, Injectable, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { Category, CategoryDocument, CategorySchema } from './category.schema';
import { Genre,GenreDocument,GenreSchema } from './genre.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions/index';
import type { Optional } from '../../types';
import { isEmpty } from 'class-validator';
import { count } from 'console';
import { MovieService } from '../movie/movie.service';
import { SeriesService } from '../series/series.service';
@Injectable()
export class GenreService {
    constructor(private movieService: MovieService,
      private seriesService: SeriesService,
    @InjectModel(Genre.name) private genreModel: Model<GenreDocument>,
  ) {}
      /**
    * get Movies and seasons and genre
    * @param id 
    * @returns 
    */

       async getMoviesSeasonsAndGenres(pageOptionsDto: PageOptionsDto):Promise<any>{
        const moviesFilter =await this.movieService.getMovies(pageOptionsDto);
        const seriesFilter =await this.seriesService.getSeries(pageOptionsDto);
        const genreFiler=await this.getGenresWithoutPagination(pageOptionsDto);
        var result = {
          genreFiler,
          moviesFilter,
          seriesFilter
        }
        return  result;
      } 
          /**
    * get Movies and seasons by genre id
    * @param id 
    * @returns 
    */

   async getMoviesAndSeasonsByGenreId(pageOptionsDto: PageOptionsDto):Promise<any>{
    const moviesFilter =await this.movieService.getMoviesByGenreId(pageOptionsDto);
    const seriesFilter =await this.seriesService.getSeriesByGenreId(pageOptionsDto);
    var result = {
      moviesFilter,
      seriesFilter
    }
    return  result;
  }         

  async getOne(id: string):Promise<Genre>{
    return  await this.genreModel.findById({ _id: id })
      .catch((err) => {console.log('in error')
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
 /**
  * get all Genres
  * @param pageOptionsDto 
  * @returns 
  */

  async getGenresWithoutPagination(pageOptionsDto: PageOptionsDto): Promise<Genre[]> {
    const queryBuilder = await this.genreModel
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
  * get all Genres
  * @param pageOptionsDto 
  * @returns 
  */

  async getGenres(pageOptionsDto: PageOptionsDto): Promise<Genre[]> {
    const queryBuilder = await this.genreModel
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

  /**
   * post 
   * @param genreDto 
   * @returns 
   */
  async create(genreDto:Genre): Promise<GenreDocument> {
      
      const b = await this.genreModel.findOne({name:genreDto.name})
      // let len=b.length;
      if(b){
         console.log(b)
         return b;
      }else{
        const create: GenreDocument = new this.genreModel(genreDto);
        return await create.save().catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
       });
      }
      
   
}

   /**
   * patch the genre
   * @param id 
   * @param genreData object 
   * @returns 
   */
  async update(id: string, genreDto: Genre):Promise<GenreDocument>{
    
    return  await this.genreModel.findByIdAndUpdate(
      { _id: id },genreDto).catch((err) => {console.log('in error')
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
  /**
   * delete the genre
   * @param id 
   * @returns 
   */

  async delete(id: string):Promise<any>{
    return  await this.genreModel.updateOne(
      { 
        $or: [ { _id: id } ] },{isActive:false})
        .catch((err) => {
            console.log('in delete');
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
