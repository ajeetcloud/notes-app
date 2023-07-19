import {Component, OnDestroy, OnInit} from "@angular/core";
import {DriveService} from "../service/drive-service";

@Component({
  selector: 'file-upload',
  templateUrl: './file.upload.component.html',
  styleUrls: ['./file.upload.component.css'],
})
export class FileUploadComponent implements OnInit, OnDestroy {

  accessToken = '';
  refreshToken = '';

  // Todo: add supporting html for attachment
  constructor(private driveService: DriveService) {
    this.accessToken = this.driveService.getAccessToken();
  }

  ngOnInit(): void {
  }

  selectFile(event: Event) {

  }

  uploadFiles() {
    // TODO: move subscribe to here & create a new component for this
    if (!this.refreshToken) {
      this.driveService.authorize();
    } else {
      this.driveService.refreshAccessToken();
    }
  }

  ngOnDestroy(): void {
  }
}
