import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Note} from "../types/types";
import {NOTES_API_ENDPOINT} from "../common/constants";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private http: HttpClient) { }

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(NOTES_API_ENDPOINT);
  }
}
