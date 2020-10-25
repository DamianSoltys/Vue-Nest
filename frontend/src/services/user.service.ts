import { IChangePasswordData } from "@/interfaces/password.interface";
import {
  ILoginData,
  ILoginResponse,
  IRegisterData
} from "@/interfaces/User.interface";

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
      this.saveLoginData(request.accessToken, request.username);
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
    myHeaders.append("Authorization", `Bearer ${userService.getToken()}`);
    const raw = JSON.stringify(passwordData);
    const requestOptions: RequestInit = {
      method: "PUT",
      headers: myHeaders,
      body: raw
    };
    const request: any = await fetch(
      "http://localhost:3000/user/locker",
      requestOptions
    )
      .then(response => response.json())
      .then(result => result)
      .catch(error => console.log("error", error));

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
  private saveLoginData(token: string, username: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
  }
}

export const userService = new UserService();
