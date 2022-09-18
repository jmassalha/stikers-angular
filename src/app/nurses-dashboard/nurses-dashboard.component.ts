import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import {
  NgbModal,
  NgbActiveModal,
} from "@ng-bootstrap/ng-bootstrap";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ConfirmationDialogService } from "../confirmation-dialog/confirmation-dialog.service";
import { ReportRepliesComponent } from '../report-replies/report-replies.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from "@angular/material/table";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { FillReportComponent } from "../fill-report/fill-report.component";
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { VoiceRecognitionService } from '../header/service/voice-recognition.service'
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
export interface User {
  FirstName: string;
  LastName: string;
  id: string;
  Email: string;
}
export interface PeriodicElement2 {
  Row_ID: string;
  UpdateDate: string;
  FullName: string;
}
export interface PeriodicElement {
  date: string;
  title: string;
  status: string;
  symbol: string;
  description: string;
}
export interface Shift {
  value: string;
  viewValue: string;
}
export interface Status {
  value: string;
  viewValue: string;
}
export interface ImportantCat {
  value: string;
  viewValue: string;
}
export interface ReportTypeArr {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'share-reports-dialog',
  templateUrl: 'share-reports-dialog.html',
})
export class ShareReportsDialog {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    public dialogRef: MatDialogRef<ShareReportsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private fb: FormBuilder) { }

  specialForces: User[] = [
    { FirstName: 'דניאלה', LastName: 'שאול', id: '031965551', Email: 'X_DSHAULL@PMC.GOV.IL' },
    { FirstName: 'טניה', LastName: 'אדמוז', id: '061233243', Email: 'TADMUZ@PMC.GOV.IL' },
    { FirstName: 'מייקי', LastName: 'מיכל לרר', id: '022355333', Email: 'MLEHRER@PMC.GOV.IL' },
    { FirstName: 'שרון', LastName: 'בן דוד', id: '029302304', Email: 'SBENDAVID@PMC.GOV.IL' }
  ]
  filteredOptions: Observable<string[]>;
  myControl = new FormControl('', Validators.required);
  users = [];
  removable = true;
  selectable = true;
  all_users_filter = [];
  reportArray = [];
  disableBtn: boolean = false;
  mail: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: any[] = [];
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;

  ngOnInit() {
    this.mail = this.fb.group({
      mailSubject: new FormControl('', null)
    });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.users.slice()));
    this.getUsers();
  }
  // displayFn(user: User): string {
  //   return user && user.FirstName + ' ' + user.LastName ? user.FirstName + ' ' + user.LastName : '';
  // }
  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.users.filter(option => option.FirstName.includes(filterValue));
  // }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.fruits.push(value);
    }

    // event.chipInput!.clear();
    this.myControl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);
    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (event.option.value.id == "1") {
      this.specialForces.forEach(element => {
        this.fruits.push(element);
      });
    } else {
      this.fruits.push(event.option.value);
    }
    this.fruitInput.nativeElement.value = '';
    this.myControl.setValue(null);
  }

  private _filter(value: any): string[] {
    let filterValue = "";
    if (value != '' && value.FirstName == undefined) {
      filterValue = value.toLowerCase();
    }
    return this.users.filter(fruit => fruit.FirstName.toLowerCase().includes(filterValue));
  }


  shareReportWithOthers() {
    this.disableBtn = true;
    if (this.fruits.length == 0) {
      this.openSnackBar("נא לבחור אחראי לשליחה");
      this.disableBtn = false;
    } else if (this.reportArray.length == 0) {
      this.openSnackBar("לא נמצאו דיווחים לשליחה");
      this.disableBtn = false;
    } else {
      this.http
        // .post("http://srv-apps-prod/RCF_WS/WebService.asmx/AttachReportToUser", {
        // .post("http://srv-apps-prod/RCF_WS/WebService.asmx/AttachReportToUser", {
        .post("http://srv-ipracticom:8080/WebService.asmx/AttachReportToUser", {
          _userSender: localStorage.getItem('loginUserName').toLowerCase(),
          users: this.fruits,
          _reportArray: this.reportArray,
          _mailSubject: this.mail.controls['mailSubject'].value,
        })
        .subscribe((Response) => {
          if (Response["d"]) {
            this.openSnackBar("! נשלח בהצלחה לנמען");
            this.dialogRef.close();
          } else {
            this.openSnackBar("! אירעה תקלה, לא נשלח");
          }
          this.disableBtn = false;
        });
    }
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
  getUsers() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetUsersForInquiries", {

      })
      .subscribe((Response) => {
        this.all_users_filter = Response["d"];

        this.all_users_filter.forEach(element => {
          this.users.push({
            FirstName: element.firstname,
            LastName: element.lastname,
            id: element.id,
            Email: element.email
          });
        });
        this.users.push({
          FirstName: 'היחידה לבטיחות הטיפול',
          LastName: '',
          id: '1',
          Email: 'a'
        });
      });
  }

}
@Component({
  selector: 'app-nurses-dashboard',
  templateUrl: './nurses-dashboard.component.html',
  styleUrls: ['./nurses-dashboard.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class NursesDashboardComponent implements OnInit {
  shift: Shift[] = [
    { value: 'בוקר', viewValue: 'בוקר' },
    { value: 'ערב', viewValue: 'ערב' },
    { value: 'לילה', viewValue: 'לילה' },
  ];

  status: Status[] = [
    { value: '', viewValue: '' },
    { value: 'לטיפול', viewValue: 'לטיפול' },
    { value: 'טופל', viewValue: 'טופל' },
  ];
  importantCat: ImportantCat[] = [
    { value: '1', viewValue: 'חשוב' },
    { value: '0', viewValue: 'רגיל' },
  ];
  reportTypeArr: ReportTypeArr[] = [
    { value: '1', viewValue: 'כללית' },
    { value: '0', viewValue: 'מחלקה' },
  ];

  @ViewChild('printmycontent') printmycontent: ElementRef;
  @ViewChild('pagetoshow') myScrollContainer: ElementRef;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  columnsToDisplay = ['date', 'status', 'edit', 'continue', 'reply'];
  ELEMENT_DATA = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @Input()
  autoActiveFirstOption: boolean

  pipe = new DatePipe('en-US');
  myDate = new Date();
  constructor(private _snackBar: MatSnackBar,
    public service: VoiceRecognitionService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<NursesDashboardComponent>,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private confirmationDialogService: ConfirmationDialogService
  ) { this.service.init(); }

  searchReportsGroup: FormGroup;
  reportsArr = [];
  all_categories_filter = [];
  all_categories_filter2 = [];
  UserName = localStorage.getItem('loginUserName').toLowerCase();
  departmentfilter = new FormControl();
  categoryfilter = new FormControl();
  categoryfilter2 = new FormControl();
  subcategoryfilter = new FormControl();
  filteredOptions2: Observable<string[]>;
  filteredOptions3: Observable<string[]>;
  filteredOptions3_2: Observable<string[]>;
  filteredOptions4: Observable<string[]>;
  department = [];
  all_departs_filter = [];
  permission: boolean = false;
  caseNumber: string;
  asDialog: boolean;
  Dept_Name: string;
  firstname: string;
  lastname: string;
  ReportGroup: FormGroup;
  subCategory = [];
  reportID: string;
  userFullName: string;
  reportType: string;
  gender: string;
  dob: string;
  description: string;
  corona: string;
  firstName: string;
  lastName: string;
  all_report_management;
  date = this.pipe.transform(this.myDate, 'dd-MM-yyyy');
  date2: string;
  time2: string;
  automaticShift: string;
  // creator: boolean;
  now = new Date();
  autoSaveCounter: any;
  autoSaveTimer: any;
  ifGeneral: string = '1';
  AdminNurse: string = '0';
  currentItemsToShow = [];
  differentReports = [];
  print2: boolean;
  panelOpenState: boolean = false;
  Patientsloading: boolean = false;
  offsetFlag = true;
  showNewReport: boolean = false;
  nursingCount: string;
  waitToSaveBtn: boolean;

  ngOnInit(): void {
    if (this.caseNumber != "" && this.caseNumber != undefined) {
      this.panelOpenState = true;
      this.getPatientDiagnosis();
    }
    this.searchReportsGroup = new FormGroup({
      'ReportShift': new FormControl('', null),
      'PatientName': new FormControl('', null),
      'ReportStatus': new FormControl('הכל', null),
      'ReportDepartment': new FormControl(' ', null),
      'CaseNumber': new FormControl('', null),
      'ReportStartDate': new FormControl('', null),
      'ReportEndDate': new FormControl('', null),
      'ReportCategory': new FormControl('', null),
      'ImportantCategory': new FormControl('הכל', null),
      'ReportTypeSearch': new FormControl('הכל', null),
    });
    this.ReportGroup = this.formBuilder.group({
      Row_ID: ['0', null],
      ReportTitle: ['', null],
      ReportMachlol: ['', null],
      ReportCategory: ['', null],
      ReportSubCategory: ['', null],
      Important: [false, null],
      ReportStatus: ['', null],
      ReportShift: [{ value: '', disabled: true }, null],
      ReportText: ['', null],
      toContinue: [false, null],
      Diagnosis: ['', null],
      PatientName: [this.firstname + ' ' + this.lastname, null],
      PatientNurseStatus: [this.description + ' ' + this.corona, null],
    });
    if (this.now.getHours() >= 7 && this.now.getHours() < 15) {
      this.automaticShift = 'בוקר';
    } else if (this.now.getHours() >= 15 && this.now.getHours() < 23) {
      this.automaticShift = 'ערב';
    } else {
      this.automaticShift = 'לילה';
    }
    this.ReportGroup.controls['ReportShift'].setValue(this.automaticShift);
    this.getCategories();
    this.getDeparts();
    this.NursesSystemPermission();
    this.date2 = this.datePipe.transform(this.now, 'dd.MM.yyyy');
    this.time2 = this.datePipe.transform(this.now, 'HH:mm');
    if (this.Dept_Name != '' && this.Dept_Name != undefined) {
      this.ifGeneral = '0';
    }
    setTimeout(() => {
      this.searchReports();
    }, 500);
    this.permission = false;
    this.filteredOptions2 = this.departmentfilter.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter2(value))
      );
    this.filteredOptions3 = this.categoryfilter.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter3(value))
      );
    this.filteredOptions3_2 = this.categoryfilter2.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter3_2(value))
      );
    this.filteredOptions4 = this.subcategoryfilter.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter4(value))
      );
    this.departmentfilter.setValue(this.Dept_Name);

    this.categoryfilter.setValue('');
    this.subcategoryfilter.setValue('');
    this.searchReportsGroup.controls['ReportEndDate'].setValue(this.now);
    this.currentItemsToShow = this.ELEMENT_DATA;
  }

  // @HostListener('window:scroll', ['$event']) getScrollHeight(event) {
  //   console.log(this.myScrollContainer.nativeElement.pageYOffset, event);
  //   if (this.myScrollContainer.nativeElement.pageYOffset > 0)
  //     this.offsetFlag = false;
  //   else
  //     this.offsetFlag = true;
  // }
  // @HostListener('document:mousewheel', ['$event'])
  // getScrollHeight(event) {
  //   console.log("top: "+event.target.offsetTop);
  //   console.log("flag: "+event.target.offsetFlag);
  //   console.log("height: "+event.target.offsetHeight);
  //   if (window.pageYOffset > 0)
  //     this.offsetFlag = false;
  //   else
  //     this.offsetFlag = true;
  // }


  startService() {
    this.service.start();
  }

  stopService() {
    if (this.service.tempWords.includes('מחק')) {
      this.ReportGroup.controls['ReportText'].setValue('');
    } else {
      let speechValue = this.ReportGroup.controls['ReportText'].value;
      this.ReportGroup.controls['ReportText'].setValue(speechValue + ' ' + this.service.tempWords);
    }
    this.service.stop();
  }

  onPageChange($event) {
    this.currentItemsToShow = this.ELEMENT_DATA.slice($event.pageIndex * $event.pageSize, $event.pageIndex * $event.pageSize + $event.pageSize);
    // this.myScrollContainer.nativeElement.scrollIntoView();
  }

  takeMeToTheTop() {
    this.myScrollContainer.nativeElement.scrollIntoView();
  }

  private _filter2(value: string): string[] {
    const filterValue2 = value;
    return this.department.filter(option => option.Dept_Name.includes(filterValue2));
  }
  private _filter3(value: string): string[] {
    const filterValue3 = value;
    return this.all_categories_filter.filter(option => option.Cat_Name.includes(filterValue3));
  }
  private _filter3_2(value: string): string[] {
    const filterValue3_2 = value;
    return this.all_categories_filter2.filter(option => option.Cat_Name.includes(filterValue3_2));
  }
  private _filter4(value: string): string[] {
    const filterValue4 = value;
    return this.subCategory.filter(option => option.SubCat_Name.includes(filterValue4));
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  openNewBornLink() {
    window.open("http://srv-apps-prod/app/#/newborn?casenumber=" + this.caseNumber);
  }

  closeModal() {
    this.dialogRef.close();
  }

  setImportantReport() {
    if (this.ReportGroup.controls['Important'].value == 'True' || this.ReportGroup.controls['Important'].value == true) {
      this.ReportGroup.controls['Important'].setValue('False');
    } else {
      this.ReportGroup.controls['Important'].setValue('True');
    }
  }

  getCategories() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetCategories", {
      })
      .subscribe((Response) => {
        this.all_categories_filter = Response["d"];
        this.all_categories_filter2 = Response["d"];
        let lastIndex = this.all_categories_filter.length - 1;
        this.subCategory = this.all_categories_filter[lastIndex].SubCategory;
      });
  }

  fillReportDialog(reportid, Dept_Name, firstName, lastName) {
    let dialogRef = this.dialog.open(FillReportComponent);
    dialogRef.componentInstance.reportID = reportid;
    dialogRef.componentInstance.Dept_Name = Dept_Name;
    dialogRef.componentInstance.firstName = firstName;
    dialogRef.componentInstance.lastName = lastName;
  }

  // open new report from face icon in the clicical reports list
  showNewReportButton(patient) {
    this.showNewReport = true;
    this.ReportGroup = this.formBuilder.group({
      Row_ID: ['0', null],
      ReportTitle: ['', null],
      ReportMachlol: [patient.ReportMachlol, null],
      ReportCategory: ['', null],
      ReportSubCategory: ['', null],
      Important: [false, null],
      ReportStatus: ['', null],
      ReportShift: [{ value: this.automaticShift, disabled: true }, null],
      ReportText: ['', null],
      toContinue: [false, null],
      Diagnosis: [patient.Diagnosis, null],
      PatientName: [patient.PatientName, null],
      PatientNurseStatus: [patient.PatientNurseStatus, null],
    });
    this.dob = patient.Patient_DobGender;
    this.gender = "";
    this.firstName = patient.PatientName;
    this.caseNumber = patient.Patient_CaseNumber;
  }

  // displayHistoryDialog(reportid) {
  //   let dialogRef = this.dialog.open(DialogElementsExampleDialog);
  //   dialogRef.componentInstance.reportID = reportid;
  // }

  addReply(reportid) {
    let dialogRef = this.dialog.open(ReportRepliesComponent);
    dialogRef.componentInstance.reportID = reportid;
  }

  openShareDialog() {
    let dialogRef = this.dialog.open(ShareReportsDialog);
    dialogRef.componentInstance.reportArray = this.ELEMENT_DATA;
  }

  NursesSystemPermission() {
    let userName = localStorage.getItem("loginUserName").toLowerCase();
    return this.http.post("http://srv-apps-prod/RCF_WS/WebService.asmx/NursesUserPersmission", { _userName: userName, withCredentials: true }).subscribe(response => {
      if (response["d"].IfFound) {
        this.AdminNurse = '1';
      };
    });
  }

  getDeparts() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetNursesDeparts", {
      })
      .subscribe((Response) => {
        this.all_departs_filter = Response["d"];

        this.all_departs_filter.forEach(element => {
          this.department.push(element);
        })
      });
  }

  print() {
    // this.dialogRef.close(this.ELEMENT_DATA);
    // $("#loader").removeClass("d-none");
    let that = this;
    setTimeout(function () {
      var printContents = that.printmycontent.nativeElement.innerHTML;
      var w = window.open();
      w.document.write(printContents);
      w.print();
      w.close();
    }, 1000);
  }

  searchReports() {
    this.Patientsloading = true;
    let myDate2 = new Date();
    if (this.departmentfilter.value == null) {
      this.departmentfilter.setValue('');
    }
    let _reportShift = this.searchReportsGroup.controls['ReportShift'].value;
    let _reportTypeSearch = this.searchReportsGroup.controls['ReportTypeSearch'].value;
    let _reportDepartment = this.Dept_Name;
    if (this.Dept_Name == undefined) {
      _reportDepartment = "";
    }
    if (this.departmentfilter.value != '' && this.departmentfilter.value != null) {
      _reportDepartment = this.departmentfilter.value;
    }
    let _reportStatus = this.searchReportsGroup.controls['ReportStatus'].value;
    let _caseNumber;
    if (this.caseNumber != undefined) {
      _caseNumber = this.caseNumber;
    } else {
      _caseNumber = this.searchReportsGroup.controls['CaseNumber'].value;
    }
    let _reportStartDate = this.searchReportsGroup.controls['ReportStartDate'].value;
    let _reportEndDate = this.searchReportsGroup.controls['ReportEndDate'].value;
    this.searchReportsGroup.controls['ReportCategory'].setValue(this.categoryfilter2.value);
    let _reportCategory = this.searchReportsGroup.controls['ReportCategory'].value;
    if (_reportCategory == null) {
      _reportCategory = "";
    }
    let _patientName = this.searchReportsGroup.controls['PatientName'].value;
    let pipe = new DatePipe('en-US');
    if (!(_reportStartDate == undefined || _reportStartDate == "" || _reportStartDate == null)) {
      _reportStartDate = pipe.transform(_reportStartDate, 'yyyy/MM/dd');
    } else {
      if (this.time2 >= "09:00") {
        _reportStartDate = pipe.transform(myDate2, 'yyyy/MM/dd 07:00');
      } else if (this.time2 < "09:00" && this.time2 > "00:00") {
        myDate2.setDate(myDate2.getDate() - 1);
        _reportStartDate = pipe.transform(myDate2, 'yyyy/MM/dd 07:00');
      } else {
        _reportStartDate = pipe.transform(myDate2, 'yyyy/MM/dd');
      }
    }
    if (!(_reportEndDate == undefined || _reportEndDate == "" || _reportEndDate == null)) {
      _reportEndDate = pipe.transform(_reportEndDate, 'yyyy/MM/dd');
    } else {
      _reportEndDate = "";
    }
    let _important = this.searchReportsGroup.controls['ImportantCategory'].value;
    if (!this.searchReportsGroup.invalid) {
      this.http
        .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetReports", {
          _reportShift: _reportShift,
          _reportDepartment: _reportDepartment,
          _reportStatus: _reportStatus,
          _caseNumber: _caseNumber,
          _reportStartDate: _reportStartDate,
          _reportEndDate: _reportEndDate,
          _reportCategory: _reportCategory,
          _userName: this.UserName,
          _reportType: this.reportType,
          _ifGeneral: this.ifGeneral,
          _patientName: _patientName,
          _important: _important,
          _reportTypeSearch: _reportTypeSearch
        })
        .subscribe((Response) => {
          this.ELEMENT_DATA = [];
          this.reportsArr = Response["d"];
          if (this.reportsArr.length > 0) {
            for (var i = 0; i < this.reportsArr.length; i++) {
              if (this.AdminNurse == "0" && this.reportsArr[i].AdminNurse == "1") {
                continue;
              } else {
                // this.ELEMENT_DATA.push({
                //   reportID: this.reportsArr[i].Row_ID,
                //   ReportDate: this.reportsArr[i].ReportDate,
                //   ReportStatus: this.reportsArr[i].ReportStatus,
                //   ReportText: this.reportsArr[i].ReportText,
                //   userFullName: this.reportsArr[i].UsersReportsList[0].UsersList[0].FirstName + " " + this.reportsArr[i].UsersReportsList[0].UsersList[0].LastName,
                //   UserName: this.reportsArr[i].UsersReportsList[0].UsersList[0].UserName,
                //   LastUpdatedDate: this.reportsArr[i].LastUpdatedDate,
                //   ReportShift: this.reportsArr[i].ReportShift,
                //   ReportMachlol: this.reportsArr[i].ReportMachlol,
                //   ReportCategory: this.reportsArr[i].ReportCategory,
                //   ReportSubCategory: this.reportsArr[i].ReportSubCategory,
                //   ReportsReplyList: this.reportsArr[i].ReportsReplyList,
                //   Important: this.reportsArr[i].Important,
                //   PatientName: this.reportsArr[i].PatientName,
                //   AdminNurse: this.reportsArr[i].AdminNurse,
                // });
                this.ELEMENT_DATA.push(this.reportsArr[i]);
              }
            }
            // if(this.AdminNurse != '1'){
            //  this.ELEMENT_DATA.filter(s => s.includes('val')); 
            // }
            // if (_caseNumber != "") {
            //   // this.ReportGroup.controls['Diagnosis'].setValue(this.reportsArr[0].Diagnosis);
            //   this.getPatientDiagnosis();
            // }
            this.departmentfilter.setValue(this.Dept_Name);
            this.permission = true;
          }
          this.differentReports = [];
          let patients = this.ELEMENT_DATA.map(item => item.PatientName)
            .filter((value, index, self) => self.indexOf(value) === index);

          for (let j = 0; j < patients.length; j++) {
            for (let k = 0; k < this.ELEMENT_DATA.length; k++) {
              if (this.ELEMENT_DATA[k].PatientName == patients[j]) {
                if (typeof this.differentReports[j] != 'undefined')
                  this.differentReports[j][this.differentReports[j].length] = this.ELEMENT_DATA[k];
                else {
                  this.differentReports.push([])
                  this.differentReports[j][0] = this.ELEMENT_DATA[k];
                }
              }
            }
          }

          this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
          this.currentItemsToShow = this.ELEMENT_DATA.slice(0, 15);
          this.Patientsloading = false;
        });
    }
  }

  getPatientDiagnosis() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetPatientDiagnosis", {
        _caseNumber: this.caseNumber
      })
      .subscribe((Response) => {
        this.ReportGroup.controls['Diagnosis'].setValue(Response["d"]);
      });
  }

  printSingleReport() {
    this.print2 = true;
    let that = this;
    setTimeout(function () {
      var printContents = that.printmycontent.nativeElement.innerHTML;
      var w = window.open();
      w.document.write(printContents);
      w.print();
      w.close();
    }, 1000);
  }

  addResponseToReport(reportID) {
    // const dialogRef = this.dialog.open(AddResponseFillDialog, {
    //   width: '600px'
    // });
    // dialogRef.componentInstance.reportID = reportID;
    // dialogRef.componentInstance.userFullName = this.userFullName;
    // dialogRef.afterClosed().subscribe(result => {
    //   this.getReportToUpdate();
    // });
  }

  areYouSureDeleteReport(reportID) {
    this.confirmationDialogService
      .confirm("נא לאשר..", "אתה מוחק דיווח.. האם אתה בטוח ...? ")
      .then((confirmed) => {
        console.log("User confirmed:", confirmed);
        if (confirmed) {
          this.deleteReport(reportID);
        } else {
        }
      })
      .catch(() =>
        console.log(
          "User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)"
        )
      );
  }

  changeReportToHandled(reportID) {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/ReportHandled", {
        _reportID: reportID
      })
      .subscribe((Response) => {
        if (Response["d"]) {
          this.openSnackBar("הדווח נסגר בהצלחה");
          this.searchReports();
        } else {
          this.openSnackBar("משהו השתבש, פעולה לא התקיימה");
        }
      });
  }

  // autosave() {
  //   this.autoSaveTimer;
  //   let lengthOfText = this.ReportGroup.controls['ReportText'].value.length;
  //   if (lengthOfText > 0) {
  //     this.sendReport('1');
  //   }
  //   this.autoSaveTimer = setTimeout(() => {
  //     this.autosave();
  //   }, 6000);
  // }



  sendReport(autosave) {
    this.ReportGroup.controls['ReportMachlol'].setValue(this.departmentfilter.value);
    this.ReportGroup.controls['ReportCategory'].setValue(this.categoryfilter.value);
    if (this.ReportGroup.controls['ReportMachlol'].value == undefined) {
      this.ReportGroup.controls['ReportMachlol'].setValue('');
    }
    if (this.caseNumber == undefined) {
      this.caseNumber = "";
    }
    if (!this.ReportGroup.invalid) {
      this.waitToSaveBtn = true;
      this.http
        .post("http://srv-apps-prod/RCF_WS/WebService.asmx/AddUpdateReport", {
          _report: this.ReportGroup.getRawValue(),
          _userName: this.UserName,
          _caseNumber: this.caseNumber,
          _reportType: this.reportType,
          _ifGeneral: this.ifGeneral,
          _AdminNurse: this.AdminNurse,
          _Patient_DobGender: this.dob + ' ' + this.gender
        })
        .subscribe((Response) => {
          if (Response["d"] != 0) {
            if (autosave == '0') {
              this.openSnackBar("נשמר בהצלחה");
              this.Dept_Name = "";
              this.departmentfilter.setValue('');
              this.ngOnInit();
            }
            else {
              this.openSnackBar("נשמר בהצלחה");
              this.ReportGroup.controls['Row_ID'].setValue(Response["d"]);
            }
            this.waitToSaveBtn = false;
          } else {
            this.openSnackBar("משהו השתבש, לא נשמר");
          }
        });
    } else {
      this.openSnackBar("שכחת אחד השדות");
    }
  }

  deleteReport(reportID) {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/DeleteReport", {
        _reportID: reportID
      })
      .subscribe((Response) => {
        if (Response["d"] == "success") {
          this.openSnackBar("דווח נמחק בהצלחה");
          this.searchReports();
        } else {
          this.openSnackBar("משהו השתבש, לא נמחק");
        }
      });
  }

  autoDate(amin) {
    if (amin == true) {
      this.ReportGroup.controls['ReportStatus'].setValue('לטיפול');
    } else if (amin == false) {
      this.ReportGroup.controls['ReportStatus'].setValue('טופל');
    } else {
      if (amin.value == "לטיפול") {
        this.ReportGroup.controls['toContinue'].setValue(true);
      } else {
        this.ReportGroup.controls['toContinue'].setValue(false);
      }
    }
  }

  onSubmit(autosave) {
    this.sendReport(autosave);
  }



}