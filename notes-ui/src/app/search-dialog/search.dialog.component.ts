import {Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {Subject} from "rxjs";
import {Note} from "../types/types";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";


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
              @Inject(MAT_DIALOG_DATA) public data: string) {
  }

  ngOnInit(): void {
    this.searchQuery = this.data;
    this.notes.push({note: 'Hello1'});
    this.notes.push({note: 'Hello2'});
    this.notes.push({note: 'Hello3'});
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
