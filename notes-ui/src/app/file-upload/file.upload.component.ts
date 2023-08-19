import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {DriveService} from "../service/drive-service";
import {CLIENT_ID, CLIENT_SECRET, FILE_VIEW_LINK, G_DRIVE_SCOPE, REDIRECT_URI} from "../common/constants";
import {
  AccessTokenRequest,
  AccessTokenResponse,
  DriveUploadResponse,
  FileDetails,
  RefreshTokenResponse
} from "../types/types";
import {Subject, takeUntil, tap} from "rxjs";
import {HttpEvent, HttpEventType, HttpResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'file-upload',
  templateUrl: './file.upload.component.html',
  styleUrls: ['./file.upload.component.css'],
})
export class FileUploadComponent implements OnInit, OnDestroy {

  accessToken = '';
  refreshToken = '';
  loading = false;
  selectedFiles: FileList;
  uploadedFiles: FileDetails[] = [];
  private destroyed = new Subject<void>();

  @ViewChild('fileInput', {read: ElementRef})
  fileInput: ElementRef<HTMLElement>;

  constructor(private driveService: DriveService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.accessToken = this.driveService.getAccessToken();
    this.refreshToken = this.driveService.getRefreshToken();
  }

  // TODO: add chips support
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
          this.fileInput.nativeElement.click();
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

  removeUploadedFile(index: number) {
    this.uploadedFiles.splice(index, 1);
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

  selectFile(event: Event) {
    this.uploadedFiles = [];
    // @ts-ignore
    this.selectedFiles = event.target.files;
    for (const file of Array.from(this.selectedFiles)) {
      const fileDetails: FileDetails = {
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
      };
      this.uploadedFiles.push(fileDetails);
      this.uploadFileWithMetadata(file, fileDetails);
    }
  }

  uploadFileWithMetadata(file: File, fileDetails: FileDetails) {
    this.driveService.uploadFileWithMetadata(file)
      .pipe(tap(event => {
        if (event.type === HttpEventType.UploadProgress) {
          // @ts-ignore
          fileDetails.progress = Math.round(100 * event.loaded / event.total);
        }
      }))
      .subscribe((response: HttpEvent<DriveUploadResponse>) => {
        if (response instanceof HttpResponse) {
          const driveResponse: DriveUploadResponse | null = response.body;
          if (driveResponse) {
            fileDetails.id = driveResponse.id;
            fileDetails.downloadLink = driveResponse.webContentLink;
            fileDetails.viewLink = FILE_VIEW_LINK + driveResponse.id;
            console.log('fileDetails', fileDetails);
          }
        }
      }, e => {
        this.snackBar.open(e.error.error.message, 'Ok');
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
