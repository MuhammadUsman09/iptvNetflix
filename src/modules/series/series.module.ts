import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerService } from '../../logger/logger.service'
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { Series, SeriesSchema } from './series.schema';
import { Cast,CastSchema } from '../cast/cast.schema';
import { Episode,EpisodeSchema } from '../episode/episode.schema';
import { Season,SeasonSchema } from '../season/season.schema';
import { EpisodeModule } from '../episode/episode.module';
import { EpisodeService } from '../episode/episode.service';
import { Genre,GenreSchema } from '../genre/genre.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Series.name, schema: SeriesSchema },
      { name: Season.name, schema: SeasonSchema },
      { name: Cast.name, schema: CastSchema },
      { name: Episode.name, schema: EpisodeSchema },
      {name: Genre.name, schema: GenreSchema}
    ]),
    EpisodeModule
  ],
  controllers: [SeriesController],
  providers: [SeriesService, LoggerService,EpisodeService],
})
export class SeriesModule {}