import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {NotebookDialogData, NotebookDialogType} from "../types/types";

@Component({
  selector: 'create-edit-notebook-dialog',
  templateUrl: './create.edit.notebook.dialog.component.html',
  styleUrls: ['./create.edit.notebook.dialog.component.css'],
})
export class CreateEditNotebookDialogComponent implements OnInit {

  actionLabel = NotebookDialogType.CREATE;
  notebookName = '';
  notebookId: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: NotebookDialogData) {
  }

  ngOnInit(): void {
    if (this.data.notebookDialogType === NotebookDialogType.EDIT) {
      this.actionLabel = NotebookDialogType.EDIT;
      this.notebookId = this.data.notebookId || 0;
      this.notebookName = this.data.notebookName || '';
    }
  }

}
