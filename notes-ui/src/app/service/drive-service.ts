import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {CLIENT_ID, CLIENT_SECRET, GOOGLE_OAUTH_ENDPOINT, RESET_ACCESS_TOKEN_INTERVAL_MS} from "../common/constants";
import {AccessTokenRequest, AccessTokenResponse, RefreshTokenRequest, RefreshTokenResponse} from "../types/types";

@Injectable({
  providedIn: 'root'
})
export class DriveService {

  private oAuth2Code = '';
  private accessToken = '';
  private refreshToken = '';

  constructor(private http: HttpClient) {
  }

  retrieveAccessToken(accessTokenRequest: AccessTokenRequest): Observable<AccessTokenResponse> {
    return this.http.post<AccessTokenResponse>(GOOGLE_OAUTH_ENDPOINT, accessTokenRequest);
  }

  /**
   * Uses 'refreshToken' to get a new 'accessToken'.
   */
  refreshAccessToken(): Observable<RefreshTokenResponse> {
    const refreshTokenRequest = this.getRefreshTokenRequest();
    return this.http.post<RefreshTokenResponse>(GOOGLE_OAUTH_ENDPOINT, refreshTokenRequest);
  }

  /**
   * Retrieves a new access token, on expiry.
   */
  checkAccessToken() {
    setInterval(() => {
        this.http.post<RefreshTokenResponse>(GOOGLE_OAUTH_ENDPOINT, this.getRefreshTokenRequest())
          .subscribe((res: RefreshTokenResponse) => {
            this.setAccessToken(res.access_token);
          });
      },
      RESET_ACCESS_TOKEN_INTERVAL_MS);
  }

  getRefreshTokenRequest(): RefreshTokenRequest {
    return {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: this.getRefreshToken(),
    };
  }

  getOAuth2Code() {
    return this.oAuth2Code;
  }

  setOAuth2Code(oAuth2Code: string) {
    this.oAuth2Code = oAuth2Code;
  }

  getAccessToken() {
    return this.accessToken;
  }

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  setRefreshToken(refreshToken: string) {
    this.refreshToken = refreshToken;
  }

}
