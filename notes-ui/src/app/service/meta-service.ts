import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  constructor(private http: HttpClient) {
  }

  getMetadata(url: string): Observable<any> {
    return this.http.get(url, { responseType: 'text' });
  }
}
