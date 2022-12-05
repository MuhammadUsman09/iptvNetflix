import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import type { User } from '../user/user.schema';
import { TokenPayloadDto } from './dto/TokenPayloadDto';
import { TokenType } from '../../constants';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
import { validateHash } from '../../common/utils';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  async createAccessToken(user: User): Promise<TokenPayloadDto> {
    user.password = '';
    return new TokenPayloadDto({
      user: user,
      // expiresIn: parseInt(process.env.JWT_EXPIRATION_TIME || '86400'),
      accessToken: await this.jwtService.signAsync({
        userId: user.id,
        type: TokenType.ACCESS_TOKEN,
        role: user.role,
      }),
    });
  }

  async validateUser(userLoginDto: User): Promise<User> {
    const user: User = <User>await this.userService.findByEmail(userLoginDto);
    const isPasswordValid = await validateHash(
      userLoginDto.password,
      user?.password,
    );
    if (!isPasswordValid) {
      throw new UserNotFoundException();
    }
    return user!;
  }
}
