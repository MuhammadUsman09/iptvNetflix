/* eslint-disable prettier/prettier */
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Helper } from '../test.helper';
import { ValidationPipe } from '@nestjs/common';
import { RoleType } from '../../src/constants';
import mongoose from 'mongoose';

describe('Almuhasba Authentication Test Cases', () => {
  let app: INestApplication;
  let helper: Helper;

  beforeAll(async () => {
    const db = await mongoose.connect(
      'mongodb://127.0.0.1:27017/game-of-tests',
    );
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
    helper = new Helper(app);
  });

  it(`Should give error on  Register Test User with no payload `, async () => {
    const userTest = await helper.createUser();
    return request(app.getHttpServer()).post('/auth/register').expect(400);
  });

  it(`Should give error on Register Test User with short firstName `, async () => {
    const userTest = await helper.createUser();
    userTest.firstName = 'da';
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on Register Test User with long firstName `, async () => {
    const userTest = await helper.createUser();
    userTest.firstName = 'I am testing it with dummy data';
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on Register Test User with short lastName `, async () => {
    // await insertUsers([user]);

    const userTest = await helper.createUser();
    userTest.lastName = 'da';
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on Register Test User with long lastName `, async () => {
    const userTest = await helper.createUser();
    userTest.firstName = 'I am testing it with dummy data';
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on invalid Email `, async () => {
    const userTest = await helper.createUser();
    userTest.email = 'asd';
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on invalid Password `, async () => {
    const userTest = await helper.createUser();
    userTest.password = 'asd';
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on invalid Phone Number Less than 11`, async () => {
    const userTest = await helper.createUser();
    userTest.phone = '03023';
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on invalid Phone Number Greater than 14`, async () => {
    const userTest = await helper.createUser();
    userTest.phone = '0302232323233333';
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on invalid Phone Number with letters`, async () => {
    const userTest = await helper.createUser();
    userTest.phone = '03023a';
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on invalid Avatar input`, async () => {
    const userTest = await helper.createUser();
    userTest.avatar = '0';
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(userTest)
      .expect(400);
  });

  // it(`RoleType USER`, async () => {
  //   const userTest = await helper.createUser();
  //   userTest.role = RoleType.USER;
  //   return request(app.getHttpServer())
  //     .post('/auth/register')
  //     .send(userTest)
  //     .then((res) => {
  //       expect(res.body.role).toBe(RoleType.USER);
  //     });
  // });

  it(`Should Register Test User with valid payload `, async () => {
    await mongoose.connection.dropDatabase();
    const userTest = await helper.createUser();
      request(app.getHttpServer())
        .post('/auth/register')
        .send(userTest)
        .expect(201);
  });

  //Login
  it(`User not found with Wrong Email on Login `, async () => {
    const userTest = await helper.loginUser();
    userTest.email = 'I am testing it with dummy data';
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(userTest)
      .expect(404);
  });

  it(`Wrong Password on Login `, async () => {
    const userTest = await helper.loginUser();
    userTest.password = 'asdss';
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(userTest)
      .expect(404);
  });

  // it(`Login Successful `, async () => {
  //   const userTest = await helper.loginUser();
  //   return request(app.getHttpServer())
  //     .post('/auth/login')
  //     .send(userTest)
  //     // .expect(200);
  //       .then((res) => {
  //         expect(res.body.accessToken).toBeDefined();
  //       });
  // });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
