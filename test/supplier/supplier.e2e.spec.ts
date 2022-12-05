import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Helper } from '../test.helper';
import { ValidationPipe } from '@nestjs/common';
import { adminToken, setupTestDB } from '../helper/setupTest';
import mongoose from 'mongoose';

let id = '';

describe('Almuhasba Supplier Test Cases', () => {
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
    const userTest = await helper.supplier();
    userTest.firstName = 'I';
    return request(app.getHttpServer())
      .post('/supplier')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on Greater than 20 character firstName `, async () => {
    const userTest = await helper.supplier();
    userTest.firstName = 'I sdakdl askdjasldj asdkljklasd adlkj';
    return request(app.getHttpServer())
      .post('/supplier')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on less than 3 character lastName `, async () => {
    const userTest = await helper.supplier();
    userTest.lastName = 'I';
    return request(app.getHttpServer())
      .post('/supplier')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on Greater than 20 character lastName `, async () => {
    const userTest = await helper.supplier();
    userTest.lastName = 'I sdakdl askdjasldj asdkljklasd adlkj';
    return request(app.getHttpServer())
      .post('/supplier')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on invalid Phone Number Greater than 14 `, async () => {
    const userTest = await helper.supplier();
    userTest.phone = '03031234567890888';
    return request(app.getHttpServer())
      .post('/supplier')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on invalid Phone Number less than 11 `, async () => {
    const userTest = await helper.supplier();
    userTest.phone = '0303';
    return request(app.getHttpServer())
      .post('/supplier')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on Less than 3 character address `, async () => {
    const userTest = await helper.supplier();
    userTest.address = 'I';
    return request(app.getHttpServer())
      .post('/supplier')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on Less than 30 character address `, async () => {
    const userTest = await helper.supplier();
    userTest.address =
      'Iasdashdhsajhdasjdhksjahdjashdajhdkajhdkjahdjashdjashdkjahsdjhasjdhaksjdhajkshdajkhdak';
    return request(app.getHttpServer())
      .post('/supplier')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on invalid CNIC less than 13 `, async () => {
    const userTest = await helper.supplier();
    userTest.phone = '31304';
    return request(app.getHttpServer())
      .post('/supplier')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on invalid CNIC Greater than 15 `, async () => {
    const userTest = await helper.supplier();
    userTest.phone = '3130418181818181818';
    return request(app.getHttpServer())
      .post('/supplier')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on Less than 3 character area `, async () => {
    const userTest = await helper.supplier();
    userTest.area = 'I';
    return request(app.getHttpServer())
      .post('/supplier')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on Less than 30 character area `, async () => {
    const userTest = await helper.supplier();
    userTest.area =
      'Iasdashdhsajhdasjdhksjahdjashdajhdkajhdkjahdjashdjashdkjahsdjhasjdhaksjdhajkshdajkhdak';
    return request(app.getHttpServer())
      .post('/supplier')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error of Unauthorized `, async () => {
    const userTest = await helper.supplier();
    return (
      request(app.getHttpServer())
        .post('/category')
        // .set('Authorization', `${token}`)
        .send(userTest)
        .expect(401)
    );
  });

  it(`Get All Suppliers `, async () => {
    return request(app.getHttpServer())
      .get('/supplier/list?column=id')
      .set('Authorization', `${token}`)
      .expect(200);
  });

  it(`Should Add Supplier `, async () => {
    const userTest = await helper.supplier();
    return request(app.getHttpServer())
      .post('/supplier')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(201)
      .then(async (res) => {
        id = res.body._id;
      });
  });

  it(`Should Update Supplier `, async () => {
    const userTest = await helper.supplier();
    userTest.firstName = 'NEW Updated';
    return request(app.getHttpServer())
      .patch('/supplier/' + id)
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(204);
  });

  it(`Should Delete supplier by Id`, async () => {
    return request(app.getHttpServer())
      .delete('/supplier/' + id)
      .set('Authorization', `${token}`)
      .expect(204);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
