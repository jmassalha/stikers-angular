import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { Survey } from './data-models';
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
export interface QuestionType {
  value: string;
  viewValue: string;
}
export interface ColumnType {
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
  _formTableArr = [];
  departmentControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;


  questions: QuestionType[] = [
    { value: 'RadioButton', viewValue: 'בחירה יחידה' },
    { value: 'CheckBox', viewValue: 'בחירה מרובה' },
    { value: 'Text', viewValue: 'טקסט' },
    { value: 'TextArea', viewValue: 'פסקה קבועה' },
    { value: 'ID', viewValue: 'תעודת זהות' },
    { value: 'Email', viewValue: 'אימייל' },
    { value: 'Phone', viewValue: 'מספר טלפון' },
    { value: 'Date', viewValue: 'תאריך' },
    { value: 'Time', viewValue: 'זמן' },
    { value: 'Signature', viewValue: 'חתימה' },
  ];
  columnType: ColumnType[] = [
    { value: 'CheckBox', viewValue: 'סימון V' },
    { value: 'Text', viewValue: 'טקסט' },
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
    private formBuilder: FormBuilder,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private confirmationDialogService: ConfirmationDialogService,
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
  tableIndex: string;


  ngOnInit() {
    this.initForm();
    this.getFormData(this.urlID);
    this.filteredOptions = this.departmentControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  displayFn(user: any): string {
    return user && user.Depart_Name ? user.Depart_Name : '';
  }

  private _filter(value: any): string[] {
    var filterValue = "";
    if (typeof value === "string") {
      filterValue = value.toLowerCase();
    } else {
      filterValue = value.Depart_Name.toLowerCase();
    }
    return this.department.filter(option => option.Depart_Name.toLowerCase().includes(filterValue));
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
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
      'priority': new FormControl('', [Validators.required]),
      'questionStatus': new FormControl('1', [Validators.required]),
      'questionGroup': new FormGroup({})
    });
    (<FormArray>this.surveyForm.get('surveyQuestions')).push(surveyQuestionItem);
  }

  onAddTable() {
    const tableColItem = new FormGroup({
      'Row_ID': new FormControl('0', null),
      'TableText': new FormControl('', null),
      'SubTitle': new FormControl('', null),
      'TablePriority': new FormControl('', null),
      'ColsType': new FormControl('Text', null),
      'TableStatus': new FormControl('1', null),
      'ColsSplitNumber': new FormControl('', null),
      'colsGroup': new FormGroup({}),
      'rowsGroup': new FormGroup({})
    });
    (<FormArray>this.tableFormGroup.get('tableArray')).push(tableColItem);
    let loopCounter = this.tableFormGroup.controls.tableArray.value.length;
    for (let i = loopCounter - 1; i < loopCounter; i++) {
      this.addColumnsControls(i);
      this.addRowsControls(i);
    }
  }
  // for updating the form
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
      'priority': new FormControl(element.priority, [Validators.required]),
      'IsRequired': new FormControl(element.QuestionIsRequired, [Validators.required]),
      'questionStatus': new FormControl(element.QuestionStatus, [Validators.required]),
      'questionGroup': new FormGroup({})
    });

    (<FormArray>this.surveyForm.get('surveyQuestions')).push(surveyQuestionItem);

    if (element.QuestionType === 'RadioButton' || element.QuestionType === 'CheckBox') {
      this.addOptionControls2(element.QuestionOptions, counter);
    }
  }
  // for updating the form
  onAddTable2(element, counter2) {
    const surveyTableItem = new FormGroup({
      'Row_ID': new FormControl(element.Row_ID, null),
      'TableText': new FormControl(element.TableText, null),
      'SubTitle': new FormControl(element.SubTitle, null),
      'TablePriority': new FormControl(element.TablePriority, null),
      'ColsType': new FormControl(element.ColsType, null),
      'TableStatus': new FormControl(element.TableStatus, null),
      'ColsSplitNumber': new FormControl(element.ColsSplitNumber, null),
      'colsGroup': new FormGroup({}),
      'rowsGroup': new FormGroup({})
    });
    (<FormArray>this.tableFormGroup.get('tableArray')).push(surveyTableItem);
    this.addColumnsControls2(element.ColumnsRowsGroup, counter2);
    this.addRowsControls2(element.ColumnsRowsGroup, counter2);
  }

  onRemoveQuestion(index) {
    this.surveyForm.controls.surveyQuestions['controls'][index].setValidators(null);
    this.surveyForm.controls.surveyQuestions['controls'][index].updateValueAndValidity();
    this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionStatus.setValidators(null);
    this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionTitle.setValidators(null);
    this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionType.setValidators(null);
    this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionID.setValidators(null);
    this.surveyForm.controls.surveyQuestions['controls'][index].controls.priority.setValidators(null);
    this.surveyForm.controls.surveyQuestions['controls'][index].controls.IsRequired.setValidators(null);
    this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionTitle.updateValueAndValidity();
    this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionType.updateValueAndValidity();
    this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionID.updateValueAndValidity();
    this.surveyForm.controls.surveyQuestions['controls'][index].controls.priority.updateValueAndValidity();
    this.surveyForm.controls.surveyQuestions['controls'][index].controls.IsRequired.updateValueAndValidity();
    this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionStatus.updateValueAndValidity();
    this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionStatus.patchValue("0");
  }

  onRemoveTable(index) {
    this.confirmationDialogService
      .confirm("נא לאשר..", "האם אתה בטוח ...? ")
      .then((confirmed) => {
        console.log("User confirmed:", confirmed);
        if (confirmed) {
          this.tableFormGroup.controls.tableArray['controls'][index].controls.TableStatus.patchValue("0");
          this.tableFormGroup.controls.tableArray['controls'][index].controls.colsGroup.setValidators(null);
          this.tableFormGroup.controls.tableArray['controls'][index].controls.rowsGroup.setValidators(null);
          this.tableFormGroup.controls.tableArray['controls'][index].controls.colsGroup.updateValueAndValidity();
          this.tableFormGroup.controls.tableArray['controls'][index].controls.rowsGroup.updateValueAndValidity();
        } else {
        }
      })
      .catch(() =>
        console.log(
          "User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)"
        )
      );

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
  // for updating the form
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
    let column = new FormArray([]);
    (this.tableFormGroup.controls.tableArray['controls'][index].controls.colsGroup).addControl('column', column);
    this.clearFormArray((<FormArray>this.tableFormGroup.controls.tableArray['controls'][index].controls.colsGroup.controls.column));
    this.addCols(index);
  }
  // for updating the form
  addColumnsControls2(ColumnsRowsGroup, index) {
    let column = new FormArray([]);
    (this.tableFormGroup.controls.tableArray['controls'][index].controls.colsGroup).addControl('column', column);
    this.clearFormArray((<FormArray>this.tableFormGroup.controls.tableArray['controls'][index].controls.colsGroup.controls.column));
    let _size = Object.keys(ColumnsRowsGroup).length;
    for (let i = 0; i < _size; i++) {
      if (ColumnsRowsGroup[i].ColStatus !== "") {
        this.addCols2(index, ColumnsRowsGroup[i]);
      }
    }
  }
  // for updating the form
  addRowsControls2(ColumnsRowsGroup, index) {
    let row = new FormArray([]);
    (this.tableFormGroup.controls.tableArray['controls'][index].controls.rowsGroup).addControl('row', row);
    this.clearFormArray((<FormArray>this.tableFormGroup.controls.tableArray['controls'][index].controls.rowsGroup.controls.row));
    let _size = Object.keys(ColumnsRowsGroup).length;
    for (let i = 0; i < _size; i++) {
      if (ColumnsRowsGroup[i].RowStatus !== "") {
        this.addRows2(index, ColumnsRowsGroup[i]);
      }
    }
  }

  addCols(index) {
    const colsNewGroup = new FormGroup({
      'Row_ID': new FormControl('0', null),
      'colsText': new FormControl('', null),
      'ColType': new FormControl('', null),
      'colStatus': new FormControl('1', null),
    });
    (<FormArray>this.tableFormGroup.controls.tableArray['controls'][index].controls.colsGroup.controls.column).push(colsNewGroup);
  }
  // for updating the form
  addCols2(index, element) {
    const colsNewGroup = new FormGroup({
      'Row_ID': new FormControl(element.Row_ID, null),
      'colsText': new FormControl(element.ColText, null),
      'ColType': new FormControl(element.ColType, null),
      'colStatus': new FormControl(element.ColStatus, null),
    });
    (<FormArray>this.tableFormGroup.controls.tableArray['controls'][index].controls.colsGroup.controls.column).push(colsNewGroup);
  }

  addRowsControls(index) {
    let row = new FormArray([]);
    (this.tableFormGroup.controls.tableArray['controls'][index].controls.rowsGroup).addControl('row', row);
    this.clearFormArray((<FormArray>this.tableFormGroup.controls.tableArray['controls'][index].controls.rowsGroup.controls.row));
    this.addRows(index);
  }

  addRows(index) {
    const rowsNewGroup = new FormGroup({
      'Row_ID': new FormControl('0', null),
      'rowsText': new FormControl('', null),
      'rowStatus': new FormControl('1', null),
    });
    (<FormArray>this.tableFormGroup.controls.tableArray['controls'][index].controls.rowsGroup.controls.row).push(rowsNewGroup);
  }
  // for updating the form
  addRows2(index, element) {
    const rowsNewGroup = new FormGroup({
      'Row_ID': new FormControl(element.Row_ID, null),
      'rowsText': new FormControl(element.RowText, null),
      'rowStatus': new FormControl(element.RowStatus, null),
    });
    (<FormArray>this.tableFormGroup.controls.tableArray['controls'][index].controls.rowsGroup.controls.row).push(rowsNewGroup);
  }

  removeOption(element, questionIndex, itemIndex) {
    <FormArray>this.surveyForm.controls.surveyQuestions['controls'][questionIndex].controls.questionGroup.controls.options.controls[itemIndex].controls.optionStatus.patchValue("0");
  }

  removeColumn(TableIndex, columnIndex) {
    this.tableFormGroup.controls.tableArray['controls'][TableIndex].setValidators(null);
    this.tableFormGroup.controls.tableArray['controls'][TableIndex].updateValueAndValidity();
    this.tableFormGroup.controls.tableArray['controls'][TableIndex].controls.colsGroup.controls.column.controls[columnIndex].controls.Row_ID.setValidators(null);
    this.tableFormGroup.controls.tableArray['controls'][TableIndex].controls.colsGroup.controls.column.controls[columnIndex].controls.Row_ID.updateValueAndValidity();
    this.tableFormGroup.controls.tableArray['controls'][TableIndex].controls.colsGroup.controls.column.controls[columnIndex].controls.colsText.setValidators(null);
    this.tableFormGroup.controls.tableArray['controls'][TableIndex].controls.colsGroup.controls.column.controls[columnIndex].controls.colsText.updateValueAndValidity();
    this.tableFormGroup.controls.tableArray['controls'][TableIndex].controls.colsGroup.controls.column.controls[columnIndex].controls.ColType.setValidators(null);
    this.tableFormGroup.controls.tableArray['controls'][TableIndex].controls.colsGroup.controls.column.controls[columnIndex].controls.ColType.updateValueAndValidity();
    this.tableFormGroup.controls.tableArray['controls'][TableIndex].controls.colsGroup.controls.column.controls[columnIndex].controls.colStatus.setValidators(null);
    this.tableFormGroup.controls.tableArray['controls'][TableIndex].controls.colsGroup.controls.column.controls[columnIndex].controls.colStatus.updateValueAndValidity();
    <FormArray>this.tableFormGroup.controls.tableArray['controls'][TableIndex].controls.colsGroup.controls.column.controls[columnIndex].controls.colStatus.patchValue("0");
  }

  removeRow(TableIndex, rowIndex) {
    <FormArray>this.tableFormGroup.controls.tableArray['controls'][TableIndex].controls.rowsGroup.controls.row.controls[rowIndex].controls.rowStatus.patchValue("0");
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
    let formTable = this.tableFormGroup.value;
    let FormID = this.FormID;
    let FormName = formData.FormName;
    let FormOpenText = formData.FormOpenText;
    let TableForm = formData.TableForm;
    let isCaseNumber = formData.isCaseNumber;
    let GeneralForm = formData.GeneralForm;
    let FormDepartment = this.departmentControl.value.Depart_Name;
    let FormDepartmentID = this.departmentControl.value.Row_ID;
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
    let Tables = [];
    let surveyQuestions = formData.surveyQuestions;
    let tableArray = formTable.tableArray;
    let FormCreatorName = localStorage.getItem("loginUserName").toLowerCase();
    let UserDepart = localStorage.getItem("Depart").toLowerCase();
    var survey = new Survey(FormID, FormName, FormOpenText, TableForm, FormDepartment, isCaseNumber, UserDepart, GeneralForm, FormDepartmentID, FormCreatorName, Questions, Tables);


    tableArray.forEach(table => {
      let tableItem = {
        'Row_ID': table.Row_ID,
        'TableText': table.TableText,
        'SubTitle': table.SubTitle,
        'TablePriority': table.TablePriority,
        'ColsType': table.ColsType,
        'TableStatus': table.TableStatus,
        'ColsSplitNumber': table.ColsSplitNumber,
        'colsGroup': [],
        'rowsGroup': [],
      }
      if (table.colsGroup.hasOwnProperty('column')) {

        table.colsGroup.column.forEach(column => {
          let colItem = {
            "Row_ID": column.Row_ID,
            "colsText": column.colsText,
            "ColType": column.ColType,
            "colStatus": column.colStatus,
          }
          if (colItem.colStatus === '0' && colItem.Row_ID === '0') {
            console.log("column deleted!")
          } else {
            tableItem.colsGroup.push(colItem);
          }
        });
      }
      if (table.rowsGroup.hasOwnProperty('row')) {

        table.rowsGroup.row.forEach(row => {
          let rowItem = {
            "Row_ID": row.Row_ID,
            "rowsText": row.rowsText,
            "rowStatus": row.rowStatus,
          }
          if (rowItem.rowStatus === '0' && rowItem.Row_ID === '0') {
            console.log("row deleted!")
          } else {
            tableItem.rowsGroup.push(rowItem);
          }
        });
      }
      survey.FormTable.push(tableItem);
    });


    surveyQuestions.forEach((question, index, array) => {
      let questionItem = {
        'QuestionID': question.questionID,
        "QuestionType": question.questionType,
        "QuestionValue": question.questionTitle,
        "priority": question.priority,
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
        let department = {
          Depart_Name: this.filter_form_response.FormDepartment,
          Row_ID: this.filter_form_response.FormDepartmentID
        }

        // this.FormDepartment = this.filter_form_response.FormDepartment;
        // this.FormDepartmentID = this.filter_form_response.FormDepartmentID;
        this.departmentControl.setValue(department);
        this.surveyForm.controls['FormID'].patchValue(this.FormID);
        this.surveyForm.controls['FormName'].patchValue(this.FormName);
        this.surveyForm.controls['FormOpenText'].patchValue(this.FormOpenText);
        this.surveyForm.controls['TableForm'].patchValue(this.TableForm);
        this.surveyForm.controls['isCaseNumber'].patchValue(this.isCaseNumber);
        this.surveyForm.controls['GeneralForm'].patchValue(this.GeneralForm);
        this.surveyForm.controls['FormDepartment'].patchValue(this.FormDepartment);
        this.surveyForm.controls['FormDepartmentID'].patchValue(this.FormDepartmentID);
        this._questionArr = this.filter_form_response.FormQuestions;
        this._formTableArr = this.filter_form_response.FormTable;
        let counter = 0;
        let counter2 = 0;

        if (this._questionArr != null) {
          this._questionArr.forEach(element => {
            if (element.PinQuestion == "0") {
              this.QuestionID = element.QuestionID;
              this.onAddQuestion2(counter, element);
              counter = counter + 1;
            }

          });
        }
        if (this._formTableArr != null) {
          this._formTableArr.forEach(element => {
            this.onAddTable2(element, counter2);
            counter2 = counter2 + 1;
          });
        }

      });

    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetFormsDeparts", {

      })
      .subscribe((Response) => {
        this.department = Response["d"];

        // this.all_departs_filter.forEach(element => {
        //   this.department.push(element);
        // })
      });

  }

  onSubmit() {
    this.postSurvey();
  }

  onClose() {
    this.dialog.closeAll();
  }

}
