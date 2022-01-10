import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-employees-manage-dash',
  templateUrl: './employees-manage-dash.component.html',
  styleUrls: ['./employees-manage-dash.component.css']
})
export class EmployeesManageDashComponent implements OnInit {

  constructor(private zone: NgZone,
    private modal: NgbModal,
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    // this.GetDepartmentsToUpdateBeds();
  }

  GetDepartmentsToUpdateBeds() {

    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetEmployeesToUpdate", {
      })
      .subscribe((Response) => {
        let t = Response["d"];
      });
  }

}
