import {Component, OnDestroy, OnInit} from "@angular/core";
import {DriveService} from "../service/drive-service";
import {CLIENT_ID, CLIENT_SECRET, G_DRIVE_SCOPE, REDIRECT_URI} from "../common/constants";
import {AccessTokenRequest, AccessTokenResponse, RefreshTokenResponse} from "../types/types";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'file-upload',
  templateUrl: './file.upload.component.html',
  styleUrls: ['./file.upload.component.css'],
})
export class FileUploadComponent implements OnInit, OnDestroy {

  accessToken = '';
  refreshToken = '';
  loading = false;
  private destroyed = new Subject<void>();

  constructor(private driveService: DriveService) {
  }

  ngOnInit(): void {
    this.accessToken = this.driveService.getAccessToken();
    this.refreshToken = this.driveService.getRefreshToken();
  }

  // TODO: add more details here
  selectFile(event: Event) {
    // @ts-ignore
    const file = (event.target as HTMLInputElement).files[0];
    console.log(event);
  }

  uploadFiles() {
    if (!this.refreshToken) {
      this.authorize();
    } else {
      this.loading = true;
      this.driveService.refreshAccessToken()
        .pipe(takeUntil(this.destroyed))
        .subscribe((res: RefreshTokenResponse) => {
          this.driveService.setAccessToken(res.access_token);
          this.accessToken = res.access_token;
          this.loading = false;
        })
    }
  }

  authorize() {
    // @ts-ignore
    const client = google.accounts.oauth2.initCodeClient({
      client_id: CLIENT_ID,
      scope: G_DRIVE_SCOPE,
      ux_mode: 'popup',
      callback: (response: any) => {
        this.driveService.setOAuth2Code(response.code);
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
    this.driveService.retrieveAccessToken(accessTokenRequest)
      .pipe(takeUntil(this.destroyed))
      .subscribe((res: AccessTokenResponse) => {
        this.driveService.setAccessToken(res.access_token);
        this.driveService.setRefreshToken(res.refresh_token);
        console.log('refresh token', res.refresh_token);
        this.driveService.checkAccessToken();
        this.accessToken = res.access_token;
        this.refreshToken = res.refresh_token;
      })
  }


  getAccessTokenRequest(): AccessTokenRequest {
    return {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: this.driveService.getOAuth2Code(),
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
    };
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
