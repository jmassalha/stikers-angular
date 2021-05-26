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


export interface Priority {
  value: string;
  viewValue: string;
}
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

  priority: Priority[] = [
    { value: 'רגיל', viewValue: 'רגיל' },
    { value: 'דחוף', viewValue: 'דחוף' },
    { value: 'בהול', viewValue: 'בהול' },
  ];
  status: Status[] = [
    { value: 'חדש', viewValue: 'חדש' },
    { value: 'לא טופל', viewValue: 'לא טופל' },
    { value: 'בטיפול', viewValue: 'בטיפול' },
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
  UserName = localStorage.getItem("loginUserName").toLowerCase();
  all_report_management;
  date = this.pipe.transform(this.myDate, 'dd-MM-yyyy');

  ngOnInit(): void {
    this.ReportGroup = this.formBuilder.group({
      Row_ID: ['0', Validators.compose([Validators.required])],
      ReportTitle: ['', Validators.compose([Validators.required])],
      Reportmachlol: ['', Validators.compose([Validators.required])],
      ReportCategory: ['', Validators.compose([Validators.required])],
      ReportSubCategory: ['', Validators.compose([Validators.required])],
      ReportPriority: ['', Validators.compose([Validators.required])],
      ReportStatus: ['', Validators.compose([Validators.required])],
      ReportShift: ['', Validators.compose([Validators.required])],
      ReportSchudledDate: ['', null],
      ReportText: ['', Validators.compose([Validators.required])],
      toContinue: [false, null],
    });
    if (this.reportID != "0") {
      this.getReportToUpdate();
    }
    this.getDeparts();
    this.filteredOptions2 = this.departmentfilter.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter2(value))
      );
  }

  private _filter2(value: string): string[] {
    const filterValue2 = value;
    return this.department.filter(option => option.Depart_Name.includes(filterValue2));
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  deleteReport(reportID){
    this.http
    .post("http://localhost:64964/WebService.asmx/DeleteReport", {
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
    if (amin.checked) {
      this.ReportGroup.controls['ReportSchudledDate'].setValue(null);
      this.ReportGroup.controls['ReportSchudledDate'].setValidators(Validators.required);
    }
  }

  sendReport() {
    if (this.ReportGroup.controls['toContinue'].value == false && this.ReportGroup.controls['ReportSchudledDate'].value == null) {
      this.ReportGroup.controls['ReportSchudledDate'].setValue(this.myDate);
    } else {
      if (this.ReportGroup.controls['Row_ID'].value == '0') {
        this.ReportGroup.controls['ReportSchudledDate'].setValue(null);
      }
      this.ReportGroup.controls['ReportSchudledDate'].setValidators(Validators.required);
    }
    if (!this.ReportGroup.invalid) {
      this.http
        .post("http://localhost:64964/WebService.asmx/AddUpdateReport", {
          _report: this.ReportGroup.value,
          _userName: this.UserName
        })
        .subscribe((Response) => {
          if (Response["d"] == "Success") {
            this.openSnackBar("נשמר בהצלחה");
            this.dialog.closeAll();
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
      .post("http://localhost:64964/WebService.asmx/GetInquiryDeparts", {

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
      .post("http://localhost:64964/WebService.asmx/GetReportToUpdate", {
        _reportID: this.reportID
      })
      .subscribe((Response) => {
        this.all_report_management = Response["d"];
        this.ReportGroup = this.formBuilder.group({
          Row_ID: new FormControl(this.all_report_management.Row_ID, null),
          ReportDate: new FormControl(this.all_report_management.ReportDate, null),
          ReportSchudledDate: new FormControl(this.all_report_management.ReportSchudledDate, null),
          ReportSubCategory: new FormControl(this.all_report_management.ReportSubCategory, null),
          ReportMachlol: new FormControl(this.all_report_management.ReportMachlol, null),
          ReportStatus: new FormControl(this.all_report_management.ReportStatus, null),
          ReportCategory: new FormControl(this.all_report_management.ReportCategory, null),
          ReportShift: new FormControl(this.all_report_management.ReportShift, null),
          ReportText: new FormControl(this.all_report_management.ReportText, null),
          ReportTitle: new FormControl(this.all_report_management.ReportTitle, null),
          ReportPriority: new FormControl(this.all_report_management.ReportPriority, null),
          toContinue: new FormControl(this.all_report_management.toContinue, null),
        });
        if (this.ReportGroup.controls['toContinue'].value == 'False') {
          this.ReportGroup.controls['toContinue'].setValue(false);
        } else {
          this.ReportGroup.controls['toContinue'].setValue(true);
        }
        this.departmentfilter.setValue(this.all_report_management.ReportMachlol);
      });
    this.getCategories();
  }

  getCategories() {
    this.http
      .post("http://localhost:64964/WebService.asmx/GetCategories", {
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
