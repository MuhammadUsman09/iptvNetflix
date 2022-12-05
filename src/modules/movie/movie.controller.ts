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
import { Movie } from './movie.schema';
import { MovieService } from './movie.service';
import { Auth, AuthUser, Public } from '../../decorators';
import { Action } from '../../casl/userRoles';
import { LoggerService } from '../../logger/logger.service';
import { LoggerMessages } from '../../exceptions/index';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPageOkResponse } from '../../decorators';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
@Controller('movie')
@ApiTags('movie')
export class MovieController {
  constructor(
    private movieService: MovieService,
    private readonly loggerService: LoggerService
  ) {
    this.loggerService.setContext('Movies controller');
  }
   /**
       * Get One Movie
       * @returns
       */
    @Get(':id')
    @Auth(Action.Read, 'Movie')
    @HttpCode(HttpStatus.OK)
    @ApiPageOkResponse({
      description: 'Get  One MOvie',
      type: Movie,
    })
    getOne(
      @Param('id') id: string
      ): Promise<any> {
      this.loggerService.log(`GET Movie/ ${LoggerMessages.API_CALLED}`);
      return this.movieService.getOne(id);
    }
  /**
   * Get Movie
   * @param PageOptionsDto
   * @returns
   */
  @Get()
  @Auth(Action.Read, 'Movie')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get  list',
    type: Movie,
  })
  getMovies(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto
  ): Promise<Movie[]> {
    this.loggerService.log(`GET Movies/ ${LoggerMessages.API_CALLED}`);
    return this.movieService.getMovies(pageOptionsDto);
  }

  /**
   *
   * @create movie
   * @param object
   * @return
   *
   */
  @Post()
  // @Auth(Action.Create, 'Movie')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: Movie, description: 'Successfully Registered' })
  async create(@Body() castDto: Movie): Promise<Movie> {
    this.loggerService.log(`Post Movie/ ${LoggerMessages.API_CALLED}`);
    return await this.movieService.create(castDto);
  }
  /**
   * @patch  movie
   * @param id & object
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'Movie')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({ type: Movie, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() movieDto: any
  ): Promise<Movie> {
    this.loggerService.log(`Patch Movie/ ${LoggerMessages.API_CALLED}`);
    return await this.movieService.update(id, movieDto);
  }
  /**
   *@delete movie
   * @param id
   * @return
   */
  @Delete(':id')
  @Auth(Action.Delete, 'Movie')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({ type: Movie, description: 'Deleted Sucessfully' })
  async delete(
    @Param('id') id: string
  ): Promise<Movie> {
    this.loggerService.log(`Delete Movie/ ${LoggerMessages.API_CALLED}`);
    return await this.movieService.delete(id);
  }
}
