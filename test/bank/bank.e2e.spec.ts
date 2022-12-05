import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Helper } from '../test.helper';
import { ValidationPipe } from '@nestjs/common';
import { adminToken, setupTestDB } from '../helper/setupTest';
import mongoose from 'mongoose';
let id = '';
describe('Almuhasba Bank Test Cases', () => {
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

  it(`Should give error on Less than 3 character Name`, async () => {
    const userTest = await helper.bank();
    userTest.name = 'ab';
    return request(app.getHttpServer())
      .post('/bank')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on more than 30 character Name`, async () => {
    const userTest = await helper.bank();
    userTest.name = 'abcdeabcdeabcdeabcdeabcdekjkcdeabcdeabcde';
    return request(app.getHttpServer())
      .post('/bank')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on Less than 3 character Account Name`, async () => {
    const userTest = await helper.bank();
    userTest.accountName = 'ab';
    return request(app.getHttpServer())
      .post('/bank')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on more than 30 character Account Name`, async () => {
    const userTest = await helper.bank();
    userTest.accountName = 'abcdeabcdeabcdeabcdeabcdeabcdeabcdeabcde';
    return request(app.getHttpServer())
      .post('/bank')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error of Unauthorized `, async () => {
    const userTest = await helper.bank();
    return (
      request(app.getHttpServer())
        .post('/bank')
        // .set('Authorization', `${token}`)
        .send(userTest)
        .expect(401)
    );
  });
  it(`Get All bank `, async () => {
    return request(app.getHttpServer())
      .get('/bank?column=id')
      .set('Authorization', `${token}`)
      .expect(200);
  });
  it(`Should Add bank `, async () => {
    const userTest = await helper.bank();
    return request(app.getHttpServer())
      .post('/bank')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(201)
      .then(async (res) => {
        id = res.body._id;
      });
  });
  it(`Should Update bank `, async () => {
    const userTest = await helper.bank();
    userTest.name = 'NEW Updated';
    return request(app.getHttpServer())
      .patch('/bank/' + id)
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(204);
  });
  it(`Should Delete bank by Id`, async () => {
    return request(app.getHttpServer())
      .delete('/bank/' + id)
      .set('Authorization', `${token}`)
      .expect(204);
  });
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
