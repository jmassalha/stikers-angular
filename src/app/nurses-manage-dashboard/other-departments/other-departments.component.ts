import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-other-departments',
  templateUrl: './other-departments.component.html',
  styleUrls: ['./other-departments.component.css']
})
export class OtherDepartmentsComponent implements OnInit {

  columnsToDisplay1: string[] = ['regular', 'imperial', 'other', 'beforebirth', 'beforesurgery'];
  columnsToDisplay1_2: string[] = ['casenumber', 'firstname', 'lastname', 'birthtype', 'date', 'time', 'birthweek'];
  columnsToDisplay2: string[] = ['inprogress', 'waiting', 'completed', 'canceled'];
  columnsToDisplay2_2: string[] = ['patientid', 'firstname', 'lastname', 'date', 'room', 'surgeryname', 'status'];
  columnsToDisplay3: string[] = ['adult', 'child', 'women', 'lyingdown', 'standing', 'shockroom'];
  columnsToDisplay3_2: string[] = ['casenumber','departmed', 'patientlastname', 'patientfirstname','dadname','age','gender','datein', 'timein'];
  dataSource3 = new MatTableDataSource<any>();
  dataSource4 = new MatTableDataSource<any>();
  dataSource5 = new MatTableDataSource<any>();
  dataSource3_2 = new MatTableDataSource<any>();
  dataSource4_2 = new MatTableDataSource<any>();
  dataSource5_2 = new MatTableDataSource<any>();

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource3_2.filter = filterValue;
  }
  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource4_2.filter = filterValue;
  }
  applyFilter3(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource5_2.filter = filterValue;
  }

  constructor(public dialog: MatDialog,
    private http: HttpClient,
    private datePipe: DatePipe) { }

  otherDepartName: string;
  progressBarNumbers: boolean;
  delivery: boolean;
  surgery: boolean;
  ICU: boolean;
  ICUDetails: boolean;
  deliveryRoomForm: FormGroup;
  date = new Date();
  myDate = this.datePipe.transform(this.date, 'yyyy-MM-dd');

  ngOnInit(): void {
    this.delivery = false;
    this.surgery = false;
    this.ICU = false;
    this.ICUDetails = false;
    this.progressBarNumbers = false;
    this.getOtherDepartmentsDetails();

    this.deliveryRoomForm = new FormGroup({
      beforeDelivery: new FormControl('', null),
      beforeSurgery: new FormControl('', null)
    });
    this.getSubmitChanges('0');
  }

  closeModal() {
    this.dialog.closeAll();
  }

  getSubmitChanges(ifsaved) {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/SubmitOtherDepartmentChanges", {
        _beforeDelivery: this.deliveryRoomForm.controls['beforeDelivery'].value,
        _beforeSurgery: this.deliveryRoomForm.controls['beforeSurgery'].value,
        userName: localStorage.getItem('loginUserName').toLowerCase()
      })
      .subscribe((Response) => {
        this.deliveryRoomForm.controls['beforeDelivery'].setValue(Response["d"][0]);
        this.deliveryRoomForm.controls['beforeSurgery'].setValue(Response["d"][1]);
      });
    if (ifsaved == '1') {
      this.dialog.closeAll();
    }
  }

  getOtherDepartmentsDetails() {
    this.progressBarNumbers = false;
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetOtherDepartmentDetails", {
        _otherDepartName: this.otherDepartName
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

  getOtherDepartmentPatients(ICUType) {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetOtherDepartmentPatients", {
        _otherDepartName: ICUType
      })
      .subscribe((Response) => {
        // this.dataSource5_2 = new MatTableDataSource<any>();
        this.ICUDetails = true;
        this.dataSource5_2 = new MatTableDataSource<any>(Response["d"]);
      });
  }

}
