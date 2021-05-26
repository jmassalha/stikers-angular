import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UpdatesingleformComponent } from '../updatesingleform/updatesingleform.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';

export interface Patient {
  FormID: string;
  PatientID: string;
  PatientName: string;
  PatientPassport: string;
  PatientPhone: string;
  PatientEmail: string;
  NurseInCharge: string;
  PatientGender: string;
  SavedToNamer: string;
  PatientBirthday: string;
  Row_ID: string;
  PatientAddress: string;
  FormName: string;
  DateOfFillForm: string;
  Signature: any;
  Questions: string[];
  NursesTable: string[];
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

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  FormID: string;
  PatientID: string;
  PatientName: string;
  PatientPassport: string;
  PatientPhone: string;
  SavedToNamer: string;
  Row_ID: string;
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
  _tableArr = [];
  todaysDate = Date.now;

  formSearchPatient: FormGroup;
  formSearchEmployee: FormGroup;
  urlID: number;
  isCaseNumber: string;
  isCaseNumber2: string;

  TABLE_DATA: Patient[] = [];
  rowFormData = {} as Patient;
  displayedColumns: string[] = [
    'PatientID', 'PatientName', 'PersonalID', 'NurseInCharge', 'PatientDate', 'Print'
  ];
  expandedElement: Patient | null;
  dataSource = new MatTableDataSource(this.TABLE_DATA);
  answersData = new BehaviorSubject<AbstractControl[]>([]);

  constructor(
    public dialog: MatDialogRef<FormsansweredComponent>,
    private router: Router,
    private http: HttpClient,
    private confirmationDialogService: ConfirmationDialogService,
    private _sanitizer: DomSanitizer,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
  ) { }

  onlyColumns: FormArray = this.formBuilder.array([]);
  TablesColsRows: FormArray = this.formBuilder.array([{
    Columns: this.onlyColumns,
    RowValue: ['', null],
    RowIDFK: ['', null],
  }]);
  surveyTables: FormArray = this.formBuilder.array([{
    ColumnRows: this.TablesColsRows,
    TableID: new FormControl('', null)
  }]);
  formPrint: FormGroup = this.formBuilder.group({
    rowFormData: new FormControl('', null),
    Tables: this.surveyTables,
  });

  ngOnInit(): void {
    this.formSearchPatient = new FormGroup({
      'caseNumber': new FormControl('', null),
      'personalPassport': new FormControl('', null),
      'FillDate': new FormControl('', null),
      'EmployeeUserName': new FormControl('', null),
    });
    this.formPrint = new FormGroup({
      'rowFormData': new FormControl('', null),
      'Tables': new FormControl('', null),
    })
    this.searchForm();
  }

  public printRowForm(row): void {
    this.dialog.close(row);
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  saveFormToNamer(element){
    this.confirmationDialogService
            .confirm("נא לאשר..", "האם אתה בטוח ...? ")
            .then((confirmed) => {
                console.log("User confirmed:", confirmed);
                if (confirmed) {
                  this.http
                  .post("http://localhost:64964/WebService.asmx/LinkPdfToPatientNamer", {
                    CaseNumber: element.PatientID,
                    FormID: element.FormID,
                    Catigory: "ZPO_ONLINE",
                    Row_ID: element.Row_ID,
                  })
                  .subscribe((Response) => {
                    //need to check if saved completed
                    if(true){
                      this.openSnackBar("! נשמר בהצלחה לתיק מטופל בנמר");
                      this.searchForm();
                    }else{
                      this.openSnackBar("! משהו לא תקין");
                    }
                  });
                } else {
                }
            })
            .catch(() =>
                console.log(
                    "User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)"
                )
            );
    
  }

  updateView2() {
    this.answersData.next(this.surveyTables.controls);
    this.answersData.next(this.TablesColsRows.controls);
    this.answersData.next(this.onlyColumns.controls);
  }

  onClose(){
    this.dialog.close();
  }

  searchForm() {
    let caseNumber = this.formSearchPatient.controls['caseNumber'].value;
    let personalPassport = this.formSearchPatient.controls['personalPassport'].value;
    let FillDate = this.formSearchPatient.controls['FillDate'].value;
    let EmployeeUserName = this.formSearchPatient.controls['EmployeeUserName'].value;
    let FormID = this.urlID;
    let pipe = new DatePipe('en-US');
    if (!(FillDate == undefined || FillDate == "" || FillDate == null)) {
      FillDate = pipe.transform(FillDate, 'yyyy/MM/dd');
    } else {
      FillDate = "";
    }
    if (caseNumber == undefined) {
      caseNumber = null;
    }
    if (personalPassport == undefined || personalPassport == null) {
      personalPassport = "";
    }

    this.http
      .post("http://localhost:64964/WebService.asmx/GetPersonalDetailsForForms", {
        _formID: FormID,
        _caseNumber: caseNumber,
        _personalPassport: personalPassport,
        _fillDate: FillDate,
        _employeeUserName: EmployeeUserName,
      })
      .subscribe((Response) => {
        this.all_forms_filter = Response["d"];
        if (this.all_forms_filter[0]) {
          this.isCaseNumber = this.all_forms_filter[0].isCaseNumber;
        }
        this.TABLE_DATA = [];
        for (var i = 0; i < this.all_forms_filter.length; i++) {
          if (this.all_forms_filter[i].CaseNumber != '1') {
            this.TABLE_DATA.push({
              FormID: this.all_forms_filter[i].formID,
              PatientID: this.all_forms_filter[i].CaseNumber,
              PatientName: this.all_forms_filter[i].PatientsList[0].PersonalFirstName + ' ' + this.all_forms_filter[i].PatientsList[0].PersonalLastName,
              DateOfFillForm: this.all_forms_filter[i].PatientsList[0].DateOfFillForm.split(' ')[0],
              PatientBirthday: this.all_forms_filter[i].PatientsList[0].PersonalBirthday.split(' ')[0],
              PatientPassport: this.all_forms_filter[i].PatientsList[0].PersonalID,
              PatientPhone: this.all_forms_filter[i].PatientsList[0].PersonalPhone,
              Row_ID: this.all_forms_filter[i].PatientsList[0].Row_ID,
              PatientEmail: this.all_forms_filter[i].PatientsList[0].PersonalEmail,
              PatientGender: this.all_forms_filter[i].PatientsList[0].PersonalGender,
              PatientAddress: this.all_forms_filter[i].PatientsList[0].PersonalAddress,
              SavedToNamer: this.all_forms_filter[i].PatientsList[0].SavedToNamer,
              NurseInCharge: this.all_forms_filter[i].PatientsList[0].NurseFullName,
              FormName: this.all_forms_filter[i].FormName,
              Signature: this._sanitizer.bypassSecurityTrustResourceUrl(this.all_forms_filter[i].Signature),
              Questions: this.all_forms_filter[i].NurseAnswers,
              NursesTable: this.all_forms_filter[i].NursesTable,
            });
          } else {
            this.TABLE_DATA.push({
              FormID: this.all_forms_filter[i].formID,
              PatientID: "",
              PatientName: "",
              DateOfFillForm: this.all_forms_filter[i].DateOfFillForm.split(' ')[0],
              PatientBirthday: "",
              PatientPassport: "",
              PatientPhone: "",
              Row_ID: "",
              PatientEmail: "",
              PatientGender: "",
              SavedToNamer: "1",
              PatientAddress: "",
              NurseInCharge: this.all_forms_filter[i].FirstName + ' ' + this.all_forms_filter[i].LastName,
              FormName: this.all_forms_filter[i].FormName,
              Signature: this._sanitizer.bypassSecurityTrustResourceUrl(this.all_forms_filter[i].PersonalSignature),
              Questions: this.all_forms_filter[i].NurseAnswers,
              NursesTable: this.all_forms_filter[i].NursesTable,
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
