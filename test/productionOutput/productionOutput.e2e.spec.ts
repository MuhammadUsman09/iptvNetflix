import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Helper } from '../test.helper';
import { ValidationPipe } from '@nestjs/common';
import { adminToken, setupTestDB } from '../helper/setupTest';
import mongoose from 'mongoose';
let id = '';
describe('Almuhasba Production Output Test Cases', () => {
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

  it(`Should give error on Less than 2 character rawSlipNumber`, async () => {
    const userTest = await helper.productionOutput();
    userTest.rawSlipNo = 'a';
    return request(app.getHttpServer())
      .post('/productionOutput')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });
  it(`Should give error on greater than 20 character rawSlipNumber`, async () => {
    const userTest = await helper.productionOutput();
    userTest.rawSlipNo = 'ghghghghghlghghghghgh';
    return request(app.getHttpServer())
      .post('/productionOutput')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on Less than 2 character lot`, async () => {
    const userTest = await helper.productionOutput();
    userTest.lot = 'a';
    return request(app.getHttpServer())
      .post('/productionOutput')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });
  it(`Should give error on greater than 10 character lot`, async () => {
    const userTest = await helper.productionOutput();
    userTest.lot = 'ghghghghghl';
    return request(app.getHttpServer())
      .post('/productionOutput')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on Less than 2 character product Number`, async () => {
    const userTest = await helper.productionOutput();
    userTest.productNo = 'a';
    return request(app.getHttpServer())
      .post('/productionOutput')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });
  it(`Should give error on greater than 10 character product Number`, async () => {
    const userTest = await helper.productionOutput();
    userTest.productNo = 'ghghghghghl';
    return request(app.getHttpServer())
      .post('/productionOutput')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error of Unauthorized `, async () => {
    const userTest = await helper.productionOutput();
    return (
      request(app.getHttpServer())
        .post('/productionOutput')
        // .set('Authorization', `${token}`)
        .send(userTest)
        .expect(401)
    );
  });
  it(`Get All productionOutput `, async () => {
    return request(app.getHttpServer())
      .get('/productionOutput/list?column=id')
      .set('Authorization', `${token}`)
      .expect(200);
  });
  it(`Should Add productionOutput `, async () => {
    const userTest = await helper.productionOutput();
    return request(app.getHttpServer())
      .post('/productionOutput')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(201)
      .then(async (res) => {
        id = res.body._id;
      });
  });
  it(`Should Update productionOutput `, async () => {
    const userTest = await helper.productionOutput();
    userTest.rawSlipNo = 'NEW';
    return request(app.getHttpServer())
      .patch('/productionOutput/' + id)
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(204);
  });
  it(`Should Delete productionOutput by Id`, async () => {
    return request(app.getHttpServer())
      .delete('/productionOutput/' + id)
      .set('Authorization', `${token}`)
      .expect(204);
  });
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
