import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {Notebook} from "../types/types";
import {NotebookService} from "../service/notebook.service";

@Component({
  selector: 'channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css'],
})
export class ChannelComponent implements OnInit, OnDestroy {

  searchValue: string = '';
  notebooks: Notebook[] = [];

  private destroyed = new Subject<void>();

  ngOnInit(): void {
    this.getNotebooks();
  }

  constructor(private notebookService: NotebookService) {
  }

  getNotebooks() {
    this.notebookService.getNotebooks()
      .pipe(takeUntil(this.destroyed))
      .subscribe((notebooks: Notebook[]) => {
        this.notebooks = notebooks;
        console.log(this.notebooks);
      });
  }

  addNotebook() {
    console.log("add notebook");
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
