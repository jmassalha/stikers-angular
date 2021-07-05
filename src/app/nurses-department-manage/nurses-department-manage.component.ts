import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FillReportComponent } from '../fill-report/fill-report.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nurses-department-manage',
  templateUrl: './nurses-department-manage.component.html',
  styleUrls: ['./nurses-department-manage.component.css']
})
export class NursesDepartmentManageComponent implements OnInit {

  displayedColumns: string[] = ['nursing','medical','receipts','released','plannedtorelease','holiday','respirators','catheter','centralcatheter','isolation','phlimitation','death','kpc','complex','cva'];
  dataSource = new MatTableDataSource<any>();

  displayedColumns2: string[] = ['tablenum','casenumber','departmentnursing','departmentmedical','passportid','firstname','lastname','dob','gender','city','enterdate','entertime'];
  dataSource2 = new MatTableDataSource<any>();

  constructor(public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder) { }

  departCode: string;
  Dept_Name: string;
  loading: boolean;
  patientsTable: boolean;
  departmentArray = [];
  ELEMENT_DATA = [];
  ELEMENT_DATA2 = [];

  ngOnInit(): void {
    this.loading = true;
    this.patientsTable = false;
    this.getDepartDetails();
  }


  fillReportDialog(reportid,Dept_Name) {
    let dialogRef = this.dialog.open(FillReportComponent);
    dialogRef.componentInstance.reportID = reportid;
    dialogRef.componentInstance.Dept_Name = Dept_Name;
  }

  getDepartDetails() {
    this.http
      .post("http://localhost:64964/WebService.asmx/GetDepartDetails", {
        _departCode: this.departCode
      })
      .subscribe((Response) => {
        this.ELEMENT_DATA = Response["d"];
        this.loading = false;
        this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
      });
  }

  getPatientsPerDepart(){
    this.http
      .post("http://localhost:64964/WebService.asmx/GetPatientsPerDepart", {
        _departCode: this.departCode
      })
      .subscribe((Response) => {
        this.dataSource2 = new MatTableDataSource<any>(Response["d"]);
        this.patientsTable = true;
      });
  }

}
