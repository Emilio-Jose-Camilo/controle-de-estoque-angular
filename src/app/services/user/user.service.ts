import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SisnupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';
import { AuthResponse } from 'src/app/models/interfaces/user/auth/AuthResponse';
import { AuthResquest } from 'src/app/models/interfaces/user/auth/authRequest';
import { environments } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = environments.API_URL;

  constructor(private http: HttpClient) { }

  signupUser(requestDatas: SisnupUserRequest): Observable<SignupUserResponse>{
    return this.http.post<SignupUserResponse>(`${this.API_URL}/user`,
    requestDatas

    );
  }

  authUser(requestDatas: AuthResquest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth`, requestDatas)

  }
}
