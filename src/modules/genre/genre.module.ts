import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerService } from '../../logger/logger.service'
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { Genre, GenreSchema } from './genre.schema';
import { MovieService } from '../movie/movie.service';
import { Movie,MovieSchema } from '../movie/movie.schema';
import { SeasonService } from '../season/season.service';
import { Season,SeasonSchema } from '../season/season.schema';
import { Cast,CastSchema } from '../cast/cast.schema';
import { CastService } from '../cast/cast.service';
import { EpisodeService } from '../episode/episode.service';
import { Episode,EpisodeSchema } from '../episode/episode.schema';
import { SeriesService } from '../series/series.service';
import { Series,SeriesSchema } from '../series/series.schema';
import { EpisodeModule } from '../episode/episode.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Genre.name, schema: GenreSchema },
      { name: Movie.name, schema: MovieSchema },
      { name: Series.name, schema: SeriesSchema },
      { name: Season.name, schema: SeasonSchema },
      { name: Cast.name, schema: CastSchema },
      { name: Episode.name, schema: EpisodeSchema },


    ]),
    EpisodeModule
  ],
  controllers: [GenreController],
  providers: [GenreService, LoggerService,MovieService,SeriesService,EpisodeService],
})
export class GenreModule {}