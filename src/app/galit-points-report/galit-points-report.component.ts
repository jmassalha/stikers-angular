import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-galit-points-report',
  templateUrl: './galit-points-report.component.html',
  styleUrls: ['./galit-points-report.component.css']
})
export class GalitPointsReportComponent implements OnInit {


  constructor(public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private readonly changeDetectorRef: ChangeDetectorRef,) { }

    patient: any = "";
    caseNumber: any;

  ngOnInit(): void {
    this.caseNumber = "0010797410";
    this.getGalitReportPatient();
  }
  
  getGalitReportPatient() {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetGalitReportPatient", {
        _CaseNumber: this.caseNumber
      })
      .subscribe((Response) => {
        this.patient = Response["d"];
      });
  }

}
