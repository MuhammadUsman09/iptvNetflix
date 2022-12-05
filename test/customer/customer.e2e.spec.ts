import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Helper } from '../test.helper';
import { ValidationPipe } from '@nestjs/common';
import { adminToken, setupTestDB } from '../helper/setupTest';
import mongoose from 'mongoose';
let id = '';
describe('Almuhasba Customer Test Cases', () => {
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

  it(`Should give error on Less than 3 character firstName`, async () => {
    const userTest = await helper.customer();
    userTest.firstName = 'ab';
    return request(app.getHttpServer())
      .post('/customer')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on more than 20 character firstName`, async () => {
    const userTest = await helper.customer();
    userTest.firstName = 'abcdeabcdeabcdeabcdeabcde';
    return request(app.getHttpServer())
      .post('/customer')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on Less than 3 character LastName`, async () => {
    const userTest = await helper.customer();
    userTest.lastName = 'ab';
    return request(app.getHttpServer())
      .post('/customer')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on more than 20 character LastName`, async () => {
    const userTest = await helper.customer();
    userTest.lastName = 'abcdeabcdeabcdeabcdeabcde';
    return request(app.getHttpServer())
      .post('/customer')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on Less than 3 character Address`, async () => {
    const userTest = await helper.customer();
    userTest.address = 'ab';
    return request(app.getHttpServer())
      .post('/customer')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on more than 20 character Address`, async () => {
    const userTest = await helper.customer();
    userTest.address = 'abcdeabcdeabcdeabcdeabcde';
    return request(app.getHttpServer())
      .post('/customer')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on Less than 3 character Area`, async () => {
    const userTest = await helper.customer();
    userTest.area = 'ab';
    return request(app.getHttpServer())
      .post('/customer')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on more than 20 character Area`, async () => {
    const userTest = await helper.customer();
    userTest.area = 'abcdeabcdeabcdeabcdeabcde';
    return request(app.getHttpServer())
      .post('/customer')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on Less than 11 character Phone`, async () => {
    const userTest = await helper.customer();
    userTest.phone = 'ab';
    return request(app.getHttpServer())
      .post('/customer')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on more than 14 character Phone`, async () => {
    const userTest = await helper.customer();
    userTest.phone = 'abcdeabcdeabcdeabcdeabcde';
    return request(app.getHttpServer())
      .post('/customer')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error of Unauthorized `, async () => {
    const userTest = await helper.customer();
    return (
      request(app.getHttpServer())
        .post('/customer')
        // .set('Authorization', `${token}`)
        .send(userTest)
        .expect(401)
    );
  });
  it(`Get All customer `, async () => {
    return request(app.getHttpServer())
      .get('/customer?column=id')
      .set('Authorization', `${token}`)
      .expect(200);
  });
  it(`Should Add customer `, async () => {
    const userTest = await helper.customer();
    return request(app.getHttpServer())
      .post('/customer')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(201)
      .then(async (res) => {
        id = res.body._id;
      });
  });
  it(`Should Update customer `, async () => {
    const userTest = await helper.customer();
    userTest.lastName = 'NEW Updated';
    return request(app.getHttpServer())
      .patch('/customer/' + id)
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(204);
  });
  it(`Should Delete customer by Id`, async () => {
    return request(app.getHttpServer())
      .delete('/customer/' + id)
      .set('Authorization', `${token}`)
      .expect(204);
  });
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
