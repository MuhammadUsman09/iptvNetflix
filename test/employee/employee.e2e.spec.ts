import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Helper } from '../test.helper';
import { ValidationPipe } from '@nestjs/common';
import { adminToken, setupTestDB } from '../helper/setupTest';
import mongoose from 'mongoose';
let id = '';
describe('Almuhasba Employee Test Cases', () => {
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
    const userTest = await helper.employee();
    userTest.fname = 'ab';
    return request(app.getHttpServer())
      .post('/employee')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on more than 10 character firstName`, async () => {
    const userTest = await helper.employee();
    userTest.fname = 'abcdeabcdeabcdeabcdeabcde';
    return request(app.getHttpServer())
      .post('/employee')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on Less than 3 character LastName`, async () => {
    const userTest = await helper.employee();
    userTest.lname = 'ab';
    return request(app.getHttpServer())
      .post('/employee')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on more than 10 character LastName`, async () => {
    const userTest = await helper.employee();
    userTest.lname = 'abcdeabcdeacde';
    return request(app.getHttpServer())
      .post('/employee')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on Less than 11 character Phone`, async () => {
    const userTest = await helper.employee();
    userTest.phone = '021458';
    return request(app.getHttpServer())
      .post('/employee')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on more than 14 character employee`, async () => {
    const userTest = await helper.employee();
    userTest.phone = '1425361425361425';
    return request(app.getHttpServer())
      .post('/employee')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error of Unauthorized `, async () => {
    const userTest = await helper.employee();
    return (
      request(app.getHttpServer())
        .post('/employee')
        // .set('Authorization', `${token}`)
        .send(userTest)
        .expect(401)
    );
  });
  it(`Get All employee `, async () => {
    return request(app.getHttpServer())
      .get('/employee?column=id')
      .set('Authorization', `${token}`)
      .expect(200);
  });
  it(`Should Add Employee `, async () => {
    const userTest = await helper.employee();
    return request(app.getHttpServer())
      .post('/employee')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(201)
      .then(async (res) => {
        id = res.body._id;
      });
  });
  it(`Should Update employee `, async () => {
    const userTest = await helper.employee();
    userTest.lname = 'Updated';
    return request(app.getHttpServer())
      .patch('/employee/' + id)
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(204);
  });
  it(`Should Delete employee by Id`, async () => {
    return request(app.getHttpServer())
      .delete('/employee/' + id)
      .set('Authorization', `${token}`)
      .expect(204);
  });
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
