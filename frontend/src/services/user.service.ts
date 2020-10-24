import { ILoginData, IRegisterData } from '@/interfaces/User.interface';

export class UserService {
  async loginUser(userData:ILoginData) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify(userData);
    const requestOptions:RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };

    return await fetch("http://localhost:3000/login", requestOptions)
      .then((response) => response.json())
      .then((result) => result)
      .catch((error) => console.log("error", error));
  }

  async registerUser(userData:IRegisterData) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify(userData);
    const requestOptions:RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };

    return await fetch("http://localhost:3000/register", requestOptions)
      .then((response) => response.json())
      .then((result) => result)
      .catch((error) => console.log("error", error));
  }

  getTest() {
    const myHeaders = new Headers();
    
    const requestOptions:RequestInit = {
        method: "GET",
        headers: myHeaders,
      };

      fetch("localhost:3000/login", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }
}

export const userService = new UserService();