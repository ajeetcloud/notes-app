import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subject} from "rxjs";


@Component({
  selector: 'search-dialog',
  templateUrl: './search.dialog.component.html',
  styleUrls: ['./search.dialog.component.css'],
})
export class SearchDialogComponent implements OnInit, OnDestroy {

  private destroyed = new Subject<void>();

  constructor() {

  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
