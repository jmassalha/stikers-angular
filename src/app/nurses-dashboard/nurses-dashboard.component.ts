import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import {
  NgbModal,
  NgbActiveModal,
} from "@ng-bootstrap/ng-bootstrap";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ConfirmationDialogService } from "../confirmation-dialog/confirmation-dialog.service";
import { ReportRepliesComponent } from '../report-replies/report-replies.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from "@angular/material/table";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { FillReportComponent } from "../fill-report/fill-report.component";
export interface User {
  name: string;
  id: string;
}
export interface PeriodicElement2 {
  Row_ID: string;
  UpdateDate: string;
  FullName: string;
}
export interface PeriodicElement {
  date: string;
  title: string;
  status: string;
  symbol: string;
  description: string;
}
export interface Shift {
  value: string;
  viewValue: string;
}
export interface Status {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'share-reports-dialog',
  templateUrl: 'share-reports-dialog.html',
})
export class ShareReportsDialog {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    public dialogRef: MatDialogRef<ShareReportsDialog>,
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
  selector: 'app-nurses-dashboard',
  templateUrl: './nurses-dashboard.component.html',
  styleUrls: ['./nurses-dashboard.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class NursesDashboardComponent implements OnInit {
  shift: Shift[] = [
    { value: 'בוקר', viewValue: 'בוקר' },
    { value: 'ערב', viewValue: 'ערב' },
    { value: 'לילה', viewValue: 'לילה' },
  ];

  status: Status[] = [
    { value: 'לטיפול', viewValue: 'לטיפול' },
    { value: 'טופל', viewValue: 'טופל' },
  ];

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  columnsToDisplay = ['date', 'status', 'edit', 'continue', 'reply'];
  ELEMENT_DATA = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  pipe = new DatePipe('en-US');
  myDate = new Date();
  constructor(private _snackBar: MatSnackBar,
    private router: Router,
    private http: HttpClient,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<NursesDashboardComponent>,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private confirmationDialogService: ConfirmationDialogService,
    activeModal: NgbActiveModal) { }

  searchReportsGroup: FormGroup;
  reportsArr = [];
  all_categories_filter = [];
  UserName = localStorage.getItem('loginUserName').toLowerCase();
  departmentfilter = new FormControl();
  categoryfilter = new FormControl();
  subcategoryfilter = new FormControl();
  filteredOptions2: Observable<string[]>;
  filteredOptions3: Observable<string[]>;
  filteredOptions4: Observable<string[]>;
  department = [];
  all_departs_filter = [];
  permission: boolean = false;
  caseNumber: string;
  asDialog: boolean;
  Dept_Name: string;
  firstname: string;
  lastname: string;
  ReportGroup: FormGroup;
  subCategory = [];
  reportID: string;
  userFullName: string;
  reportType: string;
  gender: string;
  dob: string;
  description: string;
  corona: string;
  firstName: string;
  lastName: string;
  all_report_management;
  date = this.pipe.transform(this.myDate, 'dd-MM-yyyy');
  date2: string;
  time2: string;
  automaticShift: string;
  creator: boolean;
  now = new Date();

  ngOnInit(): void {
    this.searchReportsGroup = new FormGroup({
      'ReportShift': new FormControl('', null),
      'ReportStatus': new FormControl('', null),
      'ReportDepartment': new FormControl('', null),
      'CaseNumber': new FormControl('', null),
      'ReportStartDate': new FormControl('', null),
      'ReportEndDate': new FormControl('', null),
      'ReportCategory': new FormControl('', null),
    });
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
      Diagnosis: ['', null],
    });
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
    this.date2 = this.datePipe.transform(this.now, 'dd.MM.yyyy');
    this.time2 = this.datePipe.transform(this.now, 'HH:mm');
    this.searchReports();
    this.permission = false;
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
    this.departmentfilter.setValue(this.Dept_Name);
    this.searchReportsGroup.controls['ReportEndDate'].setValue(this.now);
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

  closeModal() {
    this.dialogRef.close();
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




  fillReportDialog(reportid, Dept_Name, firstName, lastName) {
    let dialogRef = this.dialog.open(FillReportComponent);
    dialogRef.componentInstance.reportID = reportid;
    dialogRef.componentInstance.Dept_Name = Dept_Name;
    dialogRef.componentInstance.firstName = firstName;
    dialogRef.componentInstance.lastName = lastName;
  }

  // displayHistoryDialog(reportid) {
  //   let dialogRef = this.dialog.open(DialogElementsExampleDialog);
  //   dialogRef.componentInstance.reportID = reportid;
  // }

  addReply(reportid) {
    let dialogRef = this.dialog.open(ReportRepliesComponent);
    dialogRef.componentInstance.reportID = reportid;
  }

  openShareDialog() {
    let dialogRef = this.dialog.open(ShareReportsDialog);
    dialogRef.componentInstance.reportArray = this.ELEMENT_DATA;
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

  print() {
    this.dialogRef.close(this.ELEMENT_DATA);
  }

  searchReports() {
    if (this.departmentfilter.value == null) {
      this.departmentfilter.setValue('');
    }
    let _reportShift = this.searchReportsGroup.controls['ReportShift'].value;
    let _reportDepartment = this.Dept_Name;
    if (this.Dept_Name == undefined) {
      _reportDepartment = "";
    }
    let _reportStatus = this.searchReportsGroup.controls['ReportStatus'].value;
    let _caseNumber;
    if (this.caseNumber != undefined) {
      _caseNumber = this.caseNumber;
    } else {
      _caseNumber = this.searchReportsGroup.controls['CaseNumber'].value;
    }
    let _reportStartDate = this.searchReportsGroup.controls['ReportStartDate'].value;
    let _reportEndDate = this.searchReportsGroup.controls['ReportEndDate'].value;
    let _reportCategory = this.searchReportsGroup.controls['ReportCategory'].value;
    let pipe = new DatePipe('en-US');
    if (!(_reportStartDate == undefined || _reportStartDate == "" || _reportStartDate == null)) {
      _reportStartDate = pipe.transform(_reportStartDate, 'yyyy/MM/dd');
    } else {
      _reportStartDate = "";
    }
    if (!(_reportEndDate == undefined || _reportEndDate == "" || _reportEndDate == null)) {
      _reportEndDate = pipe.transform(_reportEndDate, 'yyyy/MM/dd');
    } else {
      _reportEndDate = "";
    }
    if (!this.searchReportsGroup.invalid) {
      this.http
        .post("http://srv-apps/wsrfc/WebService.asmx/GetReports", {
          _reportShift: _reportShift,
          _reportDepartment: _reportDepartment,
          _reportStatus: _reportStatus,
          _caseNumber: _caseNumber,
          _reportStartDate: _reportStartDate,
          _reportEndDate: _reportEndDate,
          _reportCategory: _reportCategory,
          _userName: this.UserName,
          _reportType: this.reportType
        })
        .subscribe((Response) => {
          this.ELEMENT_DATA = [];
          this.reportsArr = Response["d"];
          if (this.reportsArr.length > 0) {
            for (var i = 0; i < this.reportsArr.length; i++) {
              this.ELEMENT_DATA.push({
                reportID: this.reportsArr[i].Row_ID,
                ReportDate: this.reportsArr[i].ReportDate,
                ReportStatus: this.reportsArr[i].ReportStatus,
                ReportText: this.reportsArr[i].ReportText,
                userFullName: this.reportsArr[i].UsersReportsList[0].UsersList[0].FirstName + " " + this.reportsArr[i].UsersReportsList[0].UsersList[0].LastName,
                UserName: this.reportsArr[i].UsersReportsList[0].UsersList[0].UserName,
                LastUpdatedDate: this.reportsArr[i].LastUpdatedDate,
                ReportShift: this.reportsArr[i].ReportShift,
                // priority: this.reportsArr[i].ReportPriority,
                ReportMachlol: this.reportsArr[i].ReportMachlol,
                ReportCategory: this.reportsArr[i].ReportCategory,
                ReportSubCategory: this.reportsArr[i].ReportSubCategory,
              });
            }
            this.departmentfilter.setValue(this.Dept_Name);
            this.permission = true;
          }
          this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
        });
    }

  }

  changeReportToHandled(reportID) {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/ReportHandled", {
        _reportID: reportID
      })
      .subscribe((Response) => {
        if (Response["d"]) {
          this.openSnackBar("הדווח נסגר בהצלחה");
          this.searchReports();
        } else {
          this.openSnackBar("משהו השתבש, פעולה לא התקיימה");
        }
      });
  }

  sendReport() {
    this.ReportGroup.controls['ReportMachlol'].setValue(this.departmentfilter.value);
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
            this.searchReports();
          } else {
            this.openSnackBar("משהו השתבש, לא נשמר");
          }
        });
    } else {
      this.openSnackBar("שכחת אחד השדות");
    }
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

  autoDate(amin) {
    if (amin) {
      this.ReportGroup.controls['ReportStatus'].setValue('לטיפול');
    } else {
      this.ReportGroup.controls['ReportStatus'].setValue('טופל');
    }
  }

  onSubmit() {
    this.sendReport();
  }



}

