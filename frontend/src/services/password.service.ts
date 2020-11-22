import { IResponseType } from "@/interfaces/error.interface";
import {
  IChangePasswordData,
  IPasswordData
} from "@/interfaces/password.interface";
import { errorService } from "./error.service";
import { userService } from "./user.service";

export class PasswordService {
  public async addPassword(passwordData: IPasswordData): Promise<any> {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userService.getToken()}`);
    passwordData.secret = userService.getSecret();

    const raw = JSON.stringify(passwordData);
    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw
    };
    const request: any = await fetch(
      "http://localhost:3000/locker",
      requestOptions
    )
      .then(response => errorService.handleError(response))
      .then(response => response.json())
      .then(result => {
        errorService.handleResponse(
          IResponseType.SUCCESS,
          "Password added successfully."
        );
        return result;
      })
      .catch(error =>
        errorService.handleResponse(IResponseType.ERROR, error.message)
      );

    return request;
  }

  public getPasswords(): IPasswordData[] {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userService.getToken()}`);
    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders
    };
    const data: any = fetch(
      `http://localhost:3000/locker?userId=${userService.getUserId()}`,
      requestOptions
    )
      .then(response => errorService.handleError(response))
      .then(response => response.json())
      .then(result => result)
      .catch(error =>
        errorService.handleResponse(IResponseType.ERROR, error.message)
      );

    return data;
  }

  public async getDecryptedPassword(passwordId: string) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userService.getToken()}`);
    myHeaders.append("Secret", `${userService.getSecret()}`);
    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders
    };

    const data = await fetch(
      `http://localhost:3000/locker/decrypt?userId=${userService.getUserId()}&passwordId=${passwordId}}`,
      requestOptions
    )
      .then(response => errorService.handleError(response))
      .then(response => response.text())
      .then(result => result)
      .catch(error =>
        errorService.handleResponse(IResponseType.ERROR, error.message)
      );

    return data || "";
  }
}

export const passwordService = new PasswordService();
