import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EmployeesAddUpdateComponent } from '../employees-manage-dash/employees-add-update/employees-add-update.component';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-employees-manage-dash',
  templateUrl: './employees-manage-dash.component.html',
  styleUrls: ['./employees-manage-dash.component.css']
})
export class EmployeesManageDashComponent implements OnInit {

  TABLE_DATA: any[] = [];
  TABLE_DATAExcel: any[] = [];
  displayedColumns: string[] = [
    'EmployeeID', 'FirstName', 'LastName', 'DepartnentDescripton', 'FunctionDescription', 'CellNumber', 'Gender', 'DateOfBirth', 'Email'
  ];
  dataSource = new MatTableDataSource(this.TABLE_DATA);
  dataSourceExcel = new MatTableDataSource(this.TABLE_DATAExcel);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  UserName = localStorage.getItem("loginUserName").toLowerCase();
  managerType: string = "";
  all_employees = [];
  DepartmentsList = [];
  FunctionsList = [];

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
    if (this.UserName == "iditur") {
      this.managerType = "stager";
    } else if (this.UserName == "dporat" || this.UserName == "dfogel") {
      this.managerType = "unknown";
    } else if (this.UserName == "ashoshany") {
      this.managerType = "research";
    } else if (this.UserName == "jmassalha") {
      this.managerType = "hr";
    } else if (this.UserName == "adahabre" || this.UserName == "owertheim") {
      this.managerType = "admin";
    }
    if (this.managerType != "unknown") {
      this.GetEmployeesToUpdate(this.managerType, false);
      this.getEmployeeDepartmentList();
      this.getEmployeesFunctionsList();
    }
  }

  chooseManagerTypeForMultiple(managerType) {
    this.managerType = managerType;
    this.GetEmployeesToUpdate(this.managerType, false);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getEmployeeDepartmentList() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetEmployeeDepartmentList", {
      })
      .subscribe((Response) => {
        this.DepartmentsList = Response["d"];
      });
  }

  getEmployeesFunctionsList() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetEmployeesFunctionsList", {
      })
      .subscribe((Response) => {
        this.FunctionsList = Response["d"];
      });
  }

  GetEmployeesToUpdate(managerType, toExcel) {
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
    // if (managerType == "research") {
    //   employeesToShow = '';
    //   employeesWorkPlace = '2';
    // } else if (managerType == "stager") {
    //   employeesToShow = '899';
    //   employeesWorkPlace = '1';
    // } else if (managerType == "hr") {
    //   employeesToShow = '';
    //   employeesWorkPlace = '';
    // }else{
    //   employeesToShow = '';
    //   employeesWorkPlace = '';
    // }
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetEmployeesToUpdate", {
        _empId: empId,
        _empFirstName: empFirstName,
        _empLastName: empLastName,
        // _elective: elective,
        _on: on,
        _medGrad: medGrad,
        _phoneNumber: phoneNumber,
        _department: department,
        _role: role,
        _managerType: managerType,
      })
      .subscribe((Response) => {
        this.dataSource = new MatTableDataSource<any>(Response["d"]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    if (toExcel) {
      this.http
        .post("http://srv-apps-prod/RCF_WS/WebService.asmx/EmployeesExcelExport", {
          _empId: empId,
          _empFirstName: empFirstName,
          _empLastName: empLastName,
          _on: on,
          _medGrad: medGrad,
          _phoneNumber: phoneNumber,
          _department: department,
          _role: role,
          _managerType: managerType,
        })
        .subscribe((Response) => {
          this.dataSourceExcel = new MatTableDataSource<any>(Response["d"]);
          let that = this;
          setTimeout(() => {
            that.exportexcel();
          }, 1500);
        });
    }
  }

  fileName = 'Employees_List.xlsx';
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

  addUpdateEmployee(employee) {
    let dialogRef = this.dialog.open(EmployeesAddUpdateComponent, { disableClose: true });
    dialogRef.componentInstance.employee = employee;
    dialogRef.componentInstance.managerType = this.managerType;
    dialogRef.afterClosed().subscribe(result => {
      this.GetEmployeesToUpdate(this.managerType, false);
    });
  }

}
