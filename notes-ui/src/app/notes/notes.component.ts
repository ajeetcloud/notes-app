import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Note} from "../types/types";
import {NgScrollbar} from "ngx-scrollbar";
import {NotesService} from "../service/notes.service";

@Component({
  selector: 'notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
})
export class NotesComponent implements OnInit, AfterViewInit {

  @ViewChild(NgScrollbar) scrollable: NgScrollbar;
  searchValue: string = '';
  notes: Note[] = [];

  ngOnInit(): void {
    this.populateNotes();
    this.onCreateNote();
  }

  ngAfterViewInit(): void {
    this.scrollable.scrollTo({bottom: 0, duration: 0});
  }

  constructor(private notesService: NotesService) {
  }

  populateNotes() {
    this.notesService.getNotes()
      .subscribe((notes: Note[]) => {
        this.notes = notes;
      });
  }

  onCreateNote() {
    this.notesService.getNoteSubject().subscribe((note: Note) => {
      this.notes.push(note);
    });
  }

  reachedTop() {
    console.log("reached top of scroll");
    this.notes = [...this.getMorenotes1(), ...this.notes];
  }

  onScroll(event: any) {
    if (event.target.scrollTop == 0) {
      console.log("top reached");
      this.sleep(2000);
      this.notes = [...this.getMorenotes1(), ...this.notes];
    }
  }

  sleep(milliseconds: number) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  getMorenotes1(): Note[] {
    return [
      {noteId: 1016, note: '1016'},
      {noteId: 1017, note: '1017'},
      {noteId: 1018, note: '1018'},
      {noteId: 1019, note: '1019'},
      {noteId: 1020, note: '1020'},
      {noteId: 1021, note: '1021'},
      {noteId: 1022, note: '1022'},
      {noteId: 1023, note: '1023'},
      {noteId: 1024, note: '1024'},
      {noteId: 1025, note: '1025'},
      {noteId: 1026, note: '1026'},
      {noteId: 1027, note: '1027'},
      {noteId: 1028, note: '1028'},
      {noteId: 1029, note: '1029'},
      {noteId: 1030, note: '1030'},
      {noteId: 1031, note: '1031'},
      {noteId: 1032, note: '1032'},
      {noteId: 1033, note: '1033'},
      {noteId: 1034, note: '1034'},
      {noteId: 1035, note: '1035'},
      {noteId: 1036, note: '1036'},
      {noteId: 1037, note: '1037'},
      {noteId: 1038, note: '1038'},
      {noteId: 1039, note: '1039'},
      {noteId: 1040, note: '1040'},
      {noteId: 1041, note: '1041'},
      {noteId: 1042, note: '1042'},
      {noteId: 1043, note: '1043'},
      {noteId: 1044, note: '1044'},
      {noteId: 1045, note: '1045'},
      {noteId: 1046, note: '1046'},
    ];
  }

}
