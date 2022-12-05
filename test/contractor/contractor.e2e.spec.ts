import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Helper } from '../test.helper';
import { ValidationPipe } from '@nestjs/common';
import { adminToken, setupTestDB } from '../helper/setupTest';
import mongoose from 'mongoose';

let id = '';

describe('Almuhasba Contractor Test Cases', () => {
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

  it(`Should give error on less than 3 character firstName `, async () => {
    const userTest = await helper.contractor();
    userTest.firstName = 'I';
    return request(app.getHttpServer())
      .post('/contractor')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on Greater than 20 character firstName `, async () => {
    const userTest = await helper.contractor();
    userTest.firstName = 'I sdakdl askdjasldj asdkljklasd adlkj';
    return request(app.getHttpServer())
      .post('/contractor')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on less than 3 character lastName `, async () => {
    const userTest = await helper.contractor();
    userTest.lastName = 'I';
    return request(app.getHttpServer())
      .post('/contractor')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on Greater than 20 character lastName `, async () => {
    const userTest = await helper.contractor();
    userTest.lastName = 'I sdakdl askdjasldj asdkljklasd adlkj';
    return request(app.getHttpServer())
      .post('/contractor')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on invalid Phone Number Greater than 14 `, async () => {
    const userTest = await helper.contractor();
    userTest.phone = '03031234567890888';
    return request(app.getHttpServer())
      .post('/contractor')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on invalid Phone Number less than 11 `, async () => {
    const userTest = await helper.contractor();
    userTest.phone = '0303';
    return request(app.getHttpServer())
      .post('/contractor')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on Less than 3 character address `, async () => {
    const userTest = await helper.contractor();
    userTest.address = 'I';
    return request(app.getHttpServer())
      .post('/contractor')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on Less than 30 character address `, async () => {
    const userTest = await helper.contractor();
    userTest.address =
      'Iasdashdhsajhdasjdhksjahdjashdajhdkajhdkjahdjashdjashdkjahsdjhasjdhaksjdhajkshdajkhdakdfgdfgdfdfgdsfddfsfdsfdssfsdfdfsdfdsfsdfsfdfdfsddsfsdfsfsdfsdfsdfsdfsdfsdfsfsdfsdfsfsdfsfsfsdfsfsfsdfdgdgrgdfgdfgdfgdfdfdsfsdfsdfsdfs';
    return request(app.getHttpServer())
      .post('/contractor')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on invalid CNIC less than 13 `, async () => {
    const userTest = await helper.contractor();
    userTest.phone = '31304';
    return request(app.getHttpServer())
      .post('/contractor')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on invalid CNIC Greater than 15 `, async () => {
    const userTest = await helper.contractor();
    userTest.phone = '3130418181818181818';
    return request(app.getHttpServer())
      .post('/contractor')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on Less than 3 character vehicle Number `, async () => {
    const userTest = await helper.contractor();
    userTest.vehicalNumber = 'I';
    return request(app.getHttpServer())
      .post('/contractor')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on Less than 30 character vehicle Number `, async () => {
    const userTest = await helper.contractor();
    userTest.vehicalNumber =
      'Iasdashdhsajhdasjdhksjahdjashdajhdkajhdkjahdjashdjashdkjahsdjhasjdhaksjdhajkshdajkhdak';
    return request(app.getHttpServer())
      .post('/contractor')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error of Unauthorized `, async () => {
    const userTest = await helper.contractor();
    return (
      request(app.getHttpServer())
        .post('/category')
        // .set('Authorization', `${token}`)
        .send(userTest)
        .expect(401)
    );
  });

  it(`Get All contractors `, async () => {
    return request(app.getHttpServer())
      .get('/contractor/list?column=id')
      .set('Authorization', `${token}`)
      .expect(200);
  });

  it(`Should Add contractor `, async () => {
    const userTest = await helper.contractor();
    return request(app.getHttpServer())
      .post('/contractor')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(201)
      .then(async (res) => {
        id = res.body._id;
      });
  });

  it(`Should Update contractor `, async () => {
    const userTest = await helper.contractor();
    userTest.firstName = 'NEW Updated';
    return request(app.getHttpServer())
      .patch('/contractor/' + id)
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(204);
  });

  it(`Should Delete contractor by Id`, async () => {
    return request(app.getHttpServer())
      .delete('/contractor/' + id)
      .set('Authorization', `${token}`)
      .expect(204);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
