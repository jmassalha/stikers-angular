import {
    Component,
    OnInit,
    ViewChild,
    ChangeDetectorRef,
    ElementRef,
    Input,
    AfterViewInit,
    Inject,
} from "@angular/core";
import {
    FormGroup,
    FormControl,
    FormArray,
    Validators,
    FormBuilder,
    AbstractControl,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Question, Survey } from "./data-models";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, fromEvent, Subscription } from "rxjs";
import { Result } from "@zxing/library";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
// import { ZXingScannerComponent } from '@zxing/ngx-scanner';
// import { BarcodeFormat } from '@zxing/library';
import { switchMap, takeUntil, pairwise } from "rxjs/operators";
import { DomSanitizer } from "@angular/platform-browser";
import { DatePipe } from "@angular/common";
import { ConfirmationDialogService } from "../confirmation-dialog/confirmation-dialog.service";
import { environment } from "src/environments/environment";

export class PersonalDetails {
    FirstName: string;
    FatherName: string;
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
        public SubTitle: string,
        public ColsType: string,
        public ColsSplitNumber: string,
        public TableStatus: string
    ) { }
}
@Component({
    selector: "signature-dialog",
    templateUrl: "signature-dialog.html",
})
export class DialogContentExampleDialog {
    // digital sign source : https://gist.github.com/anupkrbid/6447d97df6be6761d394f18895bc680d
    canvasEl: HTMLCanvasElement;
    @Input() width = 512;
    @Input() height = 418;
    @ViewChild("canvasinside") canvasinside: ElementRef;
    cx: CanvasRenderingContext2D;
    drawingSubscription: Subscription;
    constructor(
        public dialog: MatDialogRef<DialogContentExampleDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngAfterViewInit() {
        this.canvasEl = this.canvasinside.nativeElement;
        this.cx = this.canvasEl.getContext("2d");

        this.canvasEl.width = this.width;
        this.canvasEl.height = this.height;

        this.cx.lineWidth = 3;
        this.cx.lineCap = "round";
        this.cx.strokeStyle = "#000";
        this.captureEvents(this.canvasEl);
    }

    captureEvents(canvasEl: HTMLCanvasElement) {
        this.drawingSubscription = fromEvent(canvasEl, "mousedown")
            .pipe(
                switchMap((e) => {
                    return fromEvent(canvasEl, "mousemove").pipe(
                        takeUntil(fromEvent(canvasEl, "mouseup")),
                        takeUntil(fromEvent(canvasEl, "mouseleave")),

                        pairwise()
                    );
                })
            )
            .subscribe((res: [MouseEvent, MouseEvent]) => {
                const rect = canvasEl.getBoundingClientRect();

                const prevPos = {
                    x: res[0].clientX - rect.left,
                    y: res[0].clientY - rect.top,
                };

                const currentPos = {
                    x: res[1].clientX - rect.left,
                    y: res[1].clientY - rect.top,
                };

                this.drawOnCanvas(prevPos, currentPos);
            });
        fromEvent(canvasEl, "touchstart")
            .pipe(
                switchMap(() => {
                    return fromEvent(canvasEl, "touchmove").pipe(
                        takeUntil(fromEvent(canvasEl, "touchend")),
                        takeUntil(fromEvent(canvasEl, "touchcancel")),
                        pairwise()
                    );
                })
            )
            .subscribe((res: [TouchEvent, TouchEvent]) => {
                const rect = canvasEl.getBoundingClientRect();

                const prevPos = {
                    x: res[0].touches[0].clientX - rect.left,
                    y: res[0].touches[0].clientY - rect.top,
                };
                res[0].preventDefault();
                res[0].stopImmediatePropagation();

                const currentPos = {
                    x: res[1].touches[0].clientX - rect.left,
                    y: res[1].touches[0].clientY - rect.top,
                };
                res[1].preventDefault();
                res[1].stopImmediatePropagation();

                this.drawOnCanvas(prevPos, currentPos);
            });
    }

    drawOnCanvas(
        prevPos: { x: number; y: number },
        currentPos: { x: number; y: number }
    ) {
        if (!this.cx) {
            return;
        }

        this.cx.beginPath();

        if (prevPos) {
            this.cx.moveTo(prevPos.x, prevPos.y);
            this.cx.lineTo(currentPos.x, currentPos.y);

            this.cx.stroke();
        }
    }

    ngOnDestroy() {
        this.data.sign = this.canvasEl.toDataURL();
        this.drawingSubscription.unsubscribe();
        this.dialog.close(this.data);
    }

    sendToForm() {
        this.data.sign = this.canvasEl.toDataURL();
        this.dialog.close(this.data);
        // console.log(this.canvasEl);
    }
}
@Component({
    selector: "app-fill-survey",
    templateUrl: "./fill-survey.component.html",
    styleUrls: ["./fill-survey.component.css"],
})
export class FillSurveyComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    displayedColumns: string[] = [];
    TABLE_DATA: Table[] = [];
    dataSource = new MatTableDataSource(this.TABLE_DATA);

    availableDevices: MediaDeviceInfo[];
    deviceCurrent: MediaDeviceInfo;
    deviceSelected: string;

    // formatsEnabled: BarcodeFormat[] = [
    //   BarcodeFormat.CODE_128,
    //   BarcodeFormat.DATA_MATRIX,
    //   BarcodeFormat.EAN_13,
    //   BarcodeFormat.QR_CODE,
    // ];

    hasDevices: boolean;
    hasPermission: boolean;

    qrResultString: string;

    torchEnabled = false;
    torchAvailable$ = new BehaviorSubject<boolean>(false);
    tryHarder = false;

    horizontalPosition: MatSnackBarHorizontalPosition = "start";
    verticalPosition: MatSnackBarVerticalPosition = "bottom";
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
    _tableForm: string;
    CaseNumber: string = "";
    Passport: string = "";
    _questionArr = [];
    _optionArr = [];
    _checkBoxesOptionArr = [];
    _tableArr = [];
    maxDate = Date.now();
    canvasEl: HTMLCanvasElement;
    canvasT: HTMLCanvasElement;
    sign: any;
    date: string;
    time: string;

    userTable: FormGroup;
    control: FormArray;
    mode: boolean;
    touchedRows: any;

    constructor(
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private http: HttpClient,
        private formBuilder: FormBuilder,
        private confirmationDialogService: ConfirmationDialogService,
        private datePipe: DatePipe,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _sanitizer: DomSanitizer
    ) { }

    // Digital Signature Section

    // @ViewChild('canvas') public canvas: ElementRef;

    // @Input() public width = 400;
    // @Input() public height = 150;

    // private cx: CanvasRenderingContext2D;

    // resetSign() {
    //   this.cx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    // }

    // public ngAfterViewInit() {
    //   this.canvasEl = this.canvas.nativeElement;
    //   this.cx = this.canvasEl.getContext('2d');

    //   this.cx.lineWidth = 3;
    //   this.cx.lineCap = 'round';
    //   this.cx.strokeStyle = '#000';

    //   this.captureEvents(this.canvasEl);
    // }

    // private captureEvents(canvasEl: HTMLCanvasElement) {
    //   fromEvent(canvasEl, 'mousedown')
    //     .pipe(
    //       switchMap((e) => {
    //         return fromEvent(canvasEl, 'mousemove')
    //           .pipe(
    //             takeUntil(fromEvent(canvasEl, 'mouseup')),
    //             takeUntil(fromEvent(canvasEl, 'mouseleave')),
    //             pairwise()
    //           )
    //       })
    //     )
    //     .subscribe((res: [MouseEvent, MouseEvent]) => {
    //       const rect = canvasEl.getBoundingClientRect();
    //       const prevPos = {
    //         x: res[0].clientX - rect.left,
    //         y: res[0].clientY - rect.top
    //       };
    //       const currentPos = {
    //         x: res[1].clientX - rect.left,
    //         y: res[1].clientY - rect.top
    //       };
    //       this.drawOnCanvas(prevPos, currentPos);
    //     });
    //   fromEvent(canvasEl, 'touchstart').pipe(switchMap(() => {
    //     return fromEvent(canvasEl, 'touchmove').pipe(
    //       takeUntil(fromEvent(canvasEl, 'touchend')),
    //       takeUntil(fromEvent(canvasEl, 'touchcancel')),
    //       pairwise()
    //     );
    //   })).subscribe((res: [TouchEvent, TouchEvent]) => {
    //     const rect = canvasEl.getBoundingClientRect();

    //     const prevPos = {
    //       x: res[0].touches[0].clientX - rect.left,
    //       y: res[0].touches[0].clientY - rect.top
    //     };
    //     res[0].preventDefault();
    //     res[0].stopImmediatePropagation();

    //     const currentPos = {
    //       x: res[1].touches[0].clientX - rect.left,
    //       y: res[1].touches[0].clientY - rect.top
    //     };
    //     res[1].preventDefault();
    //     res[1].stopImmediatePropagation();

    //     this.drawOnCanvas(prevPos, currentPos);
    //   });
    // }

    // private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    //   if (!this.cx) { return; }

    //   this.cx.beginPath();

    //   if (prevPos) {
    //     this.cx.moveTo(prevPos.x, prevPos.y);
    //     this.cx.lineTo(currentPos.x, currentPos.y);
    //     this.cx.stroke();
    //   }
    // }

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
    signatureArr: any[];
    signaturesArray: FormArray = this.formBuilder.array([]);
    // surveyAnswers: FormArray = this.formBuilder.array([]);
    checkBoxArray: FormArray = this.formBuilder.array([]);
    // TablesColsRows: FormArray = this.formBuilder.array([]);
    onlyColumns: FormArray = this.formBuilder.array([]);
    TablesColsRows: FormArray = this.formBuilder.array([
        {
            Columns: this.onlyColumns,
            RowValue: ["", null],
            RowIDFK: ["", null],
        },
    ]);
    surveyTables: FormArray = this.formBuilder.array([
        {
            ColumnRows: this.TablesColsRows,
            TableID: new FormControl("", null),
        },
    ]);
    surveyAnswers: FormArray = this.formBuilder.array([
        {
            CheckBoxes: this.checkBoxArray,
        },
    ]);
    surveyForm: FormGroup = this.formBuilder.group({
        Answers: this.surveyAnswers,
        Tables: this.surveyTables,
    });

    caseNumberForm = new FormGroup({
        CaseNumber: new FormControl("", null),
        Passport: new FormControl("", null),
    });

    urlID: number;
    ifContinueForm: number;
    NurseID: number;

    ngOnInit() {
        if (this.activatedRoute.snapshot.params.id != undefined) {
            this.urlID = this.activatedRoute.snapshot.params.id;
            this.ifContinueForm = 0;
        }
        this.urlID;
        this.ifContinueForm;
        this.searchCaseNumber();
        let now = new Date();
        this.date = this.datePipe.transform(now, "yyyy-MM-dd");
        this.time = this.datePipe.transform(now, "HH:mm:ss");
        this.signatureArr = [];
        this.sign =
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAGiCAYAAACRRH6CAAARv0lEQVR4Xu3WQQEAAAgCMelf2iA3GzB8sHMECBAgQIBATmC5xAITIECAAAECZwB4AgIECBAgEBQwAIKli0yAAAECBAwAP0CAAAECBIICBkCwdJEJECBAgIAB4AcIECBAgEBQwAAIli4yAQIECBAwAPwAAQIECBAIChgAwdJFJkCAAAECBoAfIECAAAECQQEDIFi6yAQIECBAwADwAwQIECBAIChgAARLF5kAAQIECBgAfoAAAQIECAQFDIBg6SITIECAAAEDwA8QIECAAIGggAEQLF1kAgQIECBgAPgBAgQIECAQFDAAgqWLTIAAAQIEDAA/QIAAAQIEggIGQLB0kQkQIECAgAHgBwgQIECAQFDAAAiWLjIBAgQIEDAA/AABAgQIEAgKGADB0kUmQIAAAQIGgB8gQIAAAQJBAQMgWLrIBAgQIEDAAPADBAgQIEAgKGAABEsXmQABAgQIGAB+gAABAgQIBAUMgGDpIhMgQIAAAQPADxAgQIAAgaCAARAsXWQCBAgQIGAA+AECBAgQIBAUMACCpYtMgAABAgQMAD9AgAABAgSCAgZAsHSRCRAgQICAAeAHCBAgQIBAUMAACJYuMgECBAgQMAD8AAECBAgQCAoYAMHSRSZAgAABAgaAHyBAgAABAkEBAyBYusgECBAgQMAA8AMECBAgQCAoYAAESxeZAAECBAgYAH6AAAECBAgEBQyAYOkiEyBAgAABA8APECBAgACBoIABECxdZAIECBAgYAD4AQIECBAgEBQwAIKli0yAAAECBAwAP0CAAAECBIICBkCwdJEJECBAgIAB4AcIECBAgEBQwAAIli4yAQIECBAwAPwAAQIECBAIChgAwdJFJkCAAAECBoAfIECAAAECQQEDIFi6yAQIECBAwADwAwQIECBAIChgAARLF5kAAQIECBgAfoAAAQIECAQFDIBg6SITIECAAAEDwA8QIECAAIGggAEQLF1kAgQIECBgAPgBAgQIECAQFDAAgqWLTIAAAQIEDAA/QIAAAQIEggIGQLB0kQkQIECAgAHgBwgQIECAQFDAAAiWLjIBAgQIEDAA/AABAgQIEAgKGADB0kUmQIAAAQIGgB8gQIAAAQJBAQMgWLrIBAgQIEDAAPADBAgQIEAgKGAABEsXmQABAgQIGAB+gAABAgQIBAUMgGDpIhMgQIAAAQPADxAgQIAAgaCAARAsXWQCBAgQIGAA+AECBAgQIBAUMACCpYtMgAABAgQMAD9AgAABAgSCAgZAsHSRCRAgQICAAeAHCBAgQIBAUMAACJYuMgECBAgQMAD8AAECBAgQCAoYAMHSRSZAgAABAgaAHyBAgAABAkEBAyBYusgECBAgQMAA8AMECBAgQCAoYAAESxeZAAECBAgYAH6AAAECBAgEBQyAYOkiEyBAgAABA8APECBAgACBoIABECxdZAIECBAgYAD4AQIECBAgEBQwAIKli0yAAAECBAwAP0CAAAECBIICBkCwdJEJECBAgIAB4AcIECBAgEBQwAAIli4yAQIECBAwAPwAAQIECBAIChgAwdJFJkCAAAECBoAfIECAAAECQQEDIFi6yAQIECBAwADwAwQIECBAIChgAARLF5kAAQIECBgAfoAAAQIECAQFDIBg6SITIECAAAEDwA8QIECAAIGggAEQLF1kAgQIECBgAPgBAgQIECAQFDAAgqWLTIAAAQIEDAA/QIAAAQIEggIGQLB0kQkQIECAgAHgBwgQIECAQFDAAAiWLjIBAgQIEDAA/AABAgQIEAgKGADB0kUmQIAAAQIGgB8gQIAAAQJBAQMgWLrIBAgQIEDAAPADBAgQIEAgKGAABEsXmQABAgQIGAB+gAABAgQIBAUMgGDpIhMgQIAAAQPADxAgQIAAgaCAARAsXWQCBAgQIGAA+AECBAgQIBAUMACCpYtMgAABAgQMAD9AgAABAgSCAgZAsHSRCRAgQICAAeAHCBAgQIBAUMAACJYuMgECBAgQMAD8AAECBAgQCAoYAMHSRSZAgAABAgaAHyBAgAABAkEBAyBYusgECBAgQMAA8AMECBAgQCAoYAAESxeZAAECBAgYAH6AAAECBAgEBQyAYOkiEyBAgAABA8APECBAgACBoIABECxdZAIECBAgYAD4AQIECBAgEBQwAIKli0yAAAECBAwAP0CAAAECBIICBkCwdJEJECBAgIAB4AcIECBAgEBQwAAIli4yAQIECBAwAPwAAQIECBAIChgAwdJFJkCAAAECBoAfIECAAAECQQEDIFi6yAQIECBAwADwAwQIECBAIChgAARLF5kAAQIECBgAfoAAAQIECAQFDIBg6SITIECAAAEDwA8QIECAAIGg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";
    }

    myModel(e: any, id: string, questionIndex: number) {
        //return;\

        if (e.checked) {
            var result = this.ChekBoxQ.find((obj) => {
                return obj.QId === questionIndex;
            });
            result.QAns = result.QAns.filter((obj) => obj !== id);

            this.ChekBoxQ = this.ChekBoxQ.filter(
                (obj) => obj.QId != questionIndex
            );
            result.QAns.push(id);
            this.ChekBoxQ.push(result);
        } else {
            var result = this.ChekBoxQ.find((obj) => {
                return obj.QId === questionIndex;
            });

            if (result.QAns[0]) {
                result.QAns = result.QAns[0].split(",");
                result.QAns = result.QAns.filter((obj) => obj !== id);
            }
            //this.ChekBoxQ = this.ChekBoxQ.filter(obj => obj.QId != questionIndex);
            //this.ChekBoxQ.push(result);
        }
    }

    openSnackBar(message) {
        this._snackBar.open(message, "X", {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

    openSignatureDialog(questID) {
        const dialogRef = this.dialog
            .open(DialogContentExampleDialog, {
                data: { sign: "", FormID: this.urlID, QuestionID: questID },
            })
            .afterClosed()
            .subscribe((data) => {
                //to show the sign in the template
                this.sign = this._sanitizer.bypassSecurityTrustResourceUrl(
                    data.sign
                );
                this.signatureArr.push(data);
            });
    }

    fillForm(continueForm) {
        this.surveyForm;
        let FormID = this._formID;
        let formData = this.surveyForm.getRawValue();
        let NurseInChargeID = String(this.NurseID);
        let Answers = [];
        let nurseInCharge = localStorage.getItem("loginUserName").toLowerCase();
        // let Signature = this.canvasEl.toDataURL();
        let surveyAnswers = formData.Answers;
        let Tables = [];
        let surveyTables = formData.Tables;
        let CaseNumber = this.caseNumberForm.controls["CaseNumber"].value;
        var survey = new Survey(
            FormID,
            CaseNumber,
            nurseInCharge,
            NurseInChargeID,
            Answers,
            surveyTables,
            Tables
        );
        var c = 0;
        var d = 0;
        surveyAnswers.forEach((answer, index, array) => {
            // if (this._questionArr[index].QuestionType == "CheckBox") {
            //   if (this.ChekBoxQ[checkboxplace].QId == this._questionArr[index].QuestionID) {
            //     answer.answerContent = this.ChekBoxQ[checkboxplace].QAns.toString();
            //     checkboxplace++;
            //   }
            // }
            // else if (this._questionArr[index].QuestionType != "CheckBox") {
            //   if (this.ChekBoxQ[checkboxplace].QId == this._questionArr[index].QuestionID) {
            //     answer.answerContent = this.ChekBoxQ[checkboxplace].QAns.toString();
            //   }
            // }

            // this.ChekBoxQ.forEach(i => {

            if (this._questionArr[index].QuestionType == "CheckBox") {
                answer.answerContent = this.ChekBoxQ[c].QAns.toString();
                c++;
            }

            if (this._questionArr[index].QuestionType == "Signature") {
                if (this.signatureArr.length > 0) {
                    if (
                        this.signatureArr[d].QuestionID ==
                        this._questionArr[index].QuestionID
                    ) {
                        answer.answerContent = this.signatureArr[d].sign;
                        d++;
                    }
                }
            }

            // if (this._questionArr.length > index) {
            //   if (this._questionArr[index].QuestionType == "CheckBox" && c == 0) {
            //     if (i.QId == this._questionArr[index].QuestionID) {
            //       answer.answerContent = i.QAns.toString();
            //     }
            //   } else if (this._questionArr[index].QuestionType != "CheckBox") {
            //     if (i.QId == this._questionArr[index].QuestionID) {
            //       answer.answerContent = i.QAns.toString();
            //     }
            //   }
            //   c++;
            // }

            // });
            if (this._questionArr.length > index) {
                if (this._questionArr[index].QuestionType != "TextArea") {
                    let AnswerItem = {
                        AnswerID: index,
                        AnswerValue: answer.answerContent,
                        questionID: this._questionArr[index].QuestionID,
                        formID: this._formID,
                        AnswerType: this._questionArr[index].QuestionType,
                        questionValue: this._questionArr[index].QuestionValue,
                        PinQuestion: this._questionArr[index].PinQuestion,
                    };
                    survey.FormAnswers.push(AnswerItem);
                }
            }
        });

        // if (Signature == "data:image//") {
        //   this.openSnackBar("נא לחתום על הטופס");
        // } else {

        if (!this.surveyForm.invalid) {
            this.confirmationDialogService
                .confirm("נא לאשר..", "האם אתה בטוח ...? ")
                .then((confirmed) => {
                    console.log("User confirmed:", confirmed);
                    if (confirmed) {
                        this.http
                            .post(
                                environment.url + "answerForm",
                                {
                                    _answerValues: survey,
                                    _ifContinue: continueForm,
                                }
                            )
                            .subscribe((Response) => {
                                if (Response["d"] != -1) {
                                    this.openSnackBar("!נשמר בהצלחה");
                                    this.http
                                        // .post("http://srv-apps-prod/RCF_WS/WebService.asmx/createPdfOnServer", {
                                        .post("http://srv-ipracticom:8080/WebService.asmx/createPdfOnServer", {
                                            CaseNumber: this.CaseNumber,
                                            FormID: survey.FormID,
                                            Catigory: "ZPO_ONLINE",
                                            Row_ID: Response["d"],
                                        }
                                        )
                                        .subscribe((Response) => {
                                            //debugger;
                                            this.http
                                                // .post("http://srv-apps-prod/RCF_WS/WebService.asmx/LinkPdfToPatientNamer", {
                                                .post("http://srv-ipracticom:756/WebService.asmx/LinkPdfToPatientNamer", {
                                                    CaseNumber:
                                                        this.CaseNumber,
                                                    FormID: survey.FormID,
                                                    Catigory: "ZPO_ONLINE",
                                                    fileSource:
                                                        Response["d"],
                                                }
                                                )
                                                .subscribe((Response) => {
                                                    if (
                                                        Response["d"] ==
                                                        "success"
                                                    ) {
                                                        this.openSnackBar(
                                                            "! נשמר בהצלחה לתיק מטופל בנמר"
                                                        );
                                                    } else {
                                                        this.openSnackBar(
                                                            "! משהו לא תקין"
                                                        );
                                                    }
                                                });
                                        });
                                } else {
                                    this.openSnackBar("משהו השתבש, לא נשמר");
                                }
                            });
                        this.dialog.closeAll();
                    } else {
                    }
                })
                .catch(() =>
                    console.log(
                        "User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)"
                    )
                );
        } else {
            const invalid = [];
            const controls = this.surveyForm.controls["Answers"]["controls"];
            let counter = 1;
            for (const name in controls) {
                if (controls[name].invalid) {
                    invalid.push(counter);
                }
                counter = counter + 1;
            }
            this.openSnackBar("!שאלה מספר" + invalid[0] + " לא תקינה ");
        }
        // }
    }

    searchCaseNumber() {
        this.CaseNumber = this.caseNumberForm.controls["CaseNumber"].value;
        this.Passport = this.caseNumberForm.controls["Passport"].value;

        this.withCaseNumber = false;
        if (this.Passport != "") {
            this.http
                .post(
                    environment.url + "selectDetailsFromNamer",
                    {
                        patientId: this.Passport,
                    }
                )
                .subscribe((Response) => {
                    if (this.Passport != "") {
                        let passPatient = Response["d"];
                        this.mPersonalDetails.Address =
                            passPatient.Address;
                        this.mPersonalDetails.DOB = passPatient.DOB;
                        this.mPersonalDetails.Email =
                            passPatient.PatientEmail;
                        this.mPersonalDetails.FirstName =
                            passPatient.FirstName;
                        this.mPersonalDetails.FatherName =
                            passPatient.FatherName;
                        this.mPersonalDetails.LastName =
                            passPatient.LastName;
                        this.mPersonalDetails.PersonID =
                            passPatient.PASSNR;
                        this.mPersonalDetails.PhoneNumber =
                            passPatient.PhoneNumber;
                        this.mPersonalDetails.Gender =
                            passPatient.Gender;
                        this.CaseNumber = passPatient.CaseNumber;
                        this.caseNumberForm.controls["CaseNumber"].setValue(
                            passPatient.CaseNumber
                        );
                    } else {
                        this.mPersonalDetails = Response["d"];
                    }
                    this.getForm(this.urlID, this.ifContinueForm, this.NurseID);
                    this.selectedSubCheckbox = new Array<any>();
                });
        } else {
            this.http
                .post(
                    environment.url + "GetPersonalDetails",
                    {
                        CaseNumber: this.CaseNumber,
                    }
                )
                .subscribe((Response) => {
                    if (this.Passport != "") {
                        let passPatient = Response["d"];
                        this.mPersonalDetails.Address =
                            passPatient[0].PatientAddress;
                        this.mPersonalDetails.DOB = passPatient[0].PatientDOB;
                        this.mPersonalDetails.Email =
                            passPatient[0].PatientEmail;
                        this.mPersonalDetails.FirstName =
                            passPatient[0].PatientFirstName;
                        this.mPersonalDetails.FatherName =
                            passPatient[0].PatientFatherName;
                        this.mPersonalDetails.LastName =
                            passPatient[0].PatientLastName;
                        this.mPersonalDetails.PersonID =
                            passPatient[0].PatientPersonID;
                        this.mPersonalDetails.PhoneNumber =
                            passPatient[0].PatientPhoneNumber;
                        this.mPersonalDetails.Gender =
                            passPatient[0].PatientGender;
                    } else {
                        this.mPersonalDetails = Response["d"];
                    }
                    this.getForm(this.urlID, this.ifContinueForm, this.NurseID);
                    this.selectedSubCheckbox = new Array<any>();
                });
        }
    }

    getForm(urlID, ifContinue, NurseID) {
        if (NurseID == undefined || NurseID == "" || NurseID == null) {
            NurseID = 0;
        }
        this.http
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetForm", {
                formFormID: urlID,
                _nurseid: NurseID,
            })
            .subscribe((Response) => {
                this.filter_form_response = Response["d"];
                this._formID = this.filter_form_response.FormID;
                this._formName = this.filter_form_response.FormName;
                this._tableForm = this.filter_form_response.TableForm;
                this._formOpenText = this.filter_form_response.FormOpenText;
                this._formDate = this.filter_form_response.FormDate;
                this.isCaseNumber = this.filter_form_response.isCaseNumber;
                this.NurseID = this.filter_form_response.NurseInChargeID;
                this.onlyColumns = this.formBuilder.array([]);
                this.TablesColsRows = this.formBuilder.array([]);
                this.surveyTables = this.formBuilder.array([]);
                var surveyTablesItem;
                var tableControl;
                var columnControlItem;

                if (
                    this.isCaseNumber == "1" &&
                    this.mPersonalDetails.PersonID == null
                ) {
                    this.openSnackBar("!מספר מקרה לא תקין");
                    this.withCaseNumber = true;
                } else {
                    this.withCaseNumber = false;
                    // initialize the tables
                    this.filter_form_response.FormTable.forEach((element) => {
                        this._tableArr.push(element);
                    });
                    // takes the data of each table
                    this.TABLE_DATA = [];
                    for (var i = 0; i < this._tableArr.length; i++) {
                        this.TablesColsRows = this.formBuilder.array([]);
                        this.TABLE_DATA.push({
                            Row_ID: this.filter_form_response.FormTable[i]
                                .Row_ID,
                            TableText:
                                this.filter_form_response.FormTable[i]
                                    .TableText,
                            SubTitle:
                                this.filter_form_response.FormTable[i].SubTitle,
                            ColsType:
                                this.filter_form_response.FormTable[i].ColsType,
                            ColsSplitNumber:
                                this.filter_form_response.FormTable[i]
                                    .ColsSplitNumber,
                            TableStatus:
                                this.filter_form_response.FormTable[i]
                                    .TableStatus,
                        });
                        let index = 0;
                        for (
                            var r = 0;
                            r < this._tableArr[i].rowsGroup.length;
                            r++
                        ) {
                            this.onlyColumns = this.formBuilder.array([]);
                            for (
                                var k = 0;
                                k < this._tableArr[i].colsGroup.length;
                                k++
                            ) {
                                if (
                                    this.filter_form_response.NurseInChargeID ==
                                    "0"
                                ) {
                                    if (
                                        this._tableArr[i].colsGroup[k]
                                            .ColType == "CheckBox"
                                    ) {
                                        surveyTablesItem =
                                            this.formBuilder.group({
                                                tableAnswerContent: [
                                                    false,
                                                    null,
                                                ],
                                                ColumnsValue: [
                                                    this._tableArr[i].colsGroup[
                                                        k
                                                    ].colsText,
                                                    null,
                                                ],
                                                ColType: [
                                                    this._tableArr[i].colsGroup[
                                                        k
                                                    ].ColType,
                                                    null,
                                                ],
                                                ColIDFK: [
                                                    this._tableArr[i].colsGroup[
                                                        k
                                                    ].Row_ID,
                                                    null,
                                                ],
                                            });
                                    } else {
                                        surveyTablesItem =
                                            this.formBuilder.group({
                                                tableAnswerContent: ["", null],
                                                ColumnsValue: [
                                                    this._tableArr[i].colsGroup[
                                                        k
                                                    ].colsText,
                                                    null,
                                                ],
                                                ColType: [
                                                    this._tableArr[i].colsGroup[
                                                        k
                                                    ].ColType,
                                                    null,
                                                ],
                                                ColIDFK: [
                                                    this._tableArr[i].colsGroup[
                                                        k
                                                    ].Row_ID,
                                                    null,
                                                ],
                                            });
                                    }
                                } else {
                                    if (
                                        this._tableArr[i].TableAnsweredGroup[
                                            index
                                        ].AnswerValue == "False"
                                    ) {
                                        this._tableArr[i].TableAnsweredGroup[
                                            index
                                        ].AnswerValue = false;
                                    } else if (
                                        this._tableArr[i].TableAnsweredGroup[
                                            index
                                        ].AnswerValue == "True"
                                    ) {
                                        this._tableArr[i].TableAnsweredGroup[
                                            index
                                        ].AnswerValue = true;
                                    }
                                    surveyTablesItem = this.formBuilder.group({
                                        Row_ID: [
                                            this._tableArr[i]
                                                .TableAnsweredGroup[index]
                                                .Row_ID,
                                            null,
                                        ],
                                        tableAnswerContent: [
                                            this._tableArr[i]
                                                .TableAnsweredGroup[index]
                                                .AnswerValue,
                                            null,
                                        ],
                                        ColumnsValue: [
                                            this._tableArr[i]
                                                .TableAnsweredGroup[index]
                                                .ColValue,
                                            null,
                                        ],
                                        ColType: [
                                            this._tableArr[i]
                                                .TableAnsweredGroup[index]
                                                .AnswerType,
                                            null,
                                        ],
                                        ColIDFK: [
                                            this._tableArr[i]
                                                .TableAnsweredGroup[index]
                                                .ColIDFK,
                                            null,
                                        ],
                                    });
                                }
                                index++;
                                this.onlyColumns.push(surveyTablesItem);
                            }
                            columnControlItem = this.formBuilder.group({
                                Columns: this.onlyColumns,
                                RowValue: [
                                    this._tableArr[i].rowsGroup[r].rowsText,
                                    null,
                                ],
                                RowIDFK: [
                                    this._tableArr[i].rowsGroup[r].Row_ID,
                                    null,
                                ],
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
                    this.dataSource = new MatTableDataSource<any>(
                        this.TABLE_DATA
                    );
                    this.dataSource.paginator = this.paginator;

                    // this.getOption(this.urlID);
                    this.getQuestion(
                        this.urlID,
                        this.mPersonalDetails,
                        ifContinue,
                        NurseID
                    );
                }
                this.surveyForm = this.formBuilder.group({
                    Answers: this.surveyAnswers,
                    Tables: this.surveyTables,
                });
            });
        // this.ngAfterViewInit();
    }

    getQuestion(urlID, personalDetails, ifContinue, NurseID) {
        let userName = localStorage.getItem("loginUserName").toLowerCase();
        this.http
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetQuestion", {
                questionsFormID: urlID,
                isCaseNumber: this.isCaseNumber,
                nurseid: NurseID,
            })
            .subscribe((Response) => {
                this.filter_question_response = Response["d"];
                this.surveyAnswers = this.formBuilder.array([]);

                var that = this;

                this.ChekBoxQ = new Array<CheckBoxAnswers>();
                this.filter_question_response.forEach((element) => {
                    this.checkBoxArray = this.formBuilder.array([]);
                    this._questionArr.push(element);
                    this._optionArr.push(element.Options);
                    var surveyAnswersItem;
                    if (ifContinue == "1") {
                        element.Answers.forEach((ans) => {
                            if (element.QuestionType == "Signature") {
                                surveyAnswersItem = this.formBuilder.group({
                                    answerContent: [ans.AnswerValue, null],
                                });
                            } else {
                                if (element.QuestionType == "CheckBox") {
                                    for (
                                        var i = 0;
                                        i < element.Options.length;
                                        i++
                                    ) {
                                        if (
                                            element.Options[i].QuestionIDFK ==
                                            element.QuestionID
                                        ) {
                                            var qOption =
                                                element.Options[i].OptionValue;

                                            if (
                                                ans.AnswerValue.indexOf(
                                                    qOption
                                                ) >= 0
                                            ) {
                                                surveyAnswersItem =
                                                    this.formBuilder.group({
                                                        answerContent: [
                                                            qOption,
                                                            null,
                                                        ],
                                                    });
                                            } else {
                                                surveyAnswersItem =
                                                    this.formBuilder.group({
                                                        answerContent: [
                                                            false,
                                                            null,
                                                        ],
                                                    });
                                            }
                                            this.checkBoxArray.push(
                                                surveyAnswersItem
                                            );
                                        }
                                    }
                                    this.surveyAnswers.push(this.checkBoxArray);
                                    // let splitted = ans.AnswerValue.split(",");
                                } else {
                                    surveyAnswersItem = this.formBuilder.group({
                                        answerContent: [ans.AnswerValue, null],
                                    });
                                }
                            }
                        });
                        if (element.QuestionType == "TextArea") {
                            surveyAnswersItem = this.formBuilder.group({
                                answerContent: [element.QuestionValue, null],
                            });
                        }
                    } else {
                        if (element.QuestionType == "CheckBox") {
                            for (var i = 0; i < element.Options.length; i++) {
                                if (
                                    element.Options[i].QuestionIDFK ==
                                    element.QuestionID
                                ) {
                                    surveyAnswersItem = this.formBuilder.group({
                                        answerContent: new FormControl(
                                            "",
                                            null
                                        ),
                                    });
                                    this.checkBoxArray.push(surveyAnswersItem);
                                }
                            }
                            this.surveyAnswers.push(this.checkBoxArray);
                            // let splitted = ans.AnswerValue.split(",");
                        }
                        if (element.QuestionType == "TextArea") {
                            surveyAnswersItem = this.formBuilder.group({
                                answerContent: [element.QuestionValue, null],
                            });
                        }
                        if (element.QuestionType == "Signature") {
                            surveyAnswersItem = this.formBuilder.group({
                                answerContent: [
                                    { value: userName, disabled: true },
                                    Validators.required,
                                ],
                            });
                        }
                        if (
                            element.QuestionIsRequired == "True" &&
                            element.QuestionType != "Signature" &&
                            element.QuestionType != "TextArea"
                        ) {
                            surveyAnswersItem = this.formBuilder.group({
                                answerContent: ["", Validators.required],
                            });
                        } else {
                            surveyAnswersItem = this.formBuilder.group({
                                answerContent: ["", null],
                            });
                        }
                    }
                    if (personalDetails.PersonID != null) {
                        if (element.PinQuestion == "1") {
                            if (
                                element.QuestionType == "Phone" &&
                                element.QuestionValue == "מספר טלפון"
                            ) {
                                surveyAnswersItem = this.formBuilder.group({
                                    answerContent: [
                                        personalDetails.PhoneNumber,
                                        Validators.compose([
                                            Validators.required,
                                        ]),
                                    ],
                                });
                            } else if (
                                element.QuestionType == "ID" &&
                                element.QuestionValue == "ת.ז"
                            ) {
                                surveyAnswersItem = this.formBuilder.group({
                                    answerContent: [
                                        {
                                            value: personalDetails.PersonID,
                                            disabled: true,
                                        },
                                        Validators.compose([
                                            Validators.pattern(
                                                "[- +()0-9]{9,10}"
                                            ),
                                            Validators.required,
                                        ]),
                                    ],
                                });
                            } else if (
                                element.QuestionType == "Email" &&
                                element.QuestionValue == "כתובת מייל"
                            ) {
                                surveyAnswersItem = this.formBuilder.group({
                                    answerContent: [
                                        personalDetails.Email,
                                        Validators.compose([
                                            Validators.pattern(
                                                "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"
                                            ),
                                        ]),
                                    ],
                                });
                            } else if (
                                element.QuestionType == "Text" &&
                                element.QuestionValue == "שם פרטי"
                            ) {
                                surveyAnswersItem = this.formBuilder.group({
                                    answerContent: [
                                        {
                                            value: personalDetails.FirstName,
                                            disabled: true,
                                        },
                                        Validators.compose([
                                            Validators.required,
                                        ]),
                                    ],
                                });
                            } else if (
                                element.QuestionType == "Text" &&
                                element.QuestionValue == "שם אב"
                            ) {
                                surveyAnswersItem = this.formBuilder.group({
                                    answerContent: [
                                        {
                                            value: personalDetails.FatherName,
                                            disabled: true,
                                        },
                                        Validators.compose([
                                            Validators.required,
                                        ]),
                                    ],
                                });
                            } else if (
                                element.QuestionType == "Text" &&
                                element.QuestionValue == "שם משפחה"
                            ) {
                                surveyAnswersItem = this.formBuilder.group({
                                    answerContent: [
                                        {
                                            value: personalDetails.LastName,
                                            disabled: true,
                                        },
                                        Validators.compose([
                                            Validators.required,
                                        ]),
                                    ],
                                });
                            } else if (
                                element.QuestionType == "Text" &&
                                element.QuestionValue == "כתובת"
                            ) {
                                surveyAnswersItem = this.formBuilder.group({
                                    answerContent: [
                                        {
                                            value: personalDetails.Address,
                                            disabled: true,
                                        },
                                        Validators.compose([
                                            Validators.required,
                                        ]),
                                    ],
                                });
                            } else if (
                                element.QuestionType == "Date" &&
                                element.QuestionValue == "תאריך לידה"
                            ) {
                                surveyAnswersItem = this.formBuilder.group({
                                    answerContent: [
                                        {
                                            value: personalDetails.DOB,
                                            disabled: true,
                                        },
                                        Validators.compose([
                                            Validators.required,
                                        ]),
                                    ],
                                });
                            } else if (
                                element.QuestionType == "RadioButton" &&
                                element.QuestionValue == "מין"
                            ) {
                                if (personalDetails.Gender == "1") {
                                    surveyAnswersItem = this.formBuilder.group({
                                        answerContent: [
                                            { value: "זכר", disabled: true },
                                            Validators.compose([
                                                Validators.required,
                                            ]),
                                        ],
                                    });
                                } else if (personalDetails.Gender == "2") {
                                    surveyAnswersItem = this.formBuilder.group({
                                        answerContent: [
                                            { value: "נקבה", disabled: true },
                                            Validators.compose([
                                                Validators.required,
                                            ]),
                                        ],
                                    });
                                } else {
                                    surveyAnswersItem = this.formBuilder.group({
                                        answerContent: [
                                            "אחר",
                                            Validators.compose([
                                                Validators.required,
                                            ]),
                                        ],
                                    });
                                }
                            }
                        }
                    }
                    //10725425

                    if (element.QuestionType == "CheckBox") {
                        if (ifContinue == "1") {
                            var nQ = new CheckBoxAnswers();
                            nQ.QRequired = element.QuestionIsRequired;
                            nQ.QId = element.QuestionID;
                            nQ.QAns = [element.Answers[0].AnswerValue];
                            that.ChekBoxQ.push(nQ);
                        } else {
                            var nQ = new CheckBoxAnswers();
                            nQ.QRequired = element.QuestionIsRequired;
                            nQ.QId = element.QuestionID;
                            nQ.QAns = [];
                            that.ChekBoxQ.push(nQ);
                        }
                    }
                    if (element.QuestionType != "CheckBox" && ifContinue == 1) {
                        this.surveyAnswers.push(surveyAnswersItem);
                    }
                    if (ifContinue == 0 && element.QuestionType != "CheckBox") {
                        this.surveyAnswers.push(surveyAnswersItem);
                    }
                });
                this.updateView();

                this.surveyForm = this.formBuilder.group({
                    Answers: this.surveyAnswers,
                    Tables: this.surveyTables,
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

    onClose() {
        this.dialog.closeAll();
    }

    onSubmit() {
        this.fillForm(0);
        // var link = document.createElement('a');
        // link.download = 'download.png';
        // link.href = this.canvasEl.toDataURL();
        // link.click();
    }
}
