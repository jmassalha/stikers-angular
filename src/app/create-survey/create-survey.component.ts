import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { Survey, Question, Option } from './data-models';
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
export interface QuestionType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.css']
})
export class CreateSurveyComponent implements OnInit {
  surveyForm: FormGroup;
  selectedOption = [];
  editMode = false;


  questions: QuestionType[] = [
    { value: 'RadioButton', viewValue: 'RadioButton' },
    { value: 'CheckBox', viewValue: 'CheckBox' },
    { value: 'Text', viewValue: 'Text' },
    { value: 'ID', viewValue: 'Passport Number' },
    { value: 'Email', viewValue: 'Email' },
    { value: 'Phone', viewValue: 'Phone' },
    { value: 'Date', viewValue: 'Date' }
  ];

  constructor(
    private router: Router,
    private http: HttpClient,
    // private surveyService: SurveyService,

  ) { }

  ngOnInit() {
    this.initForm();

  }

  private initForm() {
    let FormName = '';
    let surveyQuestions = new FormArray([]);
    this.surveyForm = new FormGroup({
      'FormName': new FormControl(FormName, [Validators.required]),
      'surveyQuestions': surveyQuestions,
    });
    this.onAddQuestion();
  }

  onAddQuestion() {
    const surveyQuestionItem = new FormGroup({
      'questionTitle': new FormControl('', Validators.required),
      'questionType': new FormControl('', Validators.required),
      'IsRequired': new FormControl(false, [Validators.required]),
      'questionGroup': new FormGroup({})
    });
    (<FormArray>this.surveyForm.get('surveyQuestions')).push(surveyQuestionItem);
  }

  onRemoveQuestion(index) {
    this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionGroup = new FormGroup({});
    this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionType = new FormControl({});
    (<FormArray>this.surveyForm.get('surveyQuestions')).removeAt(index);
    this.selectedOption.splice(index, 1)
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

  private clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  addOption(index) {
    const optionGroup = new FormGroup({
      'optionText': new FormControl('', Validators.required),
    });
    (<FormArray>this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionGroup.controls.options).push(optionGroup);
  }
  removeOption(questionIndex, itemIndex) {
    (<FormArray>this.surveyForm.controls.surveyQuestions['controls'][questionIndex].controls.questionGroup.controls.options).removeAt(itemIndex);
  }


  postSurvey() {
    let formData = this.surveyForm.value;
    let FormID = 0;
    let FormName = formData.FormName;
    let IsRequired = formData.IsRequired;
    //  let Question: Question[] = [];
    let Questions = [];
    // let dateTime = new Date();
    // let FormDate = (dateTime.getFullYear() + "-" + (dateTime.getMonth() + 1) + "-" + dateTime.getDate());
    let surveyQuestions = formData.surveyQuestions;
    // let optionArray = formData.surveyQuestions[0].questionGroup.options[0].optionText
    var survey = new Survey(FormID, FormName, Questions);
    


    surveyQuestions.forEach((question, index, array) => {
      let questionItem = {
        'QuestionID': index,
        "QuestionType": question.questionType,
        "QuestionValue": question.questionTitle,
        "QuestionOptions": [],
        "QuestionIsRequired": question.IsRequired,
      }
      

      if (question.questionGroup.hasOwnProperty('options')) {

        question.questionGroup.options.forEach((option,index) => {
          let optionItem: Option = {
            "OptionID": index,
            "OptionValue": option.optionText,
          }
          questionItem.QuestionOptions.push(optionItem);
        });
      }
      survey.FormQuestions.push(questionItem);
    });

    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/Forms", {
        _FormValues:  survey,
      })
      .subscribe((Response) => {
        console.log("Confirmed");
      });
  }


  onSubmit() {

    this.postSurvey();
    // console.log(this.surveyForm.value);

  }

}