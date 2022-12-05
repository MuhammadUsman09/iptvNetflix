import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Helper } from '../test.helper';
import { ValidationPipe } from '@nestjs/common';
import { adminToken, setupTestDB } from '../helper/setupTest';
import mongoose from 'mongoose';
let id = '';
describe('Almuhasba Sale Store Test Cases', () => {
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

  it(`Should give error on greater than 20 character direction`, async () => {
    const userTest = await helper.saleStore();
    userTest.direction = 'ghghghghgaaghghghghgaa';
    return request(app.getHttpServer())
      .post('/saleStore')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });
  it(`Should give error on greater than 50 character name`, async () => {
    const userTest = await helper.saleStore();
    userTest.name = 'ghghghghghghghghghghghghghghghghghghghghghghghghabnc';
    return request(app.getHttpServer())
      .post('/saleStore')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error of Unauthorized `, async () => {
    const userTest = await helper.saleStore();
    return (
      request(app.getHttpServer())
        .post('/saleStore')
        // .set('Authorization', `${token}`)
        .send(userTest)
        .expect(401)
    );
  });

  it(`Get All saleStore `, async () => {
    return request(app.getHttpServer())
      .get('/saleStore?column=id')
      .set('Authorization', `${token}`)
      .expect(200);
  });

  it(`Should Add saleStore `, async () => {
    const userTest = await helper.saleStore();
    return request(app.getHttpServer())
      .post('/saleStore')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(201)
      .then(async (res) => {
        id = res.body._id;
      });
  });

  it(`Should Update saleStore `, async () => {
    const userTest = await helper.saleStore();
    userTest.name = 'NEW Updated';
    return request(app.getHttpServer())
      .patch('/saleStore/' + id)
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(204);
  });

  it(`Should Delete saleStore by Id`, async () => {
    return request(app.getHttpServer())
      .delete('/saleStore/' + id)
      .set('Authorization', `${token}`)
      .expect(204);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
