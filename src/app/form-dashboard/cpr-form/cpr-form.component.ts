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
import { HttpClient, HttpHeaders } from "@angular/common/http";
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
import jspdf, { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import html2canvas from 'html2canvas';
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
    private _sanitizer: DomSanitizer) { }


  FirstSection: FormGroup;
  SecondSection: FormGroup;
  ThirdSection: FormGroup;
  PatientPassport: string = "";
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
  statusDropDown = ['VF', 'PEA', 'ASYSTOLE', 'VT'];
  rateHeadDropdown = ['יש', 'אין'];
  myDate = new Date();
  CprFormsColumns: string[] = ['date', 'patientID', 'patientName', 'print'];
  CprFormsList = [];
  CprFormsList_all = [];
  UserName = localStorage.getItem("loginUserName").toLowerCase();
  // usersToSend = ['batzadok@poria.health.gov.il', 'saziv@poria.health.gov.il', 'KMassalha@poria.health.gov.il', 'EMansour@poria.health.gov.il', 'SBenDavid@poria.health.gov.il'];
  usersToSend = ['adahabre@poria.health.gov.il'];
  filteredOptions1: Observable<string[]>;
  docfilter = new FormControl();
  filteredOptions2: Observable<string[]>;
  nurfilter = new FormControl();
  employees = [];


  ngOnInit(): void {
    this.getCprActionsList();
    // for the first table hour/minutes row
    for (let i = 0; i < 1; i++) {
      this.firstTableArray.push(this.formBuilder.group({
        subArray: this.subArrayTest(this.firstTablecolumns.length, 'actions')
      }));
    }

    // second table of actions -- fixed number 9 or wait till the response from server for actions list (fekret abo elabed) --errroooooorrrrrrrr!!!!!!!!!!!
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
      managingDocSign: new FormControl('', Validators.required),
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

  getPatientDetails() {
    this.buffering = true;
    this.http
      .post(
        "http://srv-apps-prod/RCF_WS/WebService.asmx/GetPatientDetailsByIDNumber", {
        _patientPassport: this.PatientPassport
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

  signForm(type) {
    const dialogRef = this.dialog
      .open(DialogContentExampleDialog, {
        data: { sign: "" },
      })
      .afterClosed()
      .subscribe((data) => {
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

      });
  }

  submit() {
    let defaultCprDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    this.FirstSection.controls['cprDate'].setValue(defaultCprDate);
    if (!this.FirstSection.invalid && !this.SecondSection.invalid && !this.ThirdSection.invalid) {
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
    } else {
      this.openSnackBar("שכחת למלא שדות חובה");
    }
  }

  returnToSearch() {
    this.searching = "notFound";
    this.FirstSection.reset();
    this.SecondSection.reset();
    this.ThirdSection.reset();
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
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/SendCprFormEmail", {
        _userSender: this.UserName,
        users: this.usersToSend,
        _reportArrayID: id
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
