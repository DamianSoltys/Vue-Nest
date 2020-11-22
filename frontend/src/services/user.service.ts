import { IResponseType } from "@/interfaces/error.interface";
import { IChangePasswordData } from "@/interfaces/password.interface";
import {
  ILoginData,
  ILoginResponse,
  IRegisterData
} from "@/interfaces/user.interface";
import router from "@/router/router";
import { errorService } from "./error.service";

export class UserService {
  public async loginUser(userData: ILoginData): Promise<ILoginResponse> {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify(userData);
    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw
    };
    const request: ILoginResponse = await fetch(
      "http://localhost:3000/user/login",
      requestOptions
    )
      .then(response => errorService.handleBlockResponse(response))
      .then(response => errorService.handleError(response))
      .then(response => response.json())
      .then(result => {
        errorService.handleResponse(IResponseType.SUCCESS, "Login successful");

        return result;
      })
      .catch(error => {
        errorService.handleResponse(IResponseType.ERROR, error.message);
      });

    if (request?.accessToken) {
      this.saveLoginData(request);
      router.push("/home");
    }

    return request;
  }

  public logoutUser() {
    localStorage.clear();

    return true;
  }

  public async registerUser(userData: IRegisterData) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify(userData);
    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw
    };

    return await fetch("http://localhost:3000/user/register", requestOptions)
      .then(response => errorService.handleError(response))
      .then(response => response.json())
      .then(result => {
        errorService.handleResponse(
          IResponseType.SUCCESS,
          "Register successful, you can now login."
        );

        return result;
      })
      .catch(error => {
        errorService.handleResponse(IResponseType.ERROR, error.message);
      });
  }

  public async changePassword(passwordData: IChangePasswordData): Promise<any> {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${this.getToken()}`);
    const raw = JSON.stringify(passwordData);
    const requestOptions: RequestInit = {
      method: "PUT",
      headers: myHeaders,
      body: raw
    };
    const request: string | void = await fetch(
      "http://localhost:3000/user/password",
      requestOptions
    )
      .then(response => errorService.handleError(response))
      .then(response => response.text())
      .then(result => {
        errorService.handleResponse(
          IResponseType.SUCCESS,
          "Password changed successfully."
        );

        return result;
      })
      .catch(error => {
        errorService.handleResponse(IResponseType.ERROR, error.message);
      });

    if (request) {
      const data: ILoginResponse = { secretToken: request };

      this.saveLoginData(data);
      router.push("/home");
    }

    return request;
  }

  public getTest() {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${this.getToken()}`);
    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders
    };

    fetch("http://localhost:3000/user", requestOptions)
      .then(response => errorService.handleError(response))
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => {
        errorService.handleResponse(IResponseType.ERROR, error.message);
      });

    return false;
  }

  public async unblockAccount() {
    const myHeaders = new Headers();
    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders
    };

    const data = await fetch(
      `http://localhost:3000/user/unblockAccount`,
      requestOptions
    )
      .then(response => errorService.handleError(response))
      .then(response => {
        errorService.handleResponse(
          IResponseType.SUCCESS,
          "Your address was unblocked, try login again."
        );
        return response;
      })
      .catch(error =>
        errorService.handleResponse(IResponseType.ERROR, error.message)
      );

    return data ? true : false;
  }

  //TODO: improve
  public getToken() {
    return localStorage.getItem("token");
  }

  //TODO: improve
  public getName() {
    return localStorage.getItem("username");
  }

  //TODO: improve
  public getSecret() {
    return localStorage.getItem("secret");
  }

  //TODO: improve
  public getUserId() {
    return localStorage.getItem("userId");
  }

  //TODO: improve
  public getDates() {
    return {
      lastFailureLogin: localStorage.getItem("lastFailureLogin"),
      lastSuccessLogin: localStorage.getItem("lastSuccessLogin")
    };
  }

  //TODO: improve
  private saveLoginData(request: ILoginResponse) {
    request?.accessToken
      ? localStorage.setItem("token", request.accessToken)
      : null;
    request?.username
      ? localStorage.setItem("username", request.username)
      : null;
    request?.secretToken
      ? localStorage.setItem("secret", request.secretToken)
      : null;
    request?.userId?.toString()
      ? localStorage.setItem("userId", request.userId.toString())
      : null;
    request?.lastFailureLogin
      ? localStorage.setItem("lastFailureLogin", request.lastFailureLogin)
      : null;
    request?.lastSuccessLogin
      ? localStorage.setItem("lastSuccessLogin", request.lastSuccessLogin)
      : null;
  }
}

export const userService = new UserService();
