import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import {NgModule}  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {LoginComponent} from '../login/login.component';
import {ChadsComponent} from '../chads/chads.component';
import {HearingComponent} from '../hearing/hearing.component';
import {SurgeryComponent} from '../surgery/surgery.component';
import {MrbaotComponent} from '../mrbaot/mrbaot.component';
import {EshbozComponent} from '../eshboz/eshboz.component';
import {DimotComponent} from '../dimot/dimot.component';
import { LaborComponent } from '../labor/labor.component';
import {CoronaformComponent} from '../coronaform/coronaform.component';
import {PoriadepartsComponent} from '../poriadeparts/poriadeparts.component';
import {RolesComponent} from '../roles/roles.component';
import {StaffComponent} from '../staff/staff.component';
import {SendsmsComponent} from '../sendsms/sendsms.component';
import {SendsmsadminComponent} from '../sendsmsadmin/sendsmsadmin.component';
import {CoronaresultformComponent} from '../coronaresultform/coronaresultform.component';
import {GlucoseComponent} from '../glucose/glucose.component';
import {MershamComponent} from '../mersham/mersham.component';
import {DrugsComponent} from '../drugs/drugs.component';
import {CortinasComponent} from '../cortinas/cortinas.component';
import {CortinasdepartsComponent} from '../cortinasdeparts/cortinasdeparts.component';
import {CortinasnotificationComponent} from '../cortinasnotification/cortinasnotification.component';
import { ColonoscopyComponent } from '../colonoscopy/colonoscopy.component';
import { CoronavaccineComponent } from '../coronavaccine/coronavaccine.component';
import { Covid19reportComponent } from '../covid19report/covid19report.component';
import { ConsultationsComponent } from "../consultations/consultations.component";
import { ResearchesusersComponent } from "../researchesusers/researchesusers.component";
import { ResearchespatientsComponent } from "../researchespatients/researchespatients.component";
import { ResearchesComponent } from "../researches/researches.component";
import { FastCovid19TestComponent } from "../fast-covid19-test/fast-covid19-test.component";
import { Sarscov2Component } from "../sarscov2/sarscov2.component";
import { AddpatientcoronaformComponent } from "../addpatientcoronaform/addpatientcoronaform.component";
import { SarsresultsComponent } from "../sarsresults/sarsresults.component";
import { MaternityComponent } from "../maternity/maternity.component";
import { MaternitypatientsComponent } from "../maternitypatients/maternitypatients.component";
import { EmergencycallgroupsComponent } from "../emergencycallgroups/emergencycallgroups.component";
import { EmergencymembersComponent } from "../emergencymembers/emergencymembers.component";
import { EmployeesComponent } from "../employees/employees.component";
import { FastCovidTestDashboardComponent } from "../fast-covid-test-dashboard/fast-covid-test-dashboard.component";
import { FillSurveyComponent } from "../fill-survey/fill-survey.component";
import { FormDashboardComponent } from '../form-dashboard/form-dashboard.component';
import { UpdateformComponent } from '../updateform/updateform.component';
import { UpdatesingleformComponent } from '../updatesingleform/updatesingleform.component';
import { FormsansweredComponent } from '../formsanswered/formsanswered.component';
import { EventsscheduleComponent } from '../eventsschedule/eventsschedule.component';
import { EmailmanagementComponent } from '../emailmanagement/emailmanagement.component';
import { EmailsdashboardComponent } from '../emailsdashboard/emailsdashboard.component';
import { CaseinvoisesComponent } from '../caseinvoises/caseinvoises.component';
import { NursesDashboardComponent } from '../nurses-dashboard/nurses-dashboard.component';
import { FillReportComponent } from '../fill-report/fill-report.component';
import { ManageClinicPriceComponent } from '../manage-clinic-price/manage-clinic-price.component';
import { NursesManageDashboardComponent } from '../nurses-manage-dashboard/nurses-manage-dashboard.component';
import { NursesDepartmentManageComponent } from '../nurses-department-manage/nurses-department-manage.component';
import { ScannersComponent } from "../scanners/scanners.component";
import { ClinicsDashboardComponent } from '../clinics-dashboard/clinics-dashboard.component';
import { CheckpatientinsmartclosetComponent } from '../checkpatientinsmartcloset/checkpatientinsmartcloset.component';
import { DrugsnicComponent } from '../drugsnic/drugsnic.component';
import { CasenumbersComponent } from "../casenumbers/casenumbers.component";
import { PublicInquiriesChartsComponent } from "../emailsdashboard/public-inquiries-charts/public-inquiries-charts.component";
import { VisitorsMonitoringComponent } from "../visitors-monitoring/visitors-monitoring.component";
import { VisitorsRegistrationComponent } from "../visitors-monitoring/visitors-registration/visitors-registration.component";
import { UrgentSurgeriesComponent } from "../urgent-surgeries/urgent-surgeries.component";
import { OnlineAppointmentsComponent } from "../online-appointments/online-appointments.component";
import { CardiologyCalendarComponent } from "../cardiology-calendar/cardiology-calendar.component";
import { AddupdateactionComponent } from "../cardiology-calendar/addupdateaction/addupdateaction.component";
import { MotherChildeLinkComponent } from "../mother-childe-link/mother-childe-link.component";
import { DevManageComponent } from "../dev-manage/dev-manage.component";
import { SystemManageComponent } from "../nurses-manage-dashboard/system-manage/system-manage.component";
import { GalitPointsReportComponent } from "../galit-points-report/galit-points-report.component";
import { NmrIframeComponent } from '../nmr-iframe/nmr-iframe.component';
import { EmployeesManageDashComponent } from '../employees-manage-dash/employees-manage-dash.component';
import { EmployeesAddUpdateComponent } from '../employees-manage-dash/employees-add-update/employees-add-update.component';
import { OrdersToAppointmentsComponent } from '../orders-to-appointments/orders-to-appointments.component';
import { NursesReinforcementComponent } from '../nurses-manage-dashboard/nurses-reinforcement/nurses-reinforcement.component';
import { HospitalBIDashboardComponent } from '../hospital-bi-dashboard/hospital-bi-dashboard.component';
import { InfectionDrugsComponent } from '../infection-drugs/infection-drugs.component';
import { InfectionReportComponent } from "../infection-report/infection-report.component";
import { MaternityParticipantsComponent } from "../maternity/maternity-participants/maternity-participants.component";
const routes: Routes = [
  
  { path: 'dashboard', component: DashboardComponent },
  { path: 'covid19report', component: Covid19reportComponent },
  { path: 'login', component: LoginComponent },
  { path: 'chads', component: ChadsComponent },
  { path: 'hearing', component: HearingComponent },
  { path: 'surgery', component: SurgeryComponent },
  { path: 'mrbaot', component: MrbaotComponent },
  { path: 'eshboz', component: EshbozComponent },
  { path: 'dimot', component: DimotComponent },
  { path: 'labor', component: LaborComponent },
  { path: 'coronaform', component: CoronaformComponent },
  { path: 'poriadeparts', component: PoriadepartsComponent },
  { path: 'roles', component: RolesComponent },
  { path: 'staff', component: StaffComponent },
  { path: 'sendsms', component: SendsmsComponent },
  { path: 'sendsmsadmin', component: SendsmsadminComponent },
  { path: 'coronaresultform', component: CoronaresultformComponent },
  { path: 'glucose', component: GlucoseComponent },
  { path: 'mersham', component: MershamComponent },
  { path: 'drugs', component: DrugsComponent },
  { path: 'cortinas', component: CortinasComponent },
  { path: 'cortinasdeparts', component: CortinasdepartsComponent },
  { path: 'cortinasnotification', component: CortinasnotificationComponent },
  { path: 'colonoscopy', component: ColonoscopyComponent },
  { path: "coronavaccine", component: CoronavaccineComponent },
  { path: "consultations", component: ConsultationsComponent },
  { path: "researchesusers", component: ResearchesusersComponent },
  { path: "researchespatients", component: ResearchespatientsComponent },
  { path: "researches", component: ResearchesComponent },
  { path: "caseinvoises", component: CaseinvoisesComponent },
  { path: "sarscov2", component: Sarscov2Component },
  { path: "addpatientcoronaform", component: AddpatientcoronaformComponent },
  { path: "sarsresults", component: SarsresultsComponent },
  { path: "maternity", component: MaternityComponent },
  { path: "maternitypatients", component: MaternitypatientsComponent },
  { path: "emergencycallgroups", component: EmergencycallgroupsComponent },
  { path: "emergencymembers", component: EmergencymembersComponent },
  { path: "employees", component: EmployeesComponent },
  { path: "fillsurvey/:id", component: FillSurveyComponent },
  { path: "formdashboard", component: FormDashboardComponent },
  { path: "digitalforms", component: UpdateformComponent },
  { path: "eventsschedule", component: EventsscheduleComponent },
  { path: "createorupdateform/:id", component: UpdatesingleformComponent },
  { path: "formsanswered/:id", component: FormsansweredComponent },
  { path: "emailsdashboard", component: EmailsdashboardComponent },
  { path: "emailmanagement", component: EmailmanagementComponent },
  { path: "nursereportsystem", component: NursesDashboardComponent },
  { path: "fillreport", component: FillReportComponent },
  { path: "clinicspricing", component: ClinicsDashboardComponent },
  { path: "checkpatientinsmartcloset", component: CheckpatientinsmartclosetComponent },
  { path: "drugsnic", component: DrugsnicComponent },
  { path: "manageclinicprice", component: ManageClinicPriceComponent },
  { path: "nursesmanagedashboard", component: NursesManageDashboardComponent },
  { path: "nursesdepartmentmanage", component: NursesDepartmentManageComponent },
  { path: "checkpatientinsmartcloset", component: CheckpatientinsmartclosetComponent },
  { path: "drugsnic", component: DrugsnicComponent },
  { path: "scanners", component: ScannersComponent },
  { path: "clinicspricing", component: ClinicsDashboardComponent },
  { path: "casenumbers", component: CasenumbersComponent },
  { path: "publicinquiriescharts", component: PublicInquiriesChartsComponent },
  { path: "visitorsmonitoring", component: VisitorsMonitoringComponent },
  { path: "visitorsregistration", component: VisitorsRegistrationComponent },
  { path: "fastcovid19test", component: FastCovid19TestComponent },
  { path: "fastcovidtestdashboard", component: FastCovidTestDashboardComponent },
  { path: "urgentsurgeries", component: UrgentSurgeriesComponent },
  { path: "onlineappointments", component: OnlineAppointmentsComponent },
  { path: "cardiologycalendar", component: CardiologyCalendarComponent },
  { path: "addupdateaction", component: AddupdateactionComponent },
  { path: "motherchildelink", component: MotherChildeLinkComponent },
  { path: "devmanage", component: DevManageComponent },
  { path: "systemmanage", component: SystemManageComponent },
  { path: "galitpointsreport", component: GalitPointsReportComponent },
  { path: "nmriframe", component: NmrIframeComponent },  
  { path: "employeesmanagedashboard", component: EmployeesManageDashComponent },  
  { path: "employeesaddupdate", component: EmployeesAddUpdateComponent },  
  { path: "orderstoappointments", component: OrdersToAppointmentsComponent },
  { path: "reinforcement", component: NursesReinforcementComponent },
  { path: "BIDashboard", component: HospitalBIDashboardComponent },
  { path: "InfectionDrugs", component: InfectionDrugsComponent },
  { path: "InfectionReport", component: InfectionReportComponent },
  { path: "MaternityParticipants", component: MaternityParticipantsComponent },
  { path: '', component : LoginComponent}
];
 
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
  ],
  exports: [
    //ConfirmationDialogComponent,
    RouterModule
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  declarations: [
    //ConfirmationDialogComponent
  ]
})
export class AppRoutingModule { }