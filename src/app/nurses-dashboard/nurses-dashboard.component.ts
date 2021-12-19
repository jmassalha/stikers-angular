import {
  Component,
  ElementRef,
  Inject,
  Input,
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
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
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
export interface ImportantCat {
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
    debugger
    if (this.myControl.value == "") {
      this.openSnackBar("נא לבחור אחראי לשליחה");
    } else {
      this.http
        //.post("http://srv-apps/wsrfc/WebService.asmx/AttachReportToUser", {
        .post("http://srv-ipracticom:8080/WebService.asmx/AttachReportToUser", {
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
    { value: '', viewValue: '' },
    { value: 'לטיפול', viewValue: 'לטיפול' },
    { value: 'טופל', viewValue: 'טופל' },
  ];
  importantCat: ImportantCat[] = [
    { value: '1', viewValue: 'חשוב' },
    { value: '0', viewValue: 'רגיל' },
  ];

  @ViewChild('printmycontent') printmycontent: ElementRef;

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  columnsToDisplay = ['date', 'status', 'edit', 'continue', 'reply'];
  ELEMENT_DATA = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @Input()
  autoActiveFirstOption: boolean

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
  all_categories_filter2 = [];
  UserName = localStorage.getItem('loginUserName').toLowerCase();
  departmentfilter = new FormControl();
  categoryfilter = new FormControl();
  categoryfilter2 = new FormControl();
  subcategoryfilter = new FormControl();
  filteredOptions2: Observable<string[]>;
  filteredOptions3: Observable<string[]>;
  filteredOptions3_2: Observable<string[]>;
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
  autoSaveCounter: any;
  autoSaveTimer: any;
  ifGeneral: string = '1';
  AdminNurse: string = '0';
  currentItemsToShow= [];

  ngOnInit(): void {
    this.searchReportsGroup = new FormGroup({
      'ReportShift': new FormControl('', null),
      'PatientName': new FormControl('', null),
      'ReportStatus': new FormControl('הכל', null),
      'ReportDepartment': new FormControl(' ', null),
      'CaseNumber': new FormControl('', null),
      'ReportStartDate': new FormControl('', null),
      'ReportEndDate': new FormControl('', null),
      'ReportCategory': new FormControl('', null),
      'ImportantCategory': new FormControl('הכל', null),
    });
    this.ReportGroup = this.formBuilder.group({
      Row_ID: ['0', null],
      ReportTitle: ['', null],
      ReportMachlol: ['', null],
      ReportCategory: ['', null],
      ReportSubCategory: ['', null],
      Important: [false, null],
      ReportStatus: ['', null],
      ReportShift: [{ value: '', disabled: true }, null],
      ReportText: ['', null],
      toContinue: [false, null],
      Diagnosis: ['', null],
      PatientName: [this.firstname + ' ' + this.lastname, null],
      PatientNurseStatus: [this.description + ' ' + this.corona, null],
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
    this.NursesSystemPermission();
    this.date2 = this.datePipe.transform(this.now, 'dd.MM.yyyy');
    this.time2 = this.datePipe.transform(this.now, 'HH:mm');
    if (this.Dept_Name != '' && this.Dept_Name != undefined) {
      this.ifGeneral = '0';
    }
    setTimeout(() => {
      this.searchReports();
    }, 500);
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
    this.filteredOptions3_2 = this.categoryfilter2.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter3_2(value))
      );
    this.filteredOptions4 = this.subcategoryfilter.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter4(value))
      );
    this.departmentfilter.setValue(this.Dept_Name);

    this.categoryfilter.setValue('');
    this.subcategoryfilter.setValue('');
    this.searchReportsGroup.controls['ReportEndDate'].setValue(this.now);
    this.currentItemsToShow = this.ELEMENT_DATA;
  }
  
  onPageChange($event) {
    this.currentItemsToShow =  this.ELEMENT_DATA.slice($event.pageIndex*$event.pageSize, $event.pageIndex*$event.pageSize + $event.pageSize);
  }

  private _filter2(value: string): string[] {
    const filterValue2 = value;
    return this.department.filter(option => option.Dept_Name.includes(filterValue2));
  }
  private _filter3(value: string): string[] {
    const filterValue3 = value;
    return this.all_categories_filter.filter(option => option.Cat_Name.includes(filterValue3));
  }
  private _filter3_2(value: string): string[] {
    const filterValue3_2 = value;
    return this.all_categories_filter2.filter(option => option.Cat_Name.includes(filterValue3_2));
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

  setImportantReport() {
    if (this.ReportGroup.controls['Important'].value == 'True' || this.ReportGroup.controls['Important'].value == true) {
      this.ReportGroup.controls['Important'].setValue('False');
    } else {
      this.ReportGroup.controls['Important'].setValue('True');
    }
  }

  getCategories() {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetCategories", {
      })
      .subscribe((Response) => {
        this.all_categories_filter = Response["d"];
        this.all_categories_filter2 = Response["d"];
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

  NursesSystemPermission() {
    let userName = localStorage.getItem("loginUserName").toLowerCase();
    return this.http.post("http://srv-apps/wsrfc/WebService.asmx/NursesUserPersmission", { _userName: userName, withCredentials: true }).subscribe(response => {
      if (response["d"].IfFound) {
        this.AdminNurse = '1';
      };
    });
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
    // this.dialogRef.close(this.ELEMENT_DATA);
    // $("#loader").removeClass("d-none");
    let that = this;
    setTimeout(function () {
      var printContents = that.printmycontent.nativeElement.innerHTML;
      var w = window.open();
      w.document.write(printContents);
      w.print();
      w.close();
    }, 1000);
  }

  searchReports() {
    let myDate2 = new Date();
    if (this.departmentfilter.value == null) {
      this.departmentfilter.setValue('');
    }
    let _reportShift = this.searchReportsGroup.controls['ReportShift'].value;
    let _reportDepartment = this.Dept_Name;
    if (this.Dept_Name == undefined) {
      _reportDepartment = "";
    }
    if (this.departmentfilter.value != '' && this.departmentfilter.value != null) {
      _reportDepartment = this.departmentfilter.value;
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
    this.searchReportsGroup.controls['ReportCategory'].setValue(this.categoryfilter2.value);
    let _reportCategory = this.searchReportsGroup.controls['ReportCategory'].value;
    if (_reportCategory == null) {
      _reportCategory = "";
    }
    let _patientName = this.searchReportsGroup.controls['PatientName'].value;
    let pipe = new DatePipe('en-US');
    if (!(_reportStartDate == undefined || _reportStartDate == "" || _reportStartDate == null)) {
      _reportStartDate = pipe.transform(_reportStartDate, 'yyyy/MM/dd');
    } else {
      myDate2.setDate(myDate2.getDate() - 1);
      _reportStartDate = pipe.transform(myDate2, 'yyyy/MM/dd 07:00:00');
    }
    if (!(_reportEndDate == undefined || _reportEndDate == "" || _reportEndDate == null)) {
      _reportEndDate = pipe.transform(_reportEndDate, 'yyyy/MM/dd');
    } else {
      _reportEndDate = "";
    }
    let _important = this.searchReportsGroup.controls['ImportantCategory'].value;
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
          _reportType: this.reportType,
          _ifGeneral: this.ifGeneral,
          _patientName: _patientName,
          _important: _important
        })
        .subscribe((Response) => {
          this.ELEMENT_DATA = [];
          this.reportsArr = Response["d"];
          if (this.reportsArr.length > 0) {
            for (var i = 0; i < this.reportsArr.length; i++) {
              if (this.AdminNurse == "0" && this.reportsArr[i].AdminNurse == "1") {
                continue;
              } else {
                this.ELEMENT_DATA.push({
                  reportID: this.reportsArr[i].Row_ID,
                  ReportDate: this.reportsArr[i].ReportDate,
                  ReportStatus: this.reportsArr[i].ReportStatus,
                  ReportText: this.reportsArr[i].ReportText,
                  userFullName: this.reportsArr[i].UsersReportsList[0].UsersList[0].FirstName + " " + this.reportsArr[i].UsersReportsList[0].UsersList[0].LastName,
                  UserName: this.reportsArr[i].UsersReportsList[0].UsersList[0].UserName,
                  LastUpdatedDate: this.reportsArr[i].LastUpdatedDate,
                  ReportShift: this.reportsArr[i].ReportShift,
                  ReportMachlol: this.reportsArr[i].ReportMachlol,
                  ReportCategory: this.reportsArr[i].ReportCategory,
                  ReportSubCategory: this.reportsArr[i].ReportSubCategory,
                  ReportsReplyList: this.reportsArr[i].ReportsReplyList,
                  Important: this.reportsArr[i].Important,
                  PatientName: this.reportsArr[i].PatientName,
                  AdminNurse: this.reportsArr[i].AdminNurse,
                });
              }
            }
            // if(this.AdminNurse != '1'){
            //  this.ELEMENT_DATA.filter(s => s.includes('val')); 
            // }
            if (_caseNumber != "") {
              this.ReportGroup.controls['Diagnosis'].setValue(this.reportsArr[0].Diagnosis);
            }
            this.departmentfilter.setValue(this.Dept_Name);
            this.permission = true;
          }
          this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
          this.currentItemsToShow =  this.ELEMENT_DATA.slice(0, 5);
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

  // autosave() {
  //   this.autoSaveTimer;
  //   let lengthOfText = this.ReportGroup.controls['ReportText'].value.length;
  //   if (lengthOfText > 0) {
  //     this.sendReport('1');
  //   }
  //   this.autoSaveTimer = setTimeout(() => {
  //     this.autosave();
  //   }, 6000);
  // }



  sendReport(autosave) {
    this.ReportGroup.controls['ReportMachlol'].setValue(this.departmentfilter.value);
    this.ReportGroup.controls['ReportCategory'].setValue(this.categoryfilter.value);
    if (this.ReportGroup.controls['ReportMachlol'].value == undefined) {
      this.ReportGroup.controls['ReportMachlol'].setValue('');
    }
    if (this.caseNumber == undefined) {
      this.caseNumber = "";
    }
    if (!this.ReportGroup.invalid) {
      this.http
        .post("http://srv-apps/wsrfc/WebService.asmx/AddUpdateReport", {
          _report: this.ReportGroup.getRawValue(),
          _userName: this.UserName,
          _caseNumber: this.caseNumber,
          _reportType: this.reportType,
          _ifGeneral: this.ifGeneral,
          _AdminNurse: this.AdminNurse,
          _Patient_DobGender: this.dob + ' ' + this.gender
        })
        .subscribe((Response) => {
          if (Response["d"] != 0) {
            if (autosave == '0') {
              this.openSnackBar("נשמר בהצלחה");
              // this.ReportGroup.reset();
              this.Dept_Name = "";
              this.departmentfilter.setValue('');
              this.ngOnInit();
            }
            else {
              this.openSnackBar("נשמר בהצלחה");
              this.ReportGroup.controls['Row_ID'].setValue(Response["d"]);
              // this.ReportGroup.reset();
            }
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
          this.searchReports();
        } else {
          this.openSnackBar("משהו השתבש, לא נמחק");
        }
      });
  }

  autoDate(amin) {
    if (amin == true) {
      this.ReportGroup.controls['ReportStatus'].setValue('לטיפול');
    } else if(amin == false) {
      this.ReportGroup.controls['ReportStatus'].setValue('טופל');
    }else{
      if(amin.value == "לטיפול"){
        this.ReportGroup.controls['toContinue'].setValue(true);
      }else{
        this.ReportGroup.controls['toContinue'].setValue(false);
      }
    }
  }

  onSubmit(autosave) {
    this.sendReport(autosave);
  }



}