import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from '@angular/material/dialog';
import { NursesDepartmentManageComponent } from '../nurses-department-manage/nurses-department-manage.component';
import { OtherDepartmentsComponent } from '../nurses-manage-dashboard/other-departments/other-departments.component';
import { NursesDashboardComponent } from '../nurses-dashboard/nurses-dashboard.component';
import { DatePipe } from '@angular/common';
import { int } from '@zxing/library/esm/customTypings';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare let ClientIP: any;
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
  Delivery_ER_Occupancy = [];
  searchWord: string;
  hospitalBedsInUse: string;
  resparotriesCount: string;
  updateSubscription: any;
  UserName = localStorage.getItem("loginUserName").toLowerCase();
  nursesUserPermission: boolean = false;
  privateIP;
  publicIP;
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @ViewChild('modalBug', { static: true }) modalBug: TemplateRef<any>;

  constructor(
    private modal: NgbModal,
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
  numberOfDays2 = 0;
  Dept_Number: string;
  Dept_Name: string;
  newDate: string;
  newDate2: string;
  dateToDisplayString: string;
  loaded: boolean;
  occLoaded: boolean;
  deliveryOccLoaded: boolean;
  allErOccupancy: int;
  allDeliveryErOccupancy: int;
  ELEMENT_DATA = [];
  userIP = ''
  rightPC: boolean;
  phoneNumber: any;
  reportSubject: any;

  ngOnInit(): void {
    this.loaded = false;
    this.occLoaded = false;
    this.rightPC = false;
    this.searchWord = "";
    this.getAllDeparts();
    this.getEROccupancy('', 'er');
    this.getDeliveryEROccupancy('');
    // Private Ip
    this.privateIP = ClientIP;
    // Public IP
    this.http.get('https://api.ipify.org?format=json').subscribe(data => {
      this.publicIP = data['ip'];
    });
  }


  openDialogToFill(departCode, Dept_Name, ifAdmin) {
    let dialogRef = this.dialog.open(NursesDepartmentManageComponent, { disableClose: true });
    dialogRef.componentInstance.departCode = departCode;
    dialogRef.componentInstance.Dept_Name = Dept_Name;
    dialogRef.componentInstance.ifAdmin = ifAdmin;
    if (departCode == 'סח-ל') {
      dialogRef.componentInstance.deliveryRoomDialog = 'DeliveryRoom';
    }
    // dialogRef.afterClosed()
    //   .subscribe((data) => {
    //     if (!data) {
    //       return;
    //     }
    //     this.ELEMENT_DATA = data;
    //     $("#loader").removeClass("d-none");
    //     setTimeout(function () {
    //       $("#loader").addClass("d-none");
    //       window.print();
    //     }, 1500);
    //   })
  }

  submitBugReport(){
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/ReportBugNursesSystem", {
        _phoneNumber: this.phoneNumber,
        _reportSubject: this.reportSubject,
        _userName: this.UserName,
      })
      .subscribe((Response) => {
        if(Response["d"]){
          this.openSnackBar("נשלח לטיפול");
        }else{
          this.openSnackBar("משהו השתבש לא נשלח");
        }
      });
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

  // NursesSystemPermission() {
  //   let userName = localStorage.getItem("loginUserName").toLowerCase();
  //   return this.http.post("http://srv-apps/wsrfc/WebService.asmx/NursesUserPersmission", { _userName: userName, withCredentials: true }).subscribe(response => { response["d"]; this.nursesUserPermission = response["d"] });
  // }

  handleEvent() {
    this.dialog.open(this.modalContent, { width: '60%',disableClose: true} );
  }
  
  bugReport() {
    this.dialog.open(this.modalBug, { width: '60%',disableClose: false} );
  }

  closeModal() {
    this.dialog.closeAll();
  }

  getAllDeparts() {
    this.loaded = false;
    // this.http
    //   .post("http://srv-apps/wsrfc/WebService.asmx/GetComputerName", {})
    //   .subscribe((Response) => {
    //     this.privateIP = Response["d"];
    //   });
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetNursesSystemDepartments", {
        _userName: this.UserName
      })
      .subscribe((Response) => {
        this.all_departments_array = Response["d"];
        let _ipAddress;
        let _ipAddress2;
        let _tabletAddress;
        let _adminNurse;
        if(this.all_departments_array.length > 0){
          _ipAddress = this.all_departments_array[0].IpAddress;
          _ipAddress2 = this.all_departments_array[0].IpAddress2;
          _tabletAddress = this.all_departments_array[0].TabletAddress;
          _adminNurse = this.all_departments_array[0].AdminNurse;
        }
        // this.NursesSystemPermission();
        if (_adminNurse) {
          this.nursesUserPermission = true;
          // If the user is a system admin give access else check if the machine is set to this user in database
          if(_ipAddress == "" && _ipAddress2 == "" && _tabletAddress == ""){
            this.rightPC = true;
          }else{
            if(this.privateIP == _ipAddress || this.privateIP == _ipAddress2 || this.privateIP == _tabletAddress){
              this.rightPC = true;
            }else{
              this.rightPC = false;
              this.handleEvent();
            }
          }
        }
        let that = this;
        let time = setTimeout(() => {
          if (that.nursesUserPermission && that.rightPC) {
            let time2 = setTimeout(() => {
              if (this.router.url !== '/nursesmanagedashboard') {
                clearTimeout(time);
                clearTimeout(time2);
              } else {
                this.getAllDeparts();
                this.getEROccupancy("", "er");
                this.getDeliveryEROccupancy("");
              }
            }, 300000);
          } else {
            if (that.all_departments_array.length == 1) {
              that.Dept_Number = that.all_departments_array[0].Dept_Number;
              that.Dept_Name = that.all_departments_array[0].Dept_Name;
              that.openDialogToFill(that.Dept_Number, that.Dept_Name, '0');
            }
          }
        }, 1500);
        this.loaded = true;
        if (this.all_departments_array.length > 0) {
          let numberOfPatients = this.all_departments_array[this.all_departments_array.length - 1].hospitalNumberOfPatients;
          let numberOfBeds = this.all_departments_array[this.all_departments_array.length - 1].hospitalNumberOfBeds;
          this.getDataFormServer("", numberOfPatients, numberOfBeds);
        }
      });
  }
  

  test() {
    if (this.UserName.toLowerCase() == 'jubartal') {
      localStorage.setItem("loginUserName", "nibrahim");
      window.location.reload();
    } else {
      localStorage.setItem("loginUserName", "jubartal");
      window.location.reload();
    }
  }

  getOtherDepartmentDetails(otherDepartName) {
    let dialogRef = this.dialog.open(OtherDepartmentsComponent, {});
    dialogRef.componentInstance.otherDepartName = otherDepartName;
  }

  getDeliveryEROccupancy(datePointer) {
    this.deliveryOccLoaded = false;
    let dte = new Date();
    let dateToDisplay = new Date();
    if (datePointer == 'before') {
      this.numberOfDays2++;
    } else if (datePointer == 'next') {
      this.numberOfDays2--;
    } else {
      this.numberOfDays2;
    }
    dte.setDate(dte.getDate() - this.numberOfDays2);
    let pipe = new DatePipe('en-US');
    this.newDate2 = pipe.transform(dte.toString(), 'yyyy-MM-dd');
    this.dateToDisplayString = pipe.transform(dateToDisplay.toString(), 'yyyy-MM-dd');
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetDeliveryEROccupancy", {
        _datePointer: this.newDate2
      })
      .subscribe((Response) => {
        this.Delivery_ER_Occupancy = Response["d"];
        this.allDeliveryErOccupancy = parseInt(this.Delivery_ER_Occupancy[0]) + parseInt(this.Delivery_ER_Occupancy[1]) + parseInt(this.Delivery_ER_Occupancy[2]);
        this.deliveryOccLoaded = true;
      });
  }

  getEROccupancy(datePointer, dept) {
    this.occLoaded = false;
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
        this.occLoaded = true;
      });
  }


  public getDataFormServer(_Depart: string, numberOfPatients, numberOfBeds) {
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