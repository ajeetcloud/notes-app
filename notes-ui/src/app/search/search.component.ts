import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
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

  constructor(private dialog: MatDialog) {
  }

  openSearchDialog() {
    if (this.searchQuery.trim()) {
      this.dialog.open(SearchDialogComponent, {
        height: '100%',
        width: '90%',
        data: this.searchQuery
      });
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
