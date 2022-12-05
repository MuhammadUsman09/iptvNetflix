export enum ResponseMessage {
  SUCCESS = `Success`,
  CONTRACTOR_PACKING_SIZE_ERROR = `Packing Size are not matching`,
  FarmGross_FACTORYGROOS_Error = `FarmGross and FactoryGross must be Greater than FarmTare`,
}

// some code enums for sending response code in api response
export enum ResponseCode {
  SUCCESS = 200,
  CREATED_SUCCESSFULLY = 201,
  INTERNAL_ERROR = 500,
  NOT_FOUND = 404,
  CONTENT_NOT_FOUND = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  ALREADY_EXIST = 409,
}

export enum LoggerMessages {
  API_CALLED = `Api Has Been Called.`,
}
