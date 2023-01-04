import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Notebook} from "../types/types";
import {NOTEBOOK_API_ENDPOINT} from "../common/constants";

@Injectable({
  providedIn: 'root'
})
export class NotebookService {

  constructor(private http: HttpClient) {
  }

  getNotebooks(): Observable<Notebook[]> {
    return this.http.get<Notebook[]>(NOTEBOOK_API_ENDPOINT);
  }

}
