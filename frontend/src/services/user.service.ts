import { IChangePasswordData } from "@/interfaces/password.interface";
import {
  ILoginData,
  ILoginResponse,
  IRegisterData
} from "@/interfaces/User.interface";
import router from "@/router/router";

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
      .then(response => response.json())
      .then(result => result)
      .catch(error => console.log("error", error));

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
      .then(response => response.json())
      .then(result => result)
      .catch(error => console.log("error", error));
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
      .then(response => response.text())
      .then(result => result)
      .catch(error => console.log("error", error));

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
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log("error", error));

    return false;
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
  }
}

export const userService = new UserService();
