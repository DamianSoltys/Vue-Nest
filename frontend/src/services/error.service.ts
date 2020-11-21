import { StoreActions } from "@/store/store.interface";
import { IResponseType } from "../interfaces/error.interface";
import store from "../store/vuex.config";

export class ErrorService {
  handleResponse(type: IResponseType, message: string) {
    type === IResponseType.ERROR
      ? store.dispatch(StoreActions.RESPONSE_ERROR, message)
      : store.dispatch(StoreActions.RESPONSE_SUCCESS, message);
  }

  async handleError(response: Response) {
    if (!response.ok) {
      const message = await response.json();
      const errorMessage = message.error || message.message;

      throw new Error(errorMessage);
    }

    return response;
  }
}

export const errorService = new ErrorService();
