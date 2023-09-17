import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NotesPageResponse} from "../types/types";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {

  notes: NotesPageResponse;

  constructor() {
  }

  ngOnInit(): void {
  }


  updateNotes(notes: NotesPageResponse) {
    this.notes = notes;
    console.log("Inside home");
    console.log(this.notes);
  }


  ngAfterViewInit(): void {
  }


}
