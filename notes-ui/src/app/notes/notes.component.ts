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
import {Note, NotesResponse} from "../types/types";
import {NotesService} from "../service/notes.service";
import {Subject, takeUntil} from "rxjs";
import {ViewportScroller} from "@angular/common";
import {Router} from "@angular/router";
import {NgScrollbar} from "ngx-scrollbar";
import {NotebookService} from "../service/notebook.service";

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

      setTimeout(this.focusOnTheLastNote, 200);
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

  constructor(private notesService: NotesService, private notebookService: NotebookService, private renderer: Renderer2, private scroller: ViewportScroller, private router: Router
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
          notesResponse.notes = this.notes;
          notesResponse.pageSize = res.pageSize;
          this.isNextPageLoading = false;
        });
    }
  }

  onCreateNote() {
    this.notesService.getNoteSubject().subscribe((note: Note) => {
      this.notes.push(note);
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
