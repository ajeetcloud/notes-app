import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";


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
}
