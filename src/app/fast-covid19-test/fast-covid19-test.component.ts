import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import * as uuid from 'uuid';
import { DomSanitizer } from '@angular/platform-browser';

export interface TestType {
  TestNumber: number;
  TestName: string;
}

export interface IdType {
  idCode: number;
  idType: string;
}

export interface Gender {
  genderCode: string;
  genderType: string;
}

export interface ResultTestCorona {
  TestNumber: number;
  TestName: string;
}

export interface City {
  cityName: string;
  cityCode: number;
}

export interface PlaceOfCollect {
  Name: string;
  code: number;
}

export interface Insurer {
  name: string;
  code: number;
}

export interface Origin {
  name: string;
  code: number;
}

export interface Type {
  TypeCode: number;
  TypeName: string;
}
interface MethodCodeGroup {
  MethodName: string;
  MethodNumber: string;
}

@Component({
  selector: 'app-fast-covid19-test',
  templateUrl: './fast-covid19-test.component.html',
  styleUrls: ['./fast-covid19-test.component.css']
})
export class FastCovid19TestComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';


  TestedTypeArray: TestType[] = [
    { TestNumber: 87334, TestName: 'בדיקת אנטיגן' },
    { TestNumber: 87333, TestName: 'בדיקת סופיה' },
    { TestNumber: 86110, TestName: 'בדיקת סרולוגיה' },
  ];

  IdTypeArray: IdType[] = [
    { idCode: 1, idType: 'ת"ז' },
    { idCode: 2, idType: 'דרכון' },
    { idCode: 3, idType: 'אחר' },
  ];

  GenderArray: Gender[] = [
    { genderCode: 'M', genderType: 'זכר' },
    { genderCode: 'F', genderType: 'נקבה' },
  ];

  ResultTestCoronaArray: ResultTestCorona[] = [
    { TestNumber: 3341, TestName: 'חיובי אנטיגן' },
    { TestNumber: 3340, TestName: 'שלילי אנטיגן' },
    // { TestNumber: 3331, TestName: 'חיובי סופיה' },
    // { TestNumber: 3330, TestName: 'שלילי סופיה' },
    // { TestNumber: 51, TestName: 'חיובי סרולוגיה' },
    // { TestNumber: 50, TestName: 'שלילי סרולוגיה' },
  ];

  MethodCodeArray: MethodCodeGroup[] = [
        { MethodNumber: "8733401", MethodName: 'Panbio' },
        { MethodNumber: "8733402", MethodName: 'SD Biosensor' },
        { MethodNumber: "8733403", MethodName: 'NoCheck' },
        { MethodNumber: "8733404", MethodName: 'Sofia' },
        { MethodNumber: "8733405", MethodName: 'Veritor' },
        { MethodNumber: "8733406", MethodName: 'Selignostics' },
        { MethodNumber: "8733407", MethodName: 'Certest' },
        { MethodNumber: "24", MethodName: 'PharmACT' },
        { MethodNumber: "25", MethodName: 'Diasorin FS' },
        { MethodNumber: "26", MethodName: 'ACON' }
  ];

  CitiesArray: City[] = [];

  PlaceOfCollectArray: PlaceOfCollect[] = [
    { code: 1, Name: 'דגימת בית' },
    { code: 2, Name: 'דרייב אין/עמדת בדיקות מהירות' },
    { code: 3, Name: 'מוסד' },
    { code: 4, Name: 'אירוע' },
    { code: 0, Name: 'אחר' },
  ];

  InsurerArray: Insurer[] = [
    { code: 101, name: 'כללית' },
    { code: 102, name: 'לאומית' },
    { code: 103, name: 'מכבי' },
    { code: 104, name: 'מאוחדת' },
    { code: 401, name: 'צה"ל' },
    { code: 402, name: 'שבס' },
    { code: 100, name: 'מבר' },
    { code: 999, name: 'אחר' },
  ];

  OriginArray: Origin[] = [
    { code: 4, name: 'בסופיה' },
    { code: 9, name: 'באנטיגן - דיגום פרטי' },
    // { code: 9, name: 'בסרולוגיה - דיגום פרטי' },
  ];

  TypeArray: Type[] = [
    { TypeCode: 1, TypeName: 'בית אבות/דיור מוגן' },
    { TypeCode: 2, TypeName: 'בית מלון' },
    { TypeCode: 3, TypeName: 'בית חולים גריאטרי' },
    { TypeCode: 4, TypeName: 'מעונות רווחה' },
    { TypeCode: 5, TypeName: 'גן' },
    { TypeCode: 6, TypeName: 'השכלה גבוהה' },
    { TypeCode: 7, TypeName: 'מוסד השכלה אחר' },
    { TypeCode: 8, TypeName: 'בית ספר' },
    { TypeCode: 9, TypeName: 'ישיבה' },
    { TypeCode: 0, TypeName: 'אחר' },
    { TypeCode: 40, TypeName: 'אולם אירועים' },
    { TypeCode: 41, TypeName: 'מתנ"ס' },
  ];



  pipe = new DatePipe('en-US');
  myDate = new Date();
  constructor(public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private confirmationDialogService: ConfirmationDialogService,
    private _sanitizer: DomSanitizer) { }

  myId = uuid.v4();
  TestsForm: FormGroup;
  caseNumber: string;
  all_cities_filter = [];
  subCategory = [];
  all_categories_filter = [];
  filteredOptions: Observable<City[]>;
  myControl = new FormControl('', Validators.required);
  department = [];
  UserName = localStorage.getItem("loginUserName").toLowerCase();
  all_report_management;
  date = this.pipe.transform(this.myDate, 'dd-MM-yyyy');
  date2: string;
  time2: string;
  creator: boolean;
  now = new Date();
  birthDate: string;
  userFullName: string;
  todaysDay: number = this.myDate.getDate()
  todaysMonth: number = this.myDate.getMonth()
  todaysYear: number = this.myDate.getFullYear()
  QRImage: any;
  ifQRCodeReady: boolean;

  ngOnInit(): void {
    this.getUserFullName();
    this.TestsForm = this.formBuilder.group({
      TransactionID: [this.myId, null],
      TestData: this.formBuilder.group({
        IDNum: ['', [Validators.required, Validators.pattern("[0-9 ]{1,9}")]],
        IdType: [1, Validators.required],
        FirstName: ['', Validators.required],
        LastName: ['', Validators.required],
        Gender: ['M', null],
        ResultTestCorona: [, Validators.required],
        Result: ['', null],
        MethodCode: ["8733405", Validators.required],
        MethodDesc: ['', null],
        TestedType: [87334, Validators.required],
        LabCode: [{ value: 36717, disabled: true }, Validators.required],
        LabDesc: ['בדיקות אנטיגן', Validators.required],
        BirthDate: this.formBuilder.group({
          Year: [, [Validators.required, Validators.max(this.todaysYear), Validators.min(1920)]],
          Month: [, [Validators.required, Validators.max(12), Validators.min(1)]],
          Day: [, [Validators.required, Validators.max(31), Validators.min(1)]],
        }),
      }),
      SampleData: this.formBuilder.group({
        SamplingTime: this.formBuilder.group({
          Year: [this.myDate.getFullYear(), Validators.required],
          Month: [this.myDate.getMonth() + 1, Validators.required],
          Day: [this.myDate.getDate(), Validators.required],
          Hour: [this.myDate.getHours(), Validators.required],
          Minutes: [this.myDate.getMinutes(), Validators.required],
          Seconds: [this.myDate.getSeconds(), Validators.required],
        }),
        Institute: this.formBuilder.group({
          Name: [{ value: 'אחר', disabled: true }, Validators.required],
          Type: [0, null],
          Code: ['', null],
        }),
        SenderName: [{ value: this.userFullName, disabled: true }, Validators.required],
        SenderIDnum: [{ value: this.UserName, disabled: true }, Validators.required],
        RequestID: ['', Validators.required],
        CityCode: ['', Validators.required],
        CityDesc: ['', Validators.required],
        StreetCode: [, null],
        StreetDesc: ['', null],
        HouseNumber: ['', null],
        Appartment: ['', null],
        PlaceOfCollect: [0, Validators.required],
        Tel1: ['', [Validators.required, Validators.pattern("[0-9 ]{9}")]],
        Insurer: [101, null],
        SupplierCode: [{ value: 36717, disabled: true }, Validators.required],
        SupplierDesc: [{ value: 'המרכז הרפואי ע"ש ברוך פדה, פוריה', disabled: true }, Validators.required],
        Origin: [9, Validators.required],
      })
    });
    let method = {
      MethodNumber: "8733405",
      MethodName: 'Veritor'
    };
    const name = this.MethodCodeArray.filter(option => option.MethodNumber.includes(method.MethodNumber));
    this.TestsForm.controls.TestData['controls']['MethodDesc'].setValue(name[0].MethodName);
    this.date2 = this.datePipe.transform(this.now, 'dd.MM.yyyy');
    this.time2 = this.datePipe.transform(this.now, 'HH:mm:ss');


    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.CitiesArray.slice())
      );
    this.getCityCodes();
  }

  displayFn(city: City): string {
    return city && city.cityName ? city.cityName : '';
  }

  private _filter(value: string): City[] {
    const filterValue = value.toLowerCase();
    return this.CitiesArray.filter(option => option.cityName.includes(filterValue));
  }

  changeCity(event) {
    this.TestsForm.controls.SampleData['controls']['CityCode'].setValue(event.cityCode);
    this.TestsForm.controls.SampleData['controls']['CityDesc'].setValue(event.cityName);
  }

  completeResultText(event) {
    this.TestsForm.controls.TestData['controls']['Result'].setValue(event.TestName);
  }

  displayFnMethod(city: MethodCodeGroup): string {
    return city && city.MethodName ? city.MethodName : '';
  }

  completeMethodText(event) {
    const filterValue = event;
    const name = this.MethodCodeArray.filter(option => option.MethodNumber.includes(filterValue));
    this.TestsForm.controls.TestData['controls']['MethodDesc'].setValue(name[0].MethodName);
    // this.TestsForm.controls.TestData['controls']['MethodCode'].setValue(name[0].MethodNumber);
  }

  checkBirthDateValidity() {
    if (this.TestsForm.controls.TestData['controls']['BirthDate'].controls.Year.value === this.todaysYear) {
      this.TestsForm.controls.TestData['controls']['BirthDate'].controls.Month.setValidators(Validators.max(this.todaysMonth + 1));
      this.TestsForm.controls.TestData['controls']['BirthDate'].controls.Day.setValidators(Validators.max(this.todaysDay));
    } else {
      this.TestsForm.controls.TestData['controls']['BirthDate'].controls.Month.setValidators(Validators.max(12));
      this.TestsForm.controls.TestData['controls']['BirthDate'].controls.Day.setValidators(Validators.max(31));
    }

  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  getUserFullName() {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetUserFullName", {
        _userName: this.UserName
      })
      .subscribe((Response) => {
        this.userFullName = Response["d"].FirstName + ' ' + Response["d"].LastName;
        this.TestsForm.controls.SampleData['controls']['SenderName'].setValue(this.userFullName);
      });
  }

  is_israeli_id_number() {
    let id = String(this.TestsForm.controls.TestData['controls']['IDNum'].value).trim();
    if (id.length > 9) return false;
    id = id.length < 9 ? ("00000000" + id).slice(-9) : id;
    return Array.from(id, Number).reduce((counter, digit, i) => {
      const step = digit * ((i % 2) + 1);
      return counter + (step > 9 ? step - 9 : step);
    }) % 10 === 0;
  }
  createQRFromApi(img){
    this.QRImage = "data:image/png;base64," + img;
    this.ifQRCodeReady = true;
  }
  sendReport() {
    if (!this.TestsForm.invalid) {
      this.TestsForm.controls.TestData['controls']['ResultTestCorona'].setValue(this.TestsForm.controls.TestData['controls']['ResultTestCorona'].value.TestNumber);
      this.confirmationDialogService
        .confirm("נא לאשר..", "האם אתה בטוח ...? ")
        .then((confirmed) => {
          console.log("User confirmed:", confirmed);
          if (confirmed) {
            this.http
              .post("http://srv-apps/wsrfc/WebService.asmx/SavePatientFastTestResult", {
                resultClass: this.TestsForm.getRawValue(),
              })
              .subscribe((Response) => {
                debugger
                if (Response["d"]) {
                  var json = JSON.parse(Response["d"]);
                  console.log(json);
                  var FastCoronaTestResponse = json["FastCoronaTestResponse"];
                  console.log(FastCoronaTestResponse["FastTest"]["QRCode"]);
                  this.createQRFromApi(FastCoronaTestResponse["FastTest"]["QRCode"])
                  // window.location.reload();
                } else {
                  this.openSnackBar("משהו השתבש, לא נשלח");
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
    } else {
      this.openSnackBar("אחד השדות לא תקין");
    }
  }

  getCityCodes() {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetCityCodes", {
      })
      .subscribe((Response) => {
        this.all_cities_filter = Response["d"];
        this.all_cities_filter.forEach(element => {
          this.CitiesArray.push({
            cityName: element.cityName,
            cityCode: parseInt(element.cityCode)
          });
        })
      });
  }

  getCategories() {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetCategories", {
      })
      .subscribe((Response) => {
        this.all_categories_filter = Response["d"];
        let lastIndex = this.all_categories_filter.length - 1;
        this.subCategory = this.all_categories_filter[lastIndex].SubCategory;
      });
  }

  onSubmit() {
    if (!this.is_israeli_id_number()) {
      this.openSnackBar("תעודת זהות לא תקינה");
    } else {
      this.TestsForm.controls.SampleData['controls']['SamplingTime'].controls.Year.setValue(this.myDate.getFullYear());
      this.TestsForm.controls.SampleData['controls']['SamplingTime'].controls.Month.setValue(this.myDate.getMonth() + 1);
      this.TestsForm.controls.SampleData['controls']['SamplingTime'].controls.Day.setValue(this.myDate.getDate());
      this.TestsForm.controls.SampleData['controls']['SamplingTime'].controls.Hour.setValue(this.myDate.getHours());
      this.TestsForm.controls.SampleData['controls']['SamplingTime'].controls.Minutes.setValue(this.myDate.getMinutes());
      this.TestsForm.controls.SampleData['controls']['SamplingTime'].controls.Seconds.setValue(this.myDate.getSeconds());
      this.sendReport();
    }
  }


  Finish() {
    window.location.reload();
  }


}
