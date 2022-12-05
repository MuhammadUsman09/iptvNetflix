import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Helper } from '../test.helper';
import { ValidationPipe } from '@nestjs/common';
import { adminToken, setupTestDB } from '../helper/setupTest';
import mongoose from 'mongoose';
let id = '';
describe('Almuhasba Purchase Order Test Cases', () => {
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

  it(`Should give error on greater than 10 character invoiceIdManual`, async () => {
    const userTest = await helper.purchaseOrder();
    userTest.invoiceIdManual = 'ghghghghghghll';
    return request(app.getHttpServer())
      .post('/purchaseOrder')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });
  it(`Should give error on greater than 10 character vehicleNumber`, async () => {
    const userTest = await helper.purchaseOrder();
    userTest.vehicleNumber = 'ghghghghghgh';
    return request(app.getHttpServer())
      .post('/purchaseOrder')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });
  it(`Should give error on less than 3 character vehicleNumber`, async () => {
    const userTest = await helper.purchaseOrder();
    userTest.vehicleNumber = 'gh';
    return request(app.getHttpServer())
      .post('/purchaseOrder')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });
  it(`Should give error on greater than 10 character driverName`, async () => {
    const userTest = await helper.purchaseOrder();
    userTest.driverName = 'ghghghghghgh';
    return request(app.getHttpServer())
      .post('/purchaseOrder')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });
  it(`Should give error on less than 3 character driverName`, async () => {
    const userTest = await helper.purchaseOrder();
    userTest.driverName = 'gh';
    return request(app.getHttpServer())
      .post('/purchaseOrder')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });
  it(`Should give error on greater than 1000 character note`, async () => {
    const userTest = await helper.purchaseOrder();
    userTest.note =
      'In computing, plain text is a loose term for data that represent only characters of readable material but not its graphical representation nor other objects. It may also include a limited number of "whitespace" characters that affect simple arrangement of text, such as spaces, line breaks, or tabulation characters.In computing, plain text is a loose term for data that represent only characters of readable material but not its graphical representation nor other objects. It may also include a limited number of "whitespace" characters that affect simple arrangement of text, such as spaces, line breaks, or tabulation characters.In computing, plain text is a loose term for data that represent only characters of readable material but not its graphical representation nor other objects. It may also include a limited number of "whitespace" characters that affect simple arrangement of text, such as spaces, line breaks, or tabulation characters.In computing, plain text is a loose term for data that represent only characters of readable material but not its graphical representation nor other objects. It may also include a limited number of "whitespace" characters that affect simple arrangement of text, such as spaces, line breaks, or tabulation characters.In computing, plain text is a loose term for data that represent only characters of readable material but not its graphical representation nor other objects. It may also include a limited number of "whitespace" characters that affect simple arrangement of text, such as spaces, line breaks, or tabulation characters.In computing, plain text is a loose term for data that represent only characters of readable material but not its graphical representation nor other objects. It may also include a limited number of "whitespace" characters that affect simple arrangement of text, such as spaces, line breaks, or tabulation characters.In computing, plain text is a loose term for data that represent only characters of readable material but not its graphical representation nor other objects. It may also include a limited number of "whitespace" characters that affect simple arrangement of text, such as spaces, line breaks, or tabulation characters.In computing, plain text is a loose term for data that represent only characters of readable material but not its graphical representation nor other objects. It may also include a limited number of "whitespace" characters that affect simple arrangement of text, such as spaces, line breaks, or tabulation characters.In computing, plain text is a loose term for data that represent only characters of readable material but not its graphical representation nor other objects. It may also include a limited number of "whitespace" characters that affect simple arrangement of text, such as spaces, line breaks, or tabulation characters.In computing, plain text is a loose term for data that represent only characters of readable material but not its graphical representation nor other objects. It may also include a limited number of "whitespace" characters that affect simple arrangement of text, such as spaces, line breaks, or tabulation characters.In computing, plain text is a loose term for data that represent only characters of readable material but not its graphical representation nor other objects. It may also include a limited number of "whitespace" characters that affect simple arrangement of text, such as spaces, line breaks, or tabulation characters.In computing, plain text is a loose term for data that represent only characters of readable material but not its graphical representation nor other objects. It may also include a limited number of "whitespace" characters that affect simple arrangement of text, such as spaces, line breaks, or tabulation characters.In computing, plain text is a loose term for data that represent only characters of readable material but not its graphical representation nor other objects. It may also include a limited number of "whitespace" characters that affect simple arrangement of text, such as spaces, line breaks, or tabulation characters.In computing, plain text is a loose term for data that represent only characters of readable material but not its graphical representation nor other objects. It may also include a limited number of "whitespace" characters that affect simple arrangement of text, such as spaces, line breaks, or tabulation characters.In computing, plain text is a loose term for data that represent only characters of readable material but not its graphical representation nor other objects. It may also include a limited number of "whitespace" characters that affect simple arrangement of text, such as spaces, line breaks, or tabulation characters.In computing, plain text is a loose term for data that represent only characters of readable material but not its graphical representation nor other objects. It may also include a limited number of "whitespace" characters that affect simple arrangement of text, such as spaces, line breaks, or tabulation characters.In computing, plain text is a loose term for data that represent only characters of readable material but not its graphical representation nor other objects. It may also include a limited number of "whitespace" characters that affect simple arrangement of text, such as spaces, line breaks, or tabulation characters.In computing, plain text is a loose term for data that represent only characters of readable material but not its graphical representation nor other objects. It may also include a limited number of "whitespace" characters that affect simple arrangement of text, such as spaces, line breaks, or tabulation characters.In computing, plain text is a loose term for data that represent only characters of readable material but not its graphical representation nor other objects. It may also include a limited number of "whitespace" characters that affect simple arrangement of text, such as spaces, line breaks, or tabulation characters.In computing, plain text is a loose term for data that represent only characters of readable material but not its graphical representation nor other objects. It may also include a limited number of "whitespace" characters that affect simple arrangement of text, such as spaces, line breaks, or tabulation characters.';
    return request(app.getHttpServer())
      .post('/purchaseOrder')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on less than 1 character farmGross`, async () => {
    const userTest = await helper.purchaseOrder();
    userTest.farmGross = null;
    return request(app.getHttpServer())
      .post('/purchaseOrder')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });
  it(`Should give error on less than 1 character factoryGross`, async () => {
    const userTest = await helper.purchaseOrder();
    userTest.factoryGross = null;
    return request(app.getHttpServer())
      .post('/purchaseOrder')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });
  it(`Should give error on less than 1 character factoryTare`, async () => {
    const userTest = await helper.purchaseOrder();
    userTest.factoryTare = null;
    return request(app.getHttpServer())
      .post('/purchaseOrder')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });

  it(`Should give error on greater than 10 character pageRef`, async () => {
    const userTest = await helper.purchaseOrder();
    userTest.pageRef = 'mmmmmmmmmmmmmmmm';
    return request(app.getHttpServer())
      .post('/purchaseOrder')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(400);
  });
  it(`Should give error of Unauthorized `, async () => {
    const userTest = await helper.purchaseOrder();
    return (
      request(app.getHttpServer())
        .post('/purchaseOrder')
        // .set('Authorization', `${token}`)
        .send(userTest)
        .expect(401)
    );
  });
  it(`Get All purchaseOrders `, async () => {
    return request(app.getHttpServer())
      .get('/purchaseOrder/list?column=id')
      .set('Authorization', `${token}`)
      .expect(200);
  });
  it(`Should Add purchaseOrder `, async () => {
    const userTest = await helper.purchaseOrder();
    return request(app.getHttpServer())
      .post('/purchaseOrder')
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(201)
      .then( (res) => {
        id = res.body._id;
      });
  });
  it(`Should Update purchaseOrder `, async () => {
    const userTest = await helper.purchaseOrder();
    userTest.driverName = 'NEW Updated';
    return request(app.getHttpServer())
      .patch('/purchaseOrder/' + id)
      .set('Authorization', `${token}`)
      .send(userTest)
      .expect(204);
  });
  it(`Should Delete purchaseOrder by Id`, async () => {
    return request(app.getHttpServer())
      .delete('/purchaseOrder/' + id)
      .set('Authorization', `${token}`)
      .expect(204);
  });
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
