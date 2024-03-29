import {Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ActionType, Notebook, NotebookDialogData} from "../types/types";
import {NotebookService} from "../service/notebook.service";
import {Subject, takeUntil} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoginService} from "../service/login.service";

@Component({
  selector: 'create-edit-delete-notebook-dialog',
  templateUrl: './create.edit.delete.notebook.dialog.component.html',
  styleUrls: ['./create.edit.delete.notebook.dialog.component.css'],
})
export class CreateEditDeleteNotebookDialogComponent implements OnInit, OnDestroy {

  actionLabel = '';
  notebookName = '';
  notebookId: number;

  private destroyed = new Subject<void>();

  constructor(private dialogRef: MatDialogRef<CreateEditDeleteNotebookDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: NotebookDialogData,
              private notebookService: NotebookService,
              private loginService: LoginService,
              private snackBar: MatSnackBar) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.actionLabel = this.data.notebookDialogType.toString() || '';
    this.notebookName = this.data.notebook?.notebookName || '';
  }

  cancel() {
    this.dialogRef.close();
  }

  createEditNotebook() {
    if (this.actionLabel === ActionType.CREATE) {
      const notebook: Notebook = {
        userId: this.loginService.getUserId(),
        notebookName: this.notebookName,
      }
      this.notebookService.createNotebook(notebook)
        .pipe(takeUntil(this.destroyed))
        .subscribe((res: Notebook) => {
          this.dialogRef.close(res);
          this.snackBar.open(res.notebookName + " created", 'ok');
        });

    } else if (this.actionLabel === ActionType.EDIT) {
      if (this.data.notebook) {
        this.data.notebook.notebookName = this.notebookName;
        this.notebookService.updateNotebook(this.data.notebook)
          .pipe(takeUntil(this.destroyed))
          .subscribe((res: Notebook) => {
            this.dialogRef.close(res);
            this.snackBar.open(res.notebookName + " updated", 'ok');
          });
      }
    } else {
      if (this.data.notebook) {
        const notebook: Notebook = this.data.notebook;
        this.notebookService.deleteNotebook(notebook.notebookId || 0)
          .pipe(takeUntil(this.destroyed))
          .subscribe(() => {
            this.dialogRef.close(notebook);
            this.snackBar.open(notebook.notebookName + " deleted", 'ok');
          });
      }

    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

}
