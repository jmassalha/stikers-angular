import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FillReportComponent } from '../fill-report/fill-report.component';
import { NursesDashboardComponent } from '../nurses-dashboard/nurses-dashboard.component';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-nurses-department-manage',
  templateUrl: './nurses-department-manage.component.html',
  styleUrls: ['./nurses-department-manage.component.css']
})
export class NursesDepartmentManageComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  displayedColumns: string[] = ['nursing', 'receipts', 'released', 'plannedtorelease', 'holiday', 'respirators', 'catheter', 'centralcatheter', 'isolation', 'phlimitation', 'death', 'kpc', 'complex'];
  dataSource = new MatTableDataSource<any>();

  displayedColumns2: string[] = ['casenumber', 'departmentmedical', 'lastname','firstname', 'dadname', 'age', 'gender', 'enterdate', 'entertime', 'displayreports'];
  dataSource2 = new MatTableDataSource<any>();

  applyFilter(event: Event, filval: string) {
    if (filval == '') {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource2.filter = filterValue;
    }else{
      this.dataSource2.filter = filval;
    }
  }

  constructor(public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<NursesDepartmentManageComponent>,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe) { }


  departCode: string;
  Dept_Name: string;
  loading: boolean;
  Patientsloading: boolean;
  patientsTable: boolean;
  departmentArray = [];
  ELEMENT_DATA = [];
  ELEMENT_DATA2 = [];
  departmentRelease: FormGroup;
  date = new Date();
  myDate = this.datePipe.transform(this.date, 'yyyy-MM-dd');

  ngOnInit(): void {
    this.loading = true;
    this.patientsTable = false;
    this.Patientsloading = false;
    this.departmentRelease = new FormGroup({
      plannedToRelease: new FormControl('', null),
    });
    this.getDepartDetails();
    this.getSubmitPlannedToRealse('0');
  }

  getSubmitPlannedToRealse(ifsaved) {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetSubmitPlannedToRealse", {
        _plannedToRelease: this.departmentRelease.controls['plannedToRelease'].value,
        _departCode: this.departCode,
        userName: localStorage.getItem('loginUserName').toLowerCase()
      })
      .subscribe((Response) => {
        this.departmentRelease.controls['plannedToRelease'].setValue(Response["d"][0]);
      });
    if (ifsaved == '1') {
      this.openSnackBar("נשמר בהצלחה");
      this.ngOnInit();
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  fillReportDialog(reportid, Dept_Name, firstName, lastName, caseNumber) {
    let dialogRef = this.dialog.open(FillReportComponent);
    dialogRef.componentInstance.reportID = reportid;
    dialogRef.componentInstance.Dept_Name = Dept_Name;
    dialogRef.componentInstance.firstName = firstName;
    dialogRef.componentInstance.lastName = lastName;
    dialogRef.componentInstance.caseNumber = caseNumber;
  }
  displayReports(caseNumber, asDialog, Dept_Name, firstname, lastname,gender,dob,reportType) {
    let dialogRef = this.dialog.open(NursesDashboardComponent);
    dialogRef.componentInstance.caseNumber = caseNumber;
    dialogRef.componentInstance.asDialog = asDialog;
    dialogRef.componentInstance.Dept_Name = Dept_Name;
    dialogRef.componentInstance.firstname = firstname;
    dialogRef.componentInstance.lastname = lastname;
    dialogRef.componentInstance.gender = gender;
    dialogRef.componentInstance.dob = dob;
    dialogRef.componentInstance.reportType = reportType;
    dialogRef.afterClosed()
      .subscribe((data) => {
        if(data){
          this.dialogRef.close(data);
        }
      })
  }

  getDepartDetails() {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetDepartDetails", {
        _departCode: this.departCode
      })
      .subscribe((Response) => {
        this.ELEMENT_DATA = Response["d"];
        if (this.ELEMENT_DATA.length == 0) {
          this.openSnackBar("לא נטען, לנסות שוב");
        }
        this.loading = false;
        this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
      });
  }

  getPatientsPerDepart(event: Event,subDepart: string) {
    this.Patientsloading = true;
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetPatientsPerDepart", {
        _departCode: this.departCode
      })
      .subscribe((Response) => {
        this.dataSource2 = new MatTableDataSource<any>(Response["d"]);
        this.patientsTable = !this.patientsTable;
        if(subDepart != ''){
          this.patientsTable = true;
          this.applyFilter(event,subDepart);
        }
        this.Patientsloading = false;
      });
  }


}
