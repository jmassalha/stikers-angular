import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { Question, Survey } from './data-models';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, fromEvent } from 'rxjs';
import { Result } from '@zxing/library';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';
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
export class Table {
  constructor(
    public Row_ID: string,
    public TableText: string,
    public ColsType: string,
    public ColsSplitNumber: string,
    public TableStatus: string,
  ) { }
}

@Component({
  selector: 'app-fill-survey',
  templateUrl: './fill-survey.component.html',
  styleUrls: ['./fill-survey.component.css'],
})

export class FillSurveyComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = [];
  TABLE_DATA: Table[] = [];
  dataSource = new MatTableDataSource(this.TABLE_DATA);

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
  _formOpenText: string;
  isCaseNumber: string;
  withCaseNumber: boolean;
  _formDate: string;
  CaseNumber: string = '';
  _questionArr = [];
  _optionArr = [];
  _tableArr = [];
  surveyAnswersItem = [];
  maxDate = Date.now();
  canvasEl: HTMLCanvasElement;

  userTable: FormGroup;
  control: FormArray;
  mode: boolean;
  touchedRows: any;

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private readonly _dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router
  ) { }


  // Digital Signature Section
  @ViewChild('canvas') public canvas: ElementRef;

  // @Input() public width = 400;
  // @Input() public height = 150;

  private cx: CanvasRenderingContext2D;

  resetSign() {
    this.cx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
  }

  public ngAfterViewInit() {
    this.canvasEl = this.canvas.nativeElement;
    this.cx = this.canvasEl.getContext('2d');

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    this.captureEvents(this.canvasEl);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap((e) => {
          return fromEvent(canvasEl, 'mousemove')
            .pipe(
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
              pairwise()
            )
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };
        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };
        this.drawOnCanvas(prevPos, currentPos);
      });
    fromEvent(canvasEl, 'touchstart').pipe(switchMap(() => {
      return fromEvent(canvasEl, 'touchmove').pipe(
        takeUntil(fromEvent(canvasEl, 'touchend')),
        takeUntil(fromEvent(canvasEl, 'touchcancel')),
        pairwise()
      );
    })).subscribe((res: [TouchEvent, TouchEvent]) => {
      const rect = canvasEl.getBoundingClientRect();

      const prevPos = {
        x: res[0].touches[0].clientX - rect.left,
        y: res[0].touches[0].clientY - rect.top
      };
      res[0].preventDefault();
      res[0].stopImmediatePropagation();

      const currentPos = {
        x: res[1].touches[0].clientX - rect.left,
        y: res[1].touches[0].clientY - rect.top
      };
      res[1].preventDefault();
      res[1].stopImmediatePropagation();

      this.drawOnCanvas(prevPos, currentPos);
    });
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) { return; }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y);
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }

  //this comment is for the BarCode Scanner ** temporarly unavailable

  // clearResult(): void {
  //   this.qrResultString = null;
  // }

  // onCamerasFound(devices: MediaDeviceInfo[]): void {
  //   this.availableDevices = devices;
  //   this.hasDevices = Boolean(devices && devices.length);
  // }

  // onCodeResult(resultString: string) {
  //   this.qrResultString = resultString;
  //   console.log(resultString);
  //   this.caseNumberForm.controls['CaseNumber'].setValue(resultString);
  //   this.searchCaseNumber();
  // }

  // onDeviceSelectChange(selected: string) {
  //   const selectedStr = selected || '';
  //   if (this.deviceSelected === selectedStr) { return; }
  //   this.deviceSelected = selectedStr;
  //   const device = this.availableDevices.find(x => x.deviceId === selected);
  //   this.deviceCurrent = device || undefined;
  // }

  // onDeviceChange(device: MediaDeviceInfo) {
  //   const selectedStr = device?.deviceId || '';
  //   if (this.deviceSelected === selectedStr) { return; }
  //   this.deviceSelected = selectedStr;
  //   this.deviceCurrent = device || undefined;
  // }


  // onHasPermission(has: boolean) {
  //   this.hasPermission = has;
  // }

  // onTorchCompatible(isCompatible: boolean): void {
  //   this.torchAvailable$.next(isCompatible || false);
  // }

  // toggleTorch(): void {
  //   this.torchEnabled = !this.torchEnabled;
  // }

  // toggleTryHarder(): void {
  //   this.tryHarder = !this.tryHarder;
  // }

  ChekBoxQ: CheckBoxAnswers[];
  surveyAnswers: FormArray = this.formBuilder.array([]);
  // TablesColsRows: FormArray = this.formBuilder.array([]);
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
  surveyForm: FormGroup = this.formBuilder.group({
    Answers: this.surveyAnswers,
    Tables: this.surveyTables,
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
    let formData = this.surveyForm.getRawValue();
    let Answers = [];
    let nurseInCharge = localStorage.getItem("loginUserName").toLowerCase();
    let Signature = this.canvasEl.toDataURL();
    let surveyAnswers = formData.Answers;
    let Tables = [];
    let surveyTables = formData.Tables;
    let CaseNumber = this.caseNumberForm.controls['CaseNumber'].value;
    var survey = new Survey(FormID, CaseNumber, nurseInCharge, Signature, Answers, surveyTables, Tables);
    surveyAnswers.forEach((answer, index, array) => {
      this.ChekBoxQ.forEach(i => {
        if (i.QId == this._questionArr[index].QuestionID) {
          answer.answerContent = i.QAns.toString();
        }
      });
      if (this._questionArr[index].QuestionType != "TextArea") {
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
      }
    });

    if (Signature == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAEYklEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlACBB1YxAJfjJb2jAAAAAElFTkSuQmCC") {
      this.openSnackBar("נא לחתום על הטופס");
    } else {
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
        // ***** 0010739355
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
        this._formOpenText = this.filter_form_response.FormOpenText;
        this._formDate = this.filter_form_response.FormDate;
        this.isCaseNumber = this.filter_form_response.isCaseNumber;
        this.onlyColumns = this.formBuilder.array([]);
        this.TablesColsRows = this.formBuilder.array([]);
        this.surveyTables = this.formBuilder.array([]);
        var surveyTablesItem;
        var tableControl;
        var columnControlItem;

        if (this.isCaseNumber == '1' && this.mPersonalDetails.PersonID == null) {
          this.openSnackBar("!מספר מקרה לא תקין");
          this.withCaseNumber = true;
        } else {
          this.withCaseNumber = false;
          // initialize the tables
          this.filter_form_response.FormTable.forEach(element => {
            this._tableArr.push(element);
          });
          // takes the data of each table
          this.TABLE_DATA = [];
          for (var i = 0; i < this._tableArr.length; i++) {
            this.TablesColsRows = this.formBuilder.array([]);
            this.TABLE_DATA.push({
              Row_ID: this.filter_form_response.FormTable[i].Row_ID,
              TableText: this.filter_form_response.FormTable[i].TableText,
              ColsType: this.filter_form_response.FormTable[i].ColsType,
              ColsSplitNumber: this.filter_form_response.FormTable[i].ColsSplitNumber,
              TableStatus: this.filter_form_response.FormTable[i].TableStatus,
            });
            for (var r = 0; r < this._tableArr[i].rowsGroup.length; r++) {
              this.onlyColumns = this.formBuilder.array([]);
              for (var k = 0; k < this._tableArr[i].colsGroup.length; k++) {
                surveyTablesItem = this.formBuilder.group({
                  tableAnswerContent: ["", null],
                  ColumnsValue: [this._tableArr[i].colsGroup[k].colsText, null],
                  checkBoxV: [this._tableArr[i].colsGroup[k].checkBoxV, null],
                  ColType: [this._tableArr[i].colsGroup[k].ColType, null],
                  ColIDFK: [this._tableArr[i].colsGroup[k].Row_ID, null]
                });
                this.onlyColumns.push(surveyTablesItem);
              }
              columnControlItem = this.formBuilder.group({
                Columns: this.onlyColumns,
                RowValue: [this._tableArr[i].rowsGroup[r].rowsText, null],
                RowIDFK: [this._tableArr[i].rowsGroup[r].Row_ID, null]
              });
              this.TablesColsRows.push(columnControlItem);
            }
            this.updateView2();
            tableControl = this.formBuilder.group({
              ColumnRows: this.TablesColsRows,
              TableID: [this._tableArr[i].Row_ID, null],
            });
            this.surveyTables.push(tableControl);
          }
          this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
          this.dataSource.paginator = this.paginator;
          this.getQuestion(this.urlID, this.mPersonalDetails);
          this.getOption(this.urlID);
        }

        this.surveyForm = this.formBuilder.group({
          Tables: this.surveyTables
        });
      });

    this.ngAfterViewInit();
  }


  // getForm(urlID) {
  //   this.http
  //     .post("http://localhost:64964/WebService.asmx/GetForm", {
  //       formFormID: urlID,
  //     })
  //     .subscribe((Response) => {
  //       this.filter_form_response = Response["d"];
  //       this._formID = this.filter_form_response.FormID;
  //       this._formName = this.filter_form_response.FormName;
  //       this._formOpenText = this.filter_form_response.FormOpenText;
  //       this._formDate = this.filter_form_response.FormDate;
  //       this.isCaseNumber = this.filter_form_response.isCaseNumber;
  //       this.TablesColsRows = this.formBuilder.array([]);
  //       this.surveyTables = this.formBuilder.array([]);
  //       var surveyTablesItem;
  //       var tableControl;

  //       if (this.isCaseNumber == '1' && this.mPersonalDetails.PersonID == null) {
  //         this.openSnackBar("!מספר מקרה לא תקין");
  //         this.withCaseNumber = true;
  //       } else {
  //         this.withCaseNumber = false;
  //         // initialize the tables
  //         this.filter_form_response.FormTable.forEach(element => {
  //           this._tableArr.push(element);
  //         });
  //         // takes the data of each table
  //         this.TABLE_DATA = [];
  //         for (var i = 0; i < this._tableArr.length; i++) {
  //           this.TablesColsRows = this.formBuilder.array([]);;
  //           this.TABLE_DATA.push({
  //             Row_ID: this.filter_form_response.FormTable[i].Row_ID,
  //             TableText: this.filter_form_response.FormTable[i].TableText,
  //             ColsType: this.filter_form_response.FormTable[i].ColsType,
  //             ColsSplitNumber: this.filter_form_response.FormTable[i].ColsSplitNumber,
  //             TableStatus: this.filter_form_response.FormTable[i].TableStatus,
  //           });
  //           var inputsConter = 0;
  //           if(this._tableArr[i].rowsGroup[0].rowsText != ""){
  //             inputsConter = this._tableArr[i].rowsGroup.length * (this._tableArr[i].colsGroup.length  - 1)
  //           }else{
  //             inputsConter = this._tableArr[i].rowsGroup.length * (this._tableArr[i].colsGroup.length  )
  //           }
  //           for (var r = 0; r < inputsConter ; r++) {
  //             surveyTablesItem = this.formBuilder.group({
  //               tableAnswerContent: ["", Validators.required],
  //             });
  //             this.TablesColsRows.push(surveyTablesItem);
  //           }
  //           this._tableArr[i].colsGroup.forEach(element => {

  //           })
  //           this.updateView2();
  //           tableControl = this.formBuilder.group({
  //             ColumnRows: this.TablesColsRows,
  //             TableID: ['', null],
  //           });
  //           this.surveyTables.push(tableControl);

  //         }
  //         this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
  //         this.dataSource.paginator = this.paginator;
  //         this.getQuestion(this.urlID, this.mPersonalDetails);
  //         this.getOption(this.urlID);
  //       }

  //       this.surveyForm = this.formBuilder.group({
  //         Tables: this.surveyTables
  //       });
  //     });

  //   this.ngAfterViewInit();
  // }

  getQuestion(urlID, personalDetails) {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetQuestion", {
        questionsFormID: urlID,
        isCaseNumber: this.isCaseNumber
      })
      .subscribe((Response) => {
        this.filter_question_response = Response["d"];
        this.surveyAnswers = this.formBuilder.array([]);

        var that = this;

        this.ChekBoxQ = new Array<CheckBoxAnswers>();
        this.filter_question_response.forEach(element => {
          // if(element.QuestionValue != "חתימה"){
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
                  answerContent: [personalDetails.Email, Validators.compose([Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])],
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

          // }
        });

        this.updateView();
        this.surveyForm = this.formBuilder.group({
          Answers: this.surveyAnswers,
          Tables: this.surveyTables
        });
      });
  }


  updateView() {
    this.answersData.next(this.surveyAnswers.controls);
  }
  updateView2() {
    this.answersData.next(this.surveyTables.controls);
    this.answersData.next(this.TablesColsRows.controls);
    this.answersData.next(this.onlyColumns.controls);
  }


  getOption(urlID) {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetOption", {
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
    // var link = document.createElement('a');
    // link.download = 'download.png';
    // link.href = this.canvasEl.toDataURL();
    // link.click();
  }

}