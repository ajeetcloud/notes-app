import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ActionType, Note, NotesResponse} from "../types/types";
import {NotesService} from "../service/notes.service";
import {Subject, takeUntil} from "rxjs";
import {DatePipe, ViewportScroller} from "@angular/common";
import {Router} from "@angular/router";
import {NgScrollbar} from "ngx-scrollbar";
import {NotebookService} from "../service/notebook.service";
import {MatDialog} from "@angular/material/dialog";
import {EditDeleteNoteDialogComponent} from "../edit-delete-note-dialog/edit.delete.note.dialog.component";
import {Clipboard} from '@angular/cdk/clipboard';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
})
export class NotesComponent implements OnInit, OnDestroy, OnChanges {
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = "";
  modalOpen = false;
  counter = 0;
  isNextPageLoading = false;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  searchValue: string = '';
  @Input() notes: Note[] = [];
  @Input() notes1: NotesResponse;
  private destroyed = new Subject<void>();
  @ViewChild('scrollable') scrollable: NgScrollbar;


  ngOnInit(): void {
    if (this.notes1 && this.notes1.notes) {
      this.notes = this.notes1.notes;
    }
    this.onCreateNote();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("changes", changes); // here you will get the data from parent once the input param is change
    // TODO: Fix 1st load data
    if (changes && changes['notes1'] && changes['notes1'].currentValue.notes) {
      this.notes = changes['notes1'].currentValue.notes;
      setTimeout(this.focusOnTheLastNote, 0);
    }
  }

  focusOnTheLastNote = () => {
    const lastNote = this.notes[this.notes.length - 1];
    console.log(lastNote);
    const noteId = (lastNote?.noteId || "").toString();
    const lastNoteElement = document.getElementById(noteId);
    if (lastNoteElement) {
      lastNoteElement.scrollIntoView({
        behavior: "auto", // or smooth
        block: "start",
        inline: "nearest"
      });
    }
  }

  constructor(private notesService: NotesService,
              private notebookService: NotebookService,
              private renderer: Renderer2,
              private scroller: ViewportScroller,
              private router: Router,
              private dialog: MatDialog,
              private clipboard: Clipboard,
              public datepipe: DatePipe,
              private snackBar: MatSnackBar
  ) {
  }

  checkScroll(event: Event) {
    // @ts-ignore
    if (event.target['scrollTop'] < 200) {
      if (!this.isNextPageLoading) {
        this.getNextPage();
      }
    }
  }

  getNextPage() {
    this.isNextPageLoading = true;
    const notesResponse = this.notebookService.getNotesMap().get(this.notebookService.getSelectedNotebookId());
    if (notesResponse && notesResponse.nextPage != 0) {
      console.log("GETTING NEXT PAGE");
      this.notebookService.getNotes(this.notebookService.getSelectedNotebookId(), notesResponse.nextPage)
        .pipe(takeUntil(this.destroyed))
        .subscribe((res: NotesResponse) => {
          console.log("Notes Response scrolled", res);
          notesResponse.nextPage = res.nextPage;
          for (const note of res.notes.reverse()) {
            this.notes.unshift(note);
          }
          // Updating the map.
          notesResponse.notes = this.notes;
          notesResponse.pageSize = res.pageSize;
          this.isNextPageLoading = false;
        });
    }
  }

  isDividerVisible(index: number): boolean {
    if (index == 0) {
      return true;
    }
    const prevNote = this.notes[index - 1];
    const currentNote = this.notes[index];
    const prevNoteCreationDate = new Date(prevNote!.createdOn!).toDateString();
    const currentNoteCreationDate = new Date(currentNote!.createdOn!).toDateString();

    return prevNoteCreationDate !== currentNoteCreationDate;
  }

  getDateDisplayLabel(note: Note): string {
    const creationDate = new Date(note!.createdOn!);
    if (creationDate.toDateString() === new Date().toDateString()) {
      return 'Today';
    }
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (creationDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    // Note was created in current year.
    if (creationDate.getFullYear() === new Date().getFullYear()) {
      return this.datepipe.transform(creationDate, 'EEEE, MMMM d') || '';
    }
    // Note was created in previous years.
    return this.datepipe.transform(creationDate, 'MMMM d, y') || '';
  }

  editNote(note: Note) {
    const dialogRef = this.dialog.open(EditDeleteNoteDialogComponent, {
      width: '500px',
      data: {notebookDialogType: ActionType.EDIT, note}
    });
  }


  deleteNote(note: Note) {
    const dialogRef = this.dialog.open(EditDeleteNoteDialogComponent, {
      width: '500px',
      data: {notebookDialogType: ActionType.DELETE, note}
    });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroyed))
      .subscribe((noteId: number) => {
        if (noteId) {
          const noteIndex = this.notes.findIndex(note => note.noteId === noteId);
          this.notes.splice(noteIndex, 1);
        }
      })
  }

  copyToClipboard(note: Note) {
    this.clipboard.copy(note.note || '');
    this.snackBar.open("Note copied", 'ok');
  }

  onCreateNote() {
    this.notesService.getNoteSubject().subscribe((note: Note) => {
      this.notes.push(note);
      setTimeout(this.focusOnTheLastNote, 0);
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
