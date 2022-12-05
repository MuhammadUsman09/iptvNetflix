import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Helper } from '../test.helper';
import { ValidationPipe } from '@nestjs/common';
import { adminToken, setupTestDB } from '../helper/setupTest';
import mongoose from 'mongoose';

let id = '';

describe('Almuhasba Dry Test Cases', () => {
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
    const userTest = await helper.Dry();
    return (
      request(app.getHttpServer())
        .post('/dry')
        // .set('Authorization', `${token}`)
        .send(userTest)
        .expect(401)
    );
  });
  it(`Get All Dry `, async () => {
    return request(app.getHttpServer())
      .get('/dry/list?column=id')
      .set('Authorization', `${token}`)
      .expect(200);
  });
  it(`Should Add Dry `, async () => {
    const userTest = await helper.Dry();
    return request(app.getHttpServer())
      .post('/dry')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(201)
      .then(async (res) => {
        id = res.body._id;
      });
  });
  it(`Should Update Dry `, async () => {
    const userTest = await helper.Dry();
    userTest.grossStore = 789;
    return request(app.getHttpServer())
      .patch('/dry/' + id)
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(204);
  });
  it(`Should Delete Dry by Id`, async () => {
    return request(app.getHttpServer())
      .delete('/dry/' + id)
      .set('Authorization', `${token}`)
      .expect(204);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
