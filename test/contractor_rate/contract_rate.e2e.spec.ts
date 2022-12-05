import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Helper } from '../test.helper';
import { ValidationPipe } from '@nestjs/common';
import { adminToken, setupTestDB } from '../helper/setupTest';
import mongoose from 'mongoose';

let id = '';

describe('Almuhasba Contractor Rate Test Cases', () => {
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

  // it(`Should give error on Less than 3 character Tehsil`, async () => {
  //   const userTest = await helper.contractor_rate();
  //   userTest.rate = 'I';
  //   return request(app.getHttpServer())
  //     .post('/contractor_rate')
  //     .set('Authorization', `${token}`)
  //     .send(userTest)
  //     .expect(400);
  // });
  //
  // it(`Should give error on Less than 30 character vehicle Number `, async () => {
  //   const userTest = await helper.contractor_rate();
  //   userTest.tehsil =
  //     'Iasdashdhsajhdasjdhksjahdjashdajhdkajhdkjahdjashdjashdkjahsdjhasjdhaksjdhajkshdajkhdak';
  //   return request(app.getHttpServer())
  //     .post('/contractor_rate')
  //     .set('Authorization', `${token}`)
  //     .send(userTest)
  //     .expect(400);
  // });

  it(`Should give error of Unauthorized `, async () => {
    const userTest = await helper.contractor_rate();
    return (
      request(app.getHttpServer())
        .post('/contractor_rate')
        // .set('Authorization', `${token}`)
        .send(userTest)
        .expect(401)
    );
  });


  it(`Should Add contractor_rate `, async () => {
    const userTest = await helper.contractor_rate();
    return request(app.getHttpServer())
      .post('/contractor_rate')
      .set('Authorization', `${token}`)
      .send(userTest)
      //.expect(201)
      .then(async (res) => {
        id = res.body._id;
      });
  });

  it(`Should Update contractor_rate `, async () => {
    const userTest = await helper.contractor_rate();
    userTest.packingSize = 111;
    return request(app.getHttpServer())
      .patch('/contractor_rate/' + id)
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(204);
  });

  it(`Should Delete contractor_rate by Id`, async () => {
    return request(app.getHttpServer())
      .delete('/contractor_rate/' + id)
      .set('Authorization', `${token}`)
      .expect(204);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
