import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { Survey } from './data-models';
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
export interface QuestionType {
  value: string;
  viewValue: string;
}
export interface FormDepartment {
  deptVal: string;
}
@Component({
  selector: 'app-updatesingleform',
  templateUrl: './updatesingleform.component.html',
  styleUrls: ['./updatesingleform.component.css']
})
export class UpdatesingleformComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  surveyForm: FormGroup;
  tableFormGroup: FormGroup;
  selectedOption = [];
  editMode = false;

  _formName;
  filter_form_response: any;
  filter_form_response2: any;
  filter_question_response = [];
  filter_option_response = [];
  all_departs_filter = [];
  department = [];
  _formArr = [];
  _questionArr = [];


  questions: QuestionType[] = [
    { value: 'RadioButton', viewValue: 'בחירה יחידה' },
    { value: 'CheckBox', viewValue: 'בחירה מרובה' },
    { value: 'Text', viewValue: 'טקסט' },
    { value: 'TextArea', viewValue: 'טקסט חופשי' },
    { value: 'ID', viewValue: 'תעודת זהות' },
    { value: 'Email', viewValue: 'אימייל' },
    { value: 'Phone', viewValue: 'מספר טלפון' },
    { value: 'Date', viewValue: 'תאריך' },
    { value: 'Time', viewValue: 'זמן' },
    { value: 'Signature', viewValue: 'חתימה' },
  ];

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) { }

  FormDepartment: string = "";
  FormDepartmentID: string = "";
  Row_ID: string = "";
  FormName: string = "";
  FormID: string = "";
  FormOpenText: string = "";
  isCaseNumber: any;
  TableForm: any;
  GeneralForm: any;
  QuestionID: string = "";
  urlID: number;


  ngOnInit() {
    this.initForm();
    this.getFormData(this.urlID);
  }

  counterCols(index) {
    let numberOfCols = this.tableFormGroup.controls.tableArray.value[index].colsnumber;
    if (numberOfCols > 0) {
      return new Array(numberOfCols);
    }
  }
  counterRows(index) {
    let arrayOfCols = [];
    let numberOFRows = this.tableFormGroup.controls.tableArray.value[index].rowsnumber;
    if (numberOFRows > 0) {

      return new Array(numberOFRows);
    }
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  private initForm() {
    let surveyQuestions = new FormArray([]);
    let tableArray = new FormArray([]);
    this.surveyForm = new FormGroup({
      'FormID': new FormControl("0", [Validators.required]),
      'FormName': new FormControl(this.FormName, [Validators.required]),
      'FormDepartment': new FormControl(this.FormDepartment, null),
      'isCaseNumber': new FormControl(this.isCaseNumber, null),
      'GeneralForm': new FormControl(this.GeneralForm, null),
      'FormOpenText': new FormControl(this.FormOpenText, null),
      'TableForm': new FormControl(this.TableForm, null),
      'FormDepartmentID': new FormControl(this.FormDepartmentID, null),
      'surveyQuestions': surveyQuestions,
    });
    this.tableFormGroup = new FormGroup({
      'tableArray': tableArray,
    });
  }

  onAddQuestion() {
    const surveyQuestionItem = new FormGroup({
      'questionID': new FormControl('0', [Validators.required]),
      'questionTitle': new FormControl(' ', [Validators.required]),
      'questionType': new FormControl(' ', [Validators.required]),
      'IsRequired': new FormControl(false, [Validators.required]),
      'questionStatus': new FormControl('1', [Validators.required]),
      'questionGroup': new FormGroup({})
    });
    (<FormArray>this.surveyForm.get('surveyQuestions')).push(surveyQuestionItem);
  }

  onAddTable() {
    const tableColItem = new FormGroup({
      'tableid': new FormControl('0', null),
      'colsnumber': new FormControl('1', null),
      'tabletext': new FormControl('', null),
      'colstype': new FormControl('Text', null),
      'rowsnumber': new FormControl('1', null),
      'tablestatus': new FormControl('1', null),
      'colssplit': new FormControl('0', null),
      'colsGroup': new FormGroup({}),
      'rowsGroup': new FormGroup({})
    });
    (<FormArray>this.tableFormGroup.get('tableArray')).push(tableColItem);
  }

  onAddQuestion2(counter, element) {
    if (element.QuestionIsRequired === "True") {
      element.QuestionIsRequired = true;
    } else {
      element.QuestionIsRequired = false;
    }
    const surveyQuestionItem = new FormGroup({
      'questionID': new FormControl(element.QuestionID, [Validators.required]),
      'questionTitle': new FormControl(element.QuestionValue, [Validators.required]),
      'questionType': new FormControl(element.QuestionType, [Validators.required]),
      'IsRequired': new FormControl(element.QuestionIsRequired, [Validators.required]),
      'questionStatus': new FormControl(element.QuestionStatus, [Validators.required]),
      'questionGroup': new FormGroup({})
    });

    (<FormArray>this.surveyForm.get('surveyQuestions')).push(surveyQuestionItem);

    if (element.QuestionType === 'RadioButton' || element.QuestionType === 'CheckBox') {
      this.addOptionControls2(element.QuestionOptions, counter);
    }
  }

  onRemoveQuestion(index) {
    this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionStatus.patchValue("0");
  }

  onRemoveTable(index) {
    this.tableFormGroup.controls.tableArray['controls'][index].controls.tablestatus.patchValue("0");
  }

  onSeletQuestionType(questionType, index) {
    if (questionType === 'RadioButton' || questionType === 'CheckBox') {
      this.addOptionControls(questionType, index)
    }
  }

  addOptionControls(questionType, index) {
    let options = new FormArray([]);
    let IsRequired = new FormControl(false);
    (this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionGroup).addControl('options', options);
    this.clearFormArray((<FormArray>this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionGroup.controls.options));
    this.addOption(index);
    this.addOption(index);
  }

  addOptionControls2(questionOptions, index) {
    let options = new FormArray([]);
    let IsRequired = new FormControl(false);
    (this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionGroup).addControl('options', options);
    this.clearFormArray((<FormArray>this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionGroup.controls.options));
    let _size = Object.keys(questionOptions).length;
    for (let i = 0; i < _size; i++) {
      this.addOption2(index, questionOptions[i]);
    }
  }

  private clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  addOption(index) {
    const optionGroup = new FormGroup({
      'optionID': new FormControl('0', [Validators.required]),
      'optionText': new FormControl(' ', [Validators.required]),
      'optionStatus': new FormControl('1', [Validators.required]),
    });
    (<FormArray>this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionGroup.controls.options).push(optionGroup);
  }

  addColumnsControls(index) {
    let numberOfCols = this.tableFormGroup.controls.tableArray['controls'][index].controls.colsnumber.value;
    let column = new FormArray([]);
    (this.tableFormGroup.controls.tableArray['controls'][index].controls.colsGroup).addControl('column', column);
    this.clearFormArray((<FormArray>this.tableFormGroup.controls.tableArray['controls'][index].controls.colsGroup.controls.column));
    this.addCols(index, numberOfCols);

  }

  addCols(index, numberOfCols) {
    for (let i = 0; i < parseInt(numberOfCols); i++) {
      const colsNewGroup = new FormGroup({
        'colsText': new FormControl('', null),
      });
      (<FormArray>this.tableFormGroup.controls.tableArray['controls'][index].controls.colsGroup.controls.column).push(colsNewGroup);
    }
  }
  
  addRowsControls(index) {
    let numberOfRows = this.tableFormGroup.controls.tableArray['controls'][index].controls.rowsnumber.value;
    let row = new FormArray([]);
    (this.tableFormGroup.controls.tableArray['controls'][index].controls.rowsGroup).addControl('row', row);
    this.clearFormArray((<FormArray>this.tableFormGroup.controls.tableArray['controls'][index].controls.rowsGroup.controls.row));
    this.addRows(index, numberOfRows);
  }

  addRows(index, numberOfRows) {
    for (let i = 0; i < parseInt(numberOfRows); i++) {
      const rowsNewGroup = new FormGroup({
        'rowsText': new FormControl('', null),
      });
      (<FormArray>this.tableFormGroup.controls.tableArray['controls'][index].controls.rowsGroup.controls.row).push(rowsNewGroup);
    }
  }

  removeOption(element, questionIndex, itemIndex) {
    <FormArray>this.surveyForm.controls.surveyQuestions['controls'][questionIndex].controls.questionGroup.controls.options.controls[itemIndex].controls.optionStatus.patchValue("0");
  }

  // this one is for updating existing form
  addOption2(index, element) {
    const optionGroup = new FormGroup({
      'optionID': new FormControl(element.OptionID, [Validators.required]),
      'optionText': new FormControl(element.OptionValue, [Validators.required]),
      'optionStatus': new FormControl(element.OptionStatus, [Validators.required]),
    });

    (<FormArray>this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionGroup.controls.options).push(optionGroup);
  }

  postSurvey() {
    let formData = this.surveyForm.value;
    let FormID = this.FormID;
    let FormName = formData.FormName;
    let FormOpenText = formData.FormOpenText;
    let TableForm = formData.TableForm;
    let isCaseNumber = formData.isCaseNumber;
    let GeneralForm = formData.GeneralForm;
    let FormDepartment = formData.FormDepartment;
    let FormDepartmentID = formData.FormDepartmentID;
    if (isCaseNumber == "" || isCaseNumber == false) {
      isCaseNumber = "0";
    } else {
      isCaseNumber = "1";
    }
    if (GeneralForm == "" || GeneralForm == false) {
      GeneralForm = "0";
    } else {
      GeneralForm = "1";
    }
    if (TableForm == "" || TableForm == false) {
      TableForm = "0";
    } else {
      TableForm = "1";
    }

    let Questions = [];
    let surveyQuestions = formData.surveyQuestions;
    let FormCreatorName = localStorage.getItem("loginUserName").toLowerCase();
    let UserDepart = localStorage.getItem("Depart").toLowerCase();
    var survey = new Survey(FormID, FormName, FormOpenText, TableForm, FormDepartment, isCaseNumber, UserDepart, GeneralForm, FormDepartmentID, FormCreatorName, Questions);

    surveyQuestions.forEach((question, index, array) => {
      let questionItem = {
        'QuestionID': question.questionID,
        "QuestionType": question.questionType,
        "QuestionValue": question.questionTitle,
        "QuestionOptions": [],
        "QuestionIsRequired": question.IsRequired,
        "QuestionStatus": question.questionStatus,
      }

      if (question.questionGroup.hasOwnProperty('options')) {

        question.questionGroup.options.forEach((option, index) => {
          let optionItem = {
            "OptionID": option.optionID,
            "OptionValue": option.optionText,
            "OptionStatus": option.optionStatus,
          }
          if (optionItem.OptionID === '0' && optionItem.OptionStatus === '0') {
            console.log("empty option deleted!");
          }
          else {
            questionItem.QuestionOptions.push(optionItem);
          }

        });
      }
      if (questionItem.QuestionID === '0' && questionItem.QuestionStatus === '0') {
        console.log("empty question deleted!");
      } else {
        survey.FormQuestions.push(questionItem);
      }
    });

    if (!this.surveyForm.invalid) {
      if (this.urlID === 0) {
        this.http
          .post("http://srv-apps/wsrfc/WebService.asmx/Forms", {
            _FormValues: survey,
          })
          .subscribe((Response) => {
          });
      } else {
        this.http
          .post("http://srv-apps/wsrfc/WebService.asmx/UpdateForm", {
            updateFormValues: survey,
          })
          .subscribe((Response) => {
          });
      }
      this.openSnackBar("!נשמר בהצלחה");
      this.dialog.closeAll();
      this.router.navigate(['digitalforms']);

    } else {
      this.openSnackBar("!שכחת למלא אחד השדות");
    }
  }

  getFormData(urlID) {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetFormData", {
        formFormID: urlID,
      })
      .subscribe((Response) => {
        this.filter_form_response = Response["d"];

        this.FormName = this.filter_form_response.FormName;
        this.FormID = this.filter_form_response.FormID;
        this.FormOpenText = this.filter_form_response.FormOpenText;
        if (this.FormID == null) {
          this.FormID = "0";
        }
        if (this.filter_form_response.isCaseNumber == "0") {
          this.isCaseNumber = false;
        } else {
          this.isCaseNumber = true;
        }
        if (this.filter_form_response.GeneralForm == "0") {
          this.GeneralForm = false;
        } else {
          this.GeneralForm = true;
        }
        if (this.filter_form_response.TableForm == "0") {
          this.TableForm = false;
        } else {
          this.TableForm = true;
        }
        this.FormDepartment = this.filter_form_response.FormDepartment;
        this.FormDepartmentID = this.filter_form_response.FormDepartmentID;
        this.surveyForm.controls['FormID'].patchValue(this.FormID);
        this.surveyForm.controls['FormName'].patchValue(this.FormName);
        this.surveyForm.controls['FormOpenText'].patchValue(this.FormOpenText);
        this.surveyForm.controls['TableForm'].patchValue(this.TableForm);
        this.surveyForm.controls['isCaseNumber'].patchValue(this.isCaseNumber);
        this.surveyForm.controls['GeneralForm'].patchValue(this.GeneralForm);
        this.surveyForm.controls['FormDepartment'].patchValue(this.FormDepartment);
        this.surveyForm.controls['FormDepartmentID'].patchValue(this.FormDepartmentID);
        this._questionArr = this.filter_form_response.FormQuestions;
        let counter = 0;

        if (this._questionArr != null) {
          this._questionArr.forEach(element => {
            if (element.PinQuestion == "0") {
              this.QuestionID = element.QuestionID;
              this.onAddQuestion2(counter, element);
              counter = counter + 1;
            }

          });
        }

      });

    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetFormsDeparts", {

      })
      .subscribe((Response) => {
        this.all_departs_filter = Response["d"];

        this.all_departs_filter.forEach(element => {
          this.department.push(element);
        })
      });

  }

  onSubmit() {
    // this.postSurvey();
    this.addColumnsControls(0);
    this.addRowsControls(0);
    console.log(this.tableFormGroup.value);
  }

}
