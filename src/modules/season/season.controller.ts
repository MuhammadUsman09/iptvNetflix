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
import { Season } from './season.schema';
import { SeasonService } from './season.service';
import { Auth, AuthUser, Public } from '../../decorators';
import { Action } from '../../casl/userRoles';
import { LoggerService } from '../../logger/logger.service';
import { LoggerMessages } from '../../exceptions/index';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPageOkResponse } from '../../decorators';
import { PageOptionsDto } from '../../common/dto/page-options.dto';

@Controller('season')
@ApiTags('season')
export class SeasonController {
  constructor(
    private seasonService: SeasonService,
    private readonly loggerService: LoggerService
  ) {
    this.loggerService.setContext('Season controller');
  }
  /**
       * Get One Season
       * @param PageOptionsDto
       * @returns
       */
   @Get(':id')
   @Auth(Action.Read, 'Season')
   @HttpCode(HttpStatus.OK)
   @ApiPageOkResponse({
     description: 'Get  list',
     type: Season,
   })
   getOne(
     @Param('id') id: string
     ): Promise<any> {
     this.loggerService.log(`GET Season/ ${LoggerMessages.API_CALLED}`);
     return this.seasonService.getOne(id);
   }
  /**
   * Get All Seasosn
   * @param PageOptionsDto
   * @returns
   */
  @Get()
  @Auth(Action.Read, 'Season')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get  list',
    type: Season,
  })
  getCast(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto
  ): Promise<Season[]> {
    this.loggerService.log(`GET season/ ${LoggerMessages.API_CALLED}`);
    return this.seasonService.getSeason(pageOptionsDto);
  }

  /**
   *
   * @create season
   * @param object
   * @return
   *
   */
  @Post()
  // @Auth(Action.Create, 'Season')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: Season, description: 'Successfully Registered' })
  async create(@Body() castDto: Season): Promise<Season> {
    this.loggerService.log(`Post season/ ${LoggerMessages.API_CALLED}`);
    return await this.seasonService.create(castDto);
  }
  /**
   * @patch  season
   * @param id & object
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'Season')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({ type: Season, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() seasonDto: any
  ): Promise<Season> {
    this.loggerService.log(`Patch Season/ ${LoggerMessages.API_CALLED}`);
    return await this.seasonService.update(id, seasonDto);
  }
  /**
   *@delete season
   * @param id
   * @return
   */
  @Delete(':id')
  @Auth(Action.Delete, 'Season')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({ type: Season, description: 'Deleted Sucessfully' })
  async delete(
    @Param('id') id: string
    //   @Body() genreDto: Genre,
  ): Promise<Season> {
    this.loggerService.log(`Delete Season/ ${LoggerMessages.API_CALLED}`);
    return await this.seasonService.delete(id);
  }
}
