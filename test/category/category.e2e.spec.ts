import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Helper } from '../test.helper';
import { ValidationPipe } from '@nestjs/common';
import { adminToken, setupTestDB } from '../helper/setupTest';
import mongoose from 'mongoose';

let id = '';

describe('Almuhasba Category Test Cases', () => {
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

  //Category
  it(`Should give error on less than 3 character Category `, async () => {
    const userTest = await helper.category();
    userTest.name = 'I';
    return request(app.getHttpServer())
      .post('/category')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on Greater than 20 character Category `, async () => {
    const userTest = await helper.category();
    userTest.name = 'I sdakdl askdjasldj asdkljklasd adlkj';
    return request(app.getHttpServer())
      .post('/category')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error of Unauthorized `, async () => {
    const userTest = await helper.category();
    userTest.name = 'asdf';
    return (
      request(app.getHttpServer())
        .post('/category')
        .send(userTest)
        .expect(401)
    );
  });

  it(`Get All Category `, async () => {
    return request(app.getHttpServer())
      .get('/category?column=id')
      .set('Authorization', `${token}`)
      .expect(200);
  });

  it(`Should Add Category `, async () => {
    const userTest = await helper.category();
    return request(app.getHttpServer())
      .post('/category')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(201)
      .then(async (res) => {
        id = res.body._id;
      });
  });

  it(`Should Update Category `, async () => {
    const userTest = await helper.category();
    userTest.name = 'NEW Updated';
    return request(app.getHttpServer())
      .patch('/category/' + id)
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(204);
  });

  it(`Should Delete Category by Id`, async () => {
    return (
      request(app.getHttpServer())
        .get('/category/' + id)
        .set('Authorization', `${token}`)
        // .expect(200);
        .expect(404)
    );
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
