import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavigationEnd, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NursesDepartmentManageComponent } from '../nurses-department-manage/nurses-department-manage.component';
import { OtherDepartmentsComponent } from '../nurses-manage-dashboard/other-departments/other-departments.component';
import { NursesDashboardComponent } from '../nurses-dashboard/nurses-dashboard.component';
import { DatePipe, Location  } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { int } from '@zxing/library/esm/customTypings';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';


@Component({
  selector: 'app-nurses-manage-dashboard',
  templateUrl: './nurses-manage-dashboard.component.html',
  styleUrls: ['./nurses-manage-dashboard.component.css']
})
export class NursesManageDashboardComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  all_departments_array = [];
  ER_Occupancy = [];
  searchWord: string;
  hospitalBedsInUse: string;
  resparotriesCount: string;
  updateSubscription: any;
  UserName = localStorage.getItem("loginUserName").toLowerCase();
  nursesUserPermission: boolean = false;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder) {
      
     }


  Departmints = {
    departs: [],
    total: 0,
  };
  numberOfDays = 0;
  Dept_Number: string;
  Dept_Name: string;
  newDate: string;
  dateToDisplayString: string;
  loaded: boolean;
  allErOccupancy: int
  ELEMENT_DATA = [];

  ngOnInit(): void {
    this.loaded = false;
    this.searchWord = "";
    this.getAllDeparts();
    this.getEROccupancy('', 'er');

    // this.NursesSystemPermission();
  }

  openDialogToFill(departCode, Dept_Name, ifAdmin) {
    let dialogRef = this.dialog.open(NursesDepartmentManageComponent, { disableClose: true });
    dialogRef.componentInstance.departCode = departCode;
    dialogRef.componentInstance.Dept_Name = Dept_Name;
    dialogRef.componentInstance.ifAdmin = ifAdmin;
    if(departCode == 'סח-ל'){
      dialogRef.componentInstance.deliveryRoomDialog = 'DeliveryRoom';
    }
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

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  openReportDialog(report_type) {
    let dialogRef = this.dialog.open(NursesDashboardComponent, { disableClose: true });
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

  NursesSystemPermission() {
    let userName = localStorage.getItem("loginUserName").toLowerCase();
    return this.http.post("http://srv-apps/wsrfc/WebService.asmx/NursesUserPersmission", { _userName: userName, withCredentials: true }).subscribe(response => { response["d"]; this.nursesUserPermission = response["d"] });
    // this.http
    //   .post("http://srv-apps/wsrfc/WebService.asmx/NursesUserPersmission", {
    //     _userName: userName
    //   })
    //   .subscribe((Response) => {
    //     this.nursesUserPermission = Response["d"];
    //     return this.nursesUserPermission;
    //   });
  }

  getAllDeparts() {
    this.loaded = false;
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetNursesSystemDepartments", {
        _userName: this.UserName
      })
      .subscribe((Response) => {
        this.all_departments_array = Response["d"];
        this.NursesSystemPermission();
        let that = this;
        let time = setTimeout(() => {
          if (that.nursesUserPermission) {
            let time2 = setTimeout(() => {
              if(this.router.url !== '/nursesmanagedashboard'){
                clearTimeout(time);
                clearTimeout(time2);
              }else{
                this.getAllDeparts();
                this.getEROccupancy("", "er");
              }
            }, 60000);
          } else {
            that.Dept_Number = that.all_departments_array[0].Dept_Number;
            that.Dept_Name = that.all_departments_array[0].Dept_Name;
            that.openDialogToFill(that.Dept_Number, that.Dept_Name, '0');
          }
        }, 1500);
        this.loaded = true;
        let numberOfPatients = this.all_departments_array[this.all_departments_array.length - 1].hospitalNumberOfPatients;
        let numberOfBeds = this.all_departments_array[this.all_departments_array.length - 1].hospitalNumberOfBeds;
        this.getDataFormServer("",numberOfPatients,numberOfBeds);
      });
  }

  test(){
    if(this.UserName.toLowerCase() == 'jubartal'){
      localStorage.setItem("loginUserName", "nibrahim");
      window.location.reload();
    }else{
      localStorage.setItem("loginUserName", "jubartal");
      window.location.reload();
    }
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
        // if(this.ER_Occupancy.length == 0){
        //   let that = this;
        //   setTimeout(() => {
        //     that.getEROccupancy("", "er");
        //   }, 1000);
        // }
        this.allErOccupancy = parseInt(this.ER_Occupancy[0]) + parseInt(this.ER_Occupancy[1]) + parseInt(this.ER_Occupancy[2]);
      });
  }

  public getDataFormServer(_Depart: string,numberOfPatients,numberOfBeds) {
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
          // var aobjTotal = JSON.parse(obj["total"]);
          // var aobj = JSON.parse(obj["DepartObjects"]);
          // var totalReal = JSON.parse(obj["totalReal"]);
          this.resparotriesCount = JSON.parse(obj["totalReal2"]);
          // var aaobj = JSON.parse("[" + aobj[0] + "]");
          // aobjTotal = $.parseJSON(aobjTotal);
          this.hospitalBedsInUse = numberOfPatients;
          // aaobj.forEach((element, index) => {
          //   if (element.BedsReal != "0") {
          //     for (var i = index + 1; i < aaobj.length; i++) {
          //       if (aaobj[i].BedsReal == "0") {
          //         element.Used =
          //           parseInt(element.Used) +
          //           parseInt(aaobj[i].Used);
          //       } else {
          //         break;
          //       }
          //     }
          //   } else {
          //   }
          // });
          // this.Departmints["departs"] = aaobj;
          this.Departmints["total"] = parseInt(
            ((numberOfPatients / numberOfBeds) * 100).toFixed(
              0
            )
          );
          setTimeout(() => {
          });
        }
      );
  }

}