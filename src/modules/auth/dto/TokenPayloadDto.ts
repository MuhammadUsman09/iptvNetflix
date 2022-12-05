import { ApiProperty } from '@nestjs/swagger';
import {User} from '../../user/user.schema'
export class TokenPayloadDto {
  @ApiProperty()
  expiresIn: number;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: User;

  constructor(data: { accessToken: string,user:User }) {
    // this.expiresIn = data.expiresIn;
    this.accessToken = data.accessToken;
    this.user = data.user;
  }
}
