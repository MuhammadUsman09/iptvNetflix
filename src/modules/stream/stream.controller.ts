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
import { Stream } from './stream.schema';
import { StreamService } from './stream.service';
import { Auth, AuthUser, Public } from '../../decorators';
import { Action } from '../../casl/userRoles';
import { LoggerService } from '../../logger/logger.service';
import { LoggerMessages } from '../../exceptions/index';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPageOkResponse } from '../../decorators';
import { PageOptionsDto } from '../../common/dto/page-options.dto';

@Controller('stream')
@ApiTags('stream')
export class StreamController {
  constructor(
    private streamService: StreamService,
    private readonly loggerService: LoggerService
  ) {
    this.loggerService.setContext('Stream controller');
  }
   /**
   * Get  Stream by movieId or EpisodeId
   * @param PageOptionsDto
   * @returns
   */
    @Get('/getStreamByMovieIdOrEpisodeId')
    @Auth(Action.Read, 'Stream')
    @HttpCode(HttpStatus.OK)
    @ApiPageOkResponse({
      description: 'Get  list',
      type: Stream,
    })
    getSpecificStream(
      @Query(new ValidationPipe({ transform: true }))
      pageOptionsDto: PageOptionsDto
    ): Promise<Stream[]> {
      this.loggerService.log(`GET Stream/ ${LoggerMessages.API_CALLED}`);
      return this.streamService.getSpecificStream(pageOptionsDto);
    }
  /**
       * Get One Stream
       * @returns
       */
   @Get(':id')
   @Auth(Action.Read, 'Stream')
   @HttpCode(HttpStatus.OK)
   @ApiPageOkResponse({
     description: 'Get  list',
     type: Stream,
   })
   getOne(
     @Param('id') id: string
     ): Promise<any> {
     this.loggerService.log(`GET Stream/ ${LoggerMessages.API_CALLED}`);
     return this.streamService.getOne(id);
   }
  /**
   * Get Stream
   * @param PageOptionsDto
   * @returns
   */
  @Get()
  @Auth(Action.Read, 'Stream')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get  list',
    type: Stream,
  })
  getStream(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto
  ): Promise<Stream[]> {
    this.loggerService.log(`GET Stream/ ${LoggerMessages.API_CALLED}`);
    return this.streamService.getStream(pageOptionsDto);
  }

  /**
   *
   * @create Stream
   * @param object
   * @return
   *
   */
  @Post()
  // @Auth(Action.Create, 'Stream')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: Stream, description: 'Successfully Registered' })
  async create(@Body() StreamDto: Stream): Promise<Stream> {
    this.loggerService.log(`Post Stream/ ${LoggerMessages.API_CALLED}`);
    return await this.streamService.create(StreamDto);
  }
  /**
   * @patch  Stream
   * @param id & object
   * @return
   *
   */
  @Patch()
  @Auth(Action.Update, 'Stream')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({ type: Stream, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() StreamDto: any
  ): Promise<Stream> {
    this.loggerService.log(`Patch Stream/ ${LoggerMessages.API_CALLED}`);
    return await this.streamService.update(id, StreamDto);
  }
  /**
   *@delete Stream
   * @param id
   * @return
   */
  @Delete()
  @Auth(Action.Delete, 'Movie')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({ type: Stream, description: 'Deleted Sucessfully' })
  async delete(
    @Param('id') id: string,
    @Body() StreamDto: any
  ): Promise<Stream> {
    this.loggerService.log(`Delete Movie/ ${LoggerMessages.API_CALLED}`);
    return await this.streamService.delete(id,StreamDto);
  }
}