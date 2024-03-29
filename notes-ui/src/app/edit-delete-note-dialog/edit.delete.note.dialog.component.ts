import {Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Subject, takeUntil} from "rxjs";
import {NotesService} from "../service/notes.service";
import {ActionType, Note, NoteDialogData} from "../types/types";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DriveService} from "../service/drive-service";


@Component({
  selector: 'edit-delete-note-dialog',
  templateUrl: './edit.delete.note.dialog.component.html',
  styleUrls: ['./edit.delete.note.dialog.component.css'],
})
export class EditDeleteNoteDialogComponent implements OnInit, OnDestroy {

  private destroyed = new Subject<void>();
  note: Note = {};
  actionLabel = '';
  noteContent = '';

  constructor(private dialogRef: MatDialogRef<EditDeleteNoteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: NoteDialogData,
              private notesService: NotesService,
              private driveService: DriveService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.actionLabel = this.data.notebookDialogType.toString() || '';
    this.note = this.data.note || {};
    if (this.note) {
      this.noteContent = this.note.note || '';
    }
  }

  updateOrDeleteNote() {
    if (this.actionLabel === ActionType.EDIT) {
      this.editNote();
    } else if (this.actionLabel === ActionType.DELETE) {
      this.deleteNote(this.note.noteId);
    }
  }

  editNote() {
    this.note.note = this.noteContent;
    this.notesService.updateNote(this.note)
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this.dialogRef.close(this.note.noteId);
        this.snackBar.open("Note updated", "ok", {duration: 2000});
      });
  }

  deleteNote(noteId?: number) {
    if (noteId) {
      this.notesService.deleteNote(noteId)
        .pipe(takeUntil(this.destroyed))
        .subscribe(() => {
          this.dialogRef.close(noteId);
          this.snackBar.open("Note deleted", "ok", {duration: 2000});
        });
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

}
