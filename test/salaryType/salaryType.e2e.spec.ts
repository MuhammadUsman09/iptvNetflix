import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Helper } from '../test.helper';
import { ValidationPipe } from '@nestjs/common';
import { adminToken, setupTestDB } from '../helper/setupTest';
import mongoose from 'mongoose';
let id = '';
describe('Almuhasba Salary Type Test Cases', () => {
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
    const userTest = await helper.salaryType();
    userTest.name = 'ab';
    return request(app.getHttpServer())
      .post('/salaryType')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on more than 10 character Name`, async () => {
    const userTest = await helper.salaryType();
    userTest.name = 'abcdeabcdeab';
    return request(app.getHttpServer())
      .post('/salaryType')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error of Unauthorized `, async () => {
    const userTest = await helper.salaryType();
    return (
      request(app.getHttpServer())
        .post('/salaryType')
        // .set('Authorization', `${token}`)
        .send(userTest)
        .expect(401)
    );
  });
  it(`Get All salaryType `, async () => {
    return request(app.getHttpServer())
      .get('/salaryType?column=id')
      .set('Authorization', `${token}`)
      .expect(200);
  });
  it(`Should Add salaryType `, async () => {
    const userTest = await helper.salaryType();
    return request(app.getHttpServer())
      .post('/salaryType')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(201)
      .then(async (res) => {
        id = res.body._id;
      });
  });
  it(`Should Update salaryType `, async () => {
    const userTest = await helper.salaryType();
    userTest.name = 'Updated';
    return request(app.getHttpServer())
      .patch('/salaryType/' + id)
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(204);
  });
  it(`Should Delete salaryType by Id`, async () => {
    return request(app.getHttpServer())
      .delete('/salaryType/' + id)
      .set('Authorization', `${token}`)
      .expect(204);
  });
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
