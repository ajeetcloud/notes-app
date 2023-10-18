import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {ActionType, Note, Notebook, NotesPageResponse} from "../types/types";
import {NotebookService} from "../service/notebook.service";

import {
  CreateEditDeleteNotebookDialogComponent
} from "../create-edit-delete-notebook-dialog/create.edit.delete.notebook.dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {FILE_DOWNLOAD_LINK, FILE_VIEW_LINK} from "../common/constants";
import {LoginService} from "../service/login.service";

@Component({
  selector: 'channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css'],
})
export class ChannelComponent implements OnInit, OnDestroy {

  searchValue: string = '';
  notebooks: Notebook[] = [];
  notesResponse: NotesPageResponse;
  notes: Note[] = [];
  selectedNotebookId: number;
  @Output() newItemEvent = new EventEmitter<NotesPageResponse>();
  private destroyed = new Subject<void>();

  ngOnInit(): void {
    this.getNotebooks();
    this.selectedNotebookId = this.notebookService.getSelectedNotebookId();
  }

  constructor(private notebookService: NotebookService, private dialog: MatDialog, private loginService: LoginService) {
  }

  getNotebooks() {
    this.notebookService.getNotebooks()
      .pipe(takeUntil(this.destroyed))
      .subscribe((notebooks: Notebook[]) => {
        this.notebooks = notebooks;
        this.populateNotebookIdToNotebookNameMap();
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
        this.notebookService.getNotes(notebookId, 0)
          .pipe(takeUntil(this.destroyed))
          .subscribe((res: NotesPageResponse) => {
            console.log("Notes Response in channel component", res);
            res.content.reverse();
            this.notesResponse = res;
            this.setFileMetadata();
            this.notebookService.getNotesMap().set(notebookId, this.notesResponse);
            this.newItemEvent.emit(this.notesResponse);
          });
      }
    }
  }

  /**
   * Sets the metadata for each file in the notesResponse.
   */
  setFileMetadata() {
    for (const note of this.notesResponse.content) {
      if (note.files) {
        for (const file of note.files) {
          file.viewLink = FILE_VIEW_LINK + file.driveId;
          file.downloadLink = FILE_DOWNLOAD_LINK(file.driveId);
        }
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

  logout() {
    const jwtToken = this.loginService.getJwtToken();
    console.log("token in logout", jwtToken);
    this.loginService.signout(jwtToken)
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        //TODO: do cleanup of token and redirect to login page
        console.log("logged out");
      })
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

  populateNotebookIdToNotebookNameMap() {
    const notebookIdToNotebookNameMap = this.notebookService.getNotebookIdToNotebookNameMap();
    this.notebooks
      .filter(notebook => notebook.notebookId != null)
      .forEach(notebook => notebookIdToNotebookNameMap.set(notebook.notebookId as number, notebook.notebookName));
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
