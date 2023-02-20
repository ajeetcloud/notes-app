import {Component, OnInit} from '@angular/core';
import {NotesResponse} from "../types/types";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  notes: NotesResponse;

  ngOnInit(): void {
  }

  updateNotes(notes: NotesResponse) {
    this.notes = notes;
    console.log("Inside home");
    console.log(this.notes);
  }

  constructor() {
  }

}
