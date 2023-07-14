import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from "@angular/core";
import {NewNote, Note} from "../types/types";
import {NotesService} from "../service/notes.service";
import {Subject, takeUntil} from "rxjs";
import {NotebookService} from "../service/notebook.service";
import {DriveService} from "../service/drive-service";


@Component({
  selector: 'create-note',
  templateUrl: './create.note.component.html',
  styleUrls: ['./create.note.component.css'],
})
export class CreateNoteComponent implements OnInit, OnDestroy {

  note = '';
  accessToken = '';
  refreshToken = '';
  private destroyed = new Subject<void>();
  @ViewChild('pRef', {static: false}) pRef: ElementRef;

  constructor(private notesService: NotesService,
              private notebookService: NotebookService,
              private driveService: DriveService,
              private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.accessToken = this.driveService.getAccessToken();
  }

  saveNote() {
    const newNote: NewNote = {
      notebookId: this.notebookService.getSelectedNotebookId(),
      note: this.note
    }
    this.notesService.saveNote(newNote)
      .pipe(takeUntil(this.destroyed))
      .subscribe((note: Note) => {
        if (note.noteId) {
          this.notesService.setNoteSubject(note);
          this.note = '';
        }
      });
  }

  uploadFiles() {
    // TODO: move subscribe to here & create a new component for this
    if (!this.refreshToken) {
      this.driveService.authorize();
    } else {
      this.driveService.refreshAccessToken();
    }
  }

  selectFile(event: Event) {

  }

  setHeight() {
    console.log(this.pRef.nativeElement.scrollHeight);
    this.renderer.setStyle(this.pRef.nativeElement, 'height', `${this.pRef.nativeElement.scrollHeight}px`);
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}


