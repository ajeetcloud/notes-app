import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Notebook, NotesPageResponse} from "../types/types";
import {NOTEBOOK_API_ENDPOINT, NOTES_PAGE_SIZE} from "../common/constants";

@Injectable({
  providedIn: 'root'
})
export class NotebookService {

  private selectedNotebookId: number;
  private notesMap = new Map<number, NotesPageResponse>();

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

  getNotes(notebookId: number, pageNumber: number): Observable<NotesPageResponse> {
    return this.http.get<NotesPageResponse>(`${NOTEBOOK_API_ENDPOINT}${notebookId}/notes1?pageNo=${pageNumber}&pageSize=${NOTES_PAGE_SIZE}`);
  }

  createNotebook(notebook: Notebook): Observable<Notebook> {
    return this.http.post<Notebook>(NOTEBOOK_API_ENDPOINT, notebook);
  }

  updateNotebook(notebook: Notebook): Observable<Notebook> {
    return this.http.put<Notebook>(NOTEBOOK_API_ENDPOINT, notebook);
  }

  deleteNotebook(notebookId: number): Observable<void> {
    return this.http.delete<void>(NOTEBOOK_API_ENDPOINT + notebookId);
  }

  getNotesMap(): Map<number, NotesPageResponse> {
    return this.notesMap;
  }

  setNotesMap(notesMap: Map<number, NotesPageResponse>) {
    this.notesMap = notesMap;
  }
}
