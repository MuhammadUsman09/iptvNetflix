import { RoleType } from '../../src/constants/role-type';

export const newUser = () => {
  const user = {
    id: '',
    firstName: 'almuhasba',
    lastName: 'cooperation',
    email: 'almuhasba@gmail.com',
    password: 'almuhasba',
    phone: '03023412345',
    role: RoleType.ADMIN,
    avatar: 'testimage',
  };
  return user;
};

export const logUser = () => {
  const user = {
    email: 'almuhasba@gmail.com',
    password: 'almuhasba',
  };
  return user;
};

export const cat = () => {
  const user = {
    name: 'category',
  };
  return user;
};

export const sup = () => {
  const user = {
    firstName: 'Supplier',
    lastName: 'string',
    phone: '03033030303',
    address: 'Rajput colony Kotsabzal',
    cnic: '3130418185889',
    area: 'Area',
    province: 'pubjab',
  };
  return user;
};

export const con = () => {
  const user = {
    firstName: 'Contractor',
    lastName: 'cont',
    phone: '03033030303',
    address: 'Rajput colony Kotsabzal',
    cnic: '3130418185289',
    vehicalNumber: 'vehicle',
  };
  return user;
};

export const farm = () => {
  const user = {
    tehsil: 'Sadiqabad',
    address: 'Address',
    district: 'rahim yar khan',
  };
  return user;
};

export const cRate = () => {
  const user = {
    packingSize: 222,
    rate: 122,
  };
  return user;
};

export const ware = () => {
  const user = {
    name: 'rkkao',
    address: 'asdjaskd',
  };
  return user;
};

export const str = () => {
  const user = {
    name: 'namee',
    direction: 'direction',
  };
  return user;
};

export const pOrder = () => {
  const user = {
    categoryId: '6278c5b414ac4fec9f4c832c',
    supplierId: '627a5f03096a580a7e73dd36',
    storeId: '628387f5fc96141765380b30',
    uploaderBag: 400,
    downloaderBag: 400,
    premium: '62833fe7b7d96f58fb224b5d',
    carriageBag: 400,
    fakeCarriageWeight: 12,
    invoiceIdManual: 'invol',
    vehicleNumber: 'vehicle',
    gatePass: 'gatePass',
    driverName: 'driverName',
    conveyno: 'conveyno',
    storageSlipNo: 'storageSlipNo',
    uploaderClerk: 'uploaderClerk',
    downloaderClerk: 'downloaderClerk',
    note: 'note',
    purity: 'Good',
    farmTare: 100,
    tip: 1,
    farmGross: 400,
    factoryGross: 400,
    factoryTare: 100,
    bardana: 1,
    kanta: 1,
    sangli: 1,
    moisture: 1,
    other: 1,
    rate: 12,
    rateType: 'kg',
    pageRef: 'note',
    fixType: 'factory',
    image: 'notse',
    fixationStatus: true,
    suspect: false,
    status: true,
    labourExpense:[],
  };
  return user;
};

export const wPurity = () => {
  const user = {
    grainWeight: 456,
    purity: 123,
  };
  return user;
};

export const cBudTest = () => {
  const user = {
    fieldGermination: 123,
    beforeGinning: 123,
    afterGinning: 123,
    resample1: 123,
    resample2: 123,
    resample3: 123,
    beforeDry: 123,
    afterDry: 123,
    afterPack: 123,
  };
  return user;
};

export const cIssueForProduction = () => {
  const user = {
    remainingBags: 123,
    bagsForProduction: 123,
    bagSize: 123,
    netWeight: 123,
    PlantNo: 123,
    processNo: 123,
  };
  return user;
};

export const productOutput = () => {
  const user = {
    rawSlipNo: 'abcabc',
    lot: 'abcabc',
    packingSize: 123,
    quantityInBag: 123,
    heap: 123,
    productNo: 'abcabc',
  };
  return user;
};

export const prodItem = () => {
  const user = {
    name: 'Ali',
  };
  return user;
};

export const dryDemo = () => {
  const user = {
    lossNumber: 'abc',
    grossStore: 123,
    tareStore: 123,
    grossDry: 123,
    tareDry: 123,
  };
  return user;
};

export const myPack = () => {
  const user = {
    movedQty: 123,
    qty: 123,
  };
  return user;
};

export const pSize = () => {
  const user = {
    size: 123456,
    unit: '123',
  };
  return user;
};

export const stocks = () => {
  const user = {
    productItem: 'abc',
    packingsize: 123456,
    qty: 123456,
    subcategory: 'abc',
    category: 'abc',
  };
  return user;
};

export const tDiscount = () => {
  const user = {
    name: 'abc',
    amount: 123456,
  };
  return user;
};

export const rList = () => {
  const user = {
    name: 'abc',
    rate: 123456,
  };
  return user;
};

export const sStore = () => {
  const user = {
    direction: 'north',
    category: 'large',
    name: 'pakistan',
  };
  return user;
};

export const sOfficer = () => {
  const user = {
    firstName: '123123',
    lastName: '123123',
    address: 'abcabc',
    area: 'abcabc',
    phone: '033425266744',
    email: 'abc@gmail.com',
  };
  return user;
};

export const myBook = () => {
  const user = {
    bookNo: '123123',
    destination: '123123',
    area: 'abcabc',
    type: 'abcabc',
    checkNo: 'abcbac',
    category: 'abcabc',
  };
  return user;
};

export const custom = () => {
  const user = {
    firstName: '123123',
    lastName: '123123',
    address: 'abcabc',
    area: 'abcabc',
    phone: '033425266744',
    email: 'abc@gmail.com',
  };
  return user;
};

export const getPaymnt = () => {
  const user = {
    name: 'abcabc',
  };
  return user;
};

export const bkItem = () => {
  const user = {
    qty: 123,
  };
  return user;
};

export const bnk = () => {
  const user = {
    qty: 123,
    name: 'arslan',
    accountName: 'Arslan Amanullah',
    accountNumber: '1201-0102421976',
    branch: 'main',
  };
  return user;
};

export const attendanc = () => {
  const user = {
    date: '05/04/2022',
    timeIn: '05/04/2022',
    timeOut: '05/04/2022',
    stayTime: '05/04/2022',
  };
  return user;
};

export const EmpSal = () => {
  const user = {
    amount: 456789,
  };
  return user;
};

export const sType = () => {
  const user = {
    name: 'April',
    type: 1,
  };
  return user;
};

export const emp = () => {
  const user = {
    fname: 'Arslan',
    lname: 'Amanullah',
    phone: '03342526674',
    salary: 25000,
    email: 'emp@gmail.com',
    address: 'RahimYarKhan',
  };
  return user;
};

export const desg = () => {
  const user = {
    name: 'Manager',
    description: 'Manager of It Branch',
  };
  return user;
};

export const salGen = () => {
  const user = {
    generatedBy: 'Manager',
  };
  return user;
};

export const labType = () => {
  const user = {
    name: 'Zahid',
  };
  return user;
};

export const labExpense = () => {
  const user = {
    assetID: '6278c5b414ac4fec9f4c832c',
    contractorRateID: '6278c5b414ac4fec9f4c832c',
    typeId: '6278c5b414ac4fec9f4c832c',
  };
  return user;
};
