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
  columnsToDisplay2: string[] = ['inprogress', 'waiting'];
  columnsToDisplay3: string[] = ['adult', 'child', 'women', 'lyingdown', 'standing', 'shockroom'];
  dataSource3 = new MatTableDataSource<any>();
  dataSource4 = new MatTableDataSource<any>();
  dataSource5 = new MatTableDataSource<any>();

  constructor(public dialog: MatDialog,
    private http: HttpClient) { }

  otherDepartName: string;
  delivery: boolean;
  surgery: boolean;
  ICU: boolean;
  deliveryRoomForm: FormGroup;

  ngOnInit(): void {
    this.delivery = false;
    this.surgery = false;
    this.ICU = false;
    this.getOtherDepartmentsDetails();
    
    this.deliveryRoomForm = new FormGroup({
      beforeDelivery: new FormControl('', null),
      beforeSurgery: new FormControl('', null)
    });
    this.getSubmitChanges('0');
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
      if(ifsaved == '1'){
        this.dialog.closeAll();
      }
  }

  getOtherDepartmentsDetails() {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetOtherDepartmentDetails", {
        _otherDepartName: this.otherDepartName
      })
      .subscribe((Response) => {
        if (Response["d"][0].ImperialBirth != null) {
          this.delivery = true;
          this.surgery = false;
          this.ICU = false;
          this.dataSource3 = new MatTableDataSource<any>(Response["d"]);
        } else if (Response["d"][0].SurgeryCountInProgress != null) {
          this.surgery = true;
          this.delivery = false;
          this.ICU = false;
          this.dataSource4 = new MatTableDataSource<any>(Response["d"]);
        } else {
          this.ICU = true;
          this.delivery = false;
          this.surgery = false;
          this.dataSource5 = new MatTableDataSource<any>(Response["d"]);
        }
      });
  }

}
