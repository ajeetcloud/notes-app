import {Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {Subject, takeUntil} from "rxjs";
import {SearchResults, SortBy} from "../types/types";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NotesService} from "../service/notes.service";
import {PageEvent} from "@angular/material/paginator";
import {SEARCH_PAGE_SIZE} from "../common/constants";


@Component({
  selector: 'search-dialog',
  templateUrl: './search.dialog.component.html',
  styleUrls: ['./search.dialog.component.css'],
})
export class SearchDialogComponent implements OnInit, OnDestroy {

  searchQuery: string = '';
  searchResults: SearchResults;
  sortBy = SortBy.RELEVANCE.toUpperCase();
  sortByOptions: { value: string, displayValue: string }[] = [];
  pageNumber = 0;
  pageSize = SEARCH_PAGE_SIZE;

  private destroyed = new Subject<void>();

  constructor(private dialogRef: MatDialogRef<SearchDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string,
              private noteService: NotesService,) {
  }

  ngOnInit(): void {
    this.populateSortByOptions();
    this.searchQuery = this.data;
    this.search();
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.search();
  }

  populateSortByOptions() {
    for (const key of Object.keys(SortBy) as (keyof typeof SortBy)[]) {
      this.sortByOptions.push({value: key, displayValue: SortBy[key]});
    }
  }

  search() {
    console.log("change");
    if (this.searchQuery.trim()) {
      this.noteService.searchNotes(this.searchQuery, this.pageNumber, this.pageSize, this.sortBy)
        .pipe(takeUntil(this.destroyed))
        .subscribe((res: SearchResults) => {
          this.searchResults = res;
          console.log("Search Response", res);
        });
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
