import {Component, OnDestroy, OnInit} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";
import {Subject} from "rxjs";


@Component({
  selector: 'edit-delete-note-dialog',
  templateUrl: './edit.delete.note.dialog.component.html',
  styleUrls: ['./edit.delete.note.dialog.component.css'],
})
export class EditDeleteNoteDialogComponent implements OnInit, OnDestroy {

  private destroyed = new Subject<void>();

  constructor(private dialogRef: MatDialogRef<EditDeleteNoteDialogComponent>) {
  }

  ngOnInit(): void {
  }


  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

}
