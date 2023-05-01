import { SelectionModel } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PatientDetails, TumorBoardDoctors, TumorBoardForm } from './Tumor-data';
import { TumorBoardModalComponent } from './tumor-board-modal/tumor-board-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmationDialogService } from "../../confirmation-dialog/confirmation-dialog.service";

@Component({
  selector: 'app-tumor-board',
  templateUrl: './tumor-board.component.html',
  styleUrls: ['./tumor-board.component.css']
})
export class TumorBoardComponent implements OnInit {

  @ViewChild('printmycontent') printmycontent: ElementRef;
  horizontalPosition: MatSnackBarHorizontalPosition = "start";
  verticalPosition: MatSnackBarVerticalPosition = "bottom";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchPatientProgressBar: boolean = true;
  searchPatient: FormGroup;
  patientDetails: PatientDetails;
  listOfForms = [];
  TABLE_DATA = [];
  elementToPrint: any;
  dataSource = new MatTableDataSource(this.TABLE_DATA);
  displayedColumns: string[] = [
    'delete', 'FormDate', 'Passport', 'PatientName', 'edit', 'print', 'namer'
  ];
  pdfString: string = ``;
  loaderPdfNamer = false;

  url = "http://srv-apps-prod/RCF_WS/WebService.asmx/";

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private http: HttpClient,
    private router: Router,
    private _snackBar: MatSnackBar,
    private confirmationDialogService: ConfirmationDialogService
  ) {

  }

  ngOnInit(): void {
    this.searchPatient = this.fb.group({
      chooseID: ['1', null],
      Passport: ['', null],
      CaseNumber: ['', null]
    });
    this.getTumorBoardList();
  }

  openSnackBar(message) {
    this._snackBar.open(message, "X", {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
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
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      data.PatientDetails['fullName'] = data.PatientDetails.FirstName + ' ' + data.PatientDetails.LastName;
      return data.PatientDetails.fullName.includes(filter);
    }
    // this.TABLE_DATA = this.TABLE_DATA.filter(x => x.includes(filterValue.trim().toLowerCase()));
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editFormDialog(data) {
    let dialogRef = this.dialog.open(TumorBoardModalComponent, {
      data: {
        data
      },
      width: '80%'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getTumorBoardList();
    });
  }

  deleteForm(formData) {
    this.confirmationDialogService
      .confirm("נא לאשר..", "האם אתה בטוח ...? ")
      .then((confirmed) => {
        console.log("User confirmed:", confirmed);
        if (confirmed) {
          this.http.post(this.url + "DeleteTumorBoardForm", {
            _formId: formData.RowID,
          }).subscribe((Response) => {
            this.getTumorBoardList();
          });
        } else {
        }
      })
      .catch(() =>
        console.log(
          "User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)"
        )
      );
  }

  openFormDialog(PatientDetails) {
    let dialogRef = this.dialog.open(TumorBoardModalComponent, {
      data: {
        PatientDetails
      },
      width: '80%'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getTumorBoardList();
    });
  }

  getPatients() {
    let passport = this.searchPatient.controls['Passport'].value;

    this.searchPatientProgressBar = false;
    this.http
      .post(this.url + "GetRecordAndPatients", {
        _patientPassport: passport
      })
      .subscribe((Response) => {
        this.searchPatientProgressBar = true;
        let details = Response["d"][0];
        this.patientDetails = {
          RowID: details.Row_ID,
          Passport: details.PatientPersonID,
          FirstName: details.PatientFirstName,
          LastName: details.PatientLastName,
          PhoneNumber: details.PatientPhoneNumber,
          CaseNumber: details.caseNumber,
          Address: details.PatientAddress,
          DOB: details.PatientDOB,
        }
        this.openFormDialog(this.patientDetails);
      });
  }

  getTumorBoardList() {
    this.http
      .post(this.url + "GetAllTumorBoardList", {
      })
      .subscribe((Response) => {
        this.TABLE_DATA = Response["d"];
        this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
        this.dataSource.paginator = this.paginator;
      });
  }

  doctorsPdfHtmlDivs(doctorsList) {
    let stringTest = ``;
    doctorsList.forEach((x, index) => {
      stringTest += `<div class="col" style="display: flex;margin-left: 40px;">
      <span>` + (index + 1) + `) ` + x.DoctorEmployeeIDFK + `</span>
    </div>`;
    });
    return stringTest;
  }

  linkToNamer(data) {
    this.loaderPdfNamer = true;
    let CaseNumber = "";
    this.pdfString = `<!doctype html><html lang="he"><head><meta charset="utf-8"/><title>ניטור החייאה</title>
    <style>p,mat-label,span{font-weight: bold;font-size: 18px;}.col-2{width: 20%;justify-content: center;}</style>
    </head><body dir="rtl">
    <div class="d-none-desktop" *ngIf="elementToPrint != undefined" #printmycontent>
      <div class="d-none-desktop" dir="rtl">
          <div class="card-header border-bottomIn rel" style="text-align: center;">
              <img class="full-width" style="width: 100%;" src="c:\\pdf\\TumorBoardForms\\covid_header.png" />
              <h1 class="text-center pos-abs-center"><u>Tumor Board Form</u></h1>
          </div>
          <div class="row" dir="rtl" style="display: flex;">
              <div class="col-6" style="width: 50%;text-align: center;">
                  <p>תאריך: `+ data.DateOfForm + `</p>
              </div>
              <div class="col-6" style="width: 50%;text-align: center;">
                  <p>שעה: `+ data.TimeOfForm + `</p>
              </div>
          </div>
          <div class="row" dir="rtl" style="display: flex;border-style: outset;">
              <div class="col-2">
                  <h5>מספר מקרה: `+ data.PatientDetails.CaseNumber + `</h5>
              </div>
              <div class="col-2">
                  <h5>ת.ז: `+ data.PatientDetails.Passport + `</h5>
              </div>
              <div class="col-2">
                  <h5>שם מלא: `+ data.PatientDetails.FirstName + ` ` + data.PatientDetails.LastName + `</h5>
              </div>
              <div class="col-2">
                  <h5>כתובת: `+ data.PatientDetails.Address + `</h5>
              </div>
              <div class="col-2">
                  <h5>תאריך לידה: `+ data.PatientDetails.DOB + `</h5>
              </div>
              <div class="col-2">
                  <h5>מס' טלפון: `+ data.PatientDetails.PhoneNumber + `</h5>
              </div>
          </div>
          <div class="row" dir="rtl" style="display: flex;">
              <div class="col-12">
                  <div class="row">
                      <h1><u>רשימת רופאים</u></h1>
                  </div>
                  <div class="row">
                  `+ this.doctorsPdfHtmlDivs(data.OutSourceDoctors) + `
                  </div>
              </div>
          </div>
          <div class="row" dir="rtl" style="display: flex;">
              <div class="col-12">
                  <div class="row">
                      <h1><u>תוכן הטופס:</u></h1>
                  </div>
                  <div class="row">
                      <p>`+ data.ContentData + `</p>
                  </div>
              </div>
          </div>
      </div>
  </div>
    </body></html>`;
    $("#loader_2").removeClass("d-none");
    this.http.post("http://srv-ipracticom:8080/WebService.asmx/createTumorBoardPdf", {
    // this.http.post("http://srv-apps-prod/RCF_WS/WebService.asmx/createTumorBoardPdf", {
      _tumorForm: data,
      html: this.pdfString,
      Catigory: "ZPO_TMRBRD"
    }
    )
      .subscribe((Response) => {
        let that = this;
        setTimeout(() => {
          that.http.post("http://srv-ipracticom:756/WebService.asmx/LinkPdfToPatientNamer", {
          // that.http.post("http://srv-apps-prod/RCF_WS/WebService.asmx/LinkPdfToPatientNamer", {
            CaseNumber:
              data.PatientDetails.CaseNumber,
            FormID: data.RowID,
            Catigory: "ZPO_TMRBRD",
            fileSource:
              Response["d"],
          }
          )
            .subscribe((Response) => {
              if (
                Response["d"] == "success") {
                $("#loader_2").addClass("d-none");
                that.openSnackBar("! נשמר בהצלחה לתיק מטופל בנמר");
                this.loaderPdfNamer = false;
                this.getTumorBoardList();
              } else {
                that.openSnackBar("! משהו לא תקין");
              }
            });
        }, 1000);

      });
  }

  printTumorBoardForm(element) {
    this.elementToPrint = element;
    let that = this;
    setTimeout(function () {
      var style = "<style>p,mat-label,span{font-weight: bold;font-size: 18px;}.col-2{width: 20%;justify-content: center;}</style>";
      var printContents = that.printmycontent.nativeElement.innerHTML;
      style = style + printContents;
      var w = window.open();
      w.document.write(style);
      setTimeout(() => {
        w.print();
        w.close();
      }, 500);
    }, 600);
  }

}
