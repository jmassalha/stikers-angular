import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

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
  gymDetails: FormGroup;
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
  myDate = new Date();
  _switchHTOK: any = "0";
  _switchBlossom: any = "0";
  AcceptTerms: any;
  saveBtnWait: boolean = false;
  Api = environment.url;

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
      FirstNameEng: new FormControl(this.employee.FirstNameEng, null),
      LastName: new FormControl(this.employee.LastName, [Validators.required]),
      LastNameEng: new FormControl(this.employee.LastNameEng, null),
      Gender: new FormControl(this.employee.Gender, [Validators.required]),
      KupaID: new FormControl(this.employee.KupaID, null),
      Email: new FormControl(this.employee.Email, null),
      CellNumber: new FormControl(this.employee.CellNumber, [Validators.required, Validators.pattern("[0-9 ]{10}")]),
      // KupaID: new FormControl(this.employee.KupaID, null),
      // KupaName: new FormControl(this.employee.KupaName, null),
      DateOfBirth: new FormControl(this.employee.DateOfBirth, [Validators.required]),
    });
    // if(this.employee.GymParticipation.StartGymDate == null) this.employee.GymParticipation.StartGymDate = '2023-07-27'
    // if(this.employee.GymParticipation.EndGymDate == null) this.employee.GymParticipation.EndGymDate = '2023-07-27'
    this.gymDetails = this.formBuilder.group({
      GymParticipant: new FormControl(this.employee.GymParticipation.Row_ID != null, null),
      Row_ID: new FormControl(this.employee.GymParticipation.Row_ID, null),
      StartGymDate: new FormControl(this.employee.GymParticipation.StartGymDate, null),
      EndGymDate: new FormControl(this.employee.GymParticipation.EndGymDate, null),
      MedicalProblems: new FormControl(this.employee.GymParticipation.MedicalProblems, null),
      MedicalApproval: new FormControl(this.employee.GymParticipation.MedicalApproval.toLowerCase() == 'true', null),
      PausePeriod: new FormControl(this.employee.GymParticipation.PausePeriod.toLowerCase() == 'true', null),
      PausePeriodExplain: new FormControl(this.employee.GymParticipation.PausePeriodExplain, null),
      EmployeesID: new FormControl(this.employee.GymParticipation.EmployeesID, null),
      Status: new FormControl(this.employee.GymParticipation.Status, null),
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
      DateToEndWork: new FormControl(this.employee.DateToEndWork, null),
      CarType: new FormControl(this.employee.CarType, null),
      CarNumber: new FormControl(this.employee.CarNumber, null),
      CarType2: new FormControl(this.employee.CarType2, null),
      CarNumber2: new FormControl(this.employee.CarNumber2, null),
      Remarks: new FormControl(this.employee.Remarks, null),
      // UpdateDate: new FormControl(this.employee.UpdateDate, null),
      // SentToMOHDate: new FormControl(this.employee.SentToMOHDate, null),
      DocLicence: new FormControl(this.employee.DocLicence, null),
      DocStartExperience: new FormControl(this.employee.DocStartExperience, null),
      InternLearnCountry: new FormControl(this.employee.InternLearnCountry, null),
      InternLearnCountryDesc: new FormControl(this.employee.InternLearnCountryDesc, null),
      InternUniversity: new FormControl(this.employee.InternUniversity, null),
      StatusRow: new FormControl(this.employee.StatusRow, null),
      ApprovedToBlossom: new FormControl(this.employee.ApprovedToBlossom, null),
      AcceptTerms: new FormControl(this.employee.AcceptTerms, null),
      Toranot: new FormControl(this.employee.Toranot, null),
    });
    if (this.employee.RowID == null || this.employee.StatusRow == "1") {
      this.employeePersonalDetails.controls['FirstNameEng'].setValidators(Validators.required);
      this.employeePersonalDetails.controls['LastNameEng'].setValidators(Validators.required);
    }
    this.markRequiredFields();
    this._switchHTOK = this.employee.StatusRow;
    this._switchBlossom = this.employee.ApprovedToBlossom;
    this.AcceptTerms = this.employee.AcceptTerms;

    this.sektorSelection(this.employee.EmployeeSektorID);
    this.getEmployeesFunctionsList();
    this.getRanksList();
    this.getWorkPlacesList();
    this.getEmployeesBlossomSektorList();
    this.getEmployeeDepartmentList();
    this.getUserName(this.employee.Email);
  }

  switchHTOK() {
    if (this._switchHTOK != "1") {
      this._switchHTOK = "1";
      this.employeePersonalDetails.controls['FirstNameEng'].setValidators(Validators.required);
      this.employeePersonalDetails.controls['LastNameEng'].setValidators(Validators.required);
      this.employeeWorkDetails.controls['StatusRow'].setValue(this._switchHTOK);
    } else {
      this._switchHTOK = "0";
      this.employeePersonalDetails.controls['FirstNameEng'].setValidators(null);
      this.employeePersonalDetails.controls['LastNameEng'].setValidators(null);
      this.employeeWorkDetails.controls['StatusRow'].setValue(this._switchHTOK);
    }
  }

  switchBlossom() {
    if (this._switchBlossom != "1") {
      this._switchBlossom = "1";
      this.employeeWorkDetails.controls['ApprovedToBlossom'].setValue(this._switchBlossom);
    } else {
      this._switchBlossom = "0";
      this.employeeWorkDetails.controls['ApprovedToBlossom'].setValue(this._switchBlossom);
    }
  }

  goToSignForm() {

  }

  markRequiredFields() {
    this.employeePersonalDetails.controls['EmployeeID'].markAsTouched();
    this.employeePersonalDetails.controls['FirstName'].markAsTouched();
    this.employeePersonalDetails.controls['LastName'].markAsTouched();
    this.employeePersonalDetails.controls['CellNumber'].markAsTouched();
    this.employeePersonalDetails.controls['DateOfBirth'].markAsTouched();
    if (this.employee.RowID == null) {
      this.employeePersonalDetails.controls['FirstNameEng'].markAsTouched();
      this.employeePersonalDetails.controls['LastNameEng'].markAsTouched();
    }
    this.employeeWorkDetails.controls['StartWorkDate'].markAsTouched();
  }

  // acceptTermsFunc() {
  //   if(this.AcceptTerms){
  //     this.employeeWorkDetails.controls['AcceptTerms'].setValue("1");
  //   }else{
  //     this.employeeWorkDetails.controls['AcceptTerms'].setValue("0");
  //   }
  // }

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
      if (domain.toLowerCase() == "tzmc.gov.il" || domain.toLowerCase() == "poria.health.gov.il") {
        userName = email.split('@')[0];
        this.employeeWorkDetails.controls['ADUserName'].setValue(userName);
      }
    }
    return userName;
  }

  duplicateToNewEmployee() {
    this.employeePersonalDetails.reset();
    this.employeeWorkDetails.controls['ADUserName'].reset();
    this.employeeWorkDetails.controls['RowID'].reset();
    this.employeeWorkDetails.controls['DocStartExperience'].reset();
    this.employeeWorkDetails.controls['DocLicence'].reset();
    this.employeeWorkDetails.controls['StartWorkDate'].setValue(this.myDate); //set to today
  }

  getRanksList() {
    this.http
      .post(this.Api + "GetRanksList", {
      })
      .subscribe((Response) => {
        this.RanksList = Response["d"];
      });
  }

  getWorkPlacesList() {
    this.http
      .post(this.Api + "GetWorkPlacesList", {
      })
      .subscribe((Response) => {
        this.WorkPlacesList = Response["d"];
      });
  }

  getEmployeeDepartmentList() {
    this.http
      .post(this.Api + "GetEmployeeDepartmentList", {
      })
      .subscribe((Response) => {
        this.DepartmentsList = Response["d"];
      });
  }

  getSektorsList() {
    this.http
      .post(this.Api + "GetSektorsList", {
      })
      .subscribe((Response) => {
        this.SektorsList = Response["d"];
      });
  }

  getEmployeesFunctionsList() {
    this.http
      .post(this.Api + "GetEmployeesFunctionsList", {
        _userName: this.UserName
      })
      .subscribe((Response) => {
        this.FunctionsList = Response["d"];
      });
  }

  getEmployeesBlossomSektorList() {
    this.http
      .post(this.Api + "GetEmployeesBlossomSektorList", {
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
      .post(this.Api + "CheckIfEmployeeExists", {
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
              FirstNameEng: new FormControl(this.employee.FirstNameEng, [Validators.required]),
              LastName: new FormControl(this.employee.LastName, [Validators.required]),
              LastNameEng: new FormControl(this.employee.LastNameEng, [Validators.required]),
              Gender: new FormControl(this.employee.Gender, [Validators.required]),
              KupaID: new FormControl(this.employee.KupaID, null),
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
              DateToEndWork: new FormControl(this.employee.DateToEndWork, null),
              CarType: new FormControl(this.employee.CarType, null),
              CarNumber: new FormControl(this.employee.CarNumber, null),
              CarType2: new FormControl(this.employee.CarType2, null),
              CarNumber2: new FormControl(this.employee.CarNumber2, null),
              Remarks: new FormControl(this.employee.Remarks, null),
              // UpdateDate: new FormControl(this.employee.UpdateDate, null),
              // SentToMOHDate: new FormControl(this.employee.SentToMOHDate, null),
              DocLicence: new FormControl(this.employee.DocLicence, null),
              DocStartExperience: new FormControl(this.employee.DocStartExperience, null),
              InternLearnCountry: new FormControl(this.employee.InternLearnCountry, null),
              InternLearnCountryDesc: new FormControl(this.employee.InternLearnCountryDesc, null),
              InternUniversity: new FormControl(this.employee.InternUniversity, null),
              StatusRow: new FormControl(this.employee.StatusRow, null),
              ApprovedToBlossom: new FormControl(this.employee.ApprovedToBlossom, null),
              AcceptTerms: new FormControl(this.employee.AcceptTerms, null),
              Toranot: new FormControl(this.employee.Toranot, null),
            });
            this._switchHTOK = this.employee.StatusRow;
            this._switchBlossom = this.employee.ApprovedToBlossom;
            this.AcceptTerms = this.employee.AcceptTerms;
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

  setEndTime() {
    let pipe = new DatePipe('en-US');
    // if(this.gymDetails.controls['EndGymDate'].value == null){
    //   this.gymDetails.controls['EndGymDate'] = this.gymDetails.controls['StartGymDate'];
    //   this.gymDetails.controls['EndGymDate'].setValue(this.gymDetails.controls['StartGymDate'].value);
    // }
    this.gymDetails.controls['EndGymDate'].setValue(new Date());
    this.gymDetails.controls['EndGymDate'].value.setMonth(this.gymDetails.controls['StartGymDate'].value.getMonth() + 3);
    this.gymDetails.controls['EndGymDate'].value.setDate(this.gymDetails.controls['StartGymDate'].value.getDate());
    this.gymDetails.controls['EndGymDate'].setValue(pipe.transform(this.gymDetails.controls['EndGymDate'].value, 'yyyy-MM-dd'));
  }

  saveEmployee() {
    this.employeeWorkDetails.controls['EmployeeIndex'].setValue(this.getEmployeeIndex());
    let pipe = new DatePipe('en-US');
    this.employeeWorkDetails.controls['StartWorkDate'].setValue(pipe.transform(this.employeeWorkDetails.controls['StartWorkDate'].value, 'yyyy-MM-dd'));
    this.employeeWorkDetails.controls['DocStartExperience'].setValue(pipe.transform(this.employeeWorkDetails.controls['DocStartExperience'].value, 'yyyy-MM-dd'));
    this.employeeWorkDetails.controls['EndWorkDate'].setValue(pipe.transform(this.employeeWorkDetails.controls['EndWorkDate'].value, 'yyyy-MM-dd'));
    this.employeeWorkDetails.controls['DateToEndWork'].setValue(pipe.transform(this.employeeWorkDetails.controls['DateToEndWork'].value, 'yyyy-MM-dd'));
    this.employeePersonalDetails.controls['DateOfBirth'].setValue(pipe.transform(this.employeePersonalDetails.controls['DateOfBirth'].value, 'yyyy-MM-dd'));
    this.gymDetails.controls['StartGymDate'].setValue(pipe.transform(this.gymDetails.controls['StartGymDate'].value, 'yyyy-MM-dd'));
    if (this.employeeWorkDetails.controls['StatusRow'].value == null || this.employeeWorkDetails.controls['StatusRow'].value == "0") {
      this.employeeWorkDetails.controls['StatusRow'].setValue('0');
      this.employeePersonalDetails.controls['FirstNameEng'].setValidators(null);
      this.employeePersonalDetails.controls['LastNameEng'].setValidators(null);
    } else if (this.employeeWorkDetails.controls['StatusRow'].value == "1") {
      this.employeePersonalDetails.controls['FirstNameEng'].setValidators(Validators.required);
      this.employeePersonalDetails.controls['LastNameEng'].setValidators(Validators.required);
    }
    if (!this.employeeWorkDetails.invalid && !this.employeePersonalDetails.invalid) {
      this.saveBtnWait = true;
      this.http
        .post(this.Api + "SaveEmployeeDetails", {
          _personalDetails: this.employeePersonalDetails.getRawValue(),
          _workDetails: this.employeeWorkDetails.getRawValue(),
          _gymDetails: this.gymDetails.getRawValue(),
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
    } else {
      this.openSnackBar("שכחת שדה חובה!");
    }
  }

}
