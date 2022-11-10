import {AfterViewInit, Component, OnInit} from '@angular/core';
import {note} from "../types/message";

@Component({
  selector: 'notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
})
export class NotesComponent implements OnInit, AfterViewInit {

  searchValue: string = '';
  notes: note[] = [];

  ngOnInit(): void {
    this.notes = this.getMoreMessages();
  }

  ngAfterViewInit(): void {
    const lastNoteElement = document.getElementById("1015") || null;
    if (lastNoteElement) {
      lastNoteElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });
    }
  }

  constructor() {
  }

  onScroll(event: any) {
    if (event.target.scrollTop == 0) {
      console.log("top reached");
      this.sleep(2000);
      this.notes = [...this.getMoreMessages1(), ...this.notes];
    }
  }

  sleep(milliseconds: number) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  getMoreMessages1(): note[] {
    return [
      {messageId: 1016, message: '1016'},
      {messageId: 1017, message: '1017'},
      {messageId: 1018, message: '1018'},
      {messageId: 1019, message: '1019'},
      {messageId: 1020, message: '1020'},
      {messageId: 1021, message: '1021'},
      {messageId: 1022, message: '1022'},
      {messageId: 1023, message: '1023'},
      {messageId: 1024, message: '1024'},
      {messageId: 1025, message: '1025'},
      {messageId: 1026, message: '1026'},
      {messageId: 1027, message: '1027'},
      {messageId: 1028, message: '1028'},
      {messageId: 1029, message: '1029'},
      {messageId: 1030, message: '1030'},
      {messageId: 1031, message: '1031'},
      {messageId: 1032, message: '1032'},
      {messageId: 1033, message: '1033'},
      {messageId: 1034, message: '1034'},
      {messageId: 1035, message: '1035'},
      {messageId: 1036, message: '1036'},
      {messageId: 1037, message: '1037'},
      {messageId: 1038, message: '1038'},
      {messageId: 1039, message: '1039'},
      {messageId: 1040, message: '1040'},
      {messageId: 1041, message: '1041'},
      {messageId: 1042, message: '1042'},
      {messageId: 1043, message: '1043'},
      {messageId: 1044, message: '1044'},
      {messageId: 1045, message: '1045'},
      {messageId: 1046, message: '1046'},
    ];
  }

  getMoreMessages(): note[] {
    return [
      {messageId: 1001, message: 'hello'},
      {messageId: 1002, message: 'hi'},
      {messageId: 1003, message: 'new'},
      {messageId: 1004, message: 'message'},
      {messageId: 1005, message: 'lets'},
      {messageId: 1006, message: 'add'},
      {messageId: 1007, message: 'more'},
      {messageId: 1008, message: 'message'},
      {messageId: 1009, message: 'lets'},
      {messageId: 1010, message: 'see'},
      {messageId: 1011, message: 'what'},
      {messageId: 1012, message: 'happens'},
      {messageId: 1013, message: 'now'},
      {messageId: 1014, message: 'that'},
      {messageId: 1015, message: 'rendering'},
    ];
  }

}
