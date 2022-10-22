import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css'],
})
export class ChannelComponent implements OnInit {

  searchValue: string = '';

  ngOnInit(): void {
  }

  constructor() {
  }

}
