import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerService } from '../../logger/logger.service'
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { Movie, MovieSchema } from './movie.schema';
import { Cast, CastSchema } from '../cast/cast.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Movie.name, schema: MovieSchema },
      { name: Cast.name, schema: CastSchema },
    ]),
  ],
  controllers: [MovieController],
  providers: [MovieService, LoggerService],
})
export class MovieModule {}