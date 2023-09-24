import { BrowserModule, Title } from '@angular/platform-browser';
import { Injectable, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';
import { DatePipe, registerLocaleData } from '@angular/common';
import { StikersComponent } from './stikers/stikers.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { RouterModule } from '@angular/router';
import { HttpClientModule  } from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';


@NgModule({
  declarations: [
    AppComponent,
    StikersComponent
  ],
  imports: [
    MatProgressSpinnerModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    BrowserModule,    
    RouterModule,
    NgxBarcodeModule,
    RouterModule.forRoot([]),
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
    , DatePipe
    , NgbActiveModal
  ],
  bootstrap: [AppComponent],
  exports: [
    MatBadgeModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AppModule { }
