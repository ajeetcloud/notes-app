import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Notebook, NotesResponse} from "../types/types";
import {NOTEBOOK_API_ENDPOINT, PAGE_SIZE} from "../common/constants";

@Injectable({
  providedIn: 'root'
})
export class NotebookService {

  private selectedNotebookId: number;
  private notesMap = new Map<number, NotesResponse>();

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

  getNotes(notebookId: number, pageNumber: number): Observable<NotesResponse> {
    return this.http.get<NotesResponse>(`${NOTEBOOK_API_ENDPOINT}${notebookId}/notes?pageNo=${pageNumber}&pageSize=${PAGE_SIZE}`);
  }

  getNotesMap(): Map<number, NotesResponse> {
    return this.notesMap;
  }

  setNotesMap(notesMap: Map<number, NotesResponse>) {
    this.notesMap = notesMap;
  }
}
