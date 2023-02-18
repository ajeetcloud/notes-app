import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Note, Notebook} from "../types/types";
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

  getNotes(notebookId: number): Observable<Note[]> {
    return this.http.get<Note[]>(`${NOTEBOOK_API_ENDPOINT}${notebookId}/notes?pageNo=1&pageSize=20`);
  }

}
