import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {BASE_API_ENDPOINT, LOGIN_API_ENDPOINT} from "../common/constants";
import {JWTToken, SignupRequest} from "../types/types";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loggedInUser: string;
  private jwtToken: JWTToken;

  constructor(private http: HttpClient) {
  }

  login(username: string, password: string): Observable<JWTToken> {
    return this.http.post<JWTToken>(LOGIN_API_ENDPOINT, {username, password});
  }

  signup(signupRequest: SignupRequest): Observable<SignupRequest> {
    return this.http.post<SignupRequest>(BASE_API_ENDPOINT + "/user", signupRequest);
  }

  signout(token: JWTToken): Observable<void> {
    return this.http.post<void>(BASE_API_ENDPOINT + "/signout", token);
  }

  getLoggedInUser(): string {
    return this.loggedInUser;
  }

  setLoggedInUser(loggedInUser: string) {
    this.loggedInUser = loggedInUser;
  }

  getJwtToken(): JWTToken {
    return this.jwtToken;
  }

  setJwtToken(jwtToken: JWTToken) {
    this.jwtToken = jwtToken;
  }
}
