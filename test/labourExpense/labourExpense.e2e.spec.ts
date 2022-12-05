import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Helper } from '../test.helper';
import { ValidationPipe } from '@nestjs/common';
import { adminToken, setupTestDB } from '../helper/setupTest';
import mongoose from 'mongoose';
let id = '';
describe('Almuhasba Labour Expense Test Cases', () => {
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

  it(`Should give error on Less than 3 character Asset Id`, async () => {
    const userTest = await helper.labourExpense();
    userTest.assetID = 'ab';
    return request(app.getHttpServer())
      .post('/labourExpense')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });


  it(`Should give error of Unauthorized `, async () => {
    const userTest = await helper.labourExpense();
    return (
      request(app.getHttpServer())
        .post('/labourExpense')
        // .set('Authorization', `${token}`)
        .send(userTest)
        .expect(401)
    );
  });
  it(`Get All Labour Expense `, async () => {
    return request(app.getHttpServer())
      .get('/labourExpense?column=id')
      .set('Authorization', `${token}`)
      .expect(200);
  });
  it(`Should Add labourExpense `, async () => {
    const userTest = await helper.labourExpense();
    return request(app.getHttpServer())
      .post('/labourExpense')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(201)
      .then(async (res) => {
        id = res.body._id;
      });
  });
  it(`Should Update labourExpense `, async () => {
    const userTest = await helper.labourExpense();
    userTest.assetID = '6278c5b414ac4fec9f4c832d';
    return request(app.getHttpServer())
      .patch('/labourExpense/' + id)
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(204);
  });
  it(`Should Delete labourExpense by Id`, async () => {
    return request(app.getHttpServer())
      .delete('/labourExpense/' + id)
      .set('Authorization', `${token}`)
      .expect(204);
  });
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
