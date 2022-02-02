import { Component, HostListener, Inject, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
  updateDate = new Date();
  // localIp = localStorage.getItem('LOCAL_IP');

  // private ipRegex = new RegExp(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/);
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @ViewChild('modalContent2', { static: true }) modalContent2: TemplateRef<any>;
  @ViewChild('modalBug', { static: true }) modalBug: TemplateRef<any>;
  @ViewChild('modalIp', { static: true }) modalIp: TemplateRef<any>;

  constructor(
    private zone: NgZone,
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
  actionPriority: any;
  actionsContent: any;
  ipUpdate: any;
  ClientIP: string;
  bugColumns: string[] = ['date', 'user', 'subject', 'done'];
  actionColumns: string[] = ['date', 'subject', 'priority', 'done'];
  bugData = [];
  newActionsData = [];
  // showBugsTable: boolean = false;

  ngOnInit(): void {
    this.getLocalIP();
    let that = this;
    setTimeout(() => {
      that.loaded = false;
      that.occLoaded = false;
      that.rightPC = false;
      that.searchWord = "";
      that.getAllDeparts();
      that.getEROccupancy('', 'er');
      that.getDeliveryEROccupancy('');
      that.privateIP = this.ClientIP;
      // this.IpAddressMonitoring();
    }, 1500);
    // this.ipAddressUpdate();

    // this.http.get('https://api.ipify.org?format=json').subscribe(data => {
    //   this.publicIP = data['ip'];
    // });
  }

  ipAddressUpdate() {
    if (this.ipUpdate == undefined) {
      this.ipUpdate = "";
    } else {
      this.dialog.closeAll();
    }
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/ipAddressUpdate", {
        _userName: this.UserName,
        IpAdress_Login: this.ipUpdate
      })
      .subscribe((Response) => {
        let ip = Response["d"];
        this.ipUpdate = ip.IpAddress;
        if (ip.Updated == "False") {
          this.dialog.open(this.modalIp, { width: '60%', disableClose: true });
        }
      });
  }

  IpAddressMonitoring() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/IpAddressMonitoring", {
        _userName: this.UserName,
        IpAdress_Login: this.ClientIP
      }).subscribe(() => {

      })
  }

  getBugsTable() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetBugsReport", {
      })
      .subscribe((Response) => {
        this.bugData = Response["d"];
      });
  }

  getNewActionsTable() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetNewActionsTable", {
      })
      .subscribe((Response) => {
        this.newActionsData = Response["d"];
      });
  }

  getLocalIP() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetLocalIPAddress", {
      })
      .subscribe((Response) => {
        var json = Response["d"];
        this.ClientIP = json
        setTimeout(function () {
          $("#loader").addClass("d-none");
        });
      });
  }
  // showBugsTablef() {
  //   this.showBugsTable = !this.showBugsTable;
  // }

  openDialogToFill(departCode, Dept_Name, ifAdmin) {
    let dialogRef = this.dialog.open(NursesDepartmentManageComponent, { disableClose: true });
    dialogRef.componentInstance.departCode = departCode;
    dialogRef.componentInstance.Dept_Name = Dept_Name;
    dialogRef.componentInstance.ifAdmin = ifAdmin;
    if (departCode == 'סח-ל') {
      dialogRef.componentInstance.deliveryRoomDialog = 'DeliveryRoom';
    }
  }

  submitBugReport() {
    if ((this.reportSubject == "" || this.reportSubject == undefined) || (this.phoneNumber == "" || this.phoneNumber == undefined)) {
      this.openSnackBar("נא למלא שדות חובה");
    } else {
      this.http
        .post("http://srv-apps-prod/RCF_WS/WebService.asmx/ReportBugNursesSystem", {
          _phoneNumber: this.phoneNumber,
          _reportSubject: this.reportSubject,
          _userName: this.UserName,
        })
        .subscribe((Response) => {
          if (Response["d"]) {
            this.openSnackBar("נשלח לטיפול");
            this.phoneNumber = "";
            this.reportSubject = "";
            this.getBugsTable();
          } else {
            this.openSnackBar("משהו השתבש לא נשלח");
          }
        });
    }
  }

  submitNewAction(value, rowID) {
    if (((this.actionsContent == "" || this.actionsContent == undefined) || (this.actionPriority == "" || this.actionPriority == undefined)) && rowID == "") {
      this.openSnackBar("נא למלא שדות חובה");
    } else {
      this.actionsContent == undefined ? this.actionsContent = '' : console.log('');
      this.actionPriority == undefined ? this.actionPriority = '' : console.log('');
      this.http
        .post("http://srv-apps-prod/RCF_WS/WebService.asmx/NewActionNursesSystem", {
          _actionPriority: this.actionPriority,
          _actionsContent: this.actionsContent,
          _userName: this.UserName,
          _updatePriority: value,
          _updateRowID: rowID,
        })
        .subscribe((Response) => {
          if (Response["d"]) {
            this.openSnackBar("נשלח לטיפול");
            this.actionPriority = "";
            this.actionsContent = "";
            this.getNewActionsTable();
          } else {
            this.openSnackBar("משהו השתבש לא נשלח");
          }
        });
    }
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
  //   return this.http.post("http://srv-apps-prod/RCF_WS/WebService.asmx/NursesUserPersmission", { _userName: userName, withCredentials: true }).subscribe(response => { response["d"]; this.nursesUserPermission = response["d"] });
  // }

  handleEvent() {
    this.dialog.open(this.modalContent, { width: '60%', disableClose: true });
  }
  handleEvent2() {
    this.dialog.open(this.modalContent2, { width: '60%', disableClose: true });
  }

  bugReport() {
    this.dialog.open(this.modalBug, { width: '60%', disableClose: false });
    this.getBugsTable();
    this.getNewActionsTable();
  }
  closeModal() {
    this.dialog.closeAll();
  }

  getAllDeparts() {
    this.loaded = false;
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetNursesSystemDepartments", {
        _userName: this.UserName
      })
      .subscribe((Response) => {
        this.all_departments_array = Response["d"];
        let _ipAddress;
        let _ipAddress2;
        let _ipAddress3;
        let _ipAddress4;
        let _tabletAddress;
        let _adminNurse;
        if (this.all_departments_array.length > 0) {
          _ipAddress = this.all_departments_array[0].IpAddress;
          _ipAddress2 = this.all_departments_array[0].IpAddress2;
          _ipAddress3 = this.all_departments_array[0].IpAddress3;
          _ipAddress4 = this.all_departments_array[0].IpAddress4;
          _tabletAddress = this.all_departments_array[0].TabletAddress;
          _adminNurse = this.all_departments_array[0].AdminNurse;
        }
        if (this.UserName == "clalit") {
          this.rightPC = false;
          this.handleEvent2();
        } else {
          if (_adminNurse) {
            this.nursesUserPermission = true;
            // If the user is a system admin give access else check if the machine is set to this user in database
            if (_ipAddress == "" && _ipAddress2 == "" && _ipAddress3 == "" && _ipAddress4 == "" && _tabletAddress == "") {
              this.rightPC = true;
            } else {
              if (this.privateIP == _ipAddress || this.privateIP == _ipAddress2 || this.privateIP == _ipAddress3 || this.privateIP == _ipAddress4 || (_tabletAddress == "" && this.privateIP.substring(0, 6) == "10.222")) {
                this.rightPC = true;
              } else {
                this.rightPC = false;
                this.handleEvent();
              }
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
                this.updateDate = new Date();
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


  // test() {
  //   if (this.UserName.toLowerCase() == 'jubartal') {
  //     localStorage.setItem("loginUserName", "nibrahim");
  //     window.location.reload();
  //   } else {
  //     localStorage.setItem("loginUserName", "jubartal");
  //     window.location.reload();
  //   }
  // }

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
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetDeliveryEROccupancy", {
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
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetEROccupancy", {
        _datePointer: this.newDate,
        _department: dept
      })
      .subscribe((Response) => {
        this.ER_Occupancy = Response["d"];
        this.allErOccupancy = parseInt(this.ER_Occupancy[0]) + parseInt(this.ER_Occupancy[1]) + parseInt(this.ER_Occupancy[2]);
        this.occLoaded = true;
      });
  }


  public getDataFormServer(_Depart: string, numberOfPatients, numberOfBeds) {
    this.http
      .post(
        "http://srv-apps-prod/RCF_WS/WebService.asmx/TfosaDashBoardApp",
        {
          _depart: _Depart,
        }
      )
      .subscribe(
        (Response) => {
          var obj = JSON.parse(Response["d"]);
          this.resparotriesCount = JSON.parse(obj["totalReal2"]);
          this.hospitalBedsInUse = numberOfPatients;
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