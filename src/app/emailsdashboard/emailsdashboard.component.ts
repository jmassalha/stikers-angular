import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { StatusComplaintComponent } from '../status-complaint/status-complaint.component';
import { EmailmanagementComponent } from '../emailmanagement/emailmanagement.component';
import { DatePipe } from '@angular/common';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as XLSX from 'xlsx';

export interface Email {
  EmailID: string;
  EmailSender: string;
  EmailReciever: string;
  EmailSubject: string;
  CompSubject: string;
  CompName: string;
  CompPhone: string;
  CompEmail: string;
  ContentToShow: string;
  EmailDateTime: string;
  Status: string;
  NumberOfUnread: string;
}

export interface CompStatus {
  value: string;
  viewValue: string;
}
export interface CompType {
  value: string;
  viewValue: string;
}
export interface DeadLine {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'notification-dialog',
  templateUrl: 'notification-dialog.html',
})
export class DialogContentExampleDialog {

  constructor(public dialog: MatDialog) { }
  closeNotificationDialog() {
    this.dialog.closeAll();
  }
}
@Component({
  selector: 'app-emailsdashboard',
  templateUrl: './emailsdashboard.component.html',
  styleUrls: ['./emailsdashboard.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EmailsdashboardComponent implements OnInit {

  deadline: DeadLine[] = [
    { value: '8', viewValue: 'שבוע' },
    { value: '16', viewValue: 'שבועיים' },
    { value: '22', viewValue: '3 שבועות' },
  ];
  compDepts: any[] = [];

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild("toggle") ref: ElementRef;
  all_forms_filter = [];
  all_departs_filter = [];
  department = [];
  ifRead: string = "0";

  formSearch: FormGroup;
  tableEmails: FormGroup;
  todaysDate = Date.now;

  TABLE_DATA: Email[] = [];
  TABLE_DATAExcel: any[] = [];
  displayedColumns: string[] = [
    'delete', 'FormID', 'FormName', 'formDepartment', 'FormDate', 'update', 'add', 'showAll', 'status'
  ];
  // displayedColumns: string[] = [
  //   'מחיקת פנייה', 'מס פניה', 'שם פונה', 'נושא פניה', 'תאריך קבלת פניה', 'ניהול פניה', 'פיצול פניה', 'צירוף אחראי לפניה', 'סטטוס פניה'
  // ];
  expandedElement: Email | null;
  dataSource = new MatTableDataSource(this.TABLE_DATA);
  dataSourceExcel = new MatTableDataSource(this.TABLE_DATAExcel);

  compStatus: CompStatus[] = [
    { value: '1', viewValue: 'פתוח' },
    { value: '0', viewValue: 'סגור' },
  ];

  compType: CompType[] = [
    { value: 'Complaint', viewValue: 'תלונה' },
    { value: 'Thank', viewValue: 'תודה' },
    { value: 'Inquiry', viewValue: 'פנייה' },
  ];

  constructor(
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService,
    private http: HttpClient) { }

  UserName = localStorage.getItem("loginUserName").toLowerCase();
  loaded: boolean;
  filteredOptions2: Observable<string[]>;
  departmentfilter = new FormControl();
  totalNumberOfInquiries: number;


  ngOnInit() {

    this.formSearch = new FormGroup({
      'compName': new FormControl('', null),
      'departmentControl': new FormControl('', null),
      'compStatusControl': new FormControl('', null),
      'compTypeControl': new FormControl('', null),
      'compDateControl': new FormControl('', null),
      'compDateControl2': new FormControl('', null),
      'DeadLineSearch': new FormControl('', null),
    });
    this.tableEmails = new FormGroup({
      'slideT': new FormControl('', null),
    });
    this.searchForm("0", false);
    this.filteredOptions2 = this.departmentfilter.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter2(value))
      );
  }

  private _filter2(value: string): string[] {
    const filterValue2 = value;
    return this.compDepts.filter(option => option.includes(filterValue2));
  }

  openNotificationDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);
  }

  openDialogToManageEmail(id, fakeID) {
    let dialogRef = this.dialog.open(EmailmanagementComponent);
    dialogRef.componentInstance.urlID = id;
    dialogRef.componentInstance.fakeID = fakeID;
    dialogRef.afterClosed().subscribe(result => {
      this.searchForm('0', false);
    });
  }

  openDialogToStatusComplaint(id) {
    let dialogRef = this.dialog.open(StatusComplaintComponent);
    dialogRef.componentInstance.urlID = id;
    dialogRef.afterClosed().subscribe(result => {
      this.searchForm('0', false);
    });
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  loadInquiries() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/SavingEmailsToDB", {
      })
      .subscribe((Response) => {
        this.openSnackBar("פניות נטענו בהצלחה");
        setTimeout(() => {
          this.ngOnInit();
        }, 1500);
      });
  }

  changeStatus(e: any, emailID: string) {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/ChangeStatus", {
        _status: e.checked,
        _emailID: emailID,
      })
      .subscribe((Response) => {
        let snackbar = Response["d"];
        if (snackbar == "opened") {
          this.openSnackBar("סטטוס פניה: פתוח");
        } else {
          this.openSnackBar("סטטוס פניה: סגור");
        }

      });
  }

  clearFields() {
    this.formSearch.controls['compName'].setValue("");
    this.departmentfilter.setValue("");
    this.formSearch.controls['compDateControl'].setValue("");
    this.formSearch.controls['compDateControl2'].setValue("");
    this.formSearch.controls['DeadLineSearch'].setValue("");
    this.formSearch.controls['compStatusControl'].setValue("");
    this.formSearch.controls['compTypeControl'].setValue("");
    this.searchForm("0", false);
  }

  deleteInquiry(inquiryID) {
    this.confirmationDialogService
      .confirm("נא לאשר..", "האם אתה בטוח ...? ")
      .then((confirmed) => {
        console.log("User confirmed:", confirmed);
        if (confirmed) {
          this.http
            .post(
              "http://srv-apps-prod/RCF_WS/WebService.asmx/DeleteInquiry",
              {
                _inquiryID: inquiryID
              }
            )
            .subscribe((Response) => {
              if (Response["d"]) {
                this.openSnackBar("נמחק בהצלחה");
                this.searchForm('0', false);
              } else {
                this.openSnackBar("משהו השתבש, לא נמחק !");
              }
            });
        } else {
        }
      })
      .catch(() =>
        console.log(
          "User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)"
        )
      );
  }


  fileName = 'PublicInquiries_Report.xlsx';
  exportexcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  searchForm(isRead, toExcel) {
    let compName = this.formSearch.controls['compName'].value;
    let departmentControl = this.departmentfilter.value;
    let compDateControl = this.formSearch.controls['compDateControl'].value;
    let compDateControl2 = this.formSearch.controls['compDateControl2'].value;
    let compStatusControl = this.formSearch.controls['compStatusControl'].value;
    let compTypeControl = this.formSearch.controls['compTypeControl'].value;
    let deadLineSearch = this.formSearch.controls['DeadLineSearch'].value;
    if (compStatusControl == "" && compName == "") {
      compStatusControl = '1';
    } else if (compStatusControl == "" && compName != "") {
      compStatusControl = '';
    } else if (compStatusControl == undefined) {
      compStatusControl = "";
    }
    if (departmentControl == undefined) {
      departmentControl = "";
    }
    if (deadLineSearch == undefined) {
      deadLineSearch = "";
    }
    let pipe = new DatePipe('en-US');
    if (!(compDateControl == undefined || compDateControl == "" || compDateControl == null)) {
      // compDateControl.setDate( compDateControl.getDate() + 1 );
      compDateControl = pipe.transform(compDateControl, 'yyyy/MM/dd');
    } else {
      compDateControl = "";
    }
    if (!(compDateControl2 == undefined || compDateControl2 == "" || compDateControl2 == null)) {
      compDateControl2 = pipe.transform(compDateControl2, 'yyyy/MM/dd');
    } else {
      compDateControl2 = "";
    }
    if (compTypeControl == undefined) {
      compTypeControl = "";
    }
    this.loaded = false;
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/Comp_Emails", {
        _compName: compName,
        _compDate: compDateControl,
        _compDate2: compDateControl2,
        _compStatus: compStatusControl,
        _compType: compTypeControl,
        _departmentControl: departmentControl,
        _deadLine: deadLineSearch,
        _userName: this.UserName,
        _isRead: isRead
      })
      .subscribe((Response) => {
        this.totalNumberOfInquiries = 0;
        this.loaded = true;
        if (isRead == "1") {
          window.location.reload();
        }
        this.all_forms_filter = Response["d"];
        this.TABLE_DATA = [];
        if (this.all_forms_filter.length > 0) {
          if (this.all_forms_filter[0].NumberOfUrgent != "0" && this.UserName.toLowerCase() == "matias") {
            this.openNotificationDialog();
          }
        }

        for (var i = 0; i < this.all_forms_filter.length; i++) {
          let status;
          if (this.all_forms_filter[i].Status == "1") {
            status = true;
          } else {
            status = false;
          }

          this.TABLE_DATA.push({
            EmailID: this.all_forms_filter[i].Row_ID,
            EmailSender: this.all_forms_filter[i].EmailSender,
            EmailReciever: this.all_forms_filter[i].EmailReciever,
            EmailSubject: this.all_forms_filter[i].EmailSubject,
            CompSubject: this.all_forms_filter[i].CompSubject,
            CompName: this.all_forms_filter[i].CompName,
            CompPhone: this.all_forms_filter[i].CompPhone,
            CompEmail: this.all_forms_filter[i].CompEmail,
            ContentToShow: this.all_forms_filter[i].ContentToShow,
            EmailDateTime: this.all_forms_filter[i].EmailDateTime.split(' ')[0],
            Status: status,
            NumberOfUnread: this.all_forms_filter[i].NumberOfUnread,
          });
          this.totalNumberOfInquiries++;
        }
        this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
        this.dataSource.paginator = this.paginator;
      });
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetCompDepartments", {
      })
      .subscribe((Response) => {
        this.compDepts = [];
        this.all_departs_filter = Response["d"];
        this.all_departs_filter.forEach(element => {
          this.compDepts.push(element.Dept_Name);
        })
      });
    if (toExcel) {
      this.http
        .post("http://srv-apps-prod/RCF_WS/WebService.asmx/ExportToExcel", {
          _compName: compName,
          _compDate: compDateControl,
          _compDate2: compDateControl2,
          _compStatus: compStatusControl,
          _compType: compTypeControl,
          _departmentControl: departmentControl,
          _deadLine: deadLineSearch,
          _userName: this.UserName,
          _isRead: isRead
        }).subscribe((Response) => {
          this.TABLE_DATAExcel = Response["d"];
          this.dataSourceExcel = new MatTableDataSource<any>(this.TABLE_DATAExcel);
          let that = this;
          setTimeout(() => {
            that.exportexcel();
          }, 1500);
        });
    }
  }

  onsubmit() {
    console.log(this.formSearch.value);
  }


}
