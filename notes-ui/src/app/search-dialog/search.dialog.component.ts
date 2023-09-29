import {Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {Subject, takeUntil} from "rxjs";
import {Note, NotesPageResponse, SortBy} from "../types/types";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NotesService} from "../service/notes.service";


@Component({
  selector: 'search-dialog',
  templateUrl: './search.dialog.component.html',
  styleUrls: ['./search.dialog.component.css'],
})
export class SearchDialogComponent implements OnInit, OnDestroy {

  searchQuery: string = '';
  notes: Note[] = [];

  private destroyed = new Subject<void>();

  constructor(private dialogRef: MatDialogRef<SearchDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string,
              private noteService: NotesService,) {
  }

  ngOnInit(): void {
    this.searchQuery = this.data;
    if (this.searchQuery.trim()) {
      this.search();
    }
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
