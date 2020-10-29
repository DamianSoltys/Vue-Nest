import {
  IChangePasswordData,
  IPasswordData
} from "@/interfaces/password.interface";
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
      .then(response => response.json())
      .then(result => result)
      .catch(error => console.log("error", error));

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
      .then(response => response.json())
      .then(result => result)
      .catch(error => console.log("error", error));

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
      .then(response => response.text())
      .then(result => result)
      .catch(error => error);

    return data;
  }
}

export const passwordService = new PasswordService();
