import {
  Component,
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
export interface Priority {
  value: string;
  viewValue: string;
}
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
  dataSource2 ;


  constructor(private _snackBar: MatSnackBar,
    private router: Router,
    private http: HttpClient,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    private confirmationDialogService: ConfirmationDialogService,
    activeModal: NgbActiveModal) { }

  all_history_filter = [];
  reportID: string;

  ngOnInit(): void {
    this.getHistories();
  }

  closeDialog(){
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
            let runingNum = i+1;
            ELEMENT_DATA2.push({
              Row_ID: runingNum.toString(),
              UpdateDate: this.all_history_filter[i].UpdateDate,
              FullName: this.all_history_filter[i].FirstName+' '+this.all_history_filter[i].LastName,
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

  priority: Priority[] = [
    { value: 'רגיל', viewValue: 'רגיל' },
    { value: 'דחוף', viewValue: 'דחוף' },
    { value: 'בהול', viewValue: 'בהול' },
  ];
  status: Status[] = [
    { value: 'חדש', viewValue: 'חדש' },
    { value: 'לא טופל', viewValue: 'לא טופל' },
    { value: 'בטיפול', viewValue: 'בטיפול' },
    { value: 'טופל', viewValue: 'טופל' },
  ];


  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  dataSource;
  columnsToDisplay = ['date', 'title', 'status', 'edit','reply'];
  expandedElement: PeriodicElement | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;


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

  ngOnInit(): void {

    this.searchReportsGroup = new FormGroup({
      'ReportShift': new FormControl('', null),
      'ReportStatus': new FormControl('', null),
      'ReportCategory': new FormControl('', null),
      'OpenText': new FormControl('', null),
      'ReportStartDate': new FormControl('', null),
      'ReportEndDate': new FormControl('', null),
      'ReportPriority': new FormControl('', null),
    });
    this.searchReports();
    this.getCategories();
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

  searchReports() {

    let _reportShift = this.searchReportsGroup.controls['ReportShift'].value;
    let _reportCategory = this.searchReportsGroup.controls['ReportCategory'].value;
    let _reportStatus = this.searchReportsGroup.controls['ReportStatus'].value;
    let _openText = this.searchReportsGroup.controls['OpenText'].value;
    let _reportStartDate = this.searchReportsGroup.controls['ReportStartDate'].value;
    let _reportEndDate = this.searchReportsGroup.controls['ReportEndDate'].value;
    let _reportPriority = this.searchReportsGroup.controls['ReportPriority'].value;
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
        _reportCategory: _reportCategory,
        _reportStatus: _reportStatus,
        _openText: _openText,
        _reportStartDate: _reportStartDate,
        _reportEndDate: _reportEndDate,
        _reportPriority: _reportPriority,
      })
      .subscribe((Response) => {
        let ELEMENT_DATA = [];

        this.reportsArr = Response["d"];
        if (this.reportsArr.length > 0) {
          for (var i = 0; i < this.reportsArr.length; i++) {
            ELEMENT_DATA.push({
              reportID: this.reportsArr[i].Row_ID,
              date: this.reportsArr[i].ReportDate,
              title: this.reportsArr[i].ReportTitle,
              status: this.reportsArr[i].ReportStatus,
              description: this.reportsArr[i].ReportText,
              userFullName: this.reportsArr[i].UsersReportsList[0].UsersList[0].FirstName + " " + this.reportsArr[i].UsersReportsList[0].UsersList[0].LastName,
              updateDate: this.reportsArr[i].LastUpdatedDate,
              shift: this.reportsArr[i].ReportShift,
              priority: this.reportsArr[i].ReportPriority,
            });
          }

        }
        this.dataSource = ELEMENT_DATA;
        this.dataSource.paginator = this.paginator;
      });
  }

}
