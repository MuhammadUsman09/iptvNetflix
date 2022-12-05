import { RoleType, TokenType } from '../../src/constants';
import { UserService } from '../../src/modules/user/user.service';
import { AuthService } from '../../src/modules/auth/auth.service';
import { User, UserSchema } from '../../src/modules/user/user.schema';
import { Test, TestingModule } from '@nestjs/testing';
const mongoose = require('mongoose');
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { ConfigrationModule } from '../../src/configration/configration.module';
import { ConfigrationService } from '../../src/configration/configration.service';
import { newUser } from './users';
import { JwtService } from '@nestjs/jwt';
let user: any = {};
export const adminToken = async () => {
  let nn = user;
  let jwtService: JwtService = new JwtService({
    secret: process.env.JWT_PUBLIC_KEY ,
  });
  let token = await jwtService.signAsync({
    userId: user['_id'].toString(),
    type: TokenType.ACCESS_TOKEN,
    role: user._doc.role,
  });
  return 'bearer ' + token;
};

export const setupTestDB = async () => {
  const db = await mongoose.connect(process.env.MONGODB_URI);
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        cache: true,
      }),
      MongooseModule.forRootAsync({
        imports: [ConfigrationModule],
        useFactory: async (configService: ConfigrationService) =>
          configService.mongooseConfig,
        inject: [ConfigrationService],
      }),
      MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), //-------import model here
    ],
    providers: [UserService],
  }).compile();
  const service = module.get<UserService>(UserService);
  // const authService = module.get<AuthService>(AuthService)
  let userTest = newUser();
  user = await service.createUser(userTest);
};
