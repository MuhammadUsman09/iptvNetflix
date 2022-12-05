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
import { Cast } from './cast.schema';
import { CastService } from './cast.service';
import { Auth, AuthUser, Public } from '../../decorators';
import { Action } from '../../casl/userRoles';
import { LoggerService } from '../../logger/logger.service';
import { LoggerMessages } from '../../exceptions/index';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPageOkResponse } from '../../decorators';
import { PageOptionsDto } from '../../common/dto/page-options.dto';

@Controller('cast')
@ApiTags('casts')
export class CastController {
  constructor(
    private castService: CastService,
    private readonly loggerService: LoggerService
  ) {
    this.loggerService.setContext('Cast controller');
  }


   

   /**
       * Get One Cast
       * @returns
       */
    @Get(':id')
    @Auth(Action.Read, 'Cast')
    @HttpCode(HttpStatus.OK)
    @ApiPageOkResponse({
      description: 'Get  list',
      type: Cast,
    })
    getOne(
      @Param('id') id: string
      ): Promise<any> {
      this.loggerService.log(`GET Cast/ ${LoggerMessages.API_CALLED}`);
      return this.castService.getOne(id);
    }


  /**
   * Get Cast
   * @param PageOptionsDto
   * @returns
   */
  @Get()
  @Auth(Action.Read, 'Cast')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get  list',
    type: Cast,
  })
  getCast(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto
  ): Promise<Cast[]> {
    this.loggerService.log(`GET Casts/ ${LoggerMessages.API_CALLED}`);
    return this.castService.getCast(pageOptionsDto);
  }

  /**
   *
   * @create Cast
   * @param object
   * @return
   *
   */
  @Post()
  // @Auth(Action.Create, 'Cast')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: Cast, description: 'Successfully Registered' })
  async create(@Body() castDto: Cast): Promise<Cast> {
    this.loggerService.log(`Post Cast/ ${LoggerMessages.API_CALLED}`);
    return await this.castService.create(castDto);
  }
  /**
   * @patch  Cast
   * @param id & object
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'Cast')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({ type: Cast, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() castDto: any
  ): Promise<Cast> {
    this.loggerService.log(`Patch Cast/ ${LoggerMessages.API_CALLED}`);
    return await this.castService.update(id, castDto);
  }
  /**
   *@delete cast
   * @param id
   * @return
   */
  @Delete(':id')
  @Auth(Action.Delete, 'Cast')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({ type: Cast, description: 'Deleted Sucessfully' })
  async delete(
    @Param('id') id: string
  ): Promise<Cast> {
    this.loggerService.log(`Delete Cast/ ${LoggerMessages.API_CALLED}`);
    return await this.castService.delete(id);
  }
}
