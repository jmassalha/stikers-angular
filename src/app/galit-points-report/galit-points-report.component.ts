import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-galit-points-report',
  templateUrl: './galit-points-report.component.html',
  styleUrls: ['./galit-points-report.component.css']
})
export class GalitPointsReportComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  ELEMENT_DATA: any = [];
  displayedColumns: string[] = ['CaseNumber', 'DepartName', 'PM_ROOM_NUMBER', 'PatientFirstName', 'PatientLastName', 'PM_PATIENT_GENDER', 'DatesInHospital', 'AnotherHospital', 'ICD9Surgery', 'ICD9Anamniza', 'DifferenceInStayDays', 'AGE', 'Albomin', 'Norton', 'ThroughInput', 'Iv', 'HowToEat', 'DietType', 'TextureFood', 'Desctiption', 'BMI', 'MUST', 'STAMP', 'WieghtLoss','Points'];
  dataSource = this.ELEMENT_DATA;

  constructor(public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private readonly changeDetectorRef: ChangeDetectorRef,) { }

    // patient: any = "";
    // caseNumber: any;
    patientFound: boolean;

  ngOnInit(): void {
    // this.caseNumber = "";
    this.patientFound = true;
    this.getGalitReportPatient();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  // clearSearch() {
  //   this.caseNumber = "";
  //   this.patientFound = true;
  // }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  getGalitReportPatient() {
    this.patientFound = false;
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetGalitReportPatient", {
      })
      .subscribe((Response) => {
        this.ELEMENT_DATA = Response["d"];
        this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
        if(this.ELEMENT_DATA.length == 0){
          //no data
          this.openSnackBar("חסר נתונים, מרענן מחדש");
          let time = setTimeout(() => {
            if (this.router.url !== '/galitpointsreport') {
              clearTimeout(time);
            } else {
              this.getGalitReportPatient();
            }
          }, 3000);
        }
        this.patientFound = true;
      });
  }

}
