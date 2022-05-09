import { ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

export interface User {
  FirstName: string;
  LastName: string;
  id: string;
  Email: string;
}
export interface Status {
  value: string;
  viewValue: string;
}

export interface Shift {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'share-reports-dialog',
  templateUrl: 'share-reports-dialog.html',
})
export class ShareReportsFillDialog {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    public dialogRef: MatDialogRef<ShareReportsFillDialog>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private fb: FormBuilder) { }
  specialForces: User[] = [
    { FirstName: 'דניאלה', LastName: 'שאול', id: '031965551', Email: 'X_DSHAUL@PMC.GOV.IL' },
    { FirstName: 'טניה', LastName: 'אדמוז', id: '061233243', Email: 'TADMUZ@PMC.GOV.IL' },
    { FirstName: 'מייקי', LastName: 'מיכל לרר', id: '022355333', Email: 'MLEHRER@PMC.GOV.IL' },
    { FirstName: 'שרון', LastName: 'בן דוד', id: '029302304', Email: 'SBENDAVID@PMC.GOV.IL' }
  ]
  filteredOptions: Observable<string[]>;
  myControl = new FormControl('', Validators.required);
  users = [];
  removable = true;
  selectable = true;
  all_users_filter = [];
  reportArray = [];
  disableBtn: boolean;
  mail: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: any[] = [];
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;

  ngOnInit() {
    this.mail = this.fb.group({
      mailSubject: new FormControl('', null)
    });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.users.slice()));
    this.getUsers();
  }
  
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.fruits.push(value);
    }

    // event.chipInput!.clear();
    this.myControl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);
    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (event.option.value.id == "1") {
      this.specialForces.forEach(element => {
        this.fruits.push(element);
      });
    } else {
      this.fruits.push(event.option.value);
    }
    this.fruitInput.nativeElement.value = '';
    this.myControl.setValue(null);
  }

  private _filter(value: any): string[] {
    let filterValue = "";
    if (value != '' && value.FirstName == undefined) {
      filterValue = value.toLowerCase();
    }
    return this.users.filter(fruit => fruit.FirstName.toLowerCase().includes(filterValue));
  }



  shareReportWithOthers() {
    this.disableBtn = true;
    if (this.fruits.length == 0) {
      this.openSnackBar("נא לבחור אחראי לשליחה");
      this.disableBtn = false;
    } else if (this.reportArray.length == 0) {
      this.openSnackBar("לא נמצאו דיווחים לשליחה");
      this.disableBtn = false;
    } else {
      this.http
        // .post("http://srv-apps-prod/RCF_WS/WebService.asmx/AttachReportToUser", {
        // .post("http://srv-apps-prod/RCF_WS/WebService.asmx/AttachReportToUser", {
        .post("http://srv-ipracticom:8080/WebService.asmx/AttachReportToUser", {
          _userSender: localStorage.getItem('loginUserName').toLowerCase(),
          users: this.fruits,
          _reportArray: this.reportArray,
          _mailSubject: this.mail.controls['mailSubject'].value,
        })
        .subscribe((Response) => {
          if (Response["d"]) {
            this.openSnackBar("! נשלח בהצלחה לנמען");
            this.dialogRef.close();
          } else {
            this.openSnackBar("! אירעה תקלה, לא נשלח");
          }
          this.disableBtn = false;
        });
    }
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
  getUsers() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetUsersForInquiries", {

      })
      .subscribe((Response) => {
        this.all_users_filter = Response["d"];

        this.all_users_filter.forEach(element => {
          this.users.push({
            FirstName: element.firstname,
            LastName: element.lastname,
            id: element.id,
            Email: element.email
          });
        });
        this.users.push({
          FirstName: 'היחידה לבטיחות הטיפול',
          LastName: '',
          id: '1',
          Email: 'a'
        });
      });
  }

}
@Component({
  selector: 'add-response-fill',
  templateUrl: 'add-response-fill.html',
})
export class AddResponseFillDialog {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    public dialogRef: MatDialogRef<AddResponseFillDialog>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private formBuilder: FormBuilder) { }

  reportID: string;
  userFullName: string;
  responseID: string;
  responseText: string;
  reportResponse: FormGroup;
  UserName = localStorage.getItem("loginUserName").toLowerCase();

  ngOnInit() {
    this.reportResponse = this.formBuilder.group({
      responseText: new FormControl(this.responseText, Validators.required),
    })
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  chooseAction() {
    if (this.responseID != '0') {
      this.editResponse();
    } else {
      this.saveResponse();
    }
  }

  saveResponse() {
    let ResponseText = this.reportResponse.controls['responseText'].value;
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/SendReportResponse", {
        _userName: this.UserName,
        _responseText: ResponseText,
        _reportID: this.reportID,
        _userFullName: this.userFullName
      })
      .subscribe((Response) => {
        if (Response["d"]) {
          this.openSnackBar("נשמר בהצלחה");
          this.dialogRef.close();
        } else {
          this.openSnackBar("אופס משהו השתבש, לא נשמר");
        }
      });
  }

  editResponse() {
    let ResponseText = this.reportResponse.controls['responseText'].value;
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/EditResponseNurses", {
        _responseID: this.responseID,
        _reponseText: ResponseText,
      })
      .subscribe((Response) => {
        if (Response["d"]) {
          this.openSnackBar("נשמר בהצלחה");
          this.dialogRef.close();
        } else {
          this.openSnackBar("אופס משהו השתבש, לא נשמר");
        }
      });
  }

  closeModal() {
    this.dialogRef.close();
  }

}
@Component({
  selector: 'app-fill-report',
  templateUrl: './fill-report.component.html',
  styleUrls: ['./fill-report.component.css']
})
export class FillReportComponent implements OnInit {

  @Input()
  reportID: string;
  @Input()
  userFullName: string;
  @Input()
  ifGeneral: string;
  @Input()
  offsetFlag: string;

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  status: Status[] = [
    { value: '', viewValue: '' },
    { value: 'לטיפול', viewValue: 'לטיפול' },
    { value: 'טופל', viewValue: 'טופל' },
  ];

  shift: Shift[] = [
    { value: 'בוקר', viewValue: 'בוקר' },
    { value: 'ערב', viewValue: 'ערב' },
    { value: 'לילה', viewValue: 'לילה' },
  ];

  pipe = new DatePipe('en-US');
  myDate = new Date();
  constructor(public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private dialogRef: MatDialogRef<FillReportComponent>,
    private datePipe: DatePipe,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private confirmationDialogService: ConfirmationDialogService,) { }

  ReportGroup: FormGroup;
  UsersReportsList: FormArray;
  caseNumber: string;
  all_departs_filter = [];
  subCategory = [];
  all_categories_filter = [];
  departmentfilter = new FormControl();
  categoryfilter = new FormControl();
  subcategoryfilter = new FormControl();
  filteredOptions2: Observable<string[]>;
  filteredOptions3: Observable<string[]>;
  filteredOptions4: Observable<string[]>;
  department = [];
  // reportID: string;
  Dept_Name: string;
  firstName: string;
  lastName: string;
  UserName = localStorage.getItem("loginUserName").toLowerCase();
  all_report_management: any;
  usersReponsesList: any;
  date = this.pipe.transform(this.myDate, 'dd-MM-yyyy');
  date2: string;
  time2: string;
  @ViewChild('printmycontent') printmycontent: ElementRef;
  automaticShift: string;
  reportType: string;
  creator: boolean;
  now = new Date();
  panelOpenState = true;
  visible: boolean = true;
  AdminNurse: string;
  print: boolean;

  ngOnInit(): void {
    if (this.Dept_Name != "") {
      this.departmentfilter.setValue(this.Dept_Name);
    }
    this.ReportGroup = this.formBuilder.group({
      Row_ID: ['0', null],
      ReportTitle: ['', null],
      ReportMachlol: ['', null],
      ReportCategory: ['', null],
      ReportSubCategory: ['', null],
      Important: ['', null],
      ReportStatus: ['', null],
      ReportShift: [{ value: '', disabled: true }, null],
      ReportText: ['', null],
      toContinue: [false, null],
      Diagnosis: ['', null],
      PatientName: ['', null],
      PatientNurseStatus: ['', null],
    });
    if (this.reportID != "0") {
      this.getReportToUpdate();
    } else {
      // this.autoDate(false);
    }
    this.time2 = this.datePipe.transform(this.now, 'HH:mm:ss');
    if (this.now.getHours() >= 7 && this.now.getHours() < 15) {
      this.automaticShift = 'בוקר';
    } else if (this.now.getHours() >= 15 && this.now.getHours() < 23) {
      this.automaticShift = 'ערב';
    } else {
      this.automaticShift = 'לילה';
    }
    this.ReportGroup.controls['ReportShift'].setValue(this.automaticShift);
    this.getCategories();
    this.getDeparts();
    this.filteredOptions2 = this.departmentfilter.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter2(value))
      );
    this.filteredOptions3 = this.categoryfilter.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter3(value))
      );
    this.filteredOptions4 = this.subcategoryfilter.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter4(value))
      );
  }

  private _filter2(value: string): string[] {
    const filterValue2 = value;
    return this.department.filter(option => option.Dept_Name.includes(filterValue2));
  }
  private _filter3(value: string): string[] {
    const filterValue3 = value;
    return this.all_categories_filter.filter(option => option.Cat_Name.includes(filterValue3));
  }
  private _filter4(value: string): string[] {
    const filterValue4 = value;
    return this.subCategory.filter(option => option.SubCat_Name.includes(filterValue4));
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  deleteReport(reportID) {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/DeleteReport", {
        _reportID: reportID
      })
      .subscribe((Response) => {
        if (Response["d"] == "success") {
          this.openSnackBar("דווח נמחק בהצלחה");
          this.visible = false;
        } else {
          this.openSnackBar("משהו השתבש, לא נמחק");
        }
      });
  }

  areYouSureDeleteReport(reportID) {
    this.confirmationDialogService
      .confirm("נא לאשר..", "אתה מוחק דיווח.. האם אתה בטוח ...? ")
      .then((confirmed) => {
        console.log("User confirmed:", confirmed);
        if (confirmed) {
          this.deleteReport(reportID);
        } else {
        }
      })
      .catch(() =>
        console.log(
          "User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)"
        )
      );
  }

  printSingleReport() {
    this.print = true;
    let that = this;
    setTimeout(function () {
      var printContents = that.printmycontent.nativeElement.innerHTML;
      var w = window.open();
      w.document.write(printContents);
      w.print();
      w.close();
    }, 1000);
  }

  openShareDialog() {
    let reportArr = [];
    reportArr.push(this.all_report_management);
    let dialogRef = this.dialog.open(ShareReportsFillDialog);
    dialogRef.componentInstance.reportArray = reportArr;
  }

  closeModal() {
    this.dialogRef.close();
  }

  addResponseToReport(responseID, reportID, ResponseText) {
    const dialogRef = this.dialog.open(AddResponseFillDialog, {
      width: '600px'
    });
    dialogRef.componentInstance.responseID = responseID;
    dialogRef.componentInstance.responseText = ResponseText;
    dialogRef.componentInstance.reportID = reportID;
    dialogRef.componentInstance.userFullName = this.userFullName;
    dialogRef.afterClosed().subscribe(result => {
      this.getReportToUpdate();
    });
  }

  autoDate(amin) {
    if (amin == true) {
      this.ReportGroup.controls['ReportStatus'].setValue('לטיפול');
    } else if (amin == false) {
      this.ReportGroup.controls['ReportStatus'].setValue('טופל');
    } else {
      if (amin.value == "לטיפול") {
        this.ReportGroup.controls['toContinue'].setValue(true);
      } else {
        this.ReportGroup.controls['toContinue'].setValue(false);
      }
    }
  }

  setImportantReport() {
    if (this.ReportGroup.controls['Important'].value == 'True' || this.ReportGroup.controls['Important'].value == true) {
      this.ReportGroup.controls['Important'].setValue('False');
    } else {
      this.ReportGroup.controls['Important'].setValue('True');
    }
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/SetImportantReport", {
        _ifImportant: this.ReportGroup.controls['Important'].value,
        _reportID: this.reportID
      })
      .subscribe((Response) => {
        if (Response["d"]) {
          this.openSnackBar("סומן בהצלחה");
        } else {
          this.openSnackBar("לא התבצע");
        }
      });
  }

  sendReport() {
    this.ReportGroup.controls['ReportMachlol'].setValue(this.departmentfilter.value);
    this.ReportGroup.controls['ReportCategory'].setValue(this.categoryfilter.value);
    this.ReportGroup.controls['ReportSubCategory'].setValue(this.subcategoryfilter.value);
    let dobDetails = this.ReportGroup.controls['Patient_DobGender'].value;
    if (this.caseNumber == undefined) {
      this.caseNumber = "";
    }
    if (!this.ReportGroup.invalid) {
      this.http
        .post("http://srv-apps-prod/RCF_WS/WebService.asmx/AddUpdateReport", {
          _report: this.ReportGroup.getRawValue(),
          _userName: this.UserName,
          _caseNumber: this.caseNumber,
          _reportType: this.reportType,
          _ifGeneral: this.ifGeneral,
          _AdminNurse: this.AdminNurse,
          _Patient_DobGender: dobDetails,
        })
        .subscribe((Response) => {
          if (Response["d"] != 0) {
            this.openSnackBar("נשמר בהצלחה");
            this.getReportToUpdate();
          } else {
            this.openSnackBar("משהו השתבש, לא נשמר");
          }
        });
    } else {
      this.openSnackBar("שכחת אחד השדות");
    }
  }

  getDeparts() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetNursesDeparts", {

      })
      .subscribe((Response) => {
        this.all_departs_filter = Response["d"];

        this.all_departs_filter.forEach(element => {
          this.department.push(element);
        })
      });
  }

  getReportToUpdate() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetReportToUpdate", {
        _reportID: this.reportID
      })
      .subscribe((Response) => {
        //  //debugger
        this.all_report_management = Response["d"];
        this.usersReponsesList = this.all_report_management.UsersReportsList;
        // if(this.all_report_management.UserName == this.UserName){
        this.ReportGroup = this.formBuilder.group({
          Row_ID: new FormControl(this.all_report_management.Row_ID, null),
          ReportDate: new FormControl(this.all_report_management.ReportDate, null),
          ReportSubCategory: new FormControl(this.all_report_management.ReportSubCategory, null),
          Important: new FormControl(this.all_report_management.Important, null),
          ReportMachlol: new FormControl(this.all_report_management.ReportMachlol, null),
          ReportStatus: new FormControl(this.all_report_management.ReportStatus, null),
          ReportCategory: new FormControl(this.all_report_management.ReportCategory, null),
          ReportShift: new FormControl({ value: this.all_report_management.ReportShift, disabled: true }, null),
          ReportText: new FormControl(this.all_report_management.ReportText, null),
          ReportTitle: new FormControl(this.all_report_management.ReportTitle, null),
          Patient_CaseNumber: new FormControl(this.all_report_management.Patient_CaseNumber, null),
          toContinue: new FormControl(this.all_report_management.toContinue, null),
          Diagnosis: new FormControl(this.all_report_management.Diagnosis, null),
          PatientName: new FormControl(this.all_report_management.PatientName, null),
          PatientNurseStatus: new FormControl(this.all_report_management.PatientNurseStatus, null),
          Patient_DobGender: new FormControl(this.all_report_management.Patient_DobGender, null),
        });
        this.AdminNurse = this.all_report_management.AdminNurse;
        // if(this.AdminNurse == '1' && this.)
        this.reportType = this.all_report_management.ReportType;
        let ifEditable = false;
        // let mishmeret = "בוקר";
        let reportDate = this.all_report_management.ReportDate;
        this.date2 = this.all_report_management.ReportDate;
        this.time2 = this.all_report_management.LastUpdatedTime;
        // this.date2 = this.date2.replace('/','.');
        // this.date2 = this.date2.replace('/','.');
        let Rday = parseInt(reportDate.split(".", 1)[0]);
        let Rmonth = parseInt(reportDate.split(".", 2)[1]);
        let Ryear = parseInt(reportDate.split(".", 3)[2]);
        reportDate = Rday + "" + Rmonth + "" + Ryear;
        let thisDate = this.pipe.transform(this.now, 'dd/MM/yyyy');
        let Tday = parseInt(thisDate.split("/", 1)[0]);
        let Tmonth = parseInt(thisDate.split("/", 2)[1]);
        let Tyear = parseInt(thisDate.split("/", 3)[2]);
        thisDate = Tday + "" + Tmonth + "" + Tyear;
        let thisTime = this.pipe.transform(this.now, 'HH');

        // if (parseInt(thisTime) > 14 && parseInt(thisTime) < 23) {
        //   mishmeret = "ערב";
        // } else if ((parseInt(thisTime) > 22 && parseInt(thisTime) < 24) || (parseInt(thisTime) > 0 && parseInt(thisTime) < 7)) {
        //   mishmeret = "לילה";
        // }
        if (this.all_report_management.ReportShift == 'בוקר' && reportDate == thisDate && parseInt(thisTime) < 17 && parseInt(thisTime) > 6) {
          ifEditable = true;
        } else if (this.all_report_management.ReportShift == 'ערב' && reportDate == thisDate && ((parseInt(thisTime) > 14 && parseInt(thisTime) < 24) || parseInt(thisTime) < 1)) {
          ifEditable = true;
        } else if (this.all_report_management.ReportShift == 'לילה' && (reportDate == thisDate || parseInt(reportDate) - parseInt(thisDate) == 100000) && (parseInt(thisTime) < 9 || parseInt(thisTime) > 22)) {
          ifEditable = true;
        }

        this.departmentfilter.setValue(this.all_report_management.ReportMachlol);
        this.categoryfilter.setValue(this.all_report_management.ReportCategory);
        this.subcategoryfilter.setValue(this.all_report_management.ReportSubCategory);
        if (this.all_report_management.UserName == this.UserName && reportDate == thisDate && ifEditable) {
          this.creator = true;
        } else {
          this.creator = false;
          this.ReportGroup.disable();
          this.departmentfilter.disable();
          this.categoryfilter.disable();
        }
        if (this.ReportGroup.controls['toContinue'].value == 'False') {
          this.ReportGroup.controls['toContinue'].setValue(false);
        } else {
          this.ReportGroup.controls['toContinue'].setValue(true);
        }

      });
    this.getCategories();
  }

  getCategories() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetCategories", {
      })
      .subscribe((Response) => {
        this.all_categories_filter = Response["d"];
        let lastIndex = this.all_categories_filter.length - 1;
        this.subCategory = this.all_categories_filter[lastIndex].SubCategory;
      });
  }

  deleteReply(responseRowID) {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/DeleteResponseNurses", {
        _responseRowID: responseRowID
      })
      .subscribe((Response) => {
        if (Response["d"]) {
          this.openSnackBar("נשמר בהצלחה");
          this.getReportToUpdate();
        } else {
          this.openSnackBar("משהו השתבש, לא נשמר");
        }
      });
  }

  editReply(responseRowID, reportIDFK, ResponseText) {
    this.addResponseToReport(responseRowID, reportIDFK, ResponseText);
    // this.http
    //   .post("http://srv-apps-prod/RCF_WS/WebService.asmx/EditResponseNurses", {
    //     _responseRowID: responseRowID
    //   })
    //   .subscribe((Response) => {
    //     if (Response["d"]) {
    //       this.openSnackBar("נשמר בהצלחה");
    //       this.getReportToUpdate();
    //     } else {
    //       this.openSnackBar("משהו השתבש, לא נשמר");
    //     }
    //   });
  }

  onSubmit() {
    this.sendReport();
  }

}
