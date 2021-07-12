import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatPaginator } from "@angular/material/paginator";
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
} from "@angular/forms";
import { ConfirmationDialogService } from "../confirmation-dialog/confirmation-dialog.service";
import { FillReportComponent } from '../fill-report/fill-report.component';
import { ReportRepliesComponent } from '../report-replies/report-replies.component';
import { MatDialog } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from "@angular/material/table";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
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
// export interface Priority {
//   value: string;
//   viewValue: string;
// }
export interface Status {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'dialog-elements-example-dialog',
  templateUrl: 'changesHistory.html',
})

export class DialogElementsExampleDialog implements OnInit {

  displayedColumns: string[] = ['Row_ID', 'UpdateDate', 'FullName'];
  dataSource2;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    public datepipe: DatePipe) { }

  all_history_filter = [];
  reportID: string;
  

  ngOnInit(): void {
    this.getHistories();
    
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  getHistories() {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetReportsChangesHistory", {
        _reportID: this.reportID
      })
      .subscribe((Response) => {
        let ELEMENT_DATA2 = [];
        this.all_history_filter = Response["d"];
        if (this.all_history_filter.length > 0) {
          for (var i = 0; i < this.all_history_filter.length; i++) {
            let runingNum = i + 1;
            ELEMENT_DATA2.push({
              Row_ID: runingNum.toString(),
              UpdateDate: this.all_history_filter[i].UpdateDate,
              FullName: this.all_history_filter[i].FirstName + ' ' + this.all_history_filter[i].LastName,
            });
          }
        }
        this.dataSource2 = ELEMENT_DATA2;
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

  // priority: Priority[] = [
  //   { value: 'רגיל', viewValue: 'רגיל' },
  //   { value: 'דחוף', viewValue: 'דחוף' },
  //   { value: 'בהול', viewValue: 'בהול' },
  // ];

  status: Status[] = [
    { value: 'בטיפול', viewValue: 'לטיפול' },
    { value: 'טופל', viewValue: 'טופל' },
  ];

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  columnsToDisplay = ['date', 'title', 'status', 'edit', 'reply'];
  expandedElement: PeriodicElement | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ELEMENT_DATA = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  constructor(private _snackBar: MatSnackBar,
    private router: Router,
    private http: HttpClient,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    private confirmationDialogService: ConfirmationDialogService,
    activeModal: NgbActiveModal) { }

  searchReportsGroup: FormGroup;
  reportsArr = [];
  all_categories_filter = [];
  UserName = localStorage.getItem('loginUserName').toLowerCase();
  departmentfilter = new FormControl();
  filteredOptions2: Observable<string[]>;
  department = [];
  all_departs_filter = [];
  permission: boolean = false;

  ngOnInit(): void {
    this.searchReportsGroup = new FormGroup({
      'ReportShift': new FormControl('', null),
      'ReportStatus': new FormControl('', null),
      'ReportDepartment': new FormControl('', null),
      'OpenText': new FormControl('', null),
      'ReportStartDate': new FormControl('', null),
      'ReportEndDate': new FormControl('', null),
      'ReportCategory': new FormControl('', null),
    });
    this.searchReports();
    this.getCategories();
    this.getDeparts();
    this.permission = false;
    this.filteredOptions2 = this.departmentfilter.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter2(value))
      );
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  getCategories() {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetCategories", {
      })
      .subscribe((Response) => {
        this.all_categories_filter = Response["d"];
      });
  }

  private _filter2(value: string): string[] {
    const filterValue2 = value;
    return this.department.filter(option => option.Dept_Name.includes(filterValue2));
  }

  fillReportDialog(reportid) {
    let dialogRef = this.dialog.open(FillReportComponent);
    dialogRef.componentInstance.reportID = reportid;
  }

  displayHistoryDialog(reportid) {
    let dialogRef = this.dialog.open(DialogElementsExampleDialog);
    dialogRef.componentInstance.reportID = reportid;
  }

  addReply(reportid) {
    let dialogRef = this.dialog.open(ReportRepliesComponent);
    dialogRef.componentInstance.reportID = reportid;
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
    window.print();
  }

  searchReports() {
    if(this.departmentfilter.value == null){
      this.departmentfilter.setValue('');
    }
    let _reportShift = this.searchReportsGroup.controls['ReportShift'].value;
    let _reportDepartment = this.departmentfilter.value;
    let _reportStatus = this.searchReportsGroup.controls['ReportStatus'].value;
    let _openText = this.searchReportsGroup.controls['OpenText'].value;
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
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetReports", {
        _reportShift: _reportShift,
        _reportDepartment: _reportDepartment,
        _reportStatus: _reportStatus,
        _openText: _openText,
        _reportStartDate: _reportStartDate,
        _reportEndDate: _reportEndDate,
        _reportCategory: _reportCategory,
        _userName: this.UserName
      })
      .subscribe((Response) => {
        this.ELEMENT_DATA = [];
        this.reportsArr = Response["d"];
        if (this.reportsArr.length > 0) {
          for (var i = 0; i < this.reportsArr.length; i++) {
            this.ELEMENT_DATA.push({
              reportID: this.reportsArr[i].Row_ID,
              date: this.reportsArr[i].ReportDate,
              title: this.reportsArr[i].ReportTitle,
              status: this.reportsArr[i].ReportStatus,
              description: this.reportsArr[i].ReportText,
              userFullName: this.reportsArr[i].UsersReportsList[0].UsersList[0].FirstName + " " + this.reportsArr[i].UsersReportsList[0].UsersList[0].LastName,
              updateDate: this.reportsArr[i].LastUpdatedDate,
              shift: this.reportsArr[i].ReportShift,
              // priority: this.reportsArr[i].ReportPriority,
              machlol: this.reportsArr[i].ReportMachlol,
              category: this.reportsArr[i].ReportCategory,
            });
          }
          this.permission = true;
        }
        this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
      });
  }
}
