import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from "@angular/core";
import {NewNote, Note} from "../types/types";
import {NotesService} from "../service/notes.service";
import {Subject, takeUntil} from "rxjs";


@Component({
  selector: 'create-note',
  templateUrl: './create.note.component.html',
  styleUrls: ['./create.note.component.css'],
})
export class CreateNoteComponent implements OnInit, OnDestroy {

  note = '';
  private destroyed = new Subject<void>();
  @ViewChild('pRef', {static: false}) pRef: ElementRef;

  constructor(private notesService: NotesService, private renderer: Renderer2) {
  }

  ngOnInit(): void {
  }

  saveNote() {
    const newNote: NewNote = {
      notebookId: 101,
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

  setHeight() {
    console.log(this.pRef.nativeElement.scrollHeight);
    this.renderer.setStyle(this.pRef.nativeElement, 'height', `${this.pRef.nativeElement.scrollHeight}px`);
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}


