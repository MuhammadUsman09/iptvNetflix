import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerService } from '../../logger/logger.service'
import { SeasonService } from './season.service';
import { SeasonController } from './season.controller';
import { Season, SeasonSchema } from './season.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Season.name, schema: SeasonSchema },
    ]),
  ],
  controllers: [SeasonController],
  providers: [SeasonService, LoggerService],
})
export class SeasonModule {}