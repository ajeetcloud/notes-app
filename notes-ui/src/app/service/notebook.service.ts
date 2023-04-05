import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Notebook, NotesResponse} from "../types/types";
import {NOTEBOOK_API_ENDPOINT} from "../common/constants";

@Injectable({
  providedIn: 'root'
})
export class NotebookService {

  private selectedNotebookId: number;

  constructor(private http: HttpClient) {
  }

  getSelectedNotebookId(): number {
    return this.selectedNotebookId;
  }

  setSelectedNotebookId(notebookId: number) {
    this.selectedNotebookId = notebookId;
  }

  getNotebooks(): Observable<Notebook[]> {
    return this.http.get<Notebook[]>(NOTEBOOK_API_ENDPOINT);
  }

  getNotes(notebookId: number): Observable<NotesResponse> {
    return this.http.get<NotesResponse>(`${NOTEBOOK_API_ENDPOINT}${notebookId}/notes?pageNo=1&pageSize=20`);
  }

}
