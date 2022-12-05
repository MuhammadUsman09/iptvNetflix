import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ConfigrationModule } from './configration/configration.module';
import { ConfigrationService } from './configration/configration.service';
import { LoggerModule } from './logger/logger.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/auth.guard';
import { CaslModule } from './casl/casl.module';
import { GenreModule } from './modules/genre/genre.module';
import { SeriesModule } from './modules/series/series.module';
import { CastModule } from './modules/cast/cast.module';
import { SeasonModule } from './modules/season/season.module';
import { EpisodeModule } from './modules/episode/episode.module';
import { MovieModule } from './modules/movie/movie.module';
import { HistoryModule } from './modules/history/history.module';
import { StreamModule } from './modules/stream/stream.module';
import { searchModule } from './modules/search/search.module';
@Module({
  imports: [
    UserModule,
    ConfigrationModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigrationModule],
      useFactory: async (configService: ConfigrationService) =>
        configService.mongooseConfig,
      inject: [ConfigrationService],
    }),
    LoggerModule,
    AuthModule,
    CaslModule,
    GenreModule,
    SeriesModule,
    CastModule,
    SeasonModule,
    EpisodeModule,
    MovieModule,
    HistoryModule,
    StreamModule,
    searchModule

  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppModule],
})
export class AppModule {}
