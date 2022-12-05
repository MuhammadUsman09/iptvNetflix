 import { Body, Controller, Get, HttpCode, HttpStatus, Post, Version } from '@nestjs/common';
 import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Action } from '../../casl/userRoles';
import { RoleType } from '../../constants';
import { Auth, AuthUser, Public } from '../../decorators';
import { User } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { TokenPayloadDto } from './dto/TokenPayloadDto';
@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        private userService: UserService,
        private authService: AuthService,
      ) {}

      @Public()
      @Post('login')
      @HttpCode(HttpStatus.OK)
      @ApiOkResponse({
        type: "any",
        description: 'User info with access token',
      })
      async userLogin(
        @Body() userLoginDto: any,
      ): Promise<TokenPayloadDto> {
        const userEntity:User = await this.authService.validateUser(userLoginDto);
        const token = await this.authService.createAccessToken(userEntity);
        return token;
      }
    
      @Public()
      @Post('register')
      @HttpCode(HttpStatus.CREATED)
      @ApiOkResponse({ type: User, description: 'Successfully Registered' })
      async userRegister(
        @Body() userRegisterDto: User,
      ): Promise<User> {
    
        return await this.userService.createUser(userRegisterDto);
      }
    
      @Version('1')
      @Get('me')
      @HttpCode(HttpStatus.OK)
      @Auth(Action.Read,'User')
      @ApiOkResponse({ type: User, description: 'current user info' })
      getCurrentUser(@AuthUser() user: User): User {
        return user;
      }
    
}
