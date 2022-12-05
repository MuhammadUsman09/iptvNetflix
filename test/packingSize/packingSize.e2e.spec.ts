/* eslint-disable @typescript-eslint/no-loss-of-precision */
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Helper } from '../test.helper';
import { ValidationPipe } from '@nestjs/common';
import { adminToken, setupTestDB } from '../helper/setupTest';
import mongoose from 'mongoose';

let id = '';

describe('Almuhasba Packing Size Test Cases', () => {
  let app: INestApplication;
  let helper: Helper;
  let token: string;
  beforeAll(async () => {
    await setupTestDB();
    token = await adminToken();
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
    helper = new Helper(app);
  });

  // it(`Should give error on Size greater than 10 digit`, async () => {
  //   const userTest = await helper.packingSize();
  //   userTest.size = 123456789123123456789123123456789123123456789123123456789123123456789123;
  //   return request(app.getHttpServer())
  //     .post('/packingSize')
  //     .set('Authorization', `${token}`)
  //     .send(userTest)
  //     .expect(400);
  // });

  it(`Should give error of Unauthorized `, async () => {
    const userTest = await helper.packingSize();
    return (
      request(app.getHttpServer())
        .post('/packingSize')
        // .set('Authorization', `${token}`)
        .send(userTest)
        .expect(401)
    );
  });
  it(`Get All packingSize `, async () => {
    return request(app.getHttpServer())
      .get('/packingSize?column=id')
      .set('Authorization', `${token}`)
      .expect(200);
  });
  it(`Should Add packingSize `, async () => {
    const userTest = await helper.packingSize();
    return request(app.getHttpServer())
      .post('/packingSize')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(201)
      .then(async (res) => {
        id = res.body._id;
      });
  });
  it(`Should Update packingSize `, async () => {
    const userTest = await helper.packingSize();
    userTest.size = 789;
    return request(app.getHttpServer())
      .patch('/packingSize/' + id)
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(204);
  });
  it(`Should Delete packingSize by Id`, async () => {
    return request(app.getHttpServer())
      .delete('/packingSize/' + id)
      .set('Authorization', `${token}`)
      .expect(204);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
