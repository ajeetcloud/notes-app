import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {CLIENT_ID, G_DRIVE_SCOPE} from "../common/constants";

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
    
  }

  getOAuth2Code() {
    return this.oAuth2Code;
  }

  setOAuth2Code(oAuth2Code: string) {
    this.oAuth2Code = oAuth2Code;
  }
}
