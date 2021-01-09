import { IResponseType } from "@/interfaces/error.interface";
import { IDataChange, IHistoryLog } from "@/interfaces/history.interface";
import { IPasswordData } from "@/interfaces/password.interface";
import { errorService } from "./error.service";
import { userService } from "./user.service";

export class HistoryService {
  public getHistory(): IHistoryLog[] {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userService.getToken()}`);
    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders
    };
    const data: any = fetch(
      `http://localhost:3000/history?userId=${userService.getUserId()}`,
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

  public getDataChanges(recordId: number): IDataChange[] {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userService.getToken()}`);
    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders
    };
    const data: any = fetch(
      `http://localhost:3000/history/changes?recordId=${recordId}`,
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

  public async revertData(recordId:number): Promise<any> {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userService.getToken()}`);

    const raw = JSON.stringify({recordId});
    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw
    };
    const request: any = await fetch(
      "http://localhost:3000/changes",
      requestOptions
    )
      .then(response => errorService.handleError(response))
      .then(response => response.json())
      .then(result => {
        errorService.handleResponse(
          IResponseType.SUCCESS,
          "Password updated successfully."
        );
        return result;
      })
      .catch(error =>
        errorService.handleResponse(IResponseType.ERROR, error.message)
      );

    return request;
  }
}

export const historyService = new HistoryService();
