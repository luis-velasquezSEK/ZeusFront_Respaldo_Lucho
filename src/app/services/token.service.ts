import {Injectable} from '@angular/core';

const TOKEN_KEY = 'AuthToken';
const SOCIALUSER_KEY = 'SocialUser';
const REFRESHTOKEN_KEY = 'RefreshAuthToken';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() {
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public setToken(token: string): void {
    //sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  public saveRefreshToken(token: string): void {
    sessionStorage.removeItem(REFRESHTOKEN_KEY);
    sessionStorage.setItem(REFRESHTOKEN_KEY, token);
  }

  public getRefreshToken(): string | null {
    return sessionStorage.getItem(REFRESHTOKEN_KEY);
  }

  public getSocialUser(): string {
    return sessionStorage.getItem(SOCIALUSER_KEY);
  }

  public setSocialUser(socialUser: string): void {
    //sessionStorage.removeItem(SOCIALUSER_KEY);
    sessionStorage.setItem(SOCIALUSER_KEY, socialUser);
  }

  logOut(): void {
    sessionStorage.clear();
  }
}
