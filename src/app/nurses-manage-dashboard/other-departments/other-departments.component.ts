import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-other-departments',
  templateUrl: './other-departments.component.html',
  styleUrls: ['./other-departments.component.css']
})
export class OtherDepartmentsComponent implements OnInit {

  @Input()
  deliveryRoomDialog: string;

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  columnsToDisplay1: string[] = ['all','regular', 'imperial', 'other', 'beforebirth', 'beforesurgery'];
  columnsToDisplay1_2: string[] = ['casenumber', 'firstname', 'lastname', 'birthtype', 'date', 'time', 'birthweek'];
  columnsToDisplay2: string[] = ['inprogress', 'waiting', 'completed', 'canceled'];
  columnsToDisplay2_2: string[] = ['patientid', 'firstname', 'lastname', 'departname', 'room', 'surgeryname', 'date', 'starttime', 'endtime', 'status'];
  columnsToDisplay3: string[] = ['all', 'shockroom', 'lyingdown', 'standing', 'women', 'child'];
  columnsToDisplay3_2: string[] = ['casenumber', 'departmed', 'patientlastname', 'patientfirstname', 'dadname', 'age', 'gender', 'datein', 'timein'];
  dataSource3 = new MatTableDataSource<any>();
  dataSource4 = new MatTableDataSource<any>();
  dataSource5 = new MatTableDataSource<any>();
  dataSource3_2 = new MatTableDataSource<any>();
  dataSource4_2 = new MatTableDataSource<any>();
  dataSource5_2 = new MatTableDataSource<any>();

  applyFilter(event: Event, filval) {
    if (filval == '') {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource3_2.filter = filterValue;
    } else {
      this.dataSource3_2.filter = filval;
    }
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource3_2.filter = filterValue;
  }
  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource4_2.filter = filterValue;
  }
  applyFilter3(event: Event, live) {
    if (live == '1') {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource5_2.filter = 'ACTIVE';
    } else {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource5_2.filter = filterValue;
    }
  }

  constructor(public dialog: MatDialog,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe) { }

  otherDepartName: string;
  progressBarNumbers: boolean;
  IcuPatientsBar: boolean;
  delivery: boolean;
  surgery: boolean;
  ICU: boolean;
  ICUDetails: boolean;
  deliveryRoomForm: FormGroup;
  date = new Date();
  numberOfDays = 0;
  dateToDisplayString: string;
  newDate: string;
  myDate = this.datePipe.transform(this.date, 'yyyy-MM-dd');

  ngOnInit(): void {
    this.delivery = false;
    this.surgery = false;
    this.ICU = false;
    this.ICUDetails = false;
    this.progressBarNumbers = false;
    this.IcuPatientsBar = true;
    this.getOtherDepartmentsDetails('');

    this.deliveryRoomForm = new FormGroup({
      beforeDelivery: new FormControl('', null),
      beforeSurgery: new FormControl('', null)
    });
    this.getSubmitChanges('0');
  }

  closeModal() {
    this.dialog.closeAll();
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  getSubmitChanges(ifsaved) {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/SubmitOtherDepartmentChanges", {
        _beforeDelivery: this.deliveryRoomForm.controls['beforeDelivery'].value,
        _beforeSurgery: this.deliveryRoomForm.controls['beforeSurgery'].value,
        userName: localStorage.getItem('loginUserName').toLowerCase()
      })
      .subscribe((Response) => {
        this.deliveryRoomForm.controls['beforeDelivery'].setValue(Response["d"][0]);
        this.deliveryRoomForm.controls['beforeSurgery'].setValue(Response["d"][1]);
      });
    if (ifsaved == '1') {
      this.openSnackBar("נשמר בהצלחה");
      this.ngOnInit();
    }
  }

  getOtherDepartmentsDetails(datePointer) {
    this.progressBarNumbers = false;
    if (this.deliveryRoomDialog != undefined) {
      this.otherDepartName = this.deliveryRoomDialog;
    }
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
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetOtherDepartmentDetails", {
        _otherDepartName: this.otherDepartName,
        _dateToLook: this.newDate
      })
      .subscribe((Response) => {
        let data = [];
        // let data2 = [];
        if (Response["d"][0].ImperialBirth != null) {
          this.delivery = true;
          this.surgery = false;
          this.ICU = false;
          data.push(Response["d"][0]);
          // data2.push(Response["d"][1]);
          this.dataSource3 = new MatTableDataSource<any>(data);
          this.dataSource3_2 = new MatTableDataSource<any>(Response["d"][1]);
        } else if (Response["d"][0].SurgeryCountInProgress != null) {
          this.surgery = true;
          this.delivery = false;
          this.ICU = false;
          data.push(Response["d"][0]);
          this.dataSource4 = new MatTableDataSource<any>(data);
          this.dataSource4_2 = new MatTableDataSource<any>(Response["d"][1]);
        } else {
          this.ICU = true;
          this.delivery = false;
          this.surgery = false;
          this.dataSource5 = new MatTableDataSource<any>(Response["d"]);
        }
        this.progressBarNumbers = true;
      });
  }

  getOtherDepartmentPatients(ICUType, live, event) {
    this.IcuPatientsBar = false;
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetOtherDepartmentPatients", {
        _otherDepartName: ICUType,
        _ifLive: live,
        _dateToLook: this.dateToDisplayString
      })
      .subscribe((Response) => {
        // this.dataSource5_2 = new MatTableDataSource<any>();
        this.ICUDetails = true;
        this.dataSource5_2 = new MatTableDataSource<any>(Response["d"]);
        this.applyFilter3(event, live);
        this.IcuPatientsBar = true;
      });
  }

}
