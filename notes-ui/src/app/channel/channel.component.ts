import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {Note, Notebook, NotebookDialogType, NotesResponse} from "../types/types";
import {NotebookService} from "../service/notebook.service";

import {CreateEditNotebookDialogComponent} from "../create-edit-notebook-dialog/create.edit.notebook.dialog.component";
import {MatDialog} from "@angular/material/dialog";

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

  constructor(private notebookService: NotebookService, private dialog: MatDialog) {
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
    if (notebookId) {
      this.notebookService.setSelectedNotebookId(notebookId);
      if (this.notebookService.getNotesMap().has(notebookId)) {
        console.log("reusing");
        this.notesResponse = this.notebookService.getNotesMap().get(notebookId)!;
        this.newItemEvent.emit(this.notesResponse);
      } else {
        // TODO: when scroll up, update the next page token there
        this.notebookService.getNotes(notebookId, 1)
          .pipe(takeUntil(this.destroyed))
          .subscribe((res: NotesResponse) => {
            console.log("Notes Response", res);
            this.notesResponse = res;
            this.notebookService.getNotesMap().set(notebookId, this.notesResponse);
            this.newItemEvent.emit(this.notesResponse);
          });
      }
    }
  }

  addNotebook() {
    const dialogRef = this.dialog.open(CreateEditNotebookDialogComponent, {
      width: '500px',
      height: '500px',
      data: {notebookDialogType: NotebookDialogType.CREATE, notebookName: 'hello'}
    });
    console.log("add notebook");
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
