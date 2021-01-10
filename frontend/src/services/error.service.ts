import { StoreActions } from "@/store/store.interface";
import {
  ErrorMessageEnum,
  FormTypeEnum,
  ResponseTypeEnum
} from "../interfaces/error.interface";
import store from "../store/vuex.config";

export class ErrorService {
  public handleResponse(type: ResponseTypeEnum, message: string) {
    type === ResponseTypeEnum.ERROR
      ? store.dispatch(StoreActions.RESPONSE_ERROR, message)
      : store.dispatch(StoreActions.RESPONSE_SUCCESS, message);
  }

  public async handleError(response: Response) {
    if (!response.ok) {
      const message = await response.json();
      const errorMessage = message.error || message.message;

      throw new Error(errorMessage);
    }

    return response;
  }

  public async handleBlockResponse(response: Response) {
    if (!response.ok && response.status === 403) {
      store.dispatch(StoreActions.TOGGLE_UNBLOCK_BUTTON, true);
    }

    return response;
  }

  public validateForm(
    formData: { [key: string]: string },
    formType: FormTypeEnum = FormTypeEnum.DEFAFULT
  ) {
    const keys = Object.keys(formData);
    let error = false;

    keys.forEach(key => {
      if (
        formData[key] === null ||
        formData[key] === "" ||
        formData[key] === undefined
      ) {
        this.showFormError(key, ErrorMessageEnum.INPUT_REQUIRED);
        error = true;
      }

      if (formType === FormTypeEnum.REGISTER) {
        if (formData["passwordConfirm"] !== formData["password"]) {
          this.showFormError("", ErrorMessageEnum.INPUT_CONFIRM_PASSWORD);
          error = true;
        }
      }
    });

    return error;
  }

  private showFormError(
    inputName = "",
    errorMessage: ErrorMessageEnum,
    maxLength = 15,
    minLength = 4
  ) {
    this.handleResponse(ResponseTypeEnum.ERROR, `${errorMessage}${inputName}`);
  }
}

export const errorService = new ErrorService();
