import {Component, OnDestroy, OnInit} from '@angular/core';
import {NotesService} from "../service/notes.service";
import {NotesPageResponse, SortBy} from "../types/types";
import {Subject, takeUntil} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {SearchDialogComponent} from "../search-dialog/search.dialog.component";

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

  constructor(private noteService: NotesService, private dialog: MatDialog) {
  }

  search() {

    this.dialog.open(SearchDialogComponent, {
      height: '100%',
      width: '90%',
      data: this.searchQuery
    });

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
