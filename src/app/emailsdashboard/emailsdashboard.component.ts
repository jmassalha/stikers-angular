import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { StatusComplaintComponent } from '../status-complaint/status-complaint.component';
import { EmailmanagementComponent } from '../emailmanagement/emailmanagement.component';
import { DatePipe } from '@angular/common';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

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
}

export interface CompStatus {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-emailsdashboard',
  templateUrl: './emailsdashboard.component.html',
  styleUrls: ['./emailsdashboard.component.css']
})
export class EmailsdashboardComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild("toggle") ref: ElementRef;
  all_forms_filter = [];
  all_departs_filter = [];
  department = [];

  formSearch: FormGroup;
  tableEmails: FormGroup;
  todaysDate = Date.now;

  TABLE_DATA: Email[] = [];
  displayedColumns: string[] = [
    'FormID', 'FormName', 'formDepartment', 'FormDate', 'update','add', 'showAll','status'
  ];
  dataSource = new MatTableDataSource(this.TABLE_DATA);

  compStatus: CompStatus[] = [
    { value: '1', viewValue: 'פתוח' },
    { value: '0', viewValue: 'סגור' },
  ];

  constructor(
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient) { }

    UserName = localStorage.getItem("loginUserName").toLowerCase();


  ngOnInit(): void {

    this.formSearch = new FormGroup({
      'compName': new FormControl('', null),
      'departmentControl': new FormControl('', null),
      'compStatusControl': new FormControl('', null),
      'compDateControl': new FormControl('', null),
    });
    this.tableEmails = new FormGroup({
      'slideT': new FormControl('', null),
    });

    this.searchForm();

  }

  openDialogToManageEmail(id,fakeID) {
    let dialogRef = this.dialog.open(EmailmanagementComponent);
    dialogRef.componentInstance.urlID = id;
    dialogRef.componentInstance.fakeID = fakeID;
  }

  openDialogToStatusComplaint(id) {
    let dialogRef = this.dialog.open(StatusComplaintComponent);
    dialogRef.componentInstance.urlID = id;
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  changeStatus(e: any,emailID: string){
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/ChangeStatus", {
        _status: e.checked,
        _emailID: emailID,
      })
      .subscribe((Response) => {
        let snackbar = Response["d"];
        if(snackbar == "opened"){
          this.openSnackBar("סטטוס פניה: פתוח");
        }else{
          this.openSnackBar("סטטוס פניה: סגור");
        }
        
      });
  }

  searchForm() {
    let compName = this.formSearch.controls['compName'].value;
    let departmentControl = this.formSearch.controls['departmentControl'].value;
    let compDateControl = this.formSearch.controls['compDateControl'].value;
    let compStatusControl = this.formSearch.controls['compStatusControl'].value;
    if(compStatusControl == ""){
      compStatusControl = '1';
    }else if(compStatusControl == undefined){
      compStatusControl = "";
    }
    if(departmentControl == undefined){
      departmentControl = "";
    }

    

    // let pipe = new DatePipe('en-US');
    // if(!(compDateControl == undefined || compDateControl == "" || compDateControl == null)){
    //   compDateControl = pipe.transform(compDateControl, 'yyyy/MM/dd');
    // }else{
    //   compDateControl = "";
    // }

    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/Comp_Emails", {
        _compName: compName,
        _compDate: compDateControl,
        _compStatus: compStatusControl,
      })
      .subscribe((Response) => {

        this.all_forms_filter = Response["d"];
        this.TABLE_DATA = [];
        for (var i = 0; i < this.all_forms_filter.length; i++) {
          if(this.all_forms_filter[i].Status == "1"){
            this.tableEmails.controls['slideT'].setValue(true);
          }else{
            this.tableEmails.controls['slideT'].setValue(false);
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
            EmailDateTime: this.all_forms_filter[i].EmailDateTime,
            Status: this.all_forms_filter[i].Status,
          });
        }
        this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
        this.dataSource.paginator = this.paginator;
      });
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetFormsDeparts", {
      })
      .subscribe((Response) => {
        this.all_departs_filter = Response["d"];
        this.all_departs_filter.forEach(element => {
          this.department.push(element.Depart_Name);
        })
      });
  }

  onsubmit(){
    console.log(this.formSearch.value);
  }


}
