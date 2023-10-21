import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';
import { AuthResponse } from 'src/app/models/interfaces/user/auth/AuthResponse';
import { AuthResquest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { environments } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = environments.API_URL;

  constructor(
    private http: HttpClient,
    private cookie: CookieService
  ) { }

  signupUser(requestDatas: SignupUserRequest): Observable<SignupUserResponse>{
    return this.http.post<SignupUserResponse>(`${this.API_URL}/user`,
    requestDatas

    );
  }

  authUser(requestDatas: AuthResquest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth`, requestDatas)

  }

  isLoggedIn(): boolean {
  //verificar se o usuário pussui um token ou cookie
  const JWT_TOKEN = this.cookie.get('USER_INFO');
  return JWT_TOKEN ? true : false;
  }
}
