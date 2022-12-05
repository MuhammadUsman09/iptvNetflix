import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerService } from '../../logger/logger.service'
import { StreamService } from './stream.service';
import { StreamController } from './stream.controller';
import { Stream , StreamSchema} from './stream.schema'; 
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Stream.name, schema: StreamSchema },
    ]),
  ],
  controllers: [StreamController],
  providers: [StreamService, LoggerService],
})
export class StreamModule {}