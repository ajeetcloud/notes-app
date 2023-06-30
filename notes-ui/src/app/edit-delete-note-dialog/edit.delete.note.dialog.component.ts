import {Component, OnDestroy, OnInit} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";
import {Subject, takeUntil} from "rxjs";
import {NotesService} from "../service/notes.service";


@Component({
  selector: 'edit-delete-note-dialog',
  templateUrl: './edit.delete.note.dialog.component.html',
  styleUrls: ['./edit.delete.note.dialog.component.css'],
})
export class EditDeleteNoteDialogComponent implements OnInit, OnDestroy {

  private destroyed = new Subject<void>();

  constructor(private dialogRef: MatDialogRef<EditDeleteNoteDialogComponent>, private notesService: NotesService) {
  }

  ngOnInit(): void {
  }

  deleteNote(noteId: number) {
    this.notesService.deleteNote(noteId)
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this.dialogRef.close();
      })
  }


  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

}
