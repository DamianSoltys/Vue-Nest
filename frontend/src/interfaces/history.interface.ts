export interface IHistoryLog {
  id: number;
  userId: number;
  initializeDate: Date;
  functionType: FunctionTypeEnum;
}

export interface IDataChange {
  id: number;
  userId: number;
  initializeDate: Date;
  functionType: FunctionTypeEnum;
  recordId: number;
  previousValue: string;
  presentValue: string;
}

export enum FunctionTypeEnum {
  ADD_PASSWORD = "ADD_PASSWORD",
  DELETE_PASSWORD = "DELETE_PASSWORD",
  MODIFY_PASSWORD = "MODIFY_PASSWORD",
  SHOW_PASSWORD = "SHOW_PASSWORD",
  SHARE_PASSWORD = "SHARE_PASSWORD"
}
