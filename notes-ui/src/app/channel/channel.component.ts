import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {Note, Notebook, NotesResponse} from "../types/types";
import {NotebookService} from "../service/notebook.service";

@Component({
  selector: 'channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css'],
})
export class ChannelComponent implements OnInit, OnDestroy {

  searchValue: string = '';
  notebooks: Notebook[] = [];
  notesResponse: NotesResponse;
  notes: Note[] = [];
  @Output() newItemEvent = new EventEmitter<NotesResponse>();
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

  getNotes(notebookId?: number) {
    console.log(notebookId);
    this.notebookService.getNotes(notebookId || 0)
      .pipe(takeUntil(this.destroyed))
      .subscribe((res: NotesResponse) => {
        this.notesResponse = res;
        this.newItemEvent.emit(this.notesResponse);
        /*this.notes = [...notes];
        this.newItemEvent.emit(notes);*/
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
