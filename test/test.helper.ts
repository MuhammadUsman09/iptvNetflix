/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import {
  attendanc,
  bkItem,
  bnk,
  cat,
  cBudTest,
  cIssueForProduction,
  con,
  cRate,
  custom,
  desg,
  dryDemo,
  emp,
  EmpSal,
  farm,
  getPaymnt,
  labExpense,
  labType,
  logUser,
  myBook,
  myPack,
  newUser,
  pOrder,
  prodItem,
  productOutput,
  pSize,
  rList,
  salGen,
  sOfficer,
  sStore,
  stocks,
  str,
  sType,
  sup,
  tDiscount,
  ware,
  wPurity,
} from './helper/users';
import { INestApplication } from '@nestjs/common';
export class Helper {
  private app: INestApplication;

  constructor(app: INestApplication) {
    this.app = app;
  }

  public async clearDB() {
    // mongoose.connect("mongodb://127.0.0.1:27017/game-of-tests",function(){
    //     /* Drop the DB */
    //     mongoose.connection.db.dropDatabase();
    //     return;
    // });
  }

  public async createUser() {
    return newUser();
  }

  public async loginUser() {
    return logUser();
  }

  public async category() {
    return cat();
  }

  public async supplier() {
    return sup();
  }

  public async contractor() {
    return con();
  }

  public async farmAddress() {
    return farm();
  }

  public async contractor_rate() {
    return cRate();
  }

  public async warehouse() {
    return ware();
  }

  public async store() {
    return str();
  }

  public async purchaseOrder() {
    return pOrder();
  }

  public async wheatPurity() {
    return wPurity();
  }

  public async cottonBudTest() {
    return cBudTest();
  }

  public async commodityIssueForProduction() {
    return cIssueForProduction();
  }

  public async productionOutput() {
    return productOutput();
  }

  public async productItem() {
    return prodItem();
  }

  public async Dry() {
    return dryDemo();
  }

  public async packing() {
    return myPack();
  }

  public async packingSize() {
    return pSize();
  }

  public async stock() {
    return stocks();
  }

  public async discount() {
    return tDiscount();
  }

  public async rateList() {
    return rList();
  }

  public async saleStore() {
    return sStore();
  }

  public async saleOfficer() {
    return sOfficer();
  }

  public async book() {
    return myBook();
  }

  public async customer() {
    return custom();
  }

  public async payment() {
    return getPaymnt();
  }

  public async bookItem() {
    return bkItem();
  }

  public async bank() {
    return bnk();
  }

  public async attendance() {
    return attendanc();
  }
  public async employeeSalarySetup() {
    return EmpSal();
  }

  public async salaryType() {
    return sType();
  }

  public async employee() {
    return emp();
  }

  public async designation() {
    return desg();
  }

  public async salaryGenerate() {
    return salGen();
  }

  public async labourType() {
    return labType();
  }

  public async labourExpense() {
    return labExpense();
  }

  // public authHeaderForUser(user: User | Admin): string {
  //     const configService = new ConfigService();
  //     const jwtService = new JwtService({
  //         secret: configService.get<string>('JWT_SECRET_KEY'),
  //     });

  //     const authPayload = { id: user.id ,role: user.role.roleName};
  //     const authToken = jwtService.sign(authPayload);
  //     return `Bearer ${authToken}`;
  // }
}
