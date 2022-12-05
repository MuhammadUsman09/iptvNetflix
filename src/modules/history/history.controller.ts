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
import { History } from './history.schema';
import { HistoryService } from './history.service';
import { Auth, AuthUser, Public } from '../../decorators';
import { Action } from '../../casl/userRoles';
import { LoggerService } from '../../logger/logger.service';
import { LoggerMessages } from '../../exceptions/index';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPageOkResponse } from '../../decorators';
import { PageOptionsDto } from '../../common/dto/page-options.dto';

@Controller('history')
@ApiTags('history')
export class HistoryController {
  constructor(
    private historyService: HistoryService,
    private readonly loggerService: LoggerService
  ) {
    this.loggerService.setContext('History controller');
  }
  /**
       * Get One History
       * @returns
       */
   @Get(':id')
   @Auth(Action.Read, 'History')
   @HttpCode(HttpStatus.OK)
   @ApiPageOkResponse({
     description: 'Get  list',
     type: History,
   })
   getOne(
     @Param('id') id: string
     ): Promise<any> {
     this.loggerService.log(`GET History/ ${LoggerMessages.API_CALLED}`);
     return this.historyService.getOne(id);
   }
  /**
   * Get History
   * @param PageOptionsDto
   * @returns
   */
  @Get()
  @Auth(Action.Read, 'History')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get  list',
    type: History,
  })
  getHistory(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto
  ): Promise<History[]> {
    this.loggerService.log(`GET History/ ${LoggerMessages.API_CALLED}`);
    return this.historyService.getHistory(pageOptionsDto);
  }

  /**
   *
   * @create history
   * @param object
   * @return
   *
   */
  @Post()
  // @Auth(Action.Create, 'History')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: History, description: 'Successfully Registered' })
  async create(@Body() historyDto: History): Promise<History> {
    this.loggerService.log(`Post History/ ${LoggerMessages.API_CALLED}`);
    return await this.historyService.create(historyDto);
  }
  /**
   * @patch  history
   * @param id & object
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'History')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({ type: History, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() historyDto: any
  ): Promise<History> {
    this.loggerService.log(`Patch History/ ${LoggerMessages.API_CALLED}`);
    return await this.historyService.update(id, historyDto);
  }
  /**
   *@delete history
   * @param id
   * @return
   */
  @Delete(':id')
  @Auth(Action.Delete, 'Movie')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({ type: History, description: 'Deleted Sucessfully' })
  async delete(
    @Param('id') id: string
  ): Promise<History> {
    this.loggerService.log(`Delete Movie/ ${LoggerMessages.API_CALLED}`);
    return await this.historyService.delete(id);
  }
}
