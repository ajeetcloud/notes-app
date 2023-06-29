import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {ActionType, Note, Notebook, NotesResponse} from "../types/types";
import {NotebookService} from "../service/notebook.service";

import {
  CreateEditDeleteNotebookDialogComponent
} from "../create-edit--delete-notebook-dialog/create.edit.delete.notebook.dialog.component";
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
  selectedNotebookId: number;
  @Output() newItemEvent = new EventEmitter<NotesResponse>();
  private destroyed = new Subject<void>();

  ngOnInit(): void {
    this.getNotebooks();
    this.selectedNotebookId = this.notebookService.getSelectedNotebookId();
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
    if (notebookId) {
      this.notebookService.setSelectedNotebookId(notebookId);
      this.selectedNotebookId = notebookId;
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
    const dialogRef = this.dialog.open(CreateEditDeleteNotebookDialogComponent, {
      width: '500px',
      data: {notebookDialogType: ActionType.CREATE}
    });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroyed))
      .subscribe((notebook: Notebook) => {
        if (notebook && notebook.notebookId) {
          this.notebooks.push(notebook);
        }
      })
  }

  editNotebook(notebookId: number, notebookName: string, event: MouseEvent) {
    const notebookIndex = this.notebooks.findIndex(notebook => notebook.notebookId === notebookId);
    const notebook = {...this.notebooks[notebookIndex]};
    const dialogRef = this.dialog.open(CreateEditDeleteNotebookDialogComponent, {
      width: '500px',
      data: {notebookDialogType: ActionType.EDIT, notebook}
    });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroyed))
      .subscribe((notebook: Notebook) => {
        if (notebook && notebook.notebookId) {
          this.notebooks[notebookIndex] = notebook;
        }
      })
    event.stopPropagation();
  }

  deleteNotebook(notebookId: number, event: MouseEvent) {
    const notebookIndex = this.notebooks.findIndex(notebook => notebook.notebookId === notebookId);
    const notebook = {...this.notebooks[notebookIndex]};
    const dialogRef = this.dialog.open(CreateEditDeleteNotebookDialogComponent, {
      width: '500px',
      data: {notebookDialogType: ActionType.DELETE, notebook}
    });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroyed))
      .subscribe((notebook: Notebook) => {
        if (notebook && notebook.notebookId) {
          this.notebooks.splice(notebookIndex, 1);
          this.notebookService.getNotesMap().delete(notebook.notebookId);
        }
      })

    event.stopPropagation();
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
