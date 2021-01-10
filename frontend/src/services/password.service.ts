import { ResponseTypeEnum } from "@/interfaces/error.interface";
import {
  IChangePasswordData,
  IDecryptPasswordData,
  IPasswordData,
  ISharePasswordData
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
          ResponseTypeEnum.SUCCESS,
          "Password added successfully."
        );
        return result;
      })
      .catch(error =>
        errorService.handleResponse(ResponseTypeEnum.ERROR, error.message)
      );

    return request;
  }

  public async updatePassword(passwordData: IPasswordData): Promise<any> {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userService.getToken()}`);
    passwordData.secret = userService.getSecret();

    const raw = JSON.stringify(passwordData);
    const requestOptions: RequestInit = {
      method: "PUT",
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
          ResponseTypeEnum.SUCCESS,
          "Password updated successfully."
        );
        return result;
      })
      .catch(error =>
        errorService.handleResponse(ResponseTypeEnum.ERROR, error.message)
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
        errorService.handleResponse(ResponseTypeEnum.ERROR, error.message)
      );

    return data;
  }

  public sharePassword(sharePasswordData: ISharePasswordData) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userService.getToken()}`);
    const raw = JSON.stringify(sharePasswordData);
    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw
    };
    const data: any = fetch(
      `http://localhost:3000/locker/share`,
      requestOptions
    )
      .then(response => errorService.handleError(response))
      .then(response => response.json())
      .then(result => {
        errorService.handleResponse(
          ResponseTypeEnum.SUCCESS,
          `Password shared successfully with ${sharePasswordData.username}.`
        );
        return result;
      })
      .catch(error =>
        errorService.handleResponse(ResponseTypeEnum.ERROR, error.message)
      );

    return data;
  }

  public deletePassword(id: number): IPasswordData[] {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userService.getToken()}`);
    const requestOptions: RequestInit = {
      method: "DELETE",
      headers: myHeaders
    };
    const data: any = fetch(
      `http://localhost:3000/locker?id=${id}`,
      requestOptions
    )
      .then(response => errorService.handleError(response))
      .then(response => response.json())
      .then(result => {
        errorService.handleResponse(
          ResponseTypeEnum.SUCCESS,
          "Password deleted successfully."
        );
        return result;
      })
      .catch(error =>
        errorService.handleResponse(ResponseTypeEnum.ERROR, error.message)
      );

    return data;
  }

  public async getDecryptedPassword({
    passwordId,
    userId
  }: IDecryptPasswordData) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userService.getToken()}`);
    myHeaders.append("Secret", `${userService.getSecret()}`);
    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders
    };

    const data = await fetch(
      `http://localhost:3000/locker/decrypt?userId=${userId}&passwordId=${passwordId}`,
      requestOptions
    )
      .then(response => errorService.handleError(response))
      .then(response => response.text())
      .then(result => result)
      .catch(error =>
        errorService.handleResponse(ResponseTypeEnum.ERROR, error.message)
      );

    return data || "";
  }
}

export const passwordService = new PasswordService();
