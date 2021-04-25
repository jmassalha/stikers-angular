import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UpdatesingleformComponent } from '../updatesingleform/updatesingleform.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

export interface Patient {
  FormID: string;
  PatientID: string;
  PatientName: string;
  PatientPassport: string;
  PatientPhone: string;
  PatientEmail: string;
  NurseInCharge: string;
  PatientGender: string;
  PatientBirthday: string;
  PatientAddress: string;
  FormName: string;
  DateOfFillForm: string;
  Signature: any;
  Questions: string[];
}


// export interface Nurse {
//   FormID: string;
//   UserName: string;
//   FormName: string;
//   FirstName: string;
//   LastName: string;
//   isCaseNumber2: string;
//   Department: string;
//   Signature: any;
//   fillDate: any;
//   Questions: string[];
// }

export interface Questions {
  QuestionVal: string;
  AnswerVal: string;
  CaseNumber: string;
}


@Component({
  selector: 'app-formsanswered',
  templateUrl: './formsanswered.component.html',
  styleUrls: ['./formsanswered.component.css'],
})
export class FormsansweredComponent implements OnInit {

  FormID: string;
  PatientID: string;
  PatientName: string;
  PatientPassport: string;
  PatientPhone: string;
  PatientEmail: string;
  PatientGender: string;
  PatientBirthday: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  all_forms_filter = [];
  form_patients: Patient;
  // form_nurse: Nurse;
  all_questions_filter = [];
  all_answers_filter = [];
  all_package_filter = [];
  department = [];
  todaysDate = Date.now;

  formSearchPatient: FormGroup;
  formSearchEmployee: FormGroup;
  formPrint: FormGroup;
  urlID: number;
  isCaseNumber: string;
  isCaseNumber2: string;

  TABLE_DATA: Patient[] = [];
  // TABLE_DATA2: Nurse[] = [];
  rowFormData = {} as Patient;
  // rowFormData2 = {} as Nurse;
  displayedColumns: string[] = [
    'PatientID', 'PatientName', 'PersonalID','NurseInCharge', 'PatientDate', 'Print'
  ];

  expandedElement: Patient | null;
  dataSource = new MatTableDataSource(this.TABLE_DATA);
  // dataSource2 = new MatTableDataSource(this.TABLE_DATA2);

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private _sanitizer: DomSanitizer) { }


  ngOnInit(): void {
    this.formSearchPatient = new FormGroup({
      'caseNumber': new FormControl('', null),
      'personalPassport': new FormControl('', null),
      'FillDate': new FormControl('', null),
      'EmployeeUserName': new FormControl('', null),
    });
    this.formPrint = new FormGroup({
      'question': new FormControl('', null),
    })
    this.searchForm();
    // this.nurseSearchForm();
  }

  // openDialogToUpdate(id) {
  //   let dialogRef = this.dialog.open(UpdatesingleformComponent);
  //   dialogRef.componentInstance.urlID = id;
  // }

  public printRowForm(row): void {
    this.rowFormData = row;
    this.formPrint = this.fb.group({
      question: [this.rowFormData.Questions, null],
    });

    $("#loader").removeClass("d-none");
    setTimeout(function () {
      $("#loader").addClass("d-none");
      window.print();
    }, 1500);
  }

  searchForm() {
    let caseNumber = this.formSearchPatient.controls['caseNumber'].value;
    let personalPassport = this.formSearchPatient.controls['personalPassport'].value;
    let FillDate = this.formSearchPatient.controls['FillDate'].value;
    let EmployeeUserName = this.formSearchPatient.controls['EmployeeUserName'].value;
    let FormID = this.urlID;
    let pipe = new DatePipe('en-US');
    if(!(FillDate == undefined || FillDate == "" || FillDate == null)){
      FillDate = pipe.transform(FillDate, 'yyyy/MM/dd');
    }else{
      FillDate = "";
    }
    if (caseNumber == undefined) {
      caseNumber = null;
    }
    if(personalPassport == undefined || personalPassport == null){
      personalPassport ="";
    }
    
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetPersonalDetailsForForms", {
        _formID: FormID,
        _caseNumber: caseNumber,
        _personalPassport: personalPassport,
        _fillDate: FillDate,
        _employeeUserName: EmployeeUserName,
      })
      .subscribe((Response) => {
        this.all_forms_filter = Response["d"];
        if(this.all_forms_filter[0]){
          this.isCaseNumber = this.all_forms_filter[0].isCaseNumber;
        }
        this.TABLE_DATA = [];
        for (var i = 0; i < this.all_forms_filter.length; i++) {
          if(this.all_forms_filter[i].CaseNumber != '1'){
            this.TABLE_DATA.push({
            FormID: this.all_forms_filter[i].formID,
            PatientID: this.all_forms_filter[i].CaseNumber,
            PatientName: this.all_forms_filter[i].PersonalFirstName+' '+this.all_forms_filter[i].PersonalLastName,
            DateOfFillForm: this.all_forms_filter[i].DateOfFillForm.split(' ')[0],
            PatientBirthday: this.all_forms_filter[i].PersonalBirthday.split(' ')[0],
            PatientPassport: this.all_forms_filter[i].PersonalID,
            PatientPhone: this.all_forms_filter[i].PersonalPhone,
            PatientEmail: this.all_forms_filter[i].PersonalEmail,
            PatientGender: this.all_forms_filter[i].PersonalGender,
            PatientAddress: this.all_forms_filter[i].PersonalAddress,
            NurseInCharge: this.all_forms_filter[i].NurseFullName,
            FormName: this.all_forms_filter[i].FormName,
            Signature: this._sanitizer.bypassSecurityTrustResourceUrl(this.all_forms_filter[i].Signature),
            Questions: this.all_forms_filter[i].PersonAnswers,
          });
          }else{
            this.TABLE_DATA.push({
              FormID: this.all_forms_filter[i].formID,
              PatientID: "",
              PatientName: "",
              DateOfFillForm: this.all_forms_filter[i].DateOfFillForm.split(' ')[0],
              PatientBirthday: "",
              PatientPassport: "",
              PatientPhone: "",
              PatientEmail: "",
              PatientGender: "",
              PatientAddress: "",
              NurseInCharge: this.all_forms_filter[i].FirstName+' '+this.all_forms_filter[i].LastName,
              FormName: this.all_forms_filter[i].FormName,
              Signature: this._sanitizer.bypassSecurityTrustResourceUrl(this.all_forms_filter[i].PersonalSignature),
              Questions: this.all_forms_filter[i].NurseAnswers,
            });
          }
          
        }
        this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
        this.dataSource.paginator = this.paginator;
      });
  }

//this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl(this.all_forms_filter[i].Signature 
//+ toReturnImage.base64string);
}
