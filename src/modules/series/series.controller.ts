import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { Series } from './series.schema';
import { SeriesService } from './series.service';
import { Auth, AuthUser, Public } from '../../decorators';
import { Action } from '../../casl/userRoles';
import { LoggerService } from '../../logger/logger.service';
import { LoggerMessages } from '../../exceptions/index';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPageOkResponse } from '../../decorators';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { SeriesPageOptionsDto } from 'src/common/dto/series-page-options.dto';
import { SeriesSearchPageOptionsDto } from 'src/common/dto/series-search-page-options.dto';

@Controller('series')
@ApiTags('series')
export class SeriesController {
  constructor(
    private seriesService: SeriesService,
    private readonly loggerService: LoggerService
  ) {
    this.loggerService.setContext('Series controller');
  }

  /**
   * Get Series
   * @param PageOptionsDto
   * @returns
   */
   @Get()
   @Auth(Action.Read, 'Series')
   @HttpCode(HttpStatus.OK)
   @ApiPageOkResponse({
     description: 'Get  list',
     type: Series,
   })
   getSeries(
     @Query(new ValidationPipe({ transform: true }))
     pageOptionsDto: PageOptionsDto
   ): Promise<Series[]> {
     this.loggerService.log(`GET Series/ ${LoggerMessages.API_CALLED}`);
     return this.seriesService.getSeries(pageOptionsDto);
   }


  /**
   *
   * @upload episodes links of series
   * @param object
   * @return
   *
   */
   @Post('/updateOneEpisodeLink')
   // @Auth(Action.Update, 'Series')
   @HttpCode(HttpStatus.CREATED)
   @ApiOkResponse({ type: Series, description: 'Successfully updated episode Links' })
   async updateOneEpisodeLink(@Body() seriesDto: any): Promise<any> {
     this.loggerService.log(`Post Series/ ${LoggerMessages.API_CALLED}`);
     return await this.seriesService.updateOneEpisodeLink(seriesDto);
   }

   /**
   *
   * @upload episodes links of series
   * @param object
   * @return
   *
   */
    @Post('/updateEpisodeLinks')
    // @Auth(Action.Update, 'Series')
    @HttpCode(HttpStatus.CREATED)
    @ApiOkResponse({ type: Series, description: 'Successfully updated episode Links' })
    async updateEpisodeLinks(@Body() seriesDto: any): Promise<any> {
      console.log(seriesDto)
      this.loggerService.log(`Post Series/ ${LoggerMessages.API_CALLED}`);
      return await this.seriesService.updateEpisodeLinks(seriesDto);
    }

    /**
   * Get One Top Trending Series Api On Genre Base 
   * @param PageOptionsDto
   * @returns
   */
   @Get('/getTopTrendingTenSeriesOnGenreBase')
   @Auth(Action.Read, 'Series')
   @HttpCode(HttpStatus.OK)
   @ApiPageOkResponse({
     description: 'Get Top Trending Ten List on Genre Base',
     type: Series,
   })
   getTopTrendingTenSeriesOnGenreBase(
     @Query(new ValidationPipe({ transform: true }))
     pageOptionsDto: SeriesPageOptionsDto
   ): Promise<Series[]> {
     this.loggerService.log(`getTopTrendingTenSeriesOnGenreBase/ ${LoggerMessages.API_CALLED}`);
     return this.seriesService.getTopTrendingTenSeriesOnGenreBase(pageOptionsDto);
   }

    /**
   * Get One Top Trending Series Api ON Genre Base 
   * @param PageOptionsDto
   * @returns
   */
   @Get('/getTopTrendingOneSeriesOnGenreBase')
   @Auth(Action.Read, 'Series')
   @HttpCode(HttpStatus.OK)
   @ApiPageOkResponse({
     description: 'Get Top Trending One Api List On Genre Base',
     type: Series,
   })
   getTopTrendingOneSeriesOnGenreBase(
     @Query(new ValidationPipe({ transform: true }))
     pageOptionsDto: SeriesPageOptionsDto
   ): Promise<Series[]> {
     this.loggerService.log(`getTopTrendingOneSeriesOnGenreBase/ ${LoggerMessages.API_CALLED}`);
     return this.seriesService.getTopTrendingOneSeriesOnGenreBase(pageOptionsDto);
   }

  /**
   * Get Series By Series Name
   * @param PageOptionsDto
   * @returns
   */
   @Get('/getSeriesSearchBySeriesName')
   @Auth(Action.Read, 'Series')
   @HttpCode(HttpStatus.OK)
   @ApiPageOkResponse({
     description: 'Get  list',
     type: Series,
   })
   getSeriesSearchBySeriesName(
     @Query(new ValidationPipe({ transform: true }))
     pageOptionsDto: SeriesSearchPageOptionsDto
   ): Promise<Series[]> {
     this.loggerService.log(`GET Series/ ${LoggerMessages.API_CALLED}`);
     return this.seriesService.getSeriesSearchBySeriesName(pageOptionsDto);
   }


  

  /**
   * Get One Top Trending Series Api
   * @param PageOptionsDto
   * @returns
   */
   @Get('/getTopTrendingSeriesOnGenreBase')
   @Auth(Action.Read, 'Series')
   @HttpCode(HttpStatus.OK)
   @ApiPageOkResponse({
     description: 'Get  list',
     type: Series,
   })
   getTopTrendingSeriesOnGenreBase(
     @Query(new ValidationPipe({ transform: true }))
     pageOptionsDto: SeriesPageOptionsDto
   ): Promise<Series[]> {
     this.loggerService.log(`GET Series/ ${LoggerMessages.API_CALLED}`);
     return this.seriesService.getTopTrendingSeriesOnGenreBase(pageOptionsDto);
   }

  /**
   * Get One Top Trending Series Api 
   * @param PageOptionsDto
   * @returns
   */
   @Get('/getTopTrendingOneSeries')
   @Auth(Action.Read, 'Series')
   @HttpCode(HttpStatus.OK)
   @ApiPageOkResponse({
     description: 'Get Top Trending One Api List',
     type: Series,
   })
   getTopTrendingOneSeries(
     @Query(new ValidationPipe({ transform: true }))
     pageOptionsDto: PageOptionsDto
   ): Promise<Series[]> {
     this.loggerService.log(`getTopTrendingOneSeries/ ${LoggerMessages.API_CALLED}`);
     return this.seriesService.getTopTrendingOneSeries(pageOptionsDto);
   }

   /**
   * Get One Top Trending Series Api 
   * @param PageOptionsDto
   * @returns
   */
    @Get('/getTopTrendingTenSeries')
    @Auth(Action.Read, 'Series')
    @HttpCode(HttpStatus.OK)
    @ApiPageOkResponse({
      description: 'Get Top Trending One Api List',
      type: Series,
    })
    getTopTrendingTenSeries(
      @Query(new ValidationPipe({ transform: true }))
      pageOptionsDto: PageOptionsDto
    ): Promise<Series[]> {
      this.loggerService.log(`getTopTrendingTenSeries/ ${LoggerMessages.API_CALLED}`);
      return this.seriesService.getTopTrendingTenSeries(pageOptionsDto);
    }

  /**
   *
   * @create Series
   * @param object
   * @return
   *
   */
  @Post()
  // @Auth(Action.Create, 'Series')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: Series, description: 'Successfully Registered' })
  async create(@Body() seriesDto: Series): Promise<Series> {
    this.loggerService.log(`Post Series/ ${LoggerMessages.API_CALLED}`);
    return await this.seriesService.create(seriesDto);
  }
  /**
   * @patch  Series
   * @param id & object
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'Series')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({ type: Series, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() actorDto: any
  ): Promise<Series> {
    this.loggerService.log(`Patch Series/ ${LoggerMessages.API_CALLED}`);
    return await this.seriesService.update(id, actorDto);
  }
  /**
   *@delete Series
   * @param id
   * @return
   */
  @Delete(':id')
  @Auth(Action.Delete, 'Series')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({ type: Series, description: 'Deleted Sucessfully' })
  async delete(
    @Param('id') id: string
    //   @Body() genreDto: Genre,
  ): Promise<Series> {
    this.loggerService.log(`Delete Series/ ${LoggerMessages.API_CALLED}`);
    return await this.seriesService.delete(id);
  }

  /**
       * Get One Series
       * @param PageOptionsDto
       * @returns
       */
   @Get(':id')
   @Auth(Action.Read, 'Series')
   @HttpCode(HttpStatus.OK)
   @ApiPageOkResponse({
     description: 'Get One Series',
     type: Series,
   })
   getOne(
     @Param('id') id: string
     ): Promise<any> {
     this.loggerService.log(`GET Series/ ${LoggerMessages.API_CALLED}`);
     return this.seriesService.getOne(id);
   }
}
