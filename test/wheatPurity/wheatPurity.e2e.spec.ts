import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Helper } from '../test.helper';
import { ValidationPipe } from '@nestjs/common';
import { adminToken, setupTestDB } from '../helper/setupTest';
import mongoose from 'mongoose';

let id = '';

describe('Almuhasba Wheat Purity Test Cases', () => {
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

  it(`Should give error of Unauthorized `, async () => {
    const userTest = await helper.wheatPurity();
    return (
      request(app.getHttpServer())
        .post('/wheatPurity')
        .send(userTest)
        .expect(401)
    );
  });

  it(`Get All wheatPurity `, async () => {
    return request(app.getHttpServer())
      .get('/wheatPurity/list?column=id')
      .set('Authorization', `${token}`)
      .expect(200);
  });

  it(`Should Add wheatPurity `, async () => {
    const userTest = await helper.wheatPurity();
    return request(app.getHttpServer())
      .post('/wheatPurity')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(201)
      .then(async (res) => {
        id = res.body._id;
      });
  });

  it(`Should Update wheatPurity `, async () => {
    const userTest = await helper.wheatPurity();
    userTest.grainWeight = 789;
    return request(app.getHttpServer())
      .patch('/wheatPurity/' + id)
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(204);
  });

  it(`Should Delete wheatPurity by Id`, async () => {
    return request(app.getHttpServer())
      .delete('/wheatPurity/' + id)
      .set('Authorization', `${token}`)
      .expect(204);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
