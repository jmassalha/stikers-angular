import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { CustomMaterialModule } from './core/material.module';
import { AppRoutingModule } from './core/app.routing.module';
import { FormsModule, ReactiveFormsModule }  from '@angular/forms';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ChadsComponent } from './chads/chads.component';
import { DataTablesModule } from 'angular-datatables';
import { NgxPopper } from 'angular-popper';
import { MatRadioModule } from '@angular/material/radio';
import { ChartsModule } from 'ng2-charts';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { SurgeryComponent } from './surgery/surgery.component';
import { MrbaotComponent } from './mrbaot/mrbaot.component';
import { EshbozComponent } from './eshboz/eshboz.component';
import { DimotComponent } from './dimot/dimot.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { HearingComponent } from './hearing/hearing.component';
import { LaborComponent } from './labor/labor.component';
import { AgmCoreModule } from '@agm/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CoronaformComponent } from './coronaform/coronaform.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { PoriadepartsComponent } from './poriadeparts/poriadeparts.component';
import { RolesComponent } from './roles/roles.component';
import { StaffComponent } from './staff/staff.component';
import { SendsmsComponent } from './sendsms/sendsms.component';
import { CoronaresultformComponent } from './coronaresultform/coronaresultform.component';
import { GlucoseComponent } from './glucose/glucose.component';
import { MershamComponent } from './mersham/mersham.component';
import { DrugsComponent } from './drugs/drugs.component';
import { CortinasComponent } from './cortinas/cortinas.component';
import { CortinasdepartsComponent } from './cortinasdeparts/cortinasdeparts.component';
import { CortinasnotificationComponent } from './cortinasnotification/cortinasnotification.component';
import { ColonoscopyComponent } from './colonoscopy/colonoscopy.component';
import {  NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { MatMomentDateModule} from "@angular/material-moment-adapter";
import { GoogleChartsModule } from 'angular-google-charts';
import { SendsmsadminComponent } from './sendsmsadmin/sendsmsadmin.component';
import { CoronavaccineComponent } from './coronavaccine/coronavaccine.component';
import { Covid19reportComponent } from './covid19report/covid19report.component';
import { ConsultationsComponent } from './consultations/consultations.component';
import { ResearchesusersComponent } from './researchesusers/researchesusers.component';
import { ResearchesComponent } from './researches/researches.component';
import { ResearchespatientsComponent } from './researchespatients/researchespatients.component';
import { Sarscov2Component } from './sarscov2/sarscov2.component';
import { AddpatientcoronaformComponent } from './addpatientcoronaform/addpatientcoronaform.component';
import { SarsresultsComponent } from './sarsresults/sarsresults.component';
import { MaternityComponent } from './maternity/maternity.component';
import { MaternitypatientsComponent } from './maternitypatients/maternitypatients.component';
import { EmergencycallgroupsComponent } from './emergencycallgroups/emergencycallgroups.component';
import { EmergencymembersComponent } from './emergencymembers/emergencymembers.component';
import { EmployeesComponent } from './employees/employees.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FillSurveyComponent } from './fill-survey/fill-survey.component';
import { FormDashboardComponent } from './form-dashboard/form-dashboard.component';
import { UpdateformComponent } from './updateform/updateform.component';
import { UpdatesingleformComponent } from './updatesingleform/updatesingleform.component';
import { FormsansweredComponent } from './formsanswered/formsanswered.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { EventsscheduleComponent } from './eventsschedule/eventsschedule.component';
import { EmailsdashboardComponent } from './emailsdashboard/emailsdashboard.component';
import { EmailmanagementComponent } from './emailmanagement/emailmanagement.component';
import {DatePipe} from '@angular/common';
import { StatusComplaintComponent } from './status-complaint/status-complaint.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog/confirmation-dialog.service';



const maskConfig: Partial<IConfig> = {
  validation: false,
};
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    ChadsComponent,
    SurgeryComponent,
    MrbaotComponent,
    EshbozComponent,
    DimotComponent,
    InvoicesComponent,
    HearingComponent,
    LaborComponent,
    CoronaformComponent,
    PoriadepartsComponent,
    RolesComponent,
    StaffComponent,
    SendsmsComponent,
    CoronaresultformComponent,
    GlucoseComponent,
    MershamComponent,
    DrugsComponent,
    CortinasComponent,
    CortinasdepartsComponent,
    CortinasnotificationComponent,
    ColonoscopyComponent,
    SendsmsadminComponent,
    CoronavaccineComponent,
    Covid19reportComponent,
    ConsultationsComponent,
    ResearchesusersComponent,
    ResearchesComponent,
    ResearchespatientsComponent,

    Sarscov2Component,
    AddpatientcoronaformComponent,
    SarsresultsComponent,
    MaternityComponent,
    MaternitypatientsComponent,
    EmergencycallgroupsComponent,
    EmergencymembersComponent,
    EmployeesComponent,
    FillSurveyComponent,
    FormDashboardComponent,
    UpdateformComponent,
    UpdatesingleformComponent,
    FormsansweredComponent,
    EventsscheduleComponent,

    FormsansweredComponent,
    EmailsdashboardComponent,
    EmailmanagementComponent,
    StatusComplaintComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    GoogleChartsModule,
    NgxMatNativeDateModule,    
    MatMomentDateModule,
    NgxMaterialTimepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    MatBadgeModule,
    NgCircleProgressModule.forRoot({
      // // set defaults here
      // radius: 30,
      // outerStrokeWidth: 16,
      // innerStrokeWidth: 8,
      // outerStrokeColor: "#78C000d9",
      // innerStrokeColor: "#C7E596",
      // subtitleColor: "#C7E596",
      // unitsColor: "#C7E596",
      // titleColor: "#C7E596",
      // animationDuration: 300,
      // lazy : false
      
    }) ,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBMYu4gJHWl09_DEpL08qmrJXv6s-kCfiI'
    }),
    NgxMaskModule.forRoot(maskConfig),
    NgbModule,
    MatTabsModule,
    MatDialogModule,
    MatSelectModule,
    ChartsModule,
    MatDialogModule,
    BrowserModule,
    HttpClientModule,
    MatTooltipModule,
    DataTablesModule,
    ZXingScannerModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSortModule,
    
    MatTableModule,
    CustomMaterialModule,
    MatButtonModule,     
    MatDatepickerModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatInputModule,
    MatSnackBarModule,
    FormsModule,
    AppRoutingModule,
    NgxPopper,
    MatCheckboxModule,
    MatListModule,
    MatRadioModule,
    ReactiveFormsModule 
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },DatePipe
    
      ,ConfirmationDialogService
    , NgbActiveModal],
  bootstrap: [AppComponent]
})
export class AppModule { }