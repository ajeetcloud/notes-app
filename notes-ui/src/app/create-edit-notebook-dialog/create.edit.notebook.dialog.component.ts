import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Notebook, NotebookDialogData, NotebookDialogType} from "../types/types";
import {NotebookService} from "../service/notebook.service";
import {Subject, takeUntil} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'create-edit-notebook-dialog',
  templateUrl: './create.edit.notebook.dialog.component.html',
  styleUrls: ['./create.edit.notebook.dialog.component.css'],
})
export class CreateEditNotebookDialogComponent implements OnInit {

  actionLabel = '';
  notebookName = '';
  notebookId: number;

  private destroyed = new Subject<void>();

  constructor(public dialogRef: MatDialogRef<CreateEditNotebookDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: NotebookDialogData, private notebookService: NotebookService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.actionLabel = this.data.notebookDialogType.toString() || '';
    this.notebookName = this.data.notebook?.notebookName || '';
  }

  createEditNotebook() {
    debugger;
    if (this.actionLabel === NotebookDialogType.CREATE) {
      const notebook: Notebook = {
        notebookName: this.notebookName,
      }
      this.notebookService.createNotebook(notebook)
        .pipe(takeUntil(this.destroyed))
        .subscribe((res: Notebook) => {
          this.dialogRef.close(res);
          this.snackBar.open(res.notebookName + " created", 'ok');
        });

    } else if (this.actionLabel === NotebookDialogType.EDIT) {
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
            this.dialogRef.close();
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
