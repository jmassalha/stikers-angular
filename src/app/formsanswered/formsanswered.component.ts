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

export interface Patient {
  FormID: string;
  PatientID: string;
  PatientName: string;
  PatientPassport: string;
  PatientPhone: string;
  PatientEmail: string;
  PatientGender: string;
  PatientBirthday: string;
  PatientAddress: string;
  FormName: string;
  isCaseNumber: string;
  Signature: any;
  Questions: string[];
}
export interface Nurse {
  FormID: string;
  UserName: string;
  FormName: string;
  FirstName: string;
  LastName: string;
  isCaseNumber2: string;
  Department: string;
  Signature: any;
  fillDate: any;
  Questions: string[];
}

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
  form_nurse: Nurse;
  all_questions_filter = [];
  all_answers_filter = [];
  all_package_filter = [];
  department = [];

  formSearchPatient: FormGroup;
  formSearchEmployee: FormGroup;
  formPrint: FormGroup;
  urlID: number;
  isCaseNumber: string;
  isCaseNumber2: string;

  TABLE_DATA: Patient[] = [];
  TABLE_DATA2: Nurse[] = [];
  rowFormData = {} as Patient;
  rowFormData2 = {} as Nurse;
  displayedColumns: string[] = [
    'PatientID', 'PatientName', 'PersonalID', 'PatientDate', 'Print'
  ];

  expandedElement: Patient | null;
  dataSource = new MatTableDataSource(this.TABLE_DATA);
  dataSource2 = new MatTableDataSource(this.TABLE_DATA2);

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
    });
    this.formSearchEmployee = new FormGroup({
      'EmployeeName': new FormControl('', null),
      'EmployeeUserName': new FormControl('', null),
    });
    this.formPrint = new FormGroup({
      'question': new FormControl('', null),
    })
    this.searchForm();
    this.nurseSearchForm();
  }

  openDialogToUpdate(id) {
    let dialogRef = this.dialog.open(UpdatesingleformComponent);
    dialogRef.componentInstance.urlID = id;
  }

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
    let FormID = this.urlID;
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
      })
      .subscribe((Response) => {
        this.all_forms_filter = Response["d"];
        this.isCaseNumber = '3';
        if(this.all_forms_filter[0]){
          this.isCaseNumber = this.all_forms_filter[0].isCaseNumber;
        }
        this.TABLE_DATA = [];
        for (var i = 0; i < this.all_forms_filter.length; i++) {
          this.TABLE_DATA.push({
            FormID: this.all_forms_filter[i].formID,
            PatientID: this.all_forms_filter[i].CaseNumber,
            PatientName: this.all_forms_filter[i].PersonalFirstName+' '+this.all_forms_filter[i].PersonalLastName,
            PatientBirthday: this.all_forms_filter[i].PersonAnswers[0].FillFormDate.split(' ')[0],
            PatientPassport: this.all_forms_filter[i].PersonalID,
            PatientPhone: this.all_forms_filter[i].PersonalPhone,
            PatientEmail: this.all_forms_filter[i].PersonalEmail,
            PatientGender: this.all_forms_filter[i].PersonalGender,
            PatientAddress: this.all_forms_filter[i].PersonalAddress,
            FormName: this.all_forms_filter[i].FormName,
            isCaseNumber: this.all_forms_filter[i].isCaseNumber,
            Signature: this._sanitizer.bypassSecurityTrustResourceUrl(this.all_forms_filter[i].Signature),
            Questions: this.all_forms_filter[i].PersonAnswers,
          });
        }
        this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
        this.dataSource.paginator = this.paginator;
      });
  }

  nurseSearchForm() {

    let NurseUserName = this.formSearchEmployee.controls['EmployeeUserName'].value;
    let NurseFullName = this.formSearchEmployee.controls['EmployeeName'].value;
    let FormID = this.urlID;
   
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetNurseInChargeForForms", {
        _formID: FormID,
        _NurseUserName: NurseUserName,
        _NurseFullName: NurseFullName,
      })
      .subscribe((Response) => {
        this.all_forms_filter = Response["d"];
        this.isCaseNumber2 = '3';
        if(this.all_forms_filter[0]){
          this.isCaseNumber2 = this.all_forms_filter[0].isCaseNumber;
        }
        this.TABLE_DATA2 = [];
        for (var i = 0; i < this.all_forms_filter.length; i++) {
          this.TABLE_DATA2.push({
            FormID: this.all_forms_filter[i].formID,
            UserName: this.all_forms_filter[i].UserName,
            FormName: this.all_forms_filter[i].FormName,
            Department: this.all_forms_filter[i].Department,
            FirstName: this.all_forms_filter[i].FirstName+' '+this.all_forms_filter[i].LastName,
            LastName: this.all_forms_filter[i].LastName,
            isCaseNumber2: this.all_forms_filter[i].isCaseNumber,
            fillDate: this.all_forms_filter[i].NurseAnswers[0].FillFormDate.split(' ')[0],
            Signature: this._sanitizer.bypassSecurityTrustResourceUrl(this.all_forms_filter[i].PersonalSignature),
            Questions: this.all_forms_filter[i].NurseAnswers,
          });
        }
        this.dataSource2 = new MatTableDataSource<any>(this.TABLE_DATA2);
        this.dataSource2.paginator = this.paginator;
      });
  }
//this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl(this.all_forms_filter[i].Signature 
//+ toReturnImage.base64string);
}
