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
  import { search } from './search.schema';
import { searchService } from './search.service';
  import { LoggerService } from '../../logger/logger.service';
  import { LoggerMessages } from '../../exceptions/index';
  import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
  import { ApiPageOkResponse, Auth, AuthUser } from '../../decorators';
  import { Action } from '../../casl/userRoles';
  import { PageOptionsDto } from '../../common/dto/page-options.dto';
  
@Controller('search')
@ApiTags('search')
  export class searchController {
    constructor(
      private searchService: searchService,
      private readonly loggerService: LoggerService,
    ) {
      this.loggerService.setContext('search controller');
    }
  /**
       * Get movies and seasons by search
       * @param PageOptionsDto
       * @returns
       */
  @Get('/getMoviesSeasonssearch')
  @Auth(Action.Read, 'search')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'GET Movies Seasons search',
    type: search,
  })
  getMoviesSeasonssearch(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,

  ): Promise<any> {
    this.loggerService.log(`GET Movies Seasons search/ ${LoggerMessages.API_CALLED}`);
    return this.searchService.getMoviesSeasonssearch(pageOptionsDto);
  }
   
   
  }
  