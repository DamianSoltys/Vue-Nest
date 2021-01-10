export enum ResponseTypeEnum {
  ERROR = "ERROR",
  SUCCESS = "SUCCESS"
}

export enum FormTypeEnum {
  DEFAFULT = "DEFAFULT",
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  PASSWORD = "PASSWORD"
}

export enum ErrorMessageEnum {
  INPUT_DEFAULT = "Dane pole jest niepoprawne: ",
  INPUT_REQUIRED = "Dane pole jest wymagane: ",
  INPUT_CONFIRM_PASSWORD = "Hasła muszą być takie same",
  INPUT_MAX_LENGTH = "Dane pole przekroczyło dopuszczalną ilość znaków: ",
  INPUT_MIN_LENGTH = "Dane pole jest ma za małą liczbę znaków: "
}
