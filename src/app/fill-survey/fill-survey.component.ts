import { Component, OnInit, ViewChild, ChangeDetectorRef, VERSION } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { Router, ParamMap, ActivatedRoute } from "@angular/router";
import { Survey, Question, Option } from './data-models';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from 'rxjs';
import { Result } from '@zxing/library';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
export class PersonalDetails {
  FirstName: string;
  LastName: string;
  PersonID: string;
  DOB: string;
  Gender: string;
  PhoneNumber: string;
  Email: string;
  Address: string;

}
export class CheckBoxAnswers {
  QId: number;
  QAns: string[];
  QRequired: string;
}

@Component({
  selector: 'app-fill-survey',
  templateUrl: './fill-survey.component.html',
  styleUrls: ['./fill-survey.component.css'],
})

export class FillSurveyComponent implements OnInit {

  availableDevices: MediaDeviceInfo[];
  deviceCurrent: MediaDeviceInfo;
  deviceSelected: string;

  formatsEnabled: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE,
  ];

  hasDevices: boolean;
  hasPermission: boolean;

  qrResultString: string;

  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = false;

  // ngVersion = VERSION.full;

  // @ViewChild('scanner') scanner: ZXingScannerComponent;
  // hasDevices: boolean;
  // hasPermission: boolean;
  // qrResultString: string;
  // qrResult: Result;
  // availableDevices: MediaDeviceInfo[];
  // currentDevice: MediaDeviceInfo;


  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  mPersonalDetails: PersonalDetails;
  selectedCheckbox: any[];
  selectedSubCheckbox: any[];
  editMode = false;

  public filter_form_response: any = [];
  public filter_question_response: any = [];
  public filter_option_response: any = [];
  answersData = new BehaviorSubject<AbstractControl[]>([]);

  _formID: string;
  _formName: string;
  isCaseNumber: string;
  withCaseNumber: boolean;
  _formDate: string;
  CaseNumber: string = '';
  _questionArr = [];
  _optionArr = [];
  surveyAnswersItem = [];
  maxDate = Date.now();

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private readonly _dialog: MatDialog
  ) { }


  clearResult(): void {
    this.qrResultString = null;
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
    console.log(resultString);
    this.caseNumberForm.controls['CaseNumber'].setValue(resultString);
    this.searchCaseNumber();
  }

  onDeviceSelectChange(selected: string) {
    const selectedStr = selected || '';
    if (this.deviceSelected === selectedStr) { return; }
    this.deviceSelected = selectedStr;
    const device = this.availableDevices.find(x => x.deviceId === selected);
    this.deviceCurrent = device || undefined;
  }

  onDeviceChange(device: MediaDeviceInfo) {
    const selectedStr = device?.deviceId || '';
    if (this.deviceSelected === selectedStr) { return; }
    this.deviceSelected = selectedStr;
    this.deviceCurrent = device || undefined;
  }


  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }

  onTorchCompatible(isCompatible: boolean): void {
    this.torchAvailable$.next(isCompatible || false);
  }

  toggleTorch(): void {
    this.torchEnabled = !this.torchEnabled;
  }

  toggleTryHarder(): void {
    this.tryHarder = !this.tryHarder;
  }

  ChekBoxQ: CheckBoxAnswers[];
  surveyAnswers: FormArray = this.formBuilder.array([]);
  surveyForm: FormGroup = this.formBuilder.group({
    Answers: this.surveyAnswers,
  });

  caseNumberForm = new FormGroup({
    CaseNumber: new FormControl('', Validators.required)
  });

  urlID: number;

  ngOnInit() {
    this.urlID;
    this.searchCaseNumber();
  }


  myModel(e: any, id: string, questionIndex: number) {

    if (e.checked) {
      var result = this.ChekBoxQ.find(obj => {
        return obj.QId === questionIndex
      })
      this.ChekBoxQ = this.ChekBoxQ.filter(obj => obj.QId != questionIndex);
      result.QAns.push(id);
      this.ChekBoxQ.push(result);
    } else {
      var result = this.ChekBoxQ.find(obj => {
        return obj.QId === questionIndex
      });
      result.QAns = result.QAns.filter(obj => obj !== id);
      this.ChekBoxQ = this.ChekBoxQ.filter(obj => obj.QId != questionIndex);
      this.ChekBoxQ.push(result);
    }
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }


  fillForm() {
    let FormID = this._formID;
    let formData = this.surveyForm.value;
    let Answers = [];
    let surveyAnswers = formData.Answers;
    let CaseNumber = this.caseNumberForm.controls['CaseNumber'].value;
    var survey = new Survey(FormID, CaseNumber, Answers);

    surveyAnswers.forEach((answer, index, array) => {
      this.ChekBoxQ.forEach(i => {
        if (i.QId == this._questionArr[index].QuestionID) {
          answer.answerContent = i.QAns.toString();
        }
      });
      let AnswerItem = {
        'AnswerID': index,
        "AnswerValue": answer.answerContent,
        "questionID": this._questionArr[index].QuestionID,
        "formID": this._formID,
        "AnswerType": this._questionArr[index].QuestionType,
        "questionValue": this._questionArr[index].QuestionValue,
        "PinQuestion": this._questionArr[index].PinQuestion,
      }
      survey.FormAnswers.push(AnswerItem);

    });


    if (!this.surveyForm.invalid) {
      this.http
        .post("http://localhost:64964/WebService.asmx/answerForm", {
          _answerValues: survey,
        })
        .subscribe((Response) => {
          this.openSnackBar("!נשמר בהצלחה");
        });
      this.dialog.closeAll();
      this.router.navigate(['formdashboard']);
    } else {
      const invalid = [];
      const controls = this.surveyForm.controls['Answers']['controls'];
      let counter = 1;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(counter);
        }
        counter = counter + 1;
      }
      this.openSnackBar("!שאלה מספר" + invalid[0] + " לא תקינה ");
    }
  }



  searchCaseNumber() {
    this.CaseNumber = this.caseNumberForm.controls['CaseNumber'].value;
    this.withCaseNumber = false;
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetPersonalDetails", {
        CaseNumber: this.CaseNumber,
      })
      .subscribe((Response) => {
        // ***** 30910740
        this.mPersonalDetails = Response["d"];
        this.getForm(this.urlID);
        this.selectedSubCheckbox = new Array<any>();
      });
  }


  getForm(urlID) {
    this.http
      .post("http://localhost:64964/WebService.asmx/GetForm", {
        formFormID: urlID,
      })
      .subscribe((Response) => {
        this.filter_form_response = Response["d"];
        this._formID = this.filter_form_response.FormID;
        this._formName = this.filter_form_response.FormName;
        this._formDate = this.filter_form_response.FormDate;
        this.isCaseNumber = this.filter_form_response.isCaseNumber;
        if (this.isCaseNumber == '1' && this.mPersonalDetails.PersonID == null) {
          this.openSnackBar("!מספר מקרה לא תקין");
          this.withCaseNumber = true;
        } else {
          this.withCaseNumber = false;
          this.getQuestion(this.urlID, this.mPersonalDetails);
          this.getOption(this.urlID);
        }
      });

  }

  getQuestion(urlID, personalDetails) {
    this.http
      .post("http://localhost:64964/WebService.asmx/GetQuestion", {
        questionsFormID: urlID,
        isCaseNumber: this.isCaseNumber
      })
      .subscribe((Response) => {
        this.filter_question_response = Response["d"];
        this.surveyAnswers = this.formBuilder.array([]);
        var that = this;
        this.ChekBoxQ = new Array<CheckBoxAnswers>();
        this.filter_question_response.forEach(element => {

          this._questionArr.push(element);

          var surveyAnswersItem;
          if (element.QuestionIsRequired == "False") {
            surveyAnswersItem = this.formBuilder.group({
              answerContent: ['', null],
            });
          } else {
            surveyAnswersItem = this.formBuilder.group({
              answerContent: ['', Validators.required],
            });
          }
          if (personalDetails.PersonID != null) {
            if (element.PinQuestion == "1") {
              if (element.QuestionType == "Phone" && element.QuestionValue == "מספר טלפון") {
                surveyAnswersItem = this.formBuilder.group({
                  answerContent: [personalDetails.PhoneNumber, Validators.compose([Validators.required])],
                });
              }
              else if (element.QuestionType == "ID" && element.QuestionValue == "ת.ז") {
                surveyAnswersItem = this.formBuilder.group({
                  answerContent: [{ value: personalDetails.PersonID, disabled: true }, Validators.compose([Validators.pattern('[- +()0-9]{9,10}'), Validators.required])],
                });
              }
              else if (element.QuestionType == "Email" && element.QuestionValue == "כתובת מייל") {
                surveyAnswersItem = this.formBuilder.group({
                  answerContent: [personalDetails.Email, Validators.compose([Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), Validators.required])],
                });
              }
              else if (element.QuestionType == "Text" && element.QuestionValue == "שם פרטי") {
                surveyAnswersItem = this.formBuilder.group({
                  answerContent: [{ value: personalDetails.FirstName, disabled: true }, Validators.compose([Validators.required])],
                });
              }
              else if (element.QuestionType == "Text" && element.QuestionValue == "שם משפחה") {
                surveyAnswersItem = this.formBuilder.group({
                  answerContent: [{ value: personalDetails.LastName, disabled: true }, Validators.compose([Validators.required])],
                });
              }
              else if (element.QuestionType == "Text" && element.QuestionValue == "כתובת") {
                surveyAnswersItem = this.formBuilder.group({
                  answerContent: [{ value: personalDetails.Address, disabled: true }, Validators.compose([Validators.required])],
                });
              }
              else if (element.QuestionType == "Date" && element.QuestionValue == "תאריך לידה") {
                surveyAnswersItem = this.formBuilder.group({
                  answerContent: [{ value: personalDetails.DOB, disabled: true }, Validators.compose([Validators.required])],
                });
              }
              else if (element.QuestionType == "RadioButton" && element.QuestionValue == "מין") {
                if (personalDetails.Gender == "1") {
                  surveyAnswersItem = this.formBuilder.group({
                    answerContent: [{ value: 'זכר', disabled: true }, Validators.compose([Validators.required])],
                  });
                } else if (personalDetails.Gender == "2") {
                  surveyAnswersItem = this.formBuilder.group({
                    answerContent: [{ value: 'נקבה', disabled: true }, Validators.compose([Validators.required])],
                  });
                } else {
                  surveyAnswersItem = this.formBuilder.group({
                    answerContent: ['', Validators.compose([Validators.required])],
                  });
                }

              }
            }
          }

          if (element.QuestionType == "CheckBox") {

            var nQ = new CheckBoxAnswers();
            nQ.QRequired = element.QuestionIsRequired;
            nQ.QId = element.QuestionID
            nQ.QAns = [];
            that.ChekBoxQ.push(nQ);

          }
          this.surveyAnswers.push(surveyAnswersItem);
        });
        this.updateView();
        this.surveyForm = this.formBuilder.group({
          Answers: this.surveyAnswers,
        });

      });
  }


  updateView() {
    this.answersData.next(this.surveyAnswers.controls);
  }


  getOption(urlID) {
    this.http
      .post("http://localhost:64964/WebService.asmx/GetOption", {
        optionsFormID: urlID,
      })
      .subscribe((Response) => {
        this.filter_option_response = Response["d"];
        this._optionArr = [];
        this.filter_option_response.forEach(element => {
          this._optionArr.push(element);
        });
      });
  }

  onSubmit() {
    this.fillForm();
  }

}