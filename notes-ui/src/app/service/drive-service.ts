import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {
  CLIENT_ID,
  CLIENT_SECRET,
  G_DRIVE_SCOPE,
  GOOGLE_OAUTH_ENDPOINT,
  REDIRECT_URI,
  RESET_ACCESS_TOKEN_INTERVAL_MS
} from "../common/constants";
import {AccessTokenRequest, AccessTokenResponse, RefreshTokenRequest, RefreshTokenResponse} from "../types/types";

@Injectable({
  providedIn: 'root'
})
export class DriveService {

  private oAuth2Code = '';
  private accessToken = '';
  private refreshToken = '';

  private accessTokenRetrievedSubject = new Subject<void>();

  constructor(private http: HttpClient) {
  }

  authorize() {
    // @ts-ignore
    const client = google.accounts.oauth2.initCodeClient({
      client_id: CLIENT_ID,
      scope: G_DRIVE_SCOPE,
      ux_mode: 'popup',
      callback: (response: any) => {
        this.setOAuth2Code(response.code);
        this.retrieveAccessToken();
      },
    });
    client.requestCode();
  }

  /**
   * Uses the OAuth2 code to retrieve short-lived 'accessToken' with expiry
   * and long-lived 'refreshToken'.
   */
  retrieveAccessToken() {
    const accessTokenRequest = this.getAccessTokenRequest();
    this.http.post<AccessTokenResponse>(GOOGLE_OAUTH_ENDPOINT, accessTokenRequest)
      .subscribe((res: AccessTokenResponse) => {
        this.setAccessToken(res.access_token);
        this.setRefreshToken(res.refresh_token);
        this.checkAccessToken();
        this.setAccessTokenRetrievedSubject();
      });
  }

  /**
   * Uses 'refreshToken' to get a new 'accessToken'.
   */
  refreshAccessToken() {
    const refreshTokenRequest = this.getRefreshTokenRequest();
    this.http.post<RefreshTokenResponse>(GOOGLE_OAUTH_ENDPOINT, refreshTokenRequest)
      .subscribe((res: RefreshTokenResponse) => {
        this.setAccessToken(res.access_token);
        this.checkAccessToken();
      });
  }

  /**
   * Retrieves a new access token, on expiry.
   */
  checkAccessToken() {
    setInterval(this.refreshAccessToken, RESET_ACCESS_TOKEN_INTERVAL_MS);
  }

  getRefreshTokenRequest(): RefreshTokenRequest {
    return {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: this.getRefreshToken(),
    };
  }

  getAccessTokenRequest(): AccessTokenRequest {
    return {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: this.getOAuth2Code(),
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
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

  getAccessTokenRetrievedSubject(): Subject<void> {
    return this.accessTokenRetrievedSubject;
  }

  setAccessTokenRetrievedSubject() {
    this.accessTokenRetrievedSubject.next();
  }

}
