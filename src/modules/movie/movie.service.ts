import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { Category, CategoryDocument, CategorySchema } from './category.schema';
import { Movie,MovieDocument,MovieSchema } from './movie.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions/index';
import type { Optional } from '../../types';
import { ObjectId } from 'mongodb';
import { title } from 'process';
import { Cast,CastDocument } from '../cast/cast.schema';

@Injectable()
export class MovieService {
    constructor(
      @InjectModel(Cast.name) private castModel: Model<CastDocument>,
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
  ) {}

        /**
        * Get Movies By Genre 
        * @returns 
        */
  async getMoviesByGenreId(pageOptionsDto: any): Promise<any> {
    const queryBuilder = await this.movieModel
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
            as: "genre"// output array field
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
          $facet: {
            metadata: [{ $count: 'total' }],
            movies: [
              { $sort: { [pageOptionsDto.column]: pageOptionsDto.order } },
              { $skip: pageOptionsDto.skip },
              { $limit: pageOptionsDto.take },
            ],
          },
        },
        {
          $project: {
            movies: 1,
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
        * Get One Movie 
        * @returns 
        */

   async getOne(id: string):Promise<any>{
    return  await this.movieModel
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
            }
          }
        ])
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
  /**
  * get movies search
  * @param pageOptionsDto 
  * @returns 
  */

   async getMoviesSearch(pageOptionsDto: any): Promise<Movie[]> {
    console.log(pageOptionsDto)
    const queryBuilder = await this.movieModel
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
            as: "genre"// output array field
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
  * get all Movies
  * @param pageOptionsDto 
  * @returns 
  */

  async getMovies(pageOptionsDto: PageOptionsDto): Promise<Movie[]> {
    const queryBuilder = await this.movieModel
      .aggregate([
       
        {
          $lookup: {
            from: "genres", // collection to join
            localField: "genreId",//field from the input documents
            foreignField: "_id",//field from the documents of the "from" collection
            as: "genre"// output array field
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
   * @param movieDto 
   * @returns 
   */
  async create(movieDto:Movie): Promise<MovieDocument> {
    
    const create: MovieDocument = new this.movieModel(movieDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
}

   /**
   * patch the movie
   * @param id 
   * @param movieDto object 
   * @returns 
   */
  async update(id: string, movieDto: Movie):Promise<MovieDocument>{
    return  await this.movieModel.findByIdAndUpdate(
      { _id: id },movieDto).catch((err) => {console.log('in error')
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
  /**
   * delete the movie
   * @param id 
   * @returns 
   */

  async delete(id: string):Promise<any>{
    await this.castModel.deleteMany( { streamId : id } );
    return  await this.movieModel.findByIdAndRemove(
      {  _id: id })
        .catch((err) => {
            console.log('in delete');
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
