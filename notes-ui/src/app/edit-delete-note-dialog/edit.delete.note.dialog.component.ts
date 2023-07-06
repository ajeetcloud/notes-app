import {Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Subject, takeUntil} from "rxjs";
import {NotesService} from "../service/notes.service";
import {Note, NoteDialogData} from "../types/types";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: 'edit-delete-note-dialog',
  templateUrl: './edit.delete.note.dialog.component.html',
  styleUrls: ['./edit.delete.note.dialog.component.css'],
})
export class EditDeleteNoteDialogComponent implements OnInit, OnDestroy {

  private destroyed = new Subject<void>();
  note: Note = {};

  constructor(private dialogRef: MatDialogRef<EditDeleteNoteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: NoteDialogData,
              private notesService: NotesService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    // @ts-ignore
    console.log(this.data.note.note);
    this.note = this.data.note || {};
  }

  deleteNote(noteId?: number) {
    if (noteId) {
      this.notesService.deleteNote(noteId)
        .pipe(takeUntil(this.destroyed))
        .subscribe(() => {
          this.dialogRef.close();
          this.snackBar.open("Note deleted", "ok", {duration: 2000});
        })
    }
  }


  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

}
