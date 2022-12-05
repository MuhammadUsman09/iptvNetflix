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
import { Episode } from './episode.schema';
import { EpisodeService } from './episode.service';
import { Auth, AuthUser, Public } from '../../decorators';
import { Action } from '../../casl/userRoles';
import { LoggerService } from '../../logger/logger.service';
import { LoggerMessages } from '../../exceptions/index';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPageOkResponse } from '../../decorators';
import { PageOptionsDto } from '../../common/dto/page-options.dto';

@Controller('episode')
@ApiTags('episode')
export class EpisodeController {
  constructor(
    private episodeService: EpisodeService,
    private readonly loggerService: LoggerService
  ) {
    this.loggerService.setContext('Episode controller');
  }
  /**
       * Get One Episode
       * @param PageOptionsDto
       * @returns
       */
   @Get(':id')
   @Auth(Action.Read, 'Episode')
   @HttpCode(HttpStatus.OK)
   @ApiPageOkResponse({
     description: 'Get  One Episode',
     type: Episode,
   })
   getOne(
     @Param('id') id: string
     ): Promise<any> {
     this.loggerService.log(`GET Episode/ ${LoggerMessages.API_CALLED}`);
     return this.episodeService.getOne(id);
   }
  /**
   * Get Episodes
   * @param PageOptionsDto
   * @returns
   */
  @Get()
  @Auth(Action.Read, 'Episode')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get  list',
    type: Episode,
  })
  getCast(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto
  ): Promise<Episode[]> {
    this.loggerService.log(`GET Episodes/ ${LoggerMessages.API_CALLED}`);
    return this.episodeService.getEpisode(pageOptionsDto);
  }

  /**
   *
   * @create Episode
   * @param object
   * @return
   *
   */
  @Post()
  // @Auth(Action.Create, 'Episode')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: Episode, description: 'Successfully Registered' })
  async create(@Body() episodeDto: any): Promise<Episode[]> {
    this.loggerService.log(`Post Episode/ ${LoggerMessages.API_CALLED}`);
    return await this.episodeService.create(episodeDto);
  }
  /**
   * @patch  Episode
   * @param id & object
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'Episode')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({ type: Episode, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() episodeDto: any
  ): Promise<Episode> {
    this.loggerService.log(`Patch Episode/ ${LoggerMessages.API_CALLED}`);
    return await this.episodeService.update(id, episodeDto);
  }
  /**
   *@delete episode
   * @param id
   * @return
   */
  @Delete(':id')
  @Auth(Action.Delete, 'Episode')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({ type: Episode, description: 'Deleted Sucessfully' })
  async delete(
    @Param('id') id: string
  ): Promise<Episode> {
    this.loggerService.log(`Delete Category/ ${LoggerMessages.API_CALLED}`);
    return await this.episodeService.delete(id);
  }
}
