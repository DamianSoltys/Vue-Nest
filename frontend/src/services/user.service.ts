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

    if (request?.access_token) {
      this.saveLoginData(request.access_token, request.username);
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
  private saveLoginData(token: string, username: string) {
    localStorage.setItem("token", token);
  }

  //TODO: improve
  private getToken() {
    return localStorage.getItem("token");
  }
}

export const userService = new UserService();
