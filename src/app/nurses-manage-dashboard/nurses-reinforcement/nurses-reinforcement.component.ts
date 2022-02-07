import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-nurses-reinforcement',
  templateUrl: './nurses-reinforcement.component.html',
  styleUrls: ['./nurses-reinforcement.component.css']
})
export class NursesReinforcementComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  displayedColumns: string[] = [
    'FirstName', 'LastName', 'DepartnentDescripton', 'CellNumber', 'FunctionDescription'
  ];
  displayedColumns2: string[] = [
    'FirstName', 'LastName', 'DepartnentDescripton', 'CellNumber', 'FunctionDescription'
  ];
  dataSource = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild(MatSort) sort1: MatSort;
  @ViewChild(MatSort) sort2: MatSort;
  UserName = localStorage.getItem("loginUserName").toLowerCase();
  Reinf_nurse: any = {
    name: '',
    number: ''
  }
  Reinf_emp: any = {
    name: '',
    number: ''
  }

  constructor(public dialog: MatDialog,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.GetNursesList();
    this.getReinforcementStaffList();
    this.dataSource.paginator = this.paginator1;
    this.dataSource2.paginator = this.paginator2;
    this.dataSource.sort = this.sort1;
    this.dataSource2.sort = this.sort2;
  }

  closeModal() {
    this.dialog.closeAll();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter2(event: Event) {
    const filterValue2 = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue2.trim().toLowerCase();
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  chooseReinfNurse(nurse){
    this.Reinf_nurse.name = nurse.FirstName+' '+nurse.LastName;
    this.Reinf_nurse.number = nurse.CellNumber;
  }
  
  chooseReinfEmployee(employee){
    this.Reinf_emp.name = employee.FirstName+' '+employee.LastName;
    this.Reinf_emp.number = employee.CellNumber;
  }

  GetNursesList() {
    let empId = '';
    let empFirstName = '';
    let empLastName = '';
    // let elective = this.searchEmployeesGroup.controls['Elective'].value;
    let on = '1';
    let medGrad = '';
    let phoneNumber = '';
    let department = '';
    let role = '';
    let sektor = '039';
    let workPlace = '';
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
        _managerType: "",
        _sektor: sektor,
        _workPlace: workPlace,
      })
      .subscribe((Response) => {
        this.dataSource = new MatTableDataSource<any>(Response["d"]);
        this.dataSource.paginator = this.paginator1;
        this.dataSource.sort = this.sort1;
      });
  }

  getReinforcementStaffList() {
    // 870  039  001
    let empId = '';
    let empFirstName = '';
    let empLastName = '';
    // let elective = this.searchEmployeesGroup.controls['Elective'].value;
    let on = '1';
    let medGrad = '';
    let phoneNumber = '';
    let department = '';
    let role = '';
    let sektor = "'039','870','001'";
    let workPlace = '';
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
        _managerType: "",
        _sektor: sektor,
        _workPlace: workPlace,
      })
      .subscribe((Response) => {
        this.dataSource2 = new MatTableDataSource<any>(Response["d"]);
        this.dataSource2.paginator = this.paginator2;
        this.dataSource2.sort = this.sort2;
      });
  }


}
