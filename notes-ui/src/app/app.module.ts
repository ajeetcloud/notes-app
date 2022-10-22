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
  ],
  imports: [
    MatSliderModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    [RouterModule.forRoot(appRoutes)],
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
