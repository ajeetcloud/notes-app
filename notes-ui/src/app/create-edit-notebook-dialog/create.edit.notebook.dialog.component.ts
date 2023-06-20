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

  actionLabel = NotebookDialogType.CREATE;
  notebookName = '';
  notebookId: number;

  private destroyed = new Subject<void>();

  constructor(public dialogRef: MatDialogRef<CreateEditNotebookDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: NotebookDialogData, private notebookService: NotebookService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.notebookName = this.data.notebookName || '';
    if (this.data.notebookDialogType === NotebookDialogType.EDIT) {
      this.actionLabel = NotebookDialogType.EDIT;
      this.notebookId = this.data.notebookId || 0;
    }
  }

  createEditNotebook() {
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

    } else {

    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

}
