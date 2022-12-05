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
  import { Genre } from './genre.schema';
import { GenreService } from './genre.service';
  import { LoggerService } from '../../logger/logger.service';
  import { LoggerMessages } from '../../exceptions/index';
  import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
  import { ApiPageOkResponse, Auth, AuthUser } from '../../decorators';
  import { Action } from '../../casl/userRoles';
  import { PageOptionsDto } from '../../common/dto/page-options.dto';
  
@Controller('genre')
@ApiTags('genre')
  export class GenreController {
    constructor(
      private genreService: GenreService,
      private readonly loggerService: LoggerService,
    ) {
      this.loggerService.setContext('Genre controller');
    }
  /**
       * Get movies and seasons by genre
       * @param PageOptionsDto
       * @returns
       */
   @Get('/getMoviesSeasonsAndGenres')
   @Auth(Action.Read, 'Genre')
   @HttpCode(HttpStatus.OK)
   @ApiPageOkResponse({
     description: 'Get Genre Movies And Series list',
     type: Genre,
   })
   getMoviesSeasonsAndGenres(
     @Query(new ValidationPipe({ transform: true }))
     pageOptionsDto: PageOptionsDto,
 
   ): Promise<any> {
     this.loggerService.log(`GET Movies And Seasons and Genres/ ${LoggerMessages.API_CALLED}`);
     return this.genreService.getMoviesSeasonsAndGenres(pageOptionsDto);
   }
  /**
       * Get movies and seasons by genre
       * @param PageOptionsDto
       * @returns
       */
  @Get('/getMoviesAndSeasonsByGenreId')
  @Auth(Action.Read, 'Genre')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Genre list',
    type: Genre,
  })
  getMoviesAndSeasonsByGenreId(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,

  ): Promise<any> {
    this.loggerService.log(`GET Movies And Seasons By Genre/ ${LoggerMessages.API_CALLED}`);
    return this.genreService.getMoviesAndSeasonsByGenreId(pageOptionsDto);
  }
    /**
   * Get Genre
   * @param PageOptionsDto
   * @returns
   */
   @Get(':id')
   @Auth(Action.Read, 'Genre')
   @HttpCode(HttpStatus.OK)
   @ApiPageOkResponse({
     description: 'Get  Genre',
     type: Genre,
   })
   getOne(
     @Param('id') id: string
     ): Promise<Genre> {
     this.loggerService.log(`GET Genre/ ${LoggerMessages.API_CALLED}`);
     return this.genreService.getOne(id);
   }
    
    /**
     * Get Genre
     * @param PageOptionsDto
     * @returns
     */
    @Get()
    @Auth(Action.Read, 'Genre')
    @HttpCode(HttpStatus.OK)
    @ApiPageOkResponse({
      description: 'Get Genre list',
      type: Genre,
    })
    getGenres(
      @Query(new ValidationPipe({ transform: true }))
      pageOptionsDto: PageOptionsDto,
    ): Promise<Genre[]> {
      this.loggerService.log(`GET Genre list/ ${LoggerMessages.API_CALLED}`);
      return this.genreService.getGenres(pageOptionsDto);
    }
   
    /**
     *
     * @create Genre
     * @param object
     * @return
     *
     */
    @Post()
    // @Auth(Action.Create, 'Genre')
    @HttpCode(HttpStatus.CREATED)
    @ApiOkResponse({ type: Genre, description: 'Successfully Registered' })
    async create(@Body() genreDto: Genre): Promise<Genre> {
      this.loggerService.log(`Post Genre/ ${LoggerMessages.API_CALLED}`);
      return await this.genreService.create(genreDto);
    }
    /**
     * @patch  Genre
     * @param id & object
     * @return
     *
     */
    @Patch(':id')
    @Auth(Action.Update, 'Genre')
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiOkResponse({ type: Genre, description: 'Updated Sucessfully' })
    async update(
      @Param('id') id: string,
      @Body() genreDto: any,
    ): Promise<Genre> {
      this.loggerService.log(`Patch Category/ ${LoggerMessages.API_CALLED}`);
      return await this.genreService.update(id, genreDto);
    }
    /**
     *@delete Genre
     * @param id
     * @return
     */
    @Delete(':id')
    @Auth(Action.Delete, 'Genre')
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiOkResponse({ type: Genre, description: 'Deleted Sucessfully' })
    async delete(
      @Param('id') id: string
    ): Promise<Genre> {
      this.loggerService.log(`Delete Category/ ${LoggerMessages.API_CALLED}`);
      return await this.genreService.delete(id);
    }
  }
  