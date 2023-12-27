import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from "@angular/core";
import {MediaFile, NewNote, Note} from "../types/types";
import {NotesService} from "../service/notes.service";
import {forkJoin, Subject, takeUntil} from "rxjs";
import {NotebookService} from "../service/notebook.service";
import {DriveService} from "../service/drive-service";
import {FILE_DOWNLOAD_LINK, FILE_VIEW_LINK, LINK_REGEX} from "../common/constants";
import {FileService} from "../service/file.service";
import {LoginService} from "../service/login.service";


@Component({
  selector: 'create-note',
  templateUrl: './create.note.component.html',
  styleUrls: ['./create.note.component.css'],
})
export class CreateNoteComponent implements OnInit, OnDestroy {

  note = '';
  private destroyed = new Subject<void>();
  @ViewChild('pRef', {static: false}) pRef: ElementRef;
  mediaFiles: MediaFile[] = [];

  constructor(private notesService: NotesService,
              private notebookService: NotebookService,
              private driveService: DriveService,
              private fileService: FileService,
              private loginService: LoginService,
              private renderer: Renderer2) {
  }

  ngOnInit(): void {
  }

  saveNote() {
    const newNote: NewNote = {
      userId: this.loginService.getUserId(),
      notebookId: this.notebookService.getSelectedNotebookId(),
      note: this.note,
      files: this.mediaFiles,
    }
    this.notesService.saveNote(newNote)
      .pipe(takeUntil(this.destroyed))
      .subscribe((note: Note) => {
        if (note.noteId) {
          this.setFileMetadata(note);
          this.notesService.setNoteSubject(note);
          this.note = '';
          this.mediaFiles = [];
        }
      });
  }

  setFileMetadata(note: Note) {
    if (note.files) {
      for (const file of note.files) {
        file.viewLink = FILE_VIEW_LINK + file.driveId;
        file.downloadLink = FILE_DOWNLOAD_LINK(file.driveId);
      }
    }
  }

  updateMediaFiles(mediaFile: MediaFile) {
    this.mediaFiles.push(mediaFile);
  }

  setHeight() {
    console.log(this.pRef.nativeElement.scrollHeight);
    this.renderer.setStyle(this.pRef.nativeElement, 'height', `${this.pRef.nativeElement.scrollHeight}px`);
  }

  onPaste(event: ClipboardEvent) {
    const items = event?.clipboardData?.items;
    let files: File[] = [];
    if (items) {
      // @ts-ignore
      for (const item of items) {
        if (item.getAsFile()) {
          files.push(item.getAsFile());
        }
      }
      if (files.length) {
        this.fileService.setFilesCopiedToClipboardSubject(files);
      }
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}


