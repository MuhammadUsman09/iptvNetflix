import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { RoleType } from '../../constants';
import { TokenType } from '../../constants';

import type { User } from '../user/user.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_PUBLIC_KEY || 'AlmuhasbaApiBackend',
    });
  }

  async validate(args: { userId: string; role: RoleType; type: TokenType }) {
    if (args.type !== TokenType.ACCESS_TOKEN) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOne({
      id: args.userId,
      role: args.role,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
