import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerService } from '../../logger/logger.service'
import { CastService } from './cast.service';
import { CastController } from './cast.controller';
import { Cast, CastSchema } from './cast.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cast.name, schema: CastSchema },
    ]),
  ],
  controllers: [CastController],
  providers: [CastService, LoggerService],
})
export class CastModule {}