import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from '@angular/material/dialog';
import { VisitorsRegistrationComponent } from '../visitors-monitoring/visitors-registration/visitors-registration.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-visitors-monitoring',
  templateUrl: './visitors-monitoring.component.html',
  styleUrls: ['./visitors-monitoring.component.css']
})
export class VisitorsMonitoringComponent implements OnInit {

  all_departments_array = [];
  ER_Occupancy = [];
  searchWord: string;
  hospitalBedsInUse: string;
  resparotriesCount: string;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder) { }


  Departmints = {
    departs: [],
    total: 0,
  };
  numberOfDays = 0;
  newDate: string;
  dateToDisplayString: string;
  loaded: boolean;

  ngOnInit(): void {
    this.loaded = false;
    this.searchWord = "";
    this.getAllDeparts();
  }

  openDialogToFill(departCode, Dept_Name) {
    let dialogRef = this.dialog.open(VisitorsRegistrationComponent, {});
    dialogRef.componentInstance.departCode = departCode;
    dialogRef.componentInstance.Dept_Name = Dept_Name;
  }

  getAllDeparts() {
    this.loaded = false;
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetVisitorsSystemDepartments", {
      })
      .subscribe((Response) => {
        this.all_departments_array = Response["d"];
        this.loaded = true;
      });
  }

}
