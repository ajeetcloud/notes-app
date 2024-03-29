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
import {ActionType, MediaFile, Note, NotesPageResponse} from "../types/types";
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
import {FileService} from "../service/file.service";
import {DriveService} from "../service/drive-service";

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

  selectedNotebookId: number;
  searchValue: string = '';
  @Input() notes: Note[] = [];
  @Input() notes1: NotesPageResponse;
  private destroyed = new Subject<void>();
  @ViewChild('scrollable') scrollable: NgScrollbar;


  ngOnInit(): void {
    this.selectedNotebookId = this.notebookService.getSelectedNotebookId();
    if (this.notes1 && this.notes1.content) {
      this.notes = this.notes1.content;
    }
    this.onCreateNote();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.selectedNotebookId = this.notebookService.getSelectedNotebookId();
    console.log("changes", changes); // here you will get the data from parent once the input param is change
    // TODO: Fix 1st load data
    if (changes && changes['notes1'] && changes['notes1'].currentValue.content) {
      this.notes = changes['notes1'].currentValue.content;
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
              private fileService: FileService,
              private renderer: Renderer2,
              private scroller: ViewportScroller,
              private router: Router,
              private dialog: MatDialog,
              private clipboard: Clipboard,
              public datepipe: DatePipe,
              private driveService: DriveService,
              private snackBar: MatSnackBar,
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
    if (notesResponse && !notesResponse.last) {
      console.log("GETTING NEXT PAGE");
      this.notebookService.getNotes(this.notebookService.getSelectedNotebookId(), notesResponse.pageable.pageNumber + 1)
        .pipe(takeUntil(this.destroyed))
        .subscribe((res: NotesPageResponse) => {
          console.log("Notes Response scrolled", res);
          for (const note of res.content) {
            this.notes.unshift(note);
          }
          notesResponse.content = this.notes;
          notesResponse.pageable.pageSize = res.pageable.pageSize;
          notesResponse.pageable.pageNumber = res.pageable.pageNumber;
          notesResponse.last = res.last;
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

  /**
   * Deletes a file from the note's list of files and from the server.
   *
   * @param {Note} note - The note object.
   * @param {MediaFile} file - The file object to be deleted.
   */
  deleteFile(note: Note, file: MediaFile) {
    if (file.fileId) {
      this.fileService.deleteFile(file.fileId)
        .pipe(takeUntil(this.destroyed))
        .subscribe(() => {
          this.deleteFileFromDrive(file.driveId);
          if (note.files) {
            const fileIndex = note.files.findIndex(mediaFile => mediaFile.fileId === file.fileId);
            note.files.splice(fileIndex, 1);
            this.snackBar.open(`${file.fileName} deleted successfully.`, 'ok');
          }
        }, error => {
          this.snackBar.open(error.error.message, 'Ok');
        });
    }

  }

  deleteFileFromDrive(driveId: string) {
    this.driveService.deleteFile(driveId)
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
      }, error => {
        this.snackBar.open(error.message, 'Ok');
      });
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
