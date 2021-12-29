import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FillReportComponent } from '../fill-report/fill-report.component';
import { NursesDashboardComponent } from '../nurses-dashboard/nurses-dashboard.component';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'bug-report-component',
  templateUrl: './bugModal.html',
  styleUrls: ['./nurses-department-manage.component.css']
})
export class BugReportComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  UserName = localStorage.getItem("loginUserName").toLowerCase();
  reportSubject: any;
  phoneNumber: any;

  constructor(public dialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<NursesDepartmentManageComponent>,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe) {

  }

  ngOnInit() {

  }


  submitBugReport() {
    if ((this.phoneNumber == "" || this.phoneNumber == undefined) || (this.reportSubject == "" || this.reportSubject == undefined)) {
      this.openSnackBar("להשלים שדות חובה");
    } else {
      this.http
        .post("https://srv-apps:4433/WebService.asmx/ReportBugNursesSystem", {
          _phoneNumber: this.phoneNumber,
          _reportSubject: this.reportSubject,
          _userName: this.UserName,
        })
        .subscribe((Response) => {
          if (Response["d"]) {
            this.openSnackBar("נשלח לטיפול");
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

}

@Component({
  selector: 'app-nurses-department-manage',
  templateUrl: './nurses-department-manage.component.html',
  styleUrls: ['./nurses-department-manage.component.css']
})
export class NursesDepartmentManageComponent implements OnInit {


  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();

  displayedColumns2: string[] = ['casenumber', 'departmentmedical', 'lastname', 'firstname', 'dadname', 'age', 'gender', 'enterdate', 'entertime', 'displayreports'];
  dataSource2 = new MatTableDataSource<any>();
  @ViewChild('modalBug', { static: true }) modalBug: TemplateRef<any>;

  applyFilter(event: Event, filval: string) {
    if (filval == '') {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource2.filter = filterValue;
    } else {
      this.dataSource2.filter = filval;
    }
  }

  constructor(public dialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<NursesDepartmentManageComponent>,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe) { }

  event: Event;
  deliveryRoomDialog: string;
  numberOfCVA: number = 0;
  numberOfNeurology: number = 0;
  departCode: string;
  updateSubscription: any;
  Dept_Name: string;
  ifAdmin: string;
  loading: boolean;
  Patientsloading: boolean;
  patientsTable: boolean;
  departmentArray = [];
  ELEMENT_DATA = [];
  ELEMENT_DATA2 = [];
  RespiratorsCount: string = "0";
  CatheterCount: string = "0";
  CentralCatheterCount: string = "0";
  IsolationCount: string = "0";
  PhLimitationCount: string = "0";
  CoronaStatus: string = '';
  departmentRelease: FormGroup;
  UserName = localStorage.getItem("loginUserName").toLowerCase();
  date = new Date();
  myDate = this.datePipe.transform(this.date, 'yyyy-MM-dd');
  timer: any;
  arrayOfMedDepts = [];
  phoneNumber: any;
  reportSubject: any;

  ngOnInit(): void {
    if (this.Dept_Name == 'מיון יולדות (חדר לידה)' || this.Dept_Name == 'חדר לידה') {
      this.displayedColumns = ['nursing', 'receipts', 'released'];
    } else if (this.Dept_Name == 'ילוד בריא' || this.Dept_Name == 'יולדות') {
      this.displayedColumns = ['nursing', 'receipts', 'released', 'plannedtorelease', 'holiday'];
    }
    else {
      this.displayedColumns = ['nursing', 'receipts', 'released', 'plannedtorelease', 'holiday', 'respirators', 'catheter', 'centralcatheter', 'isolation', 'phlimitation', 'death', 'kpc', 'complex'];
    }
    this.loading = true;
    this.patientsTable = true;
    this.Patientsloading = false;
    this.departmentRelease = new FormGroup({
      plannedToRelease: new FormControl('', null),
    });
    this.getDepartDetails();
    this.getSubmitPlannedToRealse('0');
    this.getPatientsPerDepart(this.event, '');
    this.checkIfToRefresh(true);
  }

  checkIfToRefresh(refresh) {
    // let time = setTimeout(() => {
    //   if (refresh) {
    //     let time2 =  setTimeout(() => {
    //       this.getDepartDetails();
    //       this.getSubmitPlannedToRealse('0');
    //       this.getPatientsPerDepart(this.event, '');
    //       this.checkIfToRefresh(true);
    //     }, 1500);
    //   }else{
    //     clearTimeout(time);
    //   }
    // }, 5000);
  }

  getSubmitPlannedToRealse(ifsaved) {
    this.http
      .post("https://srv-apps:4433/WebService.asmx/GetSubmitPlannedToRealse", {
        _plannedToRelease: this.departmentRelease.controls['plannedToRelease'].value,
        _departCode: this.departCode,
        userName: localStorage.getItem('loginUserName').toLowerCase()
      })
      .subscribe((Response) => {
        this.departmentRelease.controls['plannedToRelease'].setValue(Response["d"]);
      });
    if (ifsaved == '1') {
      this.openSnackBar("נשמר בהצלחה");
      this.ngOnInit();
    }
  }

  closeModal() {
    // this.checkIfToRefresh(false);
    this.dialogRef.close();
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  displayReports(caseNumber, asDialog, Dept_Name, firstname, lastname, gender, dob, description, corona, reportType) {
    let dialogRef = this.dialog.open(NursesDashboardComponent, { disableClose: true });
    dialogRef.componentInstance.caseNumber = caseNumber;
    dialogRef.componentInstance.asDialog = asDialog;
    dialogRef.componentInstance.Dept_Name = Dept_Name;
    dialogRef.componentInstance.firstname = firstname;
    dialogRef.componentInstance.lastname = lastname;
    dialogRef.componentInstance.gender = gender;
    dialogRef.componentInstance.dob = dob;
    dialogRef.componentInstance.description = description;
    dialogRef.componentInstance.corona = corona;
    dialogRef.componentInstance.reportType = reportType;
    dialogRef.afterClosed()
      .subscribe((data) => {
        if (data) {
          this.dialogRef.close(data);
        }
        // clearInterval(this.updateSubscription);
      })
  }

  bugReport() {
    let dialogRef = this.dialog.open(BugReportComponent);
    dialogRef.componentInstance.reportSubject = this.reportSubject;
    dialogRef.componentInstance.phoneNumber = this.phoneNumber;
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


  getDepartDetails() {
    this.http
      .post("https://srv-apps:4433/WebService.asmx/GetDepartDetails", {
        _departCode: this.departCode
      })
      .subscribe((Response) => {
        this.ELEMENT_DATA = Response["d"];
        if (this.ELEMENT_DATA.length == 0) {
          this.openSnackBar("לא נטען, מרענן מחדש...");
          setTimeout(() => {
            console.log('again');
            this.getDepartDetails();
          }, 5000);
        } else {
          this.RespiratorsCount = this.ELEMENT_DATA[0].RespiratorsCount;
          this.CatheterCount = this.ELEMENT_DATA[0].CatheterCount;
          this.CentralCatheterCount = this.ELEMENT_DATA[0].CentralCatheterCount;
          this.IsolationCount = this.ELEMENT_DATA[0].IsolationCount;
          this.PhLimitationCount = this.ELEMENT_DATA[0].PhLimitationCount;
          this.loading = false;
          this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
        }
      });
  }

  getPatientsPerDepart(event: Event, subDepart: string) {
    this.Patientsloading = true;
    this.http
      .post("https://srv-apps:4433/WebService.asmx/GetPatientsPerDepart", {
        _departCode: this.departCode
      })
      .subscribe((Response) => {
        this.dataSource2 = new MatTableDataSource<any>(Response["d"]);
        let uniqueMedDeparts = [];
        this.arrayOfMedDepts = [];
        uniqueMedDeparts = this.dataSource2.filteredData.map(item => item.PM_MOVE_DEPART)
          .filter((value, index, self) => self.indexOf(value) === index);

        uniqueMedDeparts.forEach(element => {
          let medDepart = {
            name: '',
            number: 0
          }
          medDepart.name = element;
          medDepart.number = this.dataSource2.filteredData.filter((obj) => obj.PM_MOVE_DEPART === element).length;
          this.arrayOfMedDepts.push(medDepart);
        });
        let coronaExists = this.dataSource2.filteredData.filter((obj) => obj.CoronaStatus === 'מאומת קורונה').length;
        if (coronaExists > 0) {
          this.CoronaStatus = '1'
        }
        if (subDepart != '') {
          this.patientsTable = true;
          this.applyFilter(event, subDepart);
        }
        this.Patientsloading = false;
      });
  }


}
