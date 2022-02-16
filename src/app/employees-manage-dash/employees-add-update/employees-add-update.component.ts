import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Injectable, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-employees-add-update',
  templateUrl: './employees-add-update.component.html',
  styleUrls: ['./employees-add-update.component.css']
})
export class EmployeesAddUpdateComponent implements OnInit {


  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  employee: any;
  employeePersonalDetails: FormGroup;
  employeeWorkDetails: FormGroup;
  RanksList = [];
  SektorsList = [];
  FunctionsList = [];
  EmployeeBlossomSektors = [];
  DepartmentsList = [];
  WorkPlacesList = [];
  managerType;
  empType: string = "none";
  UserName = localStorage.getItem("loginUserName").toLowerCase();
  EmployeeExists: boolean;

  constructor(private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    let RankID = this.employee.RankID;
    let DepartnentCode = this.employee.DepartnentCode;
    let WorkPlaceID = this.employee.WorkPlaceID;
    let functionDefault = this.employee.FunctionID;
    let employeeBlossomSektorID = this.employee.EmployeeBlossomSektorID;
    if (this.managerType == "stager") {
      RankID = "031";
      DepartnentCode = "00079150";
      employeeBlossomSektorID = "1";
      WorkPlaceID = "1";
      functionDefault = "18";
    } else if (this.managerType == "research") {
      WorkPlaceID = "2";
    }
    this.getSektorsList();
    this.employeePersonalDetails = this.formBuilder.group({
      RowID: new FormControl(this.employee.RowID, null),
      EmployeeID: new FormControl(this.employee.EmployeeID, [Validators.required, Validators.pattern("[0-9 ]{1,9}")]),
      FirstName: new FormControl(this.employee.FirstName, [Validators.required]),
      LastName: new FormControl(this.employee.LastName, [Validators.required]),
      Gender: new FormControl(this.employee.Gender, [Validators.required]),
      Email: new FormControl(this.employee.Email, [Validators.required]),
      CellNumber: new FormControl(this.employee.CellNumber, [Validators.required, Validators.pattern("[0-9 ]{10}")]),
      // KupaID: new FormControl(this.employee.KupaID, null),
      // KupaName: new FormControl(this.employee.KupaName, null),
      DateOfBirth: new FormControl(this.employee.DateOfBirth, [Validators.required]),
    });
    this.employeeWorkDetails = this.formBuilder.group({
      RowID: new FormControl(this.employee.RowID, null),
      EmployeeIndex: new FormControl('', null),
      StartWorkDate: new FormControl(this.employee.StartWorkDate, Validators.required),
      EmployeeSektorID: new FormControl(this.employee.EmployeeSektorID, null),
      EmployeeBlossomSektorID: new FormControl(employeeBlossomSektorID, null),
      Title: new FormControl(this.employee.Title, null),
      FunctionID: new FormControl(functionDefault, null),
      // FunctionDescription: new FormControl(this.employee.FunctionDescription, null),
      DepartnentCode: new FormControl(DepartnentCode, null),
      // DepartnentDescripton: new FormControl(this.employee.DepartnentDescripton, null),
      // JobTitleID: new FormControl('NULL', null),
      RankID: new FormControl(RankID, null),
      ADUserName: new FormControl('', null),
      WorkPlaceID: new FormControl(WorkPlaceID, null),
      EndWorkDate: new FormControl(this.employee.EndWorkDate, null),
      Remarks: new FormControl(this.employee.Remarks, null),
      // UpdateDate: new FormControl(this.employee.UpdateDate, null),
      // SentToMOHDate: new FormControl(this.employee.SentToMOHDate, null),
      DocLicence: new FormControl(this.employee.DocLicence, null),
      DocStartExperience: new FormControl(this.employee.DocStartExperience, null),
      InternLearnCountry: new FormControl(this.employee.InternLearnCountry, null),
      InternLearnCountryDesc: new FormControl(this.employee.InternLearnCountryDesc, null),
      InternUniversity: new FormControl(this.employee.InternUniversity, null),
    });
    this.sektorSelection(this.employee.EmployeeSektorID);
    this.getEmployeesFunctionsList();
    this.getRanksList();
    this.getWorkPlacesList();
    this.getEmployeesBlossomSektorList();
    this.getEmployeeDepartmentList();
    this.getUserName(this.employee.Email);
  }

  getEmployeeIndex() {
    return this.employeeWorkDetails.controls['DepartnentCode'].value + '_' + this.employeeWorkDetails.controls['EmployeeSektorID'].value;
  }

  getUserName(email) {
    if (email == "") {
      email = this.employeePersonalDetails.controls['Email'].value;
    }
    let userName = "";
    if (email != undefined && email != "") {
      let domain = email.split('@')[1];
      if (domain.toLowerCase() == "pmc.gov.il" || domain.toLowerCase() == "poria.health.gov.il") {
        userName = email.split('@')[0];
        this.employeeWorkDetails.controls['ADUserName'].setValue(userName);
      }
    }
    return userName;
  }

  duplicateToNewEmployee(){
    this.employeePersonalDetails.reset();
    this.employeeWorkDetails.controls['ADUserName'].reset();
    this.employeeWorkDetails.controls['RowID'].reset();
  }

  getRanksList() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetRanksList", {
      })
      .subscribe((Response) => {
        this.RanksList = Response["d"];
      });
  }

  getWorkPlacesList() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetWorkPlacesList", {
      })
      .subscribe((Response) => {
        this.WorkPlacesList = Response["d"];
      });
  }

  getEmployeeDepartmentList() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetEmployeeDepartmentList", {
      })
      .subscribe((Response) => {
        this.DepartmentsList = Response["d"];
      });
  }

  getSektorsList() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetSektorsList", {
      })
      .subscribe((Response) => {
        this.SektorsList = Response["d"];
      });
  }

  getEmployeesFunctionsList() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetEmployeesFunctionsList", {
      })
      .subscribe((Response) => {
        this.FunctionsList = Response["d"];
      });
  }

  getEmployeesBlossomSektorList() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetEmployeesBlossomSektorList", {
      })
      .subscribe((Response) => {
        this.EmployeeBlossomSektors = Response["d"];
      });
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  checkIfExists() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/CheckIfEmployeeExists", {
        _EmployeeID: this.employeePersonalDetails.controls['EmployeeID'].value
      })
      .subscribe((Response) => {
        if (Response["d"].EmployeeID != null) {
          this.openSnackBar("העובד קיים במערכת - ליצור קשר עם מערכות מידע");
          this.EmployeeExists = true;
          this.employee = Response["d"];
          if (this.managerType != "stager") {
            let RankID = this.employee.RankID;
            let DepartnentCode = this.employee.DepartnentCode;
            let WorkPlaceID = this.employee.WorkPlaceID;
            let functionDefault = this.employee.FunctionID;
            let employeeBlossomSektorID = this.employee.EmployeeBlossomSektorID;
            this.employeePersonalDetails = this.formBuilder.group({
              RowID: new FormControl(this.employee.RowID, null),
              EmployeeID: new FormControl(this.employee.EmployeeID, [Validators.required, Validators.pattern("[0-9 ]{1,9}")]),
              FirstName: new FormControl(this.employee.FirstName, [Validators.required]),
              LastName: new FormControl(this.employee.LastName, [Validators.required]),
              Gender: new FormControl(this.employee.Gender, [Validators.required]),
              Email: new FormControl(this.employee.Email, [Validators.required]),
              CellNumber: new FormControl(this.employee.CellNumber, [Validators.required, Validators.pattern("[0-9 ]{10}")]),
              // KupaID: new FormControl(this.employee.KupaID, null),
              // KupaName: new FormControl(this.employee.KupaName, null),
              DateOfBirth: new FormControl(this.employee.DateOfBirth, [Validators.required]),
            });
            this.employeeWorkDetails = this.formBuilder.group({
              RowID: new FormControl(this.employee.RowID, null),
              EmployeeIndex: new FormControl('', null),
              StartWorkDate: new FormControl(this.employee.StartWorkDate, Validators.required),
              EmployeeSektorID: new FormControl(this.employee.EmployeeSektorID, null),
              EmployeeBlossomSektorID: new FormControl(employeeBlossomSektorID, null),
              Title: new FormControl(this.employee.Title, null),
              FunctionID: new FormControl(functionDefault, null),
              // FunctionDescription: new FormControl(this.employee.FunctionDescription, null),
              DepartnentCode: new FormControl(DepartnentCode, null),
              // DepartnentDescripton: new FormControl(this.employee.DepartnentDescripton, null),
              // JobTitleID: new FormControl('NULL', null),
              RankID: new FormControl(RankID, null),
              ADUserName: new FormControl('', null),
              WorkPlaceID: new FormControl(WorkPlaceID, null),
              EndWorkDate: new FormControl(this.employee.EndWorkDate, null),
              Remarks: new FormControl(this.employee.Remarks, null),
              // UpdateDate: new FormControl(this.employee.UpdateDate, null),
              // SentToMOHDate: new FormControl(this.employee.SentToMOHDate, null),
              DocLicence: new FormControl(this.employee.DocLicence, null),
              DocStartExperience: new FormControl(this.employee.DocStartExperience, null),
              InternLearnCountry: new FormControl(this.employee.InternLearnCountry, null),
              InternLearnCountryDesc: new FormControl(this.employee.InternLearnCountryDesc, null),
              InternUniversity: new FormControl(this.employee.InternUniversity, null),
            });
          } else {
            this.employeePersonalDetails.disable();
            this.employeeWorkDetails.disable();
          }
        }
      });
  }

  setLearnCountry(country) {
    if (country.value == "ארץ") {
      this.employeeWorkDetails.controls['InternLearnCountryDesc'].setValue('ישראל');
    } else {
      this.employeeWorkDetails.controls['InternLearnCountryDesc'].setValue('');
    }
  }

  sektorSelection(sektor) {
    this.employeeWorkDetails.controls['EmployeeSektorID'].setValue(sektor);
    if (sektor == "999") {
      this.empType = "doctor";
    } else if (sektor == "899") {
      this.empType = "stager";
    } else {
      this.empType = "none";
    }
  }

  saveEmployee() {
    this.employeeWorkDetails.controls['EmployeeIndex'].setValue(this.getEmployeeIndex());
    let pipe = new DatePipe('en-US');
    this.employeeWorkDetails.controls['StartWorkDate'].setValue(pipe.transform(this.employeeWorkDetails.controls['StartWorkDate'].value, 'yyyy-MM-dd'));
    this.employeeWorkDetails.controls['DocStartExperience'].setValue(pipe.transform(this.employeeWorkDetails.controls['DocStartExperience'].value, 'yyyy-MM-dd'));
    this.employeeWorkDetails.controls['EndWorkDate'].setValue(pipe.transform(this.employeeWorkDetails.controls['EndWorkDate'].value, 'yyyy-MM-dd'));
    this.employeePersonalDetails.controls['DateOfBirth'].setValue(pipe.transform(this.employeePersonalDetails.controls['DateOfBirth'].value, 'yyyy-MM-dd'));
    if (!this.employeeWorkDetails.invalid) {
      this.http
        .post("http://srv-apps-prod/RCF_WS/WebService.asmx/SaveEmployeeDetails", {
          _personalDetails: this.employeePersonalDetails.getRawValue(),
          _workDetails: this.employeeWorkDetails.getRawValue(),
          _userName: this.UserName,
        })
        .subscribe((Response) => {
          if (Response["d"]) {
            this.openSnackBar("נשמר בהצלחה");
            this.dialog.closeAll();
          } else {
            this.openSnackBar("משהו השתבש, לא נשמר");
          }
        });
    }
  }

}
