import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
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


// export interface Priority {
//   value: string;
//   viewValue: string;
// }
export interface Status {
  value: string;
  viewValue: string;
}

export interface Shift {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-fill-report',
  templateUrl: './fill-report.component.html',
  styleUrls: ['./fill-report.component.css']
})
export class FillReportComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  // priority: Priority[] = [
  //   { value: 'רגיל', viewValue: 'רגיל' },
  //   { value: 'דחוף', viewValue: 'דחוף' },
  //   { value: 'בהול', viewValue: 'בהול' },
  // ];
  status: Status[] = [
    { value: 'לטיפול', viewValue: 'לטיפול' },
    { value: 'טופל', viewValue: 'טופל' },
  ];

  shift: Shift[] = [
    { value: 'בוקר', viewValue: 'בוקר' },
    { value: 'ערב', viewValue: 'ערב' },
    { value: 'לילה', viewValue: 'לילה' },
  ];

  pipe = new DatePipe('en-US');
  myDate = new Date();
  constructor(public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private confirmationDialogService: ConfirmationDialogService,) { }

  ReportGroup: FormGroup;
  all_departs_filter = [];
  subCategory = [];
  all_categories_filter = [];
  departmentfilter = new FormControl();
  filteredOptions2: Observable<string[]>;
  department = [];
  reportID: string;
  Dept_Name: string;
  firstName: string;
  lastName: string;
  UserName = localStorage.getItem("loginUserName").toLowerCase();
  all_report_management;
  date = this.pipe.transform(this.myDate, 'dd-MM-yyyy');
  date2: string;
  time2: string;
  automaticShift: string;
  creator: boolean;
  now = new Date();

  ngOnInit(): void {
    if(this.Dept_Name != ""){
      this.departmentfilter.setValue(this.Dept_Name);
    }
    this.ReportGroup = this.formBuilder.group({
      Row_ID: ['0', Validators.compose([Validators.required])],
      ReportTitle: ['', Validators.compose([Validators.required])],
      ReportMachlol: ['', Validators.compose([Validators.required])],
      ReportCategory: ['', Validators.compose([Validators.required])],
      ReportSubCategory: ['', Validators.compose([Validators.required])],
      // ReportPriority: ['', Validators.compose([Validators.required])],
      ReportStatus: ['', Validators.compose([Validators.required])],
      ReportShift: [{value:'',disabled:true},null],
      // ReportSchudledDate: ['', Validators.compose([Validators.required])],
      ReportText: ['', Validators.compose([Validators.required])],
      toContinue: [false, null],
    });
    if (this.reportID != "0") {
      this.getReportToUpdate();
    } else {
      // this.autoDate(false);
    }
    if((this.firstName != "" || this.lastName != "")&&(this.firstName != undefined || this.lastName != undefined)){
      this.ReportGroup.controls['ReportText'].setValue("דווח עבור מטופל ("+this.firstName+" "+this.lastName+"): ");
    }

    this.date2 = this.datePipe.transform(this.now, 'yyyy-MM-dd');
    this.time2 = this.datePipe.transform(this.now, 'HH:mm:ss');
    if(this.now.getHours() >= 7 && this.now.getHours() < 15){
      this.automaticShift = 'בוקר';
    }else if(this.now.getHours() >= 15 && this.now.getHours() < 23){
      this.automaticShift = 'ערב';
    }else{
      this.automaticShift = 'לילה';
    }
    this.ReportGroup.controls['ReportShift'].setValue(this.automaticShift);
    this.getCategories();
    this.getDeparts();
    this.filteredOptions2 = this.departmentfilter.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter2(value))
      );
  }

  private _filter2(value: string): string[] {
    const filterValue2 = value;
    return this.department.filter(option => option.Dept_Name.includes(filterValue2));
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  deleteReport(reportID) {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/DeleteReport", {
        _reportID: reportID
      })
      .subscribe((Response) => {
        if (Response["d"] == "success") {
          this.openSnackBar("דווח נמחק בהצלחה");
          this.dialog.closeAll();
        } else {
          this.openSnackBar("משהו השתבש, לא נמחק");
        }
      });
  }

  closeModal() {
    this.dialog.closeAll();
  }

  autoDate(amin) {
    if (amin) {
      // this.ReportGroup.controls['ReportSchudledDate'].setValue(null);
      // this.ReportGroup.controls['ReportSchudledDate'].setValidators(Validators.required);
      // this.ReportGroup.controls['ReportSchudledDate'].enable();
      this.ReportGroup.controls['ReportStatus'].setValue('לטיפול');
    } else {
      // this.ReportGroup.controls['ReportSchudledDate'].disable();
      // this.ReportGroup.controls['ReportSchudledDate'].setValue(this.myDate);
      this.ReportGroup.controls['ReportStatus'].setValue('טופל');
    }
  }

  sendReport() {
    // if (this.ReportGroup.controls['toContinue'].value == false) {
    //   this.ReportGroup.controls['ReportSchudledDate'].enable();
    //   this.ReportGroup.controls['ReportSchudledDate'].setValue(this.myDate);
    // }
    // this.ReportGroup.controls['ReportSchudledDate'].setValue(this.pipe.transform(this.ReportGroup.controls['ReportSchudledDate'].value, 'yyyy-MM-dd'));
    // this.ReportGroup.controls['ReportSchudledDate'].setValidators(null);
    this.ReportGroup.controls['ReportMachlol'].setValue(this.departmentfilter.value);

    if (!this.ReportGroup.invalid) {
      this.http
        .post("http://srv-apps/wsrfc/WebService.asmx/AddUpdateReport", {
          _report: this.ReportGroup.getRawValue(),
          _userName: this.UserName
        })
        .subscribe((Response) => {
          if (Response["d"] == "Success") {
            this.openSnackBar("נשמר בהצלחה");
            this.dialog.closeAll();
            window.location.reload();
          } else {
            this.openSnackBar("משהו השתבש, לא נשמר");
          }
        });
    } else {
      this.openSnackBar("שכחת אחד השדות");
    }
  }

  getDeparts() {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetNursesDeparts", {

      })
      .subscribe((Response) => {
        this.all_departs_filter = Response["d"];

        this.all_departs_filter.forEach(element => {
          this.department.push(element);
        })
      });
  }

  getReportToUpdate() {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetReportToUpdate", {
        _reportID: this.reportID
      })
      .subscribe((Response) => {
        this.all_report_management = Response["d"];
        // if(this.all_report_management.UserName == this.UserName){
          this.ReportGroup = this.formBuilder.group({
            Row_ID: new FormControl(this.all_report_management.Row_ID, null),
            ReportDate: new FormControl(this.all_report_management.ReportDate, null),
            // ReportSchudledDate: new FormControl(this.all_report_management.ReportSchudledDate, null),
            ReportSubCategory: new FormControl(this.all_report_management.ReportSubCategory, null),
            ReportMachlol: new FormControl(this.all_report_management.ReportMachlol, null),
            ReportStatus: new FormControl(this.all_report_management.ReportStatus, null),
            ReportCategory: new FormControl(this.all_report_management.ReportCategory, null),
            ReportShift: new FormControl({value:this.all_report_management.ReportShift,disabled: true}, null),
            ReportText: new FormControl(this.all_report_management.ReportText, null),
            ReportTitle: new FormControl(this.all_report_management.ReportTitle, null),
            // ReportPriority: new FormControl(this.all_report_management.ReportPriority, null),
            toContinue: new FormControl(this.all_report_management.toContinue, null),
          });
        // }else{
        //   this.ReportGroup = this.formBuilder.group({
        //     Row_ID: new FormControl(this.all_report_management.Row_ID, null),
        //     ReportDate: new FormControl({ value: this.all_report_management.ReportDate, disabled: true }, null),
        //     // ReportSchudledDate: new FormControl(this.all_report_management.ReportSchudledDate, null),
        //     ReportSubCategory: new FormControl({ value: this.all_report_management.ReportSubCategory, disabled: true }, null),
        //     ReportMachlol: new FormControl({ value: this.all_report_management.ReportMachlol, disabled: true }, null),
        //     ReportStatus: new FormControl(this.all_report_management.ReportStatus, null),
        //     ReportCategory: new FormControl({ value: this.all_report_management.ReportCategory, disabled: true }, null),
        //     ReportShift: new FormControl({ value: this.all_report_management.ReportShift, disabled: true }, null),
        //     ReportText: new FormControl({ value: this.all_report_management.ReportText, disabled: true }, null),
        //     ReportTitle: new FormControl({ value: this.all_report_management.ReportTitle, disabled: true }, null),
        //     ReportPriority: new FormControl({ value: this.all_report_management.ReportPriority, disabled: true }, null),
        //     toContinue: new FormControl(this.all_report_management.toContinue, null),
        //   });
        // }
        let ifEditable = false;
        let mishmeret = "";
        let reportDate = this.all_report_management.ReportDate.split(" ",1);//this.pipe.transform(this.all_report_management.ReportDate, 'dd/MM/yyyy');
        reportDate = reportDate[0];
        if(reportDate.length < 10){
          reportDate = "0"+reportDate;
        }
        let thisDate = this.pipe.transform(this.now, 'MM/dd/yyyy');
        let thisTime = this.pipe.transform(this.now, 'HH');

        if(parseInt(thisTime) > 14 && parseInt(thisTime) < 23){
          mishmeret = "ערב";
        }else if((parseInt(thisTime) > 22 && parseInt(thisTime) < 24) || (parseInt(thisTime) > 0 && parseInt(thisTime) < 7)){
          mishmeret = "לילה";
        }
        if(this.all_report_management.ReportShift == 'בוקר' && reportDate == thisDate && parseInt(thisTime) < 17 && parseInt(thisTime) > 6){
          ifEditable = true;
        }else if(this.all_report_management.ReportShift == 'ערב' && reportDate == thisDate && ((parseInt(thisTime) > 14 && parseInt(thisTime) < 24) || parseInt(thisTime) < 1) && mishmeret == 'ערב'){
          ifEditable = true;
        }else if(this.all_report_management.ReportShift == 'לילה' && (reportDate == thisDate || parseInt(reportDate.split('/')[0]) - parseInt(thisDate.split('/')[0]) == 1) && (parseInt(thisTime) < 9 || parseInt(thisTime) > 22) && mishmeret == 'לילה'){
          ifEditable = true;
        }

        if(this.all_report_management.UserName == this.UserName && reportDate == thisDate && ifEditable){
          this.creator = true;
        }else{
          this.creator = false;
        }
        if (this.ReportGroup.controls['toContinue'].value == 'False') {
          this.ReportGroup.controls['toContinue'].setValue(false);
          // this.ReportGroup.controls['ReportSchudledDate'].disable();
        } else {
          this.ReportGroup.controls['toContinue'].setValue(true);
        }
        this.departmentfilter.setValue(this.all_report_management.ReportMachlol);
      });
    this.getCategories();
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

  changeSubCategory(myselect: any) {
    console.log(myselect);
  }


  onSubmit() {
    this.sendReport();
  }

}
