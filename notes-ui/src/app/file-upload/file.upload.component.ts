import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from "@angular/core";
import {DriveService} from "../service/drive-service";
import {
  CLIENT_ID,
  CLIENT_SECRET,
  FILE_DOWNLOAD_LINK,
  FILE_VIEW_LINK,
  G_DRIVE_SCOPE,
  REDIRECT_URI
} from "../common/constants";
import {
  AccessTokenRequest,
  AccessTokenResponse,
  DriveUploadResponse,
  FileDetails,
  MediaFile,
  Note,
  RefreshTokenResponse
} from "../types/types";
import {Subject, takeUntil, tap} from "rxjs";
import {HttpEvent, HttpEventType, HttpResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NotesService} from "../service/notes.service";
import {FileService} from "../service/file.service";

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
  @Output() newFileUploadedEvent = new EventEmitter<MediaFile>();
  private destroyed = new Subject<void>();

  @ViewChild('fileInput', {read: ElementRef})
  fileInput: ElementRef<HTMLElement>;

  constructor(private driveService: DriveService, private snackBar: MatSnackBar, private notesService: NotesService, private fileService: FileService,) {
  }

  ngOnInit(): void {
    this.accessToken = this.driveService.getAccessToken();
    this.refreshToken = this.driveService.getRefreshToken();
    this.onCreateNote();

    if (this.refreshToken && !this.accessToken) {
      this.getAccessTokenOnload();
    }

    this.fileService.getFilesCopiedToClipboardSubject().subscribe((files: File[]) => {
      this.prepareFileData(files);
    })

  }

  getAccessTokenOnload() {
    this.loading = true;
    this.driveService.refreshAccessToken()
      .pipe(takeUntil(this.destroyed))
      .subscribe((res: RefreshTokenResponse) => {
        this.driveService.setAccessToken(res.access_token);
        this.accessToken = res.access_token;
        this.driveService.checkAccessToken();
        this.loading = false;
      })
  }

  uploadFiles() {
    if (!this.refreshToken) {
      this.authorize();
    } else {
      if (!this.accessToken) {
        this.getAccessTokenOnload();
      }
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

  onCreateNote() {
    this.notesService.getNoteSubject().subscribe((note: Note) => {
      this.uploadedFiles = [];
    });
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
    this.prepareFileData(Array.from(this.selectedFiles));
  }

  prepareFileData(files: File[]) {
    for (const file of files) {
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
            fileDetails.downloadLink = FILE_DOWNLOAD_LINK(driveResponse.id);
            fileDetails.viewLink = FILE_VIEW_LINK + driveResponse.id;
            this.newFileUploadedEvent.emit({'driveId': driveResponse.id, 'fileName': fileDetails.name});
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
