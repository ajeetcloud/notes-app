import {AfterViewInit, Component, NgZone, OnInit} from '@angular/core';
import {NotesResponse} from "../types/types";
import {GapiService} from "../service/gapi-service";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {

  notes: NotesResponse;

  constructor(private gapiService: GapiService, private zone: NgZone) {
  }

  ngOnInit(): void {
  }


  updateNotes(notes: NotesResponse) {
    this.notes = notes;
    console.log("Inside home");
    console.log(this.notes);
  }


  ngAfterViewInit(): void {
  }


}
