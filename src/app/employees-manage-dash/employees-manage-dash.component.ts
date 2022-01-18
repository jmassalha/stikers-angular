import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EmployeesAddUpdateComponent } from '../employees-manage-dash/employees-add-update/employees-add-update.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-employees-manage-dash',
  templateUrl: './employees-manage-dash.component.html',
  styleUrls: ['./employees-manage-dash.component.css']
})
export class EmployeesManageDashComponent implements OnInit {

  TABLE_DATA: any[] = [];
  displayedColumns: string[] = [
    'EmployeeID', 'FirstName', 'LastName', 'Gender', 'DateOfBirth', 'CellNumber', 'Email', 'FunctionDescription', 'DepartnentDescripton'
  ];
  dataSource = new MatTableDataSource(this.TABLE_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  UserName = localStorage.getItem("loginUserName").toLowerCase();
  managerType: string = "";

  constructor(private zone: NgZone,
    private modal: NgbModal,
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder) { }

  searchEmployeesGroup: FormGroup;

  ngOnInit(): void {
    this.searchEmployeesGroup = this.formBuilder.group({
      EmpID: new FormControl('', null),
      EmpFirstName: new FormControl('', null),
      EmpLastName: new FormControl('', null),
      // Elective: new FormControl('0', null),
      On: new FormControl('1', null),
      MedGrad: new FormControl('0', null),
      PhoneNumber: new FormControl('', null),
      Department: new FormControl('', null),
      Role: new FormControl('', null),
    });
    if (this.UserName == "dporat" || this.UserName == "dfogel" || this.UserName == "iditur") {
      this.managerType = "research";
    } else if (this.UserName == "jubartal") {
      this.managerType = "stager";
    } else if (this.UserName == "jmassalha") {
      this.managerType = "hr";
    } else {
      this.managerType = "admin";
    }
    this.GetEmployeesToUpdate(this.managerType);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  GetEmployeesToUpdate(managerType) {
    let employeesToShow = "";
    let employeesWorkPlace = "";
    let empId = this.searchEmployeesGroup.controls['EmpID'].value;
    let empFirstName = this.searchEmployeesGroup.controls['EmpFirstName'].value;
    let empLastName = this.searchEmployeesGroup.controls['EmpLastName'].value;
    // let elective = this.searchEmployeesGroup.controls['Elective'].value;
    let on = this.searchEmployeesGroup.controls['On'].value;
    let medGrad = this.searchEmployeesGroup.controls['MedGrad'].value;
    let phoneNumber = this.searchEmployeesGroup.controls['PhoneNumber'].value;
    let department = this.searchEmployeesGroup.controls['Department'].value;
    let role = this.searchEmployeesGroup.controls['Role'].value;
    if (managerType == "research") {
      employeesToShow = '';
      employeesWorkPlace = '2';
    } else if (managerType == "stager") {
      employeesToShow = '899';
      employeesWorkPlace = '1';
    } else if (managerType == "hr") {
      employeesToShow = '';
      employeesWorkPlace = '';
    }
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetEmployeesToUpdate", {
      })
      .subscribe((Response) => {
        this.dataSource = new MatTableDataSource<any>(Response["d"]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  addUpdateEmployee(employee) {
    let dialogRef = this.dialog.open(EmployeesAddUpdateComponent, { disableClose: true });
    dialogRef.componentInstance.employee = employee;
    dialogRef.afterClosed().subscribe(result => {
      this.GetEmployeesToUpdate(this.managerType);
    });
  }

}
