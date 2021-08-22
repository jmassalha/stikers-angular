import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from '@angular/material/dialog';
import { NursesDepartmentManageComponent } from '../nurses-department-manage/nurses-department-manage.component';
import { OtherDepartmentsComponent } from '../nurses-manage-dashboard/other-departments/other-departments.component';
import { NursesDashboardComponent } from '../nurses-dashboard/nurses-dashboard.component';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { interval, Subscription } from 'rxjs';
import { int } from '@zxing/library/esm/customTypings';

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
  private updateSubscription: Subscription;

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
  allErOccupancy: int
  ELEMENT_DATA = [];

  ngOnInit(): void {
    this.loaded = false;
    this.searchWord = "";
    this.getAllDeparts();
    this.getDataFormServer("");
    this.getEROccupancy('', '');
    this.updateSubscription = interval(60000).subscribe(
      (val) => { this.getAllDeparts(); this.getEROccupancy("", "er"); }
    );
  }

  openDialogToFill(departCode, Dept_Name) {
    let dialogRef = this.dialog.open(NursesDepartmentManageComponent, {});
    dialogRef.componentInstance.departCode = departCode;
    dialogRef.componentInstance.Dept_Name = Dept_Name;
    dialogRef.afterClosed()
      .subscribe((data) => {
        if (!data) {
          return;
        }
        this.ELEMENT_DATA = data;

        $("#loader").removeClass("d-none");
        setTimeout(function () {
          $("#loader").addClass("d-none");
          window.print();
        }, 1500);
      })
  }
  
  openReportDialog(report_type) {
    let dialogRef = this.dialog.open(NursesDashboardComponent, {});
    dialogRef.componentInstance.reportType = report_type;
    dialogRef.afterClosed()
      .subscribe((data) => {
        if (!data) {
          return;
        }
        this.ELEMENT_DATA = data;

        $("#loader").removeClass("d-none");
        setTimeout(function () {
          $("#loader").addClass("d-none");
          window.print();
        }, 1500);
      })
  }



  getAllDeparts() {
    this.loaded = false;
    this.http
      .post("http://localhost:64964/WebService.asmx/GetNursesSystemDepartments", {
      })
      .subscribe((Response) => {
        this.all_departments_array = Response["d"];
        this.loaded = true;
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
        this.allErOccupancy = parseInt(this.ER_Occupancy[0])+parseInt(this.ER_Occupancy[1])+parseInt(this.ER_Occupancy[2]);
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
