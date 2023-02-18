import {Component, OnInit} from '@angular/core';
import {Note} from "../types/types";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  notes: Note[] = [];

  ngOnInit(): void {
  }

  updateNotes(notes: Note[]) {
    this.notes = notes;
  }

  constructor() {
  }

}
