import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-galit-points-report',
  templateUrl: './galit-points-report.component.html',
  styleUrls: ['./galit-points-report.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GalitPointsReportComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  ELEMENT_DATA: any = [];
  displayedColumns: string[] = ['CaseNumber', 'DepartName', 'PM_ROOM_NUMBER', 'PatientFirstName', 'PM_PATIENT_GENDER', 'DatesInHospital', 'ICD9Surgery', 'ICD9Anamniza', 'DifferenceInStayDays', 'AGE', 'Albomin', 'Norton', 'ThroughInput', 'HowToEat', 'DietType', 'TextureFood', 'Desctiption', 'BMI', 'MUST', 'WieghtLoss', 'Points'];
  dataSource = this.ELEMENT_DATA;
  dataSource2 = this.ELEMENT_DATA;
  @ViewChild('printmycontent') printmycontent: ElementRef;

  constructor(public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router,
    private http: HttpClient,
    private datePipe: DatePipe,
    private fb: FormBuilder) { }

  // patient: any = "";
  // caseNumber: any;
  patientFound: boolean;
  numberOfPatients: number = 0;
  departmentsArray = [];
  checked = false;
  fillteredDepartmentsArray = [];
  url = "http://srv-apps-prod/RCF_WS/WebService.asmx/";
  searchForm: FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    // this.caseNumber = "";
    this.patientFound = true;
    this.searchForm = this.fb.group({
      DateSearch: new FormControl({ value: '', disabled: true }, null),
      DepartmentSearch: new FormControl('', null)
    });
    this.getGalitReportPatient();
  }

  applyFilter(event: Event) {
    let filterValue;
    if (event == undefined) {
      filterValue = "";
    } else if (event.isTrusted == undefined) {
      filterValue = event;
    } else {
      filterValue = (event.target as HTMLInputElement).value;
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  print() {
    let that = this;
    that.paginator._changePageSize(300);
    setTimeout(function () {
      var style = "<style>button{background:none!important;border:0;} td.mat-cell{text-align: center;box-shadow: 0px 1px 0px 2px;background: white;transform: scaleY(1.0);}</style>"
      var printContents = that.printmycontent.nativeElement.innerHTML;
      style += printContents;
      var w = window.open();
      w.document.write(style);
      w.print();
      w.close();
      that.paginator._changePageSize(5);
    }, 1000);
  }

  saveReport() {
    this.http
      .post(this.url + "SaveGalitReport", {})
      .subscribe((Response) => {
        if (Response["d"]) {
          this.openSnackBar("נשמר בהצלחה");
        } else {
          this.openSnackBar("תקלה, לא נשמר");
        }
      });
  }


  getGalitReportPatient() {
    this.patientFound = false;
    let dateOfReport = "";
    if (this.checked) {
      dateOfReport = this.searchForm.controls['DateSearch'].value;
      dateOfReport = this.datePipe.transform(dateOfReport, 'yyyy-MM-dd');
    }
    let dept = this.searchForm.controls['DepartmentSearch'].value;
    let deptToSearch = "";
    for (let i = 0; i < dept.length; i++) {
      deptToSearch += "'" + dept[i] + "',";
    }
    deptToSearch = "(" + deptToSearch.slice(0,deptToSearch.length - 1) + ")";
    this.http
      .post(this.url + "GetGalitReportPatient", {
        _dateOfReport: dateOfReport,
        _departmentOfReport: deptToSearch
      })
      .subscribe((Response) => {
        this.ELEMENT_DATA = Response["d"];
        let fileteredArray = [];
        this.ELEMENT_DATA.forEach(element => {
          if (!fileteredArray.includes(element.DepartName)) {
            fileteredArray.push(element.DepartName);
            this.departmentsArray.push({
              name: element.DepartName,
              check: false
            });
          }
          if (parseInt(element.AGE) > 70) {
            element.Points++;
          } if (parseInt(element.DatesInHospital) > 8) {
            element.Points += 6;
          } if (element.AnotherHospital == "כן") {
            element.Points++;
          } if (element.ICD9Anamniza != "") {
            element.Points += 6;
          } if (element.ICD9Surgery != "") {
            element.Points += 0;
          } if (parseInt(element.DifferenceInStayDays) > 30) {
            element.Points++;
          } if (parseInt(element.Albomin) > 3) {
            element.Points += 6;
          } if (parseInt(element.Norton) < 14) {
            element.Points++;
          } if (element.ThroughInput != "רגילדרך הפה") {
            element.Points += 6;
          } if (element.Iv == "yes") {
            element.Points += 6;
          } if (element.HowToEat == "עזרה מלאה" || element.HowToEat == "עזרה חלקית") {
            element.Points += 4;
          } if (element.DietType != "רגילה") {
            element.Points += 0;
          } if (element.TextureFood != "רגיל") {
            element.Points += 0;
          } if (element.Desctiption != "") {
            element.Points += 6;
          } let bmi = element.BMI.split(" - ", 3)[2];
          if (parseInt(bmi) > 18.5) {
            element.Points += 2;
          } if (parseInt(element.MUST) > 2) {
            element.Points += 2;
          } if (parseInt(element.STAMP) > 4) {
            element.Points += 2;
          }
        });
        this.numberOfPatients = this.ELEMENT_DATA.length;
        this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // if (this.ELEMENT_DATA.length == 0) {
        //   //no data
        //   this.openSnackBar("חסר נתונים, מרענן מחדש");
        //   let time = setTimeout(() => {
        //     if (this.router.url !== '/galitpointsreport') {
        //       clearTimeout(time);
        //     } else {
        //       this.getGalitReportPatient();
        //     }
        //   }, 3000);
        // }
        this.patientFound = true;
      });
  }

}