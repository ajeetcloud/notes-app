import {Component, OnInit} from "@angular/core";
import {NewNote, Note} from "../types/types";
import {NotesService} from "../service/notes.service";


@Component({
  selector: 'create-note',
  templateUrl: './create.note.component.html',
  styleUrls: ['./create.note.component.css'],
})
export class CreateNoteComponent implements OnInit {

  note = '';

  constructor(private notesService: NotesService) {
  }

  ngOnInit(): void {
  }

  saveNote() {
    const newNote: NewNote = {
      notebookId: 101,
      note: this.note
    }
    this.notesService.saveNote(newNote)
      .subscribe((note: Note) => {
        if (note.noteId) {
          this.notesService.setNoteSubject(note);
          this.note = '';
        }
      });
  }
}


