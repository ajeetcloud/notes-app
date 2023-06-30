import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NewNote, Note} from "../types/types";
import {NOTES_API_ENDPOINT} from "../common/constants";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  private createNoteSubject = new Subject<Note>();

  constructor(private http: HttpClient) {
  }

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(NOTES_API_ENDPOINT);
  }

  saveNote(note: NewNote): Observable<Note> {
    return this.http.post<Note>(NOTES_API_ENDPOINT, note);
  }

  deleteNote(noteId: number): Observable<void> {
    return this.http.delete<void>(NOTES_API_ENDPOINT + noteId);
  }

  getNoteSubject(): Subject<Note> {
    return this.createNoteSubject;
  }

  setNoteSubject(note: Note) {
    this.createNoteSubject.next(note);
  }
}
