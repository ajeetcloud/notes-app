import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subject} from "rxjs";
import {Note} from "../types/types";


@Component({
  selector: 'search-dialog',
  templateUrl: './search.dialog.component.html',
  styleUrls: ['./search.dialog.component.css'],
})
export class SearchDialogComponent implements OnInit, OnDestroy {

  notes: Note[] = [];

  private destroyed = new Subject<void>();

  constructor() {

  }

  ngOnInit(): void {
    this.notes.push({note: 'Hello1'});
    this.notes.push({note: 'Hello2'});
    this.notes.push({note: 'Hello3'});
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
