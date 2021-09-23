import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
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

export interface User {
  name: string;
  id: string;
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
export class ShareReportDialog {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    public dialogRef: MatDialogRef<ShareReportDialog>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private _snackBar: MatSnackBar,
    private http: HttpClient) { }

  filteredOptions: Observable<string[]>;
  myControl = new FormControl('', Validators.required);
  users = [];
  all_users_filter = [];
  reportArray = [];

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.users.slice())
      );
    this.getUsers();
  }
  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(option => option.name.includes(filterValue));
  }


  shareReportWithOthers() {
    if (this.myControl.value == "") {
      this.openSnackBar("נא לבחור אחראי לשליחה");
    } else {
      this.http
        .post("http://srv-apps/wsrfc/WebService.asmx/AttachReportToUser", {
          _userSender: localStorage.getItem('loginUserName').toLowerCase(),
          userId: this.myControl.value.id,
          _reportArray: this.reportArray,
        })
        .subscribe((Response) => {
          if (Response["d"] == "found") {
            this.openSnackBar("! נשלח בהצלחה לנמען");
            this.dialogRef.close();
          } else {
            this.openSnackBar("! אירעה תקלה, לא נשלח");
          }
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
      .post("http://srv-apps/wsrfc/WebService.asmx/GetUsersForInquiries", {

      })
      .subscribe((Response) => {
        this.all_users_filter = Response["d"];

        this.all_users_filter.forEach(element => {
          this.users.push({
            name: element.firstname + " " + element.lastname,
            id: element.id
          });
        })
      });
  }

}
@Component({
  selector: 'add-response',
  templateUrl: 'add-response.html',
})
export class AddResponseDialog {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    public dialogRef: MatDialogRef<AddResponseDialog>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private formBuilder: FormBuilder) { }

  reportID: string;
  userFullName: string;
  reportResponse: FormGroup;
  UserName = localStorage.getItem("loginUserName").toLowerCase();

  ngOnInit() {
    this.reportResponse = this.formBuilder.group({
      responseText: new FormControl('', Validators.required),
    })
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  saveResponse() {
    let ResponseText = this.reportResponse.controls['responseText'].value;
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/SendReportResponse", {
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

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  status: Status[] = [
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
  automaticShift: string;
  reportType: string;
  creator: boolean;
  now = new Date();
  panelOpenState = false;

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
      ReportStatus: ['', null],
      ReportShift: [{ value: '', disabled: true }, null],
      ReportText: ['', null],
      toContinue: [false, null],
      Diagnosis: [false, null],
    });
    if (this.reportID != "0") {
      this.getReportToUpdate();
    } else {
      // this.autoDate(false);
    }
    // if((this.firstName != "" || this.lastName != "")&&(this.firstName != undefined || this.lastName != undefined)){
    //   this.ReportGroup.controls['ReportText'].setValue(this.firstName+" "+this.lastName);
    // }

    //this.date2 = this.datePipe.transform(this.now, 'dd.MM.yyyy');
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
      .post("http://srv-apps/wsrfc/WebService.asmx/DeleteReport", {
        _reportID: reportID
      })
      .subscribe((Response) => {
        if (Response["d"] == "success") {
          this.openSnackBar("דווח נמחק בהצלחה");
          this.dialog.closeAll();
        } else {
          this.openSnackBar("משהו השתבש, לא נמחק");
        }
      });
  }

  openShareDialog() {
    let reportArr = [];
    reportArr.push(this.all_report_management);
    let dialogRef = this.dialog.open(ShareReportDialog);
    dialogRef.componentInstance.reportArray = reportArr;
  }

  closeModal() {
    this.dialogRef.close();
  }

  addResponseToReport(reportID) {
    const dialogRef = this.dialog.open(AddResponseDialog, {
      width: '600px'
    });
    dialogRef.componentInstance.reportID = reportID;
    dialogRef.componentInstance.userFullName = this.userFullName;
    dialogRef.afterClosed().subscribe(result => {
      this.getReportToUpdate();
    });
  }

  autoDate(amin) {
    if (amin) {
      this.ReportGroup.controls['ReportStatus'].setValue('לטיפול');
    } else {
      this.ReportGroup.controls['ReportStatus'].setValue('טופל');
    }
  }

  sendReport() {
    this.ReportGroup.controls['ReportMachlol'].setValue(this.departmentfilter.value);
    this.ReportGroup.controls['ReportCategory'].setValue(this.categoryfilter.value);
    this.ReportGroup.controls['ReportSubCategory'].setValue(this.subcategoryfilter.value);
    if (this.caseNumber == undefined) {
      this.caseNumber = "";
    }
    if (!this.ReportGroup.invalid) {
      this.http
        .post("http://srv-apps/wsrfc/WebService.asmx/AddUpdateReport", {
          _report: this.ReportGroup.getRawValue(),
          _userName: this.UserName,
          _caseNumber: this.caseNumber,
          _reportType: this.reportType
        })
        .subscribe((Response) => {
          if (Response["d"] == "Success") {
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
      .post("http://srv-apps/wsrfc/WebService.asmx/GetNursesDeparts", {

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
      .post("http://srv-apps/wsrfc/WebService.asmx/GetReportToUpdate", {
        _reportID: this.reportID
      })
      .subscribe((Response) => {
        this.all_report_management = Response["d"];
        this.usersReponsesList = this.all_report_management.UsersReportsList;
        // if(this.all_report_management.UserName == this.UserName){
        this.ReportGroup = this.formBuilder.group({
          Row_ID: new FormControl(this.all_report_management.Row_ID, null),
          ReportDate: new FormControl(this.all_report_management.ReportDate, null),
          ReportSubCategory: new FormControl(this.all_report_management.ReportSubCategory, null),
          ReportMachlol: new FormControl(this.all_report_management.ReportMachlol, null),
          ReportStatus: new FormControl(this.all_report_management.ReportStatus, null),
          ReportCategory: new FormControl(this.all_report_management.ReportCategory, null),
          ReportShift: new FormControl({ value: this.all_report_management.ReportShift, disabled: true }, null),
          ReportText: new FormControl(this.all_report_management.ReportText, null),
          ReportTitle: new FormControl(this.all_report_management.ReportTitle, null),
          toContinue: new FormControl(this.all_report_management.toContinue, null),
          Diagnosis: new FormControl(this.all_report_management.Diagnosis, null),
        });
        this.reportType = this.all_report_management.ReportType;
        let ifEditable = false;
        let mishmeret = "בוקר";
        let reportDate = this.all_report_management.ReportDate.split(" ", 1)[0];
        this.date2 = this.all_report_management.LastUpdatedDate;
        this.time2 = this.all_report_management.LastUpdatedTime;
        // this.date2 = this.date2.replace('/','.');
        // this.date2 = this.date2.replace('/','.');
        let Rday = parseInt(reportDate.split("/", 1)[0]);
        let Rmonth = parseInt(reportDate.split("/", 2)[1]);
        let Ryear = parseInt(reportDate.split("/", 3)[2]);
        reportDate = Rday + "" + Rmonth + "" + Ryear;
        let thisDate = this.pipe.transform(this.now, 'dd/MM/yyyy');
        let Tday = parseInt(thisDate.split("/", 1)[0]);
        let Tmonth = parseInt(thisDate.split("/", 2)[1]);
        let Tyear = parseInt(thisDate.split("/", 3)[2]);
        thisDate = Tday + "" + Tmonth + "" + Tyear;
        let thisTime = this.pipe.transform(this.now, 'HH');

        if (parseInt(thisTime) > 14 && parseInt(thisTime) < 23) {
          mishmeret = "ערב";
        } else if ((parseInt(thisTime) > 22 && parseInt(thisTime) < 24) || (parseInt(thisTime) > 0 && parseInt(thisTime) < 7)) {
          mishmeret = "לילה";
        }
        if (this.all_report_management.ReportShift == 'בוקר' && reportDate == thisDate && parseInt(thisTime) < 17 && parseInt(thisTime) > 6) {
          ifEditable = true;
        } else if (this.all_report_management.ReportShift == 'ערב' && reportDate == thisDate && ((parseInt(thisTime) > 14 && parseInt(thisTime) < 24) || parseInt(thisTime) < 1) && mishmeret == 'ערב') {
          ifEditable = true;
        } else if (this.all_report_management.ReportShift == 'לילה' && (reportDate == thisDate || parseInt(reportDate.split('/')[0]) - parseInt(thisDate.split('/')[0]) == 1) && (parseInt(thisTime) < 9 || parseInt(thisTime) > 22) && mishmeret == 'לילה') {
          ifEditable = true;
        }

        if (this.all_report_management.UserName == this.UserName && reportDate == thisDate && ifEditable) {
          this.creator = true;
        } else {
          this.creator = false;
        }
        if (this.ReportGroup.controls['toContinue'].value == 'False') {
          this.ReportGroup.controls['toContinue'].setValue(false);
        } else {
          this.ReportGroup.controls['toContinue'].setValue(true);
        }
        this.departmentfilter.setValue(this.all_report_management.ReportMachlol);
        this.categoryfilter.setValue(this.all_report_management.ReportCategory);
        this.subcategoryfilter.setValue(this.all_report_management.ReportSubCategory);
      });
    this.getCategories();
  }

  getCategories() {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetCategories", {
      })
      .subscribe((Response) => {
        this.all_categories_filter = Response["d"];
        let lastIndex = this.all_categories_filter.length - 1;
        this.subCategory = this.all_categories_filter[lastIndex].SubCategory;
      });
  }

  onSubmit() {
    this.sendReport();
  }

}
