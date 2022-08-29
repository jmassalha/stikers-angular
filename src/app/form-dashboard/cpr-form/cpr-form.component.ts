import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {
  MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import {
  MatDialog,
} from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { DatePipe } from "@angular/common";
import { ConfirmationDialogService } from "../../confirmation-dialog/confirmation-dialog.service";
import { DialogContentExampleDialog } from "../../fill-survey/fill-survey.component";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { Observable } from "rxjs";
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-cpr-form',
  templateUrl: './cpr-form.component.html',
  styleUrls: ['./cpr-form.component.css']
})
export class CprFormComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = "start";
  verticalPosition: MatSnackBarVerticalPosition = "bottom";
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @ViewChild('printmycontent') printmycontent: ElementRef;

  constructor(public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private confirmationDialogService: ConfirmationDialogService,
    private datePipe: DatePipe,
    private router: Router,
    private _sanitizer: DomSanitizer) {

  }

  FirstSection: FormGroup;
  SecondSection: FormGroup;
  ThirdSection: FormGroup;
  CaseNumber: string = "";
  searching: string = "notFound";
  buffering: boolean = false;
  PatientRecord: any;
  signDoc: any = "";
  signNurse: any = "";
  firstTablecolumns = Array(15).fill("שעה");
  firstTableArray: FormArray = this.formBuilder.array([]);
  actionsTableArray: FormArray = this.formBuilder.array([]);
  secondTablecolumns = Array(7).fill("שעה");
  thirdTableArray: FormArray = this.formBuilder.array([]);
  forthTableArray: FormArray = this.formBuilder.array([]);
  actions = [];
  deathFormShow: boolean;
  cprTeamShow: boolean;
  secondTableMeds = ['ADRENALINE', 'AMIODARONE', 'ATROPINE', '', '', ''];
  statusDropDown = ['VF', 'PEA', 'ASYSTOLE', 'VT', 'BRADY ARITMIA'];
  rateHeadDropdown = ['יש', 'אין'];
  myDate = new Date();
  CprFormsColumns: string[] = ['rowid', 'date', 'patientID', 'patientName', 'print', 'sign'];
  CprFormsList = [];
  CprFormsList_all = [];
  UserName = localStorage.getItem("loginUserName").toLowerCase();
  // usersToSend = ['adahabre@poria.health.gov.il', 'batzadok@poria.health.gov.il', 'saziv@poria.health.gov.il', 'KMassalha@poria.health.gov.il', 'EMansour@poria.health.gov.il', 'SBenDavid@poria.health.gov.il'];
  usersToSend = ['adahabre@poria.health.gov.il'];
  filteredOptions1: Observable<string[]>;
  docfilter = new FormControl();
  filteredOptions2: Observable<string[]>;
  nurfilter = new FormControl();
  employees = [];
  url = "http://srv-apps-prod/RCF_WS/WebService.asmx/";
  pdfToServer: string = `<!doctype html><html lang="he"><head><meta charset="utf-8"/><title>ניטור החייאה</title>
  <style>p,mat-label,li{font-weight: bold;font-size: 12px;}.col-2{width: 20%;justify-content: center;}td{border: 1px solid black}
  .container1{margin:2px; padding: 0px 5px 0px 0px; border-style: double;}th{font-size: 14px;}</style>
  </head><body dir="rtl">
  <div class="d-none-desktop" dir="rtl">
  <div class="card-header border-bottomIn rel" style="text-align: center;">
      <img class="full-width" style="width: 640px;" src="assets/images/covid_2_header.png" />
      <div class="centered" style="position: absolute;top: 6%;left: 50%;transform: translate(-50%, -50%);"> נספח
          לנוהל ניהול מערך החייאה במרכז הרפואי, מס' נוהל 1.2.21</div>
      <div class="centered" style="position: absolute;top: 8%;left: 50%;transform: translate(-50%, -50%);"> מזהה
          סער: 1000-1004-2018-0001454</div>
      <div class="centered" style="position: absolute;top: 10%;left: 50%;transform: translate(-50%, -50%);"> תאריך
          עדכון 03.21</div>
      <h2 class="text-center pos-abs-center"><u>ניטור החייאה</u></h2>
  </div>
  <div class="row" dir="rtl" style="display: flex;">
      <div class="col-2">
          <p>מספר מקרה: {{CprFormsList[0].PM_CASE_NUMBER}}</p>
      </div>
      <div class="col-2">
          <p>ת.ז: {{CprFormsList[0].PM_PATIENT_ID}}</p>
      </div>
      <div class="col-2">
          <p>שם מלא: {{CprFormsList[0].PM_FIRST_NAME}} {{CprFormsList[0].PM_LAST_NAME}}</p>
      </div>
      <div class="col-2">
          <p *ngIf="CprFormsList[0].PM_PATIENT_GENDER == '1'">מין: זכר</p>
          <p *ngIf="CprFormsList[0].PM_PATIENT_GENDER != '1'">מין: נקבה</p>
      </div>
      <div class="col-2">
          <p>גיל: {{CprFormsList[0].PM_DOB | number : '1.1-1'}}</p>
      </div>
  </div>

  <div class="container1 m-2" style="display: grid;" dir="rtl">
      <div class="header" style="float: right;">
          <p class="text-right"><b><u>א) נתונים לפני תחילת פעולות החייאה:</u></b></p>
      </div>
      <div class="row" style="float: right;">
          <div class="col-8" style="display: flex;margin: -10px 0px -10px 0px;">
              <div class="inside-col" style="display: flex;margin-left: 10px;">
                  <mat-label style="align-self: center;">תאריך החייאה:&nbsp; </mat-label>
                  <p style="margin: 0px;"><u>{{CprFormsList[0].cprDate}}</u></p>
              </div>
              <div class="inside-col" style="display: flex;margin-left: 10px;">
                  <mat-label style="align-self: center;">שעה:&nbsp; </mat-label>
                  <p style="margin: 0px;"><u>{{CprFormsList[0].cprTime}}</u></p>
              </div>
              <div class="inside-col" style="display: flex;margin-left: 10px;">
                  <mat-label style="align-self: center;">הופעל צוות החייאה:&nbsp; </mat-label>
                  <p style="margin: 0px;"><u>{{CprFormsList[0].cprTeamWork}}</u></p>
              </div>
              <div class="inside-col" style="display: flex;margin-left: 10px;">
                  <mat-label style="align-self: center;">בשעה:&nbsp; </mat-label>
                  <p style="margin: 0px;"><u>{{CprFormsList[0].cprTeamWorkTime}}</u></p>
              </div>

          </div>

      </div>
      <div class="header" style="float: right;" *ngIf="CprFormsList[0].cprTeamWork == 'כן'">
          <p class="text-right"><b>שם ושעת הגעת צוות החייאה:&nbsp;</b></p>
      </div>
      <div class="row" *ngIf="CprFormsList[0].cprTeamWork == 'כן'">
          <div class="col-10" style="display: flex;margin: -10px 0px -10px 0px;">
              <div class="inside-col" style="display: flex;margin-left: 10px;">
                  <mat-label style="align-self: center;">שם קרדיולוג:&nbsp; </mat-label>
                  <p style="margin: 0px;"><u>{{CprFormsList[0].cadriologName}}</u></p>
              </div>
              <div class="inside-col" style="display: flex;margin-left: 10px;">
                  <mat-label style="align-self: center;">שעת הגעה:&nbsp; </mat-label>
                  <p style="margin: 0px;"><u>{{CprFormsList[0].cardiologTime}}</u></p>
              </div>
              <div class="inside-col" style="display: flex;margin-left: 10px;">
                  <mat-label style="align-self: center;">שם מרדים:&nbsp; </mat-label>
                  <p style="margin: 0px;"><u>{{CprFormsList[0].mardimName}}</u></p>
              </div>
              <div class="inside-col" style="display: flex;margin-left: 10px;">
                  <mat-label style="align-self: center;">שעת הגעה:&nbsp; </mat-label>
                  <p style="margin: 0px;"><u>{{CprFormsList[0].mardimTime}}</u></p>
              </div>
              <div class="inside-col" style="display: flex;margin-left: 10px;">
                  <mat-label style="align-self: center;">שם א.כללית: &nbsp;</mat-label>
                  <p style="margin: 0px;"><u>{{CprFormsList[0].clalitName}}</u></p>
              </div>
              <div class="inside-col" style="display: flex;margin-left: 10px;">
                  <mat-label style="align-self: center;">שעת הגעה:&nbsp; </mat-label>
                  <p style="margin: 0px;"><u>{{CprFormsList[0].clalitTime}}</u></p>
              </div>
          </div>
      </div>
      <div class="row" style="float: right;">
          <div class="col-12">
              <div class="row">
                  <div class="col-6" style="float: right;width: 20%;">
                      <mat-label>מקום האירוע: &nbsp;</mat-label>
                      <p style="display: inline-flex;"><u>{{CprFormsList[0].cprPlace}}</u></p>
                  </div>
                  <div class="col-6" style="float: right;width: 80%;">
                      <mat-label><b>עדים לאירוע: &nbsp;</b></mat-label>
                      <ul style="display: inline-flex;">
                          <li style="margin-left: 26px;"
                              [ngStyle]="{'display': CprFormsList[0].cprWitness1 == 'True' ? 'block' : 'none' }">
                              צוות
                              רפואי</li>
                          <li style="margin-left: 26px;"
                              [ngStyle]="{'display': CprFormsList[0].cprWitness2 == 'True' ? 'block' : 'none' }">
                              צוות
                              סיעודי</li>
                          <li style="margin-left: 26px;"
                              [ngStyle]="{'display': CprFormsList[0].cprWitness3 == 'True' ? 'block' : 'none' }">
                              <span></span>מלווה /
                              משפחה
                          </li>
                      </ul>
                  </div>
              </div>

          </div>
      </div>
      <div class="row" style="float: right;margin: -20px 0px 0px 0px;">
          <div class="col-" style="width: 100%;">
              <mat-label><b>הסיבה להחייאה: &nbsp;</b></mat-label>
              <ul style="display: inline-flex;">
                  <li style="margin-left: 26px;"
                      [ngStyle]="{'display': CprFormsList[0].cprCause1 == 'True' ? 'block' : 'none' }">דום לב
                  </li>
                  <li style="margin-left: 26px;"
                      [ngStyle]="{'display': CprFormsList[0].cprCause2 == 'True' ? 'block' : 'none' }">דום
                      נשימה
                  </li>
                  <li style="margin-left: 26px;"
                      [ngStyle]="{'display': CprFormsList[0].cprCause3 == 'True' ? 'block' : 'none' }">אחר
                  </li>
              </ul>
          </div>
      </div>
      <div class="row" style="float: right;">
          <div class="col-12" style="display: flex;margin: -10px 0px 0px 0px;">
              <div class="inside-col4" style="display: flex;align-self: center;margin-left: 10px;">
                  <mat-label style="align-self: center;">מצב הכרה &nbsp;: מגיב: &nbsp;</mat-label>
                  <p style="margin: 0px;"><u>{{CprFormsList[0].replying}}</u></p>
              </div>
              <div class="inside-col4" style="display: flex;align-self: center;">
                  <mat-label style="align-self: center;">מצב נשימתי: &nbsp;</mat-label>
                  <p style="margin: 0px;"><u>{{CprFormsList[0].resporatoryStat}}</u></p>
              </div>
          </div>
      </div>
      <div class="row" style="float: right;">
          <div class="inside-col" style="display: flex;align-self: center;">
              <mat-label style="align-self: center;">אבחנות המטופל:&nbsp; </mat-label>
              <p style="margin: 0px;"><u>{{CprFormsList[0].patientDiagnosis}}</u></p>
          </div>
      </div>
  </div>


  <div class="container1 m-2" style="margin-top: 5px;display: grid;" dir="rtl">
      <div class="header">
          <p class="text-right" style="margin: 0px;"><b><u>ב) תהליך החייאה:</u></b></p>
      </div>
      <div class="row clearfix">
          <div class="col-md-12 column">
              <table id="firstTable" class="table table-bordered table-hover" style="width: 100%;">
                  <tbody>
                      <tr>
                          <td style="background-color: red;text-align: right;">קצב לב ראשוני
                              שזוהה
                          </td>
                          <td class="col-1 text-center" *ngFor="let col of firstTablecolumns; let i = index">
                              <mat-label style="align-self: center;">שעה:&nbsp;</mat-label>
                              <p style="margin: 0px;font-size: 9px;padding: 0px;">
                                  <b>{{CprFormsList[0].firstTableArray[i].subArray[0].timeHead}}</b>
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td>בד' דופק יש/אין</td>
                          <td class="col-1" *ngFor="let inp of firstTablecolumns; let i = index">
                              <p style="margin: 0px;font-size: 9px;padding: 0px;">
                                  <b>{{CprFormsList[0].firstTableArray[i].subArray[0].rateHead}}</b>
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td>הערכת קצב</td>
                          <td class="col-1" *ngFor="let inp of firstTablecolumns; let i = index"
                              style="text-align: right;">
                              <p style="margin: 0px;font-size: 5px;padding: 0px;"
                                  *ngIf="CprFormsList[0].firstTableArray[i].subArray[0].rateStatusHead == 'ASYSTOLE'">
                                  <b>ASYS</b>
                              </p>
                              <p style="margin: 0px;font-size: 9px;padding: 0px;"
                                  *ngIf="CprFormsList[0].firstTableArray[i].subArray[0].rateStatusHead != 'ASYSTOLE'">
                                  <b>{{CprFormsList[0].firstTableArray[i].subArray[0].rateStatusHead}}</b>
                              </p>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>
      <div class="row">
          <div class="col" style="width: 25%;float: right;">
              <div class="row clearfix" style="width: 100%;float: right;">
                  <div class="col-md-12 column">
                      <table class="table table-bordered table-hover" style="width: 100%;" id="tab_logic">
                          <thead>
                              <tr>
                                  <th class="text-center">
                                      פעולות
                                  </th>
                                  <th class="text-center">
                                      סטטוס
                                  </th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr class="text-center" *ngFor="let action of actions; let i = index">
                                  <td>
                                      <p>{{action.ActionList}}</p>
                                  </td>
                                  <td>
                                      <p>{{CprFormsList[0].actionsTableArray[i].actionctrl}}</p>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
          <div class="col" style="width: 75%;float: right;">
              <div class="row clearfix" style="width: 100%;float: right;">
                  <div class="col-md-12 column">
                      <table class="table table-bordered table-hover" style="width: 100%;" id="tab_logic">
                          <thead>
                              <tr>
                                  <th class="text-center">
                                      התרופה
                                  </th>
                                  <th class="text-center" *ngFor="let time of secondTablecolumns">
                                      {{time}}
                                  </th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr *ngFor="let action of CprFormsList[0].thirdTableArray; let i = index"
                                  class="text-center">
                                  <td>
                                      <p style="font-size: 7px;">{{action.subArray[0].title}}</p>
                                  </td>
                                  <td
                                      *ngFor="let time of CprFormsList[0].thirdTableArray[i].subArray; let j = index">
                                      <div class="row" style="display: flex;margin: 10px 0px 10px 0px;">
                                          <div class="col-6"
                                              style="width: 50%;margin: 0px;border-left: 1px solid black;text-align: center;">
                                              <p style="margin: 0px;font-size: 8px;">{{time.textMed}}</p>
                                          </div>
                                          <div class="col-6" style="width: 50%;margin: 0px;text-align: center;">
                                              <p style="margin: 0px;font-size: 8px;">{{time.timeMed}}</p>
                                          </div>
                                      </div>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </div>
              <div class="row clearfix" style="width: 100%;float: right;">
                  <div class="col-md-12 column">
                      <table class="table table-bordered table-hover" style="width: 100%;" id="tab_logic">
                          <tbody>
                              <tr class="text-center">
                                  <td>
                                      <p style="font-size: 7px;">שעת דפיברלציה/היפוך חשמלי</p>
                                  </td>
                                  <td class="text-center"
                                      *ngFor="let time of CprFormsList[0].forthTableArray[0].subArray; let i = index">
                                      <p style="margin: 0px;">{{time.timeMed}}</p>
                                  </td>
                              </tr>
                              <tr class="text-center">
                                  <td>
                                      <p style="font-size: 9px;">אנרגיה של מכת חשמל</p>
                                  </td>
                                  <td
                                      *ngFor="let text of CprFormsList[0].forthTableArray[0].subArray; let j = index">
                                      <p style="margin: 0px;">{{text.textMed}}</p>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      </div>



  </div>


  <div class="container1 m-2" style="margin-top: 5px;display: grid;" dir="rtl">
      <div class="header">
          <div class="row" style="width: 100%;">
              <div class="col-4" style="width: 30%;float: right;">
                  <p style="align-self: center;"><b>ג) סיום ההחייאה:&nbsp;</b></p>
              </div>
              <div class="col-8" style="width: 70%;float: right;">
                  <div class="inside-col3 mr-3" style="width: 40%;float: right;">
                      <p>שעת סיום ההחייאה: &nbsp;<u>{{CprFormsList[0].cprEndTime}}</u></p>
                  </div>
                  <div class="inside-col3" style="width: 25%;float: right;">
                      <p>קביעת מוות:&nbsp; <u>{{CprFormsList[0].cprDeath}}</u></p>
                  </div>
              </div>
          </div>
          <div class="row" *ngIf="CprFormsList[0].cprDeath == 'לא'">
              <div class="col-12">
                  <div class="row" style="width: 100%;">
                      <div class="col-4" style="width: 30%;float: right;margin-top: -20px;">
                          <p><b><u>סימנים חיוניים בתום החייאה&nbsp;</u></b>
                          </p>
                      </div>
                      <div class="col-8" style="width: 70%;float: right;margin-top: -20px;">
                          <div class="inside-col3" style="width: 40%;float: right;">
                              <p>נשימה עצמונית: &nbsp;<u>{{CprFormsList[0].resporatoryAlone}}</u></p>
                          </div>
                          <div class="inside-col3" style="width: 25%;float: right;">
                              <p>קצב לב:&nbsp; <u>{{CprFormsList[0].heartRate}}</u></p>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="col-12">
                  <div class="row" style="width: 100%;">
                      <div class="col-12">
                          <div class="inside-col" style="width: 25%;float: right;margin-top: -20px;">
                              <p>סטורציה:&nbsp; <u>{{CprFormsList[0].saturation}}</u></p>
                          </div>
                          <div class="inside-col" style="width: 25%;float: right;margin-top: -20px;">
                              <p><u>{{CprFormsList[0].carbonCo}}</u> &nbsp;:ETCO2</p>
                          </div>
                          <div class="inside-col" style="width: 25%;float: right;margin-top: -20px;">
                              <p>לחץ דם:&nbsp;<u>{{CprFormsList[0].bloodPressure}}</u></p>
                          </div>
                          <div class="inside-col" style="width: 25%;float: right;margin-top: -20px;">
                              <p>דופק:&nbsp;<u>{{CprFormsList[0].pulseStat}}</u></p>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="col-12">
                  <div class="row" style="width: 100%;">
                      <div class="col-6 text-right" style="width: 100%;float: right;margin-top: -20px;">
                          <p>מצב הכרה:&nbsp;<u>{{CprFormsList[0].cautiosStat}}</u></p>
                      </div>
                      <div class="col-6" style="width: 50%;float: right;margin-top: -20px;"></div>
                  </div>
              </div>
          </div>
          <div class="row" style="margin-top: 10%;">
              <div class="col-12">
                  <div class="row" style="width: 100%;">
                      <div class="col inside-col3"
                          style="width: 50%;float: right;display: inline-flex;margin-top: -20px;">
                          <div>
                              <p>שם וחתימת הרופא - מנהל החייאה:&nbsp;</p>
                              <u>{{CprFormsList[0].managingDoc}} - {{CprFormsList[0].managingDocLicence}}</u>
                          </div>
                          <img width="100" height="100" [src]="CprFormsList[0].managingDocSign">
                      </div>
                      <div class="col inside-col3"
                          style="width: 50%;float: right;display: inline-flex;margin-top: -20px;">
                          <div>
                              <p>שם וחתימת האחות שהשתתפה בהחייאה ו/או מופקדת על
                                  החולה: &nbsp;</p>
                              <u>{{CprFormsList[0].responsNurse}} - {{CprFormsList[0].managingDocLicence}}</u>
                          </div>
                          <img width="100" height="100" [src]="CprFormsList[0].responsNurseSign">
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>

  <div class="row" style="width: 100%;text-align: center;">
      <p class="last-paragraph text-center"><b>הטופס ימולא על-ידי הרופא מנהל ההחייאה והאחות שהשתתפה
              בהחייאה. &nbsp; מקור: לתיק
              המטופל
              &nbsp; העתק: למרכז ועדת החייאה.
              &nbsp; העתק: היחידה לבטיחות הטיפול.</b></p>
  </div>
</div></body></html>`;


  ngOnInit(): void {
    
    this.getCprActionsList();
    // for the first table hour/minutes row
    for (let i = 0; i < 1; i++) {
      this.firstTableArray.push(this.formBuilder.group({
        subArray: this.subArrayTest(this.firstTablecolumns.length, 'actions')
      }));
    }

    // second table of actions
    for (let i = 0; i < 9; i++) {
      this.actionsTableArray.push(this.formBuilder.group({
        id: new FormControl(i, null),
        actionctrl: new FormControl('', Validators.required)
      }));
    }

    // third table of medicine arrays
    for (let i = 0; i < 6; i++) {
      this.thirdTableArray.push(this.formBuilder.group({
        title: this.secondTableMeds[i],
        subArray: this.subArrayTest(this.secondTablecolumns.length, 'third')
      }));
    }

    // forth table of electricity arrays  -- NOTE (MAKE IT ONE ARRAY NOT TWO !!!!!!!!!)
    for (let i = 0; i < 1; i++) {
      this.forthTableArray.push(this.formBuilder.group({
        subArray: this.subArrayTest(this.secondTablecolumns.length, 'forth')
      }));
    }


    // this.getFormDetails();
    this.FirstSection = this.formBuilder.group({
      cprDate: new FormControl(this.myDate, Validators.required),
      cprTime: new FormControl('', Validators.required),
      cprTeamWork: new FormControl('', Validators.required),
      cprTeamWorkTime: new FormControl('', null),
      cadriologName: new FormControl('', Validators.required),
      cardiologTime: new FormControl('', Validators.required),
      mardimName: new FormControl('', Validators.required),
      mardimTime: new FormControl('', Validators.required),
      clalitName: new FormControl('', Validators.required),
      clalitTime: new FormControl('', Validators.required),
      cprPlace: new FormControl('', Validators.required),
      cprWitness1: new FormControl('', null),
      cprWitness2: new FormControl('', null),
      cprWitness3: new FormControl('', null),
      cprCause1: new FormControl('', null),
      cprCause2: new FormControl('', null),
      cprCause3: new FormControl('', null),
      replying: new FormControl('', Validators.required),
      resporatoryStat: new FormControl('', Validators.required),
      patientDiagnosis: new FormControl('', Validators.required),
    });

    this.SecondSection = this.formBuilder.group({
      firstTableArray: this.firstTableArray,
      // firstTableRateArray: this.firstTableRateArray,
      // firstTableRateStatusArray: this.firstTableRateStatusArray,
      actionsTableArray: this.actionsTableArray,
      thirdTableArray: this.thirdTableArray,
      forthTableArray: this.forthTableArray
    });

    this.ThirdSection = this.formBuilder.group({
      cprEndTime: new FormControl('', Validators.required),
      cprDeath: new FormControl('', Validators.required),
      resporatoryAlone: new FormControl('', Validators.required),
      heartRate: new FormControl('', Validators.required),
      saturation: new FormControl('', Validators.required),
      carbonCo: new FormControl('', Validators.required),
      bloodPressure: new FormControl('', Validators.required),
      pulseStat: new FormControl('', Validators.required),
      cautiosStat: new FormControl('', Validators.required),
      managingDoc: new FormControl('', Validators.required),
      managingDocSign: new FormControl('', null),
      managingDocLicence: new FormControl('', null),
      responsNurse: new FormControl('', Validators.required),
      responsNurseSign: new FormControl('', Validators.required),
      responsNurseLicence: new FormControl('', null),
    });

    this.filteredOptions1 = this.docfilter.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter1(value))
      );
    this.filteredOptions2 = this.nurfilter.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter2(value))
      );
  }

  private _filter1(value: string): string[] {
    const filterValue1 = value;
    let depart: any = this.employees.filter(t => t.firstname === filterValue1);
    let userToChange;
    if (depart.length > 0) {
      this.ThirdSection.controls['managingDoc'].setValue(depart[0].firstname);
      this.ThirdSection.controls['managingDocLicence'].setValue(depart[0].doc);
    }
    return this.employees.filter(option => option.firstname.includes(filterValue1));
  }

  private _filter2(value: string): string[] {
    const filterValue2 = value;
    let depart: any = this.employees.filter(t => t.firstname === filterValue2);
    let userToChange;
    if (depart.length > 0) {
      this.ThirdSection.controls['responsNurse'].setValue(depart[0].firstname);
      this.ThirdSection.controls['responsNurseLicence'].setValue(depart[0].doc);
    }
    return this.employees.filter(option => option.firstname.includes(filterValue2));
  }

  getEmployeesList() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetUsersForInquiries", {
      })
      .subscribe((Response) => {
        let all_users_filter = Response["d"];
        all_users_filter.forEach(element => {
          this.employees.push({
            firstname: element.firstname + " " + element.lastname,
            id: element.id,
            email: element.email,
            doc: element.DocLicence,
          });
        })
      });
  }

  openSnackBar(message) {
    this._snackBar.open(message, "X", {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  cprTeamTrue() {
    if (this.FirstSection.controls['cprTeamWork'].value == "כן") {
      this.cprTeamShow = true;
      this.FirstSection.controls['cprTeamWorkTime'].setValidators(Validators.required);
      this.FirstSection.controls['cadriologName'].setValidators(Validators.required);
      this.FirstSection.controls['cardiologTime'].setValidators(Validators.required);
      this.FirstSection.controls['mardimName'].setValidators(Validators.required);
      this.FirstSection.controls['mardimTime'].setValidators(Validators.required);
      this.FirstSection.controls['clalitName'].setValidators(Validators.required);
      this.FirstSection.controls['clalitTime'].setValidators(Validators.required);
    } else {
      this.cprTeamShow = false;
      this.FirstSection.controls['cprTeamWorkTime'].setValue('');
      this.FirstSection.controls['cadriologName'].setValue('');
      this.FirstSection.controls['cardiologTime'].setValue('');
      this.FirstSection.controls['mardimName'].setValue('');
      this.FirstSection.controls['mardimTime'].setValue('');
      this.FirstSection.controls['clalitName'].setValue('');
      this.FirstSection.controls['clalitTime'].setValue('');
      this.FirstSection.controls['cprTeamWorkTime'].setErrors(null);
      this.FirstSection.controls['cadriologName'].setErrors(null);
      this.FirstSection.controls['cardiologTime'].setErrors(null);
      this.FirstSection.controls['mardimName'].setErrors(null);
      this.FirstSection.controls['mardimTime'].setErrors(null);
      this.FirstSection.controls['clalitName'].setErrors(null);
      this.FirstSection.controls['clalitTime'].setErrors(null);
    }
  }

  // create sub arrays for the table arrays
  subArrayTest(number, tableName) {
    let t = this.formBuilder.array([]);
    let autoVal = '';
    if (tableName == 'forth') {
      autoVal = 'J 200'
    }
    if (number != 15) {
      for (let i = 0; i < number; i++) {
        t.push(this.formBuilder.group(
          {
            id: new FormControl(i, null),
            // title: new FormControl(this.secondTableMeds[place], null),
            textMed: new FormControl(autoVal, null),
            timeMed: new FormControl('', null)
          }
        ));
      }
    } else {
      for (let i = 0; i < number; i++) {
        t.push(this.formBuilder.group(
          {
            id: new FormControl(i, null),
            timeHead: new FormControl('', null),
            rateHead: new FormControl('', null),
            rateStatusHead: new FormControl('', null)
          }
        ));
      }
    }
    return t;
  }

  changeDeathForm() {
    if (this.ThirdSection.controls['cprDeath'].value == 'כן') {
      this.deathFormShow = false;
      this.ThirdSection.controls['resporatoryAlone'].setValue('');
      this.ThirdSection.controls['heartRate'].setValue('');
      this.ThirdSection.controls['saturation'].setValue('');
      this.ThirdSection.controls['carbonCo'].setValue('');
      this.ThirdSection.controls['bloodPressure'].setValue('');
      this.ThirdSection.controls['pulseStat'].setValue('');
      this.ThirdSection.controls['cautiosStat'].setValue('');
      this.ThirdSection.controls['resporatoryAlone'].setErrors(null);
      this.ThirdSection.controls['heartRate'].setErrors(null);
      this.ThirdSection.controls['saturation'].setErrors(null);
      this.ThirdSection.controls['carbonCo'].setErrors(null);
      this.ThirdSection.controls['bloodPressure'].setErrors(null);
      this.ThirdSection.controls['pulseStat'].setErrors(null);
      this.ThirdSection.controls['cautiosStat'].setErrors(null);
    } else {
      this.deathFormShow = true;
      this.ThirdSection.controls['resporatoryAlone'].setValidators(Validators.required);
      this.ThirdSection.controls['heartRate'].setValidators(Validators.required);
      this.ThirdSection.controls['saturation'].setValidators(Validators.required);
      this.ThirdSection.controls['carbonCo'].setValidators(Validators.required);
      this.ThirdSection.controls['bloodPressure'].setValidators(Validators.required);
      this.ThirdSection.controls['pulseStat'].setValidators(Validators.required);
      this.ThirdSection.controls['cautiosStat'].setValidators(Validators.required);
    }
  }

  getCprActionsList() {
    this.http
      .post(
        "http://srv-apps-prod/RCF_WS/WebService.asmx/GetCprActionsList",
        {}
      )
      .subscribe((Response) => {
        this.actions = Response["d"];
      });
  }

  // getPatientDetails() {
  //   this.buffering = true;
  //   this.http
  //     .post(
  //       "http://srv-apps-prod/RCF_WS/WebService.asmx/GetPatientDetailsByIDNumber", {
  //       _patientPassport: this.PatientPassport
  //     }
  //     )
  //     .subscribe((Response) => {
  //       this.PatientRecord = Response["d"];
  //       if (this.PatientRecord.PM_PATIENT_ID != null) {
  //         this.searching = "Found";
  //         this.getEmployeesList();
  //       } else {
  //         this.searching = "tryAgain";
  //       }
  //       this.buffering = false;
  //       this.PatientRecord.PM_DOB = this.calculateDiff(this.PatientRecord.PM_DOB) / 365;
  //       this.PatientRecord.PM_DOB = this.PatientRecord.PM_DOB.toFixed(1);
  //     });
  // }

  getPatientDetails() {
    this.buffering = true;
    this.http
      .post(
        "http://srv-apps-prod/RCF_WS/WebService.asmx/getPatientDetailsByCaseNumber", {
        _caseNumber: this.CaseNumber
      }
      )
      .subscribe((Response) => {
        this.PatientRecord = Response["d"];
        if (this.PatientRecord.PM_PATIENT_ID != null) {
          this.searching = "Found";
          this.getEmployeesList();
        } else {
          this.searching = "tryAgain";
        }
        this.buffering = false;
        this.PatientRecord.PM_DOB = this.calculateDiff(this.PatientRecord.PM_DOB) / 365;
        this.PatientRecord.PM_DOB = this.PatientRecord.PM_DOB.toFixed(1);
      });
  }

  calculateDiff(dateSent) {
    let currentDate = new Date();
    dateSent = new Date(dateSent);

    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));
  }

  LateDocSignature(data, row) {
    this.http.post("http://srv-apps-prod/RCF_WS/WebService.asmx/UpdateSign", {
      _rowID: row,
      _signData: data.sign,
    })
      .subscribe((Response) => {
        if (Response["d"]) {
          this.openSnackBar("נשמר");
          this.getAllCprFormsList();
        } else {
          this.openSnackBar("לא נשמר");
        }
      });
  }

  signForm(type, row) {
    const dialogRef = this.dialog
      .open(DialogContentExampleDialog, {
        data: { sign: "" },
      })
      .afterClosed()
      .subscribe((data) => {
        if (row != 0) {
          this.LateDocSignature(data, row);
        } else {
          //to show the sign in the template
          if (type == "Doctor") {
            // this.signDoc = this._sanitizer.bypassSecurityTrustResourceUrl(
            //   data.sign
            // );
            this.signDoc = data.sign
            if (data.sign == "data:image/png;base64,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MACCpYtMgAABAgQMAD9AgAABAgSCAgZAsHSRCRAgQICAAeAHCBAgQIBAUMAACJYuMgECBAgQMAD8AAECBAgQCAoYAMHSRSZAgAABAgaAHyBAgAABAkEBAyBYusgECBAgQMAA8AMECBAgQCAoYAAESxeZAAECBAgYAH6AAAECBAgEBQyAYOkiEyBAgAABA8APECBAgACBoIABECxdZAIECBAgYAD4AQIECBAgEBQwAIKli0yAAAECBAwAP0CAAAECBIICBkCwdJEJECBAgIAB4AcIECBAgEBQwAAIli4yAQIECBAwAPwAAQIECBAIChgAwdJFJkCAAAECBoAfIECAAAECQQEDIFi6yAQIECBAwADwAwQIECBAIChgAARLF5kAAQIECBgAfoAAAQIECAQFDIBg6SITIECAAAEDwA8QIECAAIGggAEQLF1kAgQIECBgAPgBAgQIECAQFDAAgqWLTIAAAQIEDAA/QIAAAQIEggIGQLB0kQkQIECAgAHgBwgQIECAQFDAAAiWLjIBAgQIEDAA/AABAgQIEAgKGADB0kUmQIAAAQIGgB8gQIAAAQJBAQMgWLrIBAgQIEDAAPADBAgQIEAgKGAABEsXmQABAgQIGAB+gAABAgQIBAUMgGDpIhMgQIAAAQPADxAgQIAAgaCAARAsXWQCBAgQIGAA+AECBAgQIBAUMACCpYtMgAABAgQMAD9AgAABAgSCAgZAsHSRCRAgQICAAeAHCBAgQIBAUMAACJYuMgECBAgQMAD8AAECBAgQCAoYAMHSRSZAgAABAgaAHyBAgAABAkEBAyBYusgECBAgQMAA8AMECBAgQCAoYAAESxeZAAECBAgYAH6AAAECBAgEBQyAYOkiEyBAgAABA8APECBAgACBoIABECxdZAIECBAgYAD4AQIECBAgEBQwAIKli0yAAAECBAwAP0CAAAECBIICBkCwdJEJECBAgIAB4AcIECBAgEBQwAAIli4yAQIECBAwAPwAAQIECBAIChgAwdJFJkCAAAECBoAfIECAAAECQQEDIFi6yAQIECBAwADwAwQIECBAIChgAARLF5kAAQIECBgAfoAAAQIECAQFDIBg6SITIECAAAEDwA8QIECAAIGggAEQLF1kAgQIECBgAPgBAgQIECAQFDAAgqWLTIAAAQIEDAA/QIAAAQIEggIGQLB0kQkQIECAgAHgBwgQIECAQFDAAAiWLjIBAgQIEDAA/AABAgQIEAgKGADB0kUmQIAAAQIGgB8gQIAAAQJBAQMgWLrIBAgQIEDAAPADBAgQIEAgKGAABEsXmQABAgQIGAB+gAABAgQIBAUMgGDpIhMgQIAAAQPADxAgQIAAgaCAARAsXWQCBAgQIGAA+AECBAgQIBAUMACCpYtMgAABAgQMAD9AgAABAgSCAgZAsHSRCRAgQICAAeAHCBAgQIBAUMAACJYuMgECBAgQMAD8AAECBAgQCAoYAMHSRSZAgAABAgaAHyBAgAABAkEBAyBYusgECBAgQMAA8AMECBAgQCAoYAAESxeZAAECBAgYAH6AAAECBAgEBQyAYOkiEyBAgAABA8APECBAgACBoIABECxdZAIECBAgYAD4AQIECBAgEBQwAIKli0yAAAECBAwAP0CAAAECBIICBkCwdJEJECBAgIAB4AcIECBAgEBQwAAIli4yAQIECBAwAPwAAQIECBAIChgAwdJFJkCAAAECBoAfIECAAAECQQEDIFi6yAQIECBAwADwAwQIECBAIChgAARLF5kAAQIECBgAfoAAAQIECAQFDIBg6SITIECAAAEDwA8QIECAAIGggAEQLF1kAgQIECBgAPgBAgQIECAQFDAAgqWLTIAAAQIEDAA/QIAAAQIEggIGQLB0kQkQIECAgAHgBwgQIECAQFDAAAiWLjIBAgQIEDAA/AABAgQIEAgKGADB0kUmQIAAAQIGgB8gQIAAAQJBAQMgWLrIBAgQIEDAAPADBAgQIEAgKGAABEsXmQABAgQIGAB+gAABAgQIBAUMgGDpIhMgQIAAAQPADxAgQIAAgaCAARAsXWQCBAgQIGAA+AECBAgQIBAUMACCpYtMgAABAgQMAD9AgAABAgSCAgZAsHSRCRAgQICAAeAHCBAgQIBAUMAACJYuMgECBAgQMAD8AAECBAgQCAoYAMHSRSZAgAABAgaAHyBAgAABAkEBAyBYusgECBAgQMAA8AMECBAgQCAoYAAESxeZAAECBAgYAH6AAAECBAgEBQyAYOkiEyBAgAABA8APECBAgACBoIABECxdZAIECBAgYAD4AQIECBAgEBQwAIKli0yAAAECBAwAP0CAAAECBIICBkCwdJEJECBAgIAB4AcIECBAgEBQwAAIli4yAQIECBAwAPwAAQIECBAIChgAwdJFJkCAAAECBoAfIECAAAECQQEDIFi6yAQIECBAwADwAwQIECBAIChgAARLF5kAAQIECBgAfoAAAQIECAQFDIBg6SITIECAAAEDwA8QIECAAIGggAEQLF1kAgQIECDwoOYBoxwL39cAAAAASUVORK5CYII=") {
              this.signDoc = "";
            }
            this.ThirdSection.controls['managingDocSign'].setValue(this.signDoc);
          } else {
            // this.signNurse = this._sanitizer.bypassSecurityTrustResourceUrl(
            //   data.sign
            // );
            this.signNurse = data.sign
            if (data.sign == "data:image/png;base64,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MACCpYtMgAABAgQMAD9AgAABAgSCAgZAsHSRCRAgQICAAeAHCBAgQIBAUMAACJYuMgECBAgQMAD8AAECBAgQCAoYAMHSRSZAgAABAgaAHyBAgAABAkEBAyBYusgECBAgQMAA8AMECBAgQCAoYAAESxeZAAECBAgYAH6AAAECBAgEBQyAYOkiEyBAgAABA8APECBAgACBoIABECxdZAIECBAgYAD4AQIECBAgEBQwAIKli0yAAAECBAwAP0CAAAECBIICBkCwdJEJECBAgIAB4AcIECBAgEBQwAAIli4yAQIECBAwAPwAAQIECBAIChgAwdJFJkCAAAECBoAfIECAAAECQQEDIFi6yAQIECBAwADwAwQIECBAIChgAARLF5kAAQIECBgAfoAAAQIECAQFDIBg6SITIECAAAEDwA8QIECAAIGggAEQLF1kAgQIECBgAPgBAgQIECAQFDAAgqWLTIAAAQIEDAA/QIAAAQIEggIGQLB0kQkQIECAgAHgBwgQIECAQFDAAAiWLjIBAgQIEDAA/AABAgQIEAgKGADB0kUmQIAAAQIGgB8gQIAAAQJBAQMgWLrIBAgQIEDAAPADBAgQIEAgKGAABEsXmQABAgQIGAB+gAABAgQIBAUMgGDpIhMgQIAAAQPADxAgQIAAgaCAARAsXWQCBAgQIGAA+AECBAgQIBAUMACCpYtMgAABAgQMAD9AgAABAgSCAgZAsHSRCRAgQICAAeAHCBAgQIBAUMAACJYuMgECBAgQMAD8AAECBAgQCAoYAMHSRSZAgAABAgaAHyBAgAABAkEBAyBYusgECBAgQMAA8AMECBAgQCAoYAAESxeZAAECBAgYAH6AAAECBAgEBQyAYOkiEyBAgAABA8APECBAgACBoIABECxdZAIECBAgYAD4AQIECBAgEBQwAIKli0yAAAECBAwAP0CAAAECBIICBkCwdJEJECBAgIAB4AcIECBAgEBQwAAIli4yAQIECBAwAPwAAQIECBAIChgAwdJFJkCAAAECBoAfIECAAAECQQEDIFi6yAQIECBAwADwAwQIECBAIChgAARLF5kAAQIECBgAfoAAAQIECAQFDIBg6SITIECAAAEDwA8QIECAAIGggAEQLF1kAgQIECBgAPgBAgQIECAQFDAAgqWLTIAAAQIEDAA/QIAAAQIEggIGQLB0kQkQIECAgAHgBwgQIECAQFDAAAiWLjIBAgQIEDAA/AABAgQIEAgKGADB0kUmQIAAAQIGgB8gQIAAAQJBAQMgWLrIBAgQIEDAAPADBAgQIEAgKGAABEsXmQABAgQIGAB+gAABAgQIBAUMgGDpIhMgQIAAAQPADxAgQIAAgaCAARAsXWQCBAgQIGAA+AECBAgQIBAUMACCpYtMgAABAgQMAD9AgAABAgSCAgZAsHSRCRAgQICAAeAHCBAgQIBAUMAACJYuMgECBAgQMAD8AAECBAgQCAoYAMHSRSZAgAABAgaAHyBAgAABAkEBAyBYusgECBAgQMAA8AMECBAgQCAoYAAESxeZAAECBAgYAH6AAAECBAgEBQyAYOkiEyBAgAABA8APECBAgACBoIABECxdZAIECBAgYAD4AQIECBAgEBQwAIKli0yAAAECBAwAP0CAAAECBIICBkCwdJEJECBAgIAB4AcIECBAgEBQwAAIli4yAQIECBAwAPwAAQIECBAIChgAwdJFJkCAAAECBoAfIECAAAECQQEDIFi6yAQIECBAwADwAwQIECBAIChgAARLF5kAAQIECBgAfoAAAQIECAQFDIBg6SITIECAAAEDwA8QIECAAIGggAEQLF1kAgQIECBgAPgBAgQIECAQFDAAgqWLTIAAAQIEDAA/QIAAAQIEggIGQLB0kQkQIECAgAHgBwgQIECAQFDAAAiWLjIBAgQIEDAA/AABAgQIEAgKGADB0kUmQIAAAQIGgB8gQIAAAQJBAQMgWLrIBAgQIEDAAPADBAgQIEAgKGAABEsXmQABAgQIGAB+gAABAgQIBAUMgGDpIhMgQIAAAQPADxAgQIAAgaCAARAsXWQCBAgQIGAA+AECBAgQIBAUMACCpYtMgAABAgQMAD9AgAABAgSCAgZAsHSRCRAgQICAAeAHCBAgQIBAUMAACJYuMgECBAgQMAD8AAECBAgQCAoYAMHSRSZAgAABAgaAHyBAgAABAkEBAyBYusgECBAgQMAA8AMECBAgQCAoYAAESxeZAAECBAgYAH6AAAECBAgEBQyAYOkiEyBAgAABA8APECBAgACBoIABECxdZAIECBAgYAD4AQIECBAgEBQwAIKli0yAAAECBAwAP0CAAAECBIICBkCwdJEJECBAgIAB4AcIECBAgEBQwAAIli4yAQIECBAwAPwAAQIECBAIChgAwdJFJkCAAAECBoAfIECAAAECQQEDIFi6yAQIECBAwADwAwQIECBAIChgAARLF5kAAQIECBgAfoAAAQIECAQFDIBg6SITIECAAAEDwA8QIECAAIGggAEQLF1kAgQIECDwoOYBoxwL39cAAAAASUVORK5CYII=") {
              this.signNurse = "";
            }
            this.ThirdSection.controls['responsNurseSign'].setValue(this.signNurse);
          }
        }
      });
  }

  submit() {
    let defaultCprDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    this.FirstSection.controls['cprDate'].setValue(defaultCprDate);
    if (this.FirstSection.invalid) {
      this.openSnackBar("שכחת שדה חובה בחלק ראשון");
    } else if (this.SecondSection.invalid) {
      this.openSnackBar("שכחת שדה חובה בחלק שני");
    } else if (this.ThirdSection.invalid) {
      this.openSnackBar("שכחת שדה חובה בחלק שלישי");
    } else {
      this.http.post("http://srv-apps-prod/RCF_WS/WebService.asmx/SaveCprForm", {
        _first: this.FirstSection.value,
        _second: this.SecondSection.value,
        _third: this.ThirdSection.value,
        _patientDetails: this.PatientRecord,
      })
        .subscribe((Response) => {
          if (Response["d"] != -1) {
            this.openSnackBar("נשמר בהצלחה");
            this.linkToNamer(Response["d"]);
            this.sendCprFormEmail(Response["d"]);
            this.ngOnInit();
            this.returnToSearch();
          } else {
            this.openSnackBar("אירעה תקלה, לא נשמר!");
          }
        });
    }
  }

  returnToSearch() {
    this.searching = "notFound";
    // this.FirstSection.reset();
    // this.SecondSection.reset();
    // this.ThirdSection.reset();
    window.location.reload();
  }

  displayCprForms() {
    this.getAllCprFormsList();
    this.dialog.open(this.modalContent, { width: '60%', disableClose: true });
  }

  getAllCprFormsList() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetAllCprFormsList", {
        ID: ""
      })
      .subscribe((Response) => {
        this.CprFormsList_all = Response["d"];
      });
  }

  sendCprFormEmail(id) {
    this.http
      //  .post("http://srv-apps-prod/RCF_WS/WebService.asmx/SendCprFormEmail", {
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/SendCprFormEmail", {
        _userSender: this.UserName,
        users: this.usersToSend,
        _reportArrayID: id,
        _html_content: ""
      })
      .subscribe((Response) => {
        if (Response["d"]) {
          this.openSnackBar("נשלח בהצלחה");
        } else {
          this.openSnackBar("אירעה תקלה, לא נשלח!");
        }
      });
  }

  linkToNamer(id) {
    let CaseNumber = "";
    let form = [];
    if (this.CprFormsList_all.length > 0) {
      form = this.CprFormsList_all.filter(x => x.Row_ID == id);
      CaseNumber = form[0].PM_CASE_NUMBER;
    } else {
      CaseNumber = this.PatientRecord.PM_CASE_NUMBER;
    }

    // this.http.post("http://srv-apps-prod/RCF_WS/WebService.asmx/createCprPdfOnServer", {
    this.http.post("http://srv-ipracticom:8080/WebService.asmx/createCprPdfOnServer", {
      CaseNumber: CaseNumber,
      FormID: "1",
      Catigory: "ZPO_ONLINE",
      Row_ID: id,
    }
    )
      .subscribe((Response) => {
        let that = this;
        setTimeout(() => {
          // that.http.post("http://srv-apps-prod/RCF_WS/WebService.asmx/LinkPdfToPatientNamer", {
          that.http.post("http://srv-ipracticom:756/WebService.asmx/LinkPdfToPatientNamer", {
            CaseNumber:
              CaseNumber,
            FormID: "1",
            Catigory: "ZPO_ONLINE",
            fileSource:
              Response["d"],
          }
          )
            .subscribe((Response) => {
              if (
                Response["d"] ==
                "success"
              ) {
                that.openSnackBar(
                  "! נשמר בהצלחה לתיק מטופל בנמר"
                );
              } else {
                that.openSnackBar(
                  "! משהו לא תקין"
                );
              }
            });
        }, 1000);

      });
  }

  printCprForm(id) {
    this.CprFormsList = this.CprFormsList_all.filter(x => x.Row_ID == id);
    // this.CprFormsList[0].PM_DOB = this.CprFormsList[0].PM_DOB.toFixed(1);
    // let that = this;
    // const doc = new jsPDF();
    // const pdfTable = this.printmycontent.nativeElement;
    // var html = htmlToPdfmake(pdfTable.innerHTML);
    // const documentDefinition = { content: html };
    // pdfMake.createPdf(documentDefinition).open();
    let that = this;
    setTimeout(function () {
      var style = "<style>p,mat-label,li{font-weight: bold;font-size: 12px;}.col-2{width: 20%;justify-content: center;}td{border: 1px solid black}.container1{margin:2px; padding: 0px 5px 0px 0px; border-style: double;}th{font-size: 14px;}</style>";
      var printContents = that.printmycontent.nativeElement.innerHTML;
      style = style + printContents;
      var w = window.open();
      // let pdfServer = `<!doctype html><html lang="he"><head><meta charset="utf-8"/><title>ניטור החייאה</title>
      // <style>p,mat-label,li{font-weight: bold;font-size: 12px;}.col-2{width: 20%;justify-content: center;}td{border: 1px solid black}
      // .container1{margin:2px; padding: 0px 5px 0px 0px; border-style: double;}th{font-size: 14px;}</style>
      // </head><body dir="rtl">` + printContents;
      // pdfServer = pdfServer + "</body></html>";
      // that.http.post("http://srv-apps-prod/RCF_WS/WebService.asmx/SendCprFormEmail", {
      //   _userSender: that.UserName,
      //   users: that.usersToSend,
      //   _reportArrayID: id,
      //   _html_content: pdfServer
      // }
      // ).subscribe((Response) => {
      //   console.log("hello");
      // });
      w.document.write(style);
      setTimeout(() => {
        w.print();
        w.close();
      }, 500);
    }, 600);
  }

  closeModal() {
    this.dialog.closeAll();
  }

}
