import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { Survey, Question, Option } from './data-models';
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

  // counter = 0;


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
  QuestionID: string = "";
  urlID: number;


  ngOnInit() {
    this.initForm();
    this.getFormData(this.urlID);

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
    this.surveyForm = new FormGroup({
      'FormID': new FormControl("0", [Validators.required]),
      'FormName': new FormControl(this.FormName, [Validators.required]),
      'FormDepartment': new FormControl(this.FormDepartment, null),
      'FormDepartmentID': new FormControl(this.FormDepartmentID, [Validators.required]),
      'surveyQuestions': surveyQuestions,
    });
  }

  onAddQuestion() {
    const surveyQuestionItem = new FormGroup({
      'questionID': new FormControl('0', [Validators.required]),
      'questionTitle': new FormControl('', [Validators.required]),
      'questionType': new FormControl('', [Validators.required]),
      'IsRequired': new FormControl(false, [Validators.required]),
      'questionStatus': new FormControl('1', [Validators.required]),
      'questionGroup': new FormGroup({})
    });
    (<FormArray>this.surveyForm.get('surveyQuestions')).push(surveyQuestionItem);
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
      'optionText': new FormControl('', [Validators.required]),
      'optionStatus': new FormControl('1', [Validators.required]),
    });
    (<FormArray>this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionGroup.controls.options).push(optionGroup);
  }

  removeOption(element, questionIndex, itemIndex) {
    <FormArray>this.surveyForm.controls.surveyQuestions['controls'][questionIndex].controls.questionGroup.controls.options.controls[itemIndex].controls.optionStatus.patchValue("0");
  }

  addOption2(index, element) {
    const optionGroup = new FormGroup({
      'optionID': new FormControl(element.OptionID, [Validators.required]),
      'optionText': new FormControl(element.OptionValue, [Validators.required]),
      'optionStatus': new FormControl(element.OptionStatus, [Validators.required]),
    });

    (<FormArray>this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionGroup.controls.options).push(optionGroup);
  }

  cancelReturn() {

  }


  postSurvey() {
    let formData = this.surveyForm.value;
    let FormID = this.FormID;
    let FormName = formData.FormName;
    let FormDepartment = formData.FormDepartment;
    let FormDepartmentID = formData.FormDepartmentID;
    let Questions = [];
    let surveyQuestions = formData.surveyQuestions;

    var survey = new Survey(FormID, FormName, FormDepartment, FormDepartmentID, Questions);

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
            console.log(optionItem);
          }
          else {
            questionItem.QuestionOptions.push(optionItem);
          }

        });
      }
      if (questionItem.QuestionID === '0' && questionItem.QuestionStatus === '0') {
        console.log(questionItem);
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
        if(this.FormID == null){
          this.FormID = "0";
        }
        this.FormDepartment = this.filter_form_response.FormDepartment;
        this.FormDepartmentID = this.filter_form_response.FormDepartmentID;
        this.surveyForm.controls['FormID'].patchValue(this.FormID);
        this.surveyForm.controls['FormName'].patchValue(this.FormName);
        this.surveyForm.controls['FormDepartment'].patchValue(this.FormDepartment);
        this.surveyForm.controls['FormDepartmentID'].patchValue(this.FormDepartmentID);
        this._questionArr = this.filter_form_response.FormQuestions;
        let counter = 0;

        if (this._questionArr != null) {
          this._questionArr.forEach(element => {
            if(element.PinQuestion == "0"){
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
    this.postSurvey();
  }

}
