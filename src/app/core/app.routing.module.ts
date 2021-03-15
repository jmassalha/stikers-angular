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

import { Sarscov2Component } from "../sarscov2/sarscov2.component";
import { AddpatientcoronaformComponent } from "../addpatientcoronaform/addpatientcoronaform.component";
import { SarsresultsComponent } from "../sarsresults/sarsresults.component";
import { MaternityComponent } from "../maternity/maternity.component";
import { MaternitypatientsComponent } from "../maternitypatients/maternitypatients.component";
import { EmergencycallgroupsComponent } from "../emergencycallgroups/emergencycallgroups.component";
import { EmergencymembersComponent } from "../emergencymembers/emergencymembers.component";
import { EmployeesComponent } from "../employees/employees.component";

import { FillSurveyComponent } from "../fill-survey/fill-survey.component";
import { FormDashboardComponent } from '../form-dashboard/form-dashboard.component';
import { UpdateformComponent } from '../updateform/updateform.component';
import { UpdatesingleformComponent } from '../updatesingleform/updatesingleform.component';
import { FormsansweredComponent } from '../formsanswered/formsanswered.component';
import { EmailsdashboardComponent } from '../emailsdashboard/emailsdashboard.component';
import { EmailmanagementComponent } from '../emailmanagement/emailmanagement.component';
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
  { path: "createorupdateform/:id", component: UpdatesingleformComponent },
  { path: "formsanswered/:id", component: FormsansweredComponent },

  { path: "emailsdashboard", component: EmailsdashboardComponent },
  { path: "emailmanagement", component: EmailmanagementComponent },
  { path: '', component : LoginComponent}
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  declarations: []
})
export class AppRoutingModule { }