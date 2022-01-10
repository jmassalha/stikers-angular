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

@Component({
  selector: 'app-employees-manage-dash',
  templateUrl: './employees-manage-dash.component.html',
  styleUrls: ['./employees-manage-dash.component.css']
})
export class EmployeesManageDashComponent implements OnInit {

  TABLE_DATA: any[] = [];
  displayedColumns: string[] = [
    'employee_id', 'first_name', 'last_name', 'gender', 'date_of_birth', 'cell_number', 'elictive', 'email', 'function_description', 'departnent_code'
  ];
  dataSource = new MatTableDataSource(this.TABLE_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;

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
      EmpID: new FormControl('',null),
      EmpFirstName: new FormControl('',null),
      EmpLastName: new FormControl('',null),
      Elective: new FormControl('',null),
      On: new FormControl('',null),
    });
    this.GetEmployeesToUpdate();
  }

  GetEmployeesToUpdate() {
    let empId = this.searchEmployeesGroup.controls['EmpID'].value;
    let empFirstName = this.searchEmployeesGroup.controls['EmpFirstName'].value;
    let empLastName = this.searchEmployeesGroup.controls['EmpLastName'].value;
    let elective = this.searchEmployeesGroup.controls['Elective'].value;
    let on = this.searchEmployeesGroup.controls['On'].value;
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetEmployeesToUpdate", {
        
      })
      .subscribe((Response) => {
        this.dataSource = new MatTableDataSource<any>(Response["d"]);
        this.dataSource.paginator = this.paginator;
      });
  }

  addUpdateEmployee(employee){
    let dialogRef = this.dialog.open(EmployeesAddUpdateComponent, { disableClose: true });
    dialogRef.componentInstance.employee = employee;
  }

}
