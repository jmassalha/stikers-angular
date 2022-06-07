import {
  Component,
  OnInit,
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {
  MatSnackBar,
} from "@angular/material/snack-bar";
import {
  MatDialog,
} from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { DatePipe } from "@angular/common";
import { ConfirmationDialogService } from "../../confirmation-dialog/confirmation-dialog.service";
import { DialogContentExampleDialog } from "../../fill-survey/fill-survey.component";

@Component({
  selector: 'app-cpr-form',
  templateUrl: './cpr-form.component.html',
  styleUrls: ['./cpr-form.component.css']
})
export class CprFormComponent implements OnInit {

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
  sign: any;
  firstTablecolumns = Array(15).fill("שעה")
  secondTablecolumns = Array(7).fill("שעה")
  actions = [];
  secondTableActions = ['ADRENALINE', 'AMIODARONE', 'ATROPINE', '', '', ''];

  ngOnInit(): void {
    // this.getFormDetails();
    this.FirstSection = this.formBuilder.group({
      cprDate: new FormControl('', Validators.required),
      cprTime: new FormControl('', Validators.required),
      cprTeamWork: new FormControl('', Validators.required),
      cprTeamWorkTime: new FormControl('', Validators.required),
      cadriologName: new FormControl('', Validators.required),
      cardiologTime: new FormControl('', Validators.required),
      mardimName: new FormControl('', Validators.required),
      mardimTime: new FormControl('', Validators.required),
      clalitName: new FormControl('', Validators.required),
      clalitTime: new FormControl('', Validators.required),
      cprPlace: new FormControl('', Validators.required),
      cprWitness1: new FormControl('', Validators.required),
      cprWitness2: new FormControl('', Validators.required),
      cprWitness3: new FormControl('', Validators.required),
      cprCause1: new FormControl('', Validators.required),
      cprCause2: new FormControl('', Validators.required),
      cprCause3: new FormControl('', Validators.required),
      replying: new FormControl('', Validators.required),
      resporatoryStat: new FormControl('', Validators.required),
      patientDiagnosis: new FormControl('', Validators.required)
    });

    this.SecondSection = this.formBuilder.group({
      firstHeartRate: new FormControl('', Validators.required)
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
      responsNurse: new FormControl('', Validators.required),
      managingDoc: new FormControl('', Validators.required),
      managingNurse: new FormControl('', Validators.required),
    });
    this.getCprActionsList();
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
        "http://srv-apps-prod/RCF_WS/WebService.asmx/GetRecordAndPatients", {
        _patientPassport: this.PatientPassport
      }
      )
      .subscribe((Response) => {
        this.PatientRecord = Response["d"][0];
        if (this.PatientRecord.PatientPersonID != null) {
          this.searching = "Found";
        } else {
          this.searching = "tryAgain";
        }
        this.buffering = false;
        this.PatientRecord.PatientDOB = this.calculateDiff(this.PatientRecord.PatientDOB) / 365;

      });
  }

  calculateDiff(dateSent) {
    let currentDate = new Date();
    dateSent = new Date(dateSent);

    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));
  }

  signForm() {
    const dialogRef = this.dialog
      .open(DialogContentExampleDialog, {
        data: { sign: "" },
      })
      .afterClosed()
      .subscribe((data) => {
        //to show the sign in the template
        this.sign = this._sanitizer.bypassSecurityTrustResourceUrl(
          data.sign
        );
      });
  }



}
