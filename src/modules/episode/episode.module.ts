import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerService } from '../../logger/logger.service'
import { EpisodeService } from './episode.service';
import { EpisodeController } from './episode.controller';
import { Episode, EpisodeSchema } from './episode.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Episode.name, schema: EpisodeSchema },
    ]),
  ],
  controllers: [EpisodeController],
  providers: [EpisodeService, LoggerService],
})
export class EpisodeModule {}