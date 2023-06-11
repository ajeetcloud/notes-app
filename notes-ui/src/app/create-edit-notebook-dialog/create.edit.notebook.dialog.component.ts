import {AfterViewInit, Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {NotebookDialogData, NotebookDialogType} from "../types/types";

@Component({
  selector: 'create-edit-notebook-dialog',
  templateUrl: './create.edit.notebook.dialog.component.html',
  styleUrls: ['./create.edit.notebook.dialog.component.css'],
})
export class CreateEditNotebookDialogComponent implements OnInit, AfterViewInit {

  createNotebookDialog = NotebookDialogType.CREATE;
  editNotebookDialog = NotebookDialogType.EDIT;

  constructor(@Inject(MAT_DIALOG_DATA) public data: NotebookDialogData) {
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
  }

}
