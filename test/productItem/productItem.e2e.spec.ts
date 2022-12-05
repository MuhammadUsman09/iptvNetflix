import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Helper } from '../test.helper';
import { ValidationPipe } from '@nestjs/common';
import { adminToken, setupTestDB } from '../helper/setupTest';
import mongoose from 'mongoose';
let id = '';
describe('Almuhasba Product Item Test Cases', () => {
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

  it(`Should give error on Less than 3 character name`, async () => {
    const userTest = await helper.productItem();
    userTest.name = 'a';
    return request(app.getHttpServer())
      .post('/productItem')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });
  it(`Should give error on greater than 10 character name`, async () => {
    const userTest = await helper.productItem();
    userTest.name = 'ghghghghghlghghghghghlghghghghghl';
    return request(app.getHttpServer())
      .post('/productItem')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error of Unauthorized `, async () => {
    const userTest = await helper.productItem();
    return (
      request(app.getHttpServer())
        .post('/productItem')
        // .set('Authorization', `${token}`)
        .send(userTest)
        .expect(401)
    );
  });
  it(`Get All productItem `, async () => {
    return request(app.getHttpServer())
      .get('/productItem?column=id')
      .set('Authorization', `${token}`)
      .expect(200);
  });
  it(`Should Add productItem `, async () => {
    const userTest = await helper.productItem();
    return request(app.getHttpServer())
      .post('/productItem')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(201)
      .then(async (res) => {
        id = res.body._id;
      });
  });
  it(`Should Update productItem `, async () => {
    const userTest = await helper.productItem();
    userTest.name = 'NEW';
    return request(app.getHttpServer())
      .patch('/productItem/' + id)
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(204);
  });
  it(`Should Delete productItem by Id`, async () => {
    return request(app.getHttpServer())
      .delete('/productItem/' + id)
      .set('Authorization', `${token}`)
      .expect(204);
  });
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
