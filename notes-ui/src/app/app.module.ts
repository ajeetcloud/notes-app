import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {MatSliderModule} from '@angular/material/slider';
import {RouterModule, Routes} from '@angular/router';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from '@angular/material/input';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HomeComponent} from "./home/home.component";
import {SearchComponent} from "./search/search.component";
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {ChannelComponent} from "./channel/channel.component";
import {NotesComponent} from "./notes/notes.component";
import {NgScrollbarModule} from "ngx-scrollbar";
import {NgScrollbarReachedModule} from "ngx-scrollbar/reached-event";
import {MatDividerModule} from "@angular/material/divider";
import {CreateNoteComponent} from "./create-note/create.note.component";
import {MatCardModule} from "@angular/material/card";

const appRoutes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
];


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    ChannelComponent,
    NotesComponent,
    CreateNoteComponent,
  ],
  imports: [
    MatSliderModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatDividerModule,
    BrowserModule,
    FormsModule,
    NgScrollbarModule,
    BrowserAnimationsModule,
    [RouterModule.forRoot(appRoutes)],
    NgScrollbarReachedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
