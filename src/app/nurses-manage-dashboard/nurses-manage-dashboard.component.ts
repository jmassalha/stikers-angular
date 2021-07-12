import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from '@angular/material/dialog';
import { NursesDepartmentManageComponent } from '../nurses-department-manage/nurses-department-manage.component';
import { OtherDepartmentsComponent } from '../nurses-manage-dashboard/other-departments/other-departments.component';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-nurses-manage-dashboard',
  templateUrl: './nurses-manage-dashboard.component.html',
  styleUrls: ['./nurses-manage-dashboard.component.css']
})
export class NursesManageDashboardComponent implements OnInit {

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

  ngOnInit(): void {
    this.searchWord = "";
    this.getAllDeparts();
    this.getDataFormServer("");
    this.getEROccupancy('', '');
  }

  openDialogToFill(departCode, Dept_Name) {
    let dialogRef = this.dialog.open(NursesDepartmentManageComponent, {});
    dialogRef.componentInstance.departCode = departCode;
    dialogRef.componentInstance.Dept_Name = Dept_Name;
  }

  getAllDeparts() {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetNursesSystemDepartments", {
      })
      .subscribe((Response) => {
        this.all_departments_array = Response["d"];
      });
  }

  getOtherDepartmentDetails(otherDepartName) {
    let dialogRef = this.dialog.open(OtherDepartmentsComponent, {});
    dialogRef.componentInstance.otherDepartName = otherDepartName;
  }

  getEROccupancy(datePointer, dept) {
    let dte = new Date();
    let dateToDisplay = new Date();
    if (datePointer == 'before') {
      this.numberOfDays++;
    } else if (datePointer == 'next') {
      this.numberOfDays--;
    } else {
      this.numberOfDays;
    }
    dte.setDate(dte.getDate() - this.numberOfDays);
    let pipe = new DatePipe('en-US');
    this.newDate = pipe.transform(dte.toString(), 'yyyy-MM-dd');
    this.dateToDisplayString = pipe.transform(dateToDisplay.toString(), 'yyyy-MM-dd');
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetEROccupancy", {
        _datePointer: this.newDate,
        _department: dept
      })
      .subscribe((Response) => {
        this.ER_Occupancy = Response["d"];
      });
  }

  public getDataFormServer(_Depart: string) {
    this.http
      .post(
        "http://srv-apps/wsrfc/WebService.asmx/TfosaDashBoardApp",
        {
          _depart: _Depart,
        }
      )
      .subscribe(
        (Response) => {
          var obj = JSON.parse(Response["d"]);
          var aobjTotal = JSON.parse(obj["total"]);
          var aobj = JSON.parse(obj["DepartObjects"]);
          var totalReal = JSON.parse(obj["totalReal"]);
          this.resparotriesCount = JSON.parse(obj["totalReal2"]);
          var aaobj = JSON.parse("[" + aobj[0] + "]");
          aobjTotal = $.parseJSON(aobjTotal);
          this.hospitalBedsInUse = aobjTotal.total;
          aaobj.forEach((element, index) => {
            if (element.BedsReal != "0") {
              for (var i = index + 1; i < aaobj.length; i++) {
                if (aaobj[i].BedsReal == "0") {
                  element.Used =
                    parseInt(element.Used) +
                    parseInt(aaobj[i].Used);
                } else {
                  break;
                }
              }
            } else {
            }
          });
          this.Departmints["departs"] = aaobj;
          this.Departmints["total"] = parseInt(
            ((aobjTotal.total / parseInt(totalReal)) * 100).toFixed(
              0
            )
          );
          setTimeout(() => {
          });
        }
      );
  }

}
