import {Injectable, OnDestroy} from "@angular/core";
import {Observable, Subject, takeUntil} from "rxjs";
import {HttpClient, HttpEvent, HttpHeaders} from "@angular/common/http";
import {
  CLIENT_ID,
  CLIENT_SECRET,
  DRIVE_FILE_UPLOAD_MULTIPART_ENDPOINT,
  GOOGLE_OAUTH_ENDPOINT,
  RESET_ACCESS_TOKEN_INTERVAL_MS
} from "../common/constants";
import {
  AccessTokenRequest,
  AccessTokenResponse,
  DriveUploadResponse,
  RefreshTokenRequest,
  RefreshTokenResponse
} from "../types/types";

@Injectable({
  providedIn: 'root'
})
export class DriveService implements OnDestroy {

  private oAuth2Code = '';
  private accessToken = '';
  private refreshToken = '';

  private destroyed = new Subject<void>();

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
        this.refreshAccessToken()
          .pipe(takeUntil(this.destroyed))
          .subscribe((res: RefreshTokenResponse) => {
            this.setAccessToken(res.access_token);
          });
      },
      RESET_ACCESS_TOKEN_INTERVAL_MS);
  }

  /**
   * Performs multipart Google Drive file upload with metadata.
   *
   * @param file
   */
  uploadFileWithMetadata(file: File): Observable<HttpEvent<DriveUploadResponse>> {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAccessToken()}`
    });
    const metadata = {
      name: file.name,
    };
    const formData: FormData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
    formData.append('file', file);

    return this.http.post<DriveUploadResponse>(DRIVE_FILE_UPLOAD_MULTIPART_ENDPOINT, formData, {
      headers: headers,
      reportProgress: true,
      observe: 'events'
    });
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

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
