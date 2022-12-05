import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerService } from '../../logger/logger.service'
import { searchService } from './search.service';
import { searchController } from './search.controller';
import { search, searchSchema } from './search.schema';
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
import { Genre,GenreSchema } from '../genre/genre.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: search.name, schema: searchSchema },
      { name: Movie.name, schema: MovieSchema },
      { name: Series.name, schema: SeriesSchema },
      { name: Season.name, schema: SeasonSchema },
      { name: Cast.name, schema: CastSchema },
      { name: Episode.name, schema: EpisodeSchema },
      {name: Genre.name,schema:GenreSchema}
    ]),
    EpisodeModule
  ],
  controllers: [searchController],
  providers: [searchService, LoggerService,MovieService,SeriesService,EpisodeService],
})
export class searchModule {}