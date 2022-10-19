import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSliderModule } from '@angular/material/slider';
import {RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HomeComponent} from "./home/home.component";

const appRoutes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
];


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    MatSliderModule,
    BrowserModule,
    BrowserAnimationsModule,
    [RouterModule.forRoot(appRoutes)],
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
