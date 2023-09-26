import {Component, OnDestroy, OnInit} from '@angular/core';
import {NotesService} from "../service/notes.service";
import {NotesPageResponse, SortBy} from "../types/types";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit, OnDestroy {

  searchQuery: string = '';

  private destroyed = new Subject<void>();

  ngOnInit(): void {
  }

  constructor(private noteService: NotesService) {
  }

  search() {
    this.noteService.searchNotes(this.searchQuery, 0, SortBy.RELEVANCE.toUpperCase())
      .pipe(takeUntil(this.destroyed))
      .subscribe((res: NotesPageResponse) => {
        console.log("Search Response", res);
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
