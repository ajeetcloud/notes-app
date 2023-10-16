import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NotesPageResponse} from "../types/types";
import {LoginService} from "../service/login.service";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {

  notes: NotesPageResponse;

  constructor(private loginService: LoginService) {
  }

  ngOnInit(): void {
    console.log("inside home, logged in user: " + this.loginService.getLoggedInUser());
    console.log("inside home, jwt in user: " + this.loginService.getJwtToken());
  }


  updateNotes(notes: NotesPageResponse) {
    this.notes = notes;
  }


  ngAfterViewInit(): void {
  }


}
