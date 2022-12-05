import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerService } from '../../logger/logger.service'
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { History, HistorySchema } from './history.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: History.name, schema: HistorySchema },
    ]),
  ],
  controllers: [HistoryController],
  providers: [HistoryService, LoggerService],
})
export class HistoryModule {}