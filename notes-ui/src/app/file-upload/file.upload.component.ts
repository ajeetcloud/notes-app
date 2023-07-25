import {Component, OnDestroy, OnInit} from "@angular/core";
import {DriveService} from "../service/drive-service";
import {CLIENT_ID, G_DRIVE_SCOPE} from "../common/constants";

@Component({
  selector: 'file-upload',
  templateUrl: './file.upload.component.html',
  styleUrls: ['./file.upload.component.css'],
})
export class FileUploadComponent implements OnInit, OnDestroy {

  accessToken = '';
  refreshToken = '';

  constructor(private driveService: DriveService) {
  }

  ngOnInit(): void {
    this.accessToken = this.driveService.getAccessToken();
    this.refreshToken = this.driveService.getRefreshToken();
  }

  selectFile(event: Event) {
    console.log(event);
  }

  uploadFiles() {
    // TODO: move subscribe to here & create a new component for this, add here
    if (!this.refreshToken) {
      this.authorize();
    } else {
      this.driveService.refreshAccessToken();
    }
  }

  authorize() {
    // @ts-ignore
    const client = google.accounts.oauth2.initCodeClient({
      client_id: CLIENT_ID,
      scope: G_DRIVE_SCOPE,
      ux_mode: 'popup',
      callback: (response: any) => {
        /*  this.setOAuth2Code(response.code);
          this.retrieveAccessToken();*/
      },
    });
    client.requestCode();
  }


  ngOnDestroy(): void {
  }
}
