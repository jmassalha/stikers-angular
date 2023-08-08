import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PatientDetails } from '../tumor-board/Tumor-data';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmationDialogService } from "../../confirmation-dialog/confirmation-dialog.service";
import { environment } from 'src/environments/environment';
import { BoneMarrowModalComponent } from './bone-marrow-modal/bone-marrow-modal.component';

@Component({
  selector: 'app-bone-marrow',
  templateUrl: './bone-marrow.component.html',
  styleUrls: ['./bone-marrow.component.css']
})
export class BoneMarrowComponent implements OnInit {


  horizontalPosition: MatSnackBarHorizontalPosition = "start";
  verticalPosition: MatSnackBarVerticalPosition = "bottom";

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private http: HttpClient,
    private router: Router,
    private _snackBar: MatSnackBar,
    private confirmationDialogService: ConfirmationDialogService) { }

  searchPatient: FormGroup;
  searchPatientProgressBar: boolean = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  TABLE_DATA = [];
  dataSource = new MatTableDataSource(this.TABLE_DATA);
  patientDetails: PatientDetails;
  @ViewChild('printmycontent') printmycontent: ElementRef;
  displayedColumns: string[] = [
    'delete', 'FormDate', 'Passport', 'PatientName', 'edit', 'print', 'namer'
  ];
  elementToPrint: any;
  loaderPdfNamer = false;
  pdfString: string = ``;

  ngOnInit(): void {
    this.searchPatient = this.fb.group({
      chooseID: ['1', null],
      Passport: ['', null],
      CaseNumber: ['', null]
    });
    this.getBoneMarrowList();
  }

  getBoneMarrowList() {
    this.http
      .post(environment.url + "GetAllBoneMarrowList", {
      })
      .subscribe((Response) => {
        this.TABLE_DATA = Response["d"];
        this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
        this.dataSource.paginator = this.paginator;
      });
  }

  getPatients() {
    let passport = this.searchPatient.controls['Passport'].value;

    this.searchPatientProgressBar = false;
    this.http
      .post(environment.url + "GetRecordAndPatients", {
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

  openFormDialog(PatientDetails) {
    let dialogRef = this.dialog.open(BoneMarrowModalComponent, {
      data: {
        PatientDetails
      },
      width: '80%'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getBoneMarrowList();
    });
  }

  printBoneMarrowForm(element) {
    this.elementToPrint = element;
    let that = this;
    setTimeout(function () {
      var style = "<style>p,mat-label,span{font-weight: bold;font-size: 18px;}h1{font-size: 12px;}.col-2{width: 20%;justify-content: center;}</style>";
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

  editFormDialog(data) {
    let dialogRef = this.dialog.open(BoneMarrowModalComponent, {
      data: {
        data
      },
      width: '80%'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getBoneMarrowList();
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

  deleteForm(formData) {
    this.confirmationDialogService
      .confirm("נא לאשר..", "האם אתה בטוח ...? ")
      .then((confirmed) => {
        console.log("User confirmed:", confirmed);
        if (confirmed) {
          this.http.post(environment.url + "DeleteBoneMarrowForm", {
            _formId: formData.Row_ID,
          }).subscribe((Response) => {
            this.openSnackBar("נמחק בהצלחה!");
            this.getBoneMarrowList();
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

  linkToNamer(data) {
    this.loaderPdfNamer = true;
    let CaseNumber = "";
    this.pdfString = `<!doctype html><html lang="he"><head><meta charset="utf-8"/><title>אספרציה מח עצם</title>
    <style>p,mat-label,span{font-weight: bold;font-size: 18px;}h1{font-size: 14px}.col-2{width: 16.66667%;justify-content: center;}.row{display: flex;border-style: outset;}</style>
    </head><body dir="rtl">
    <div class="d-none-desktop">
      <div class="d-none-desktop" dir="rtl">
          <div class="card-header border-bottomIn rel" style="text-align: center;">
              <img class="full-width" style="width: 100%;" src="c:\\pdf\\BoneMarrowForms\\covid_header.png" />
              <h1 class="text-center pos-abs-center"><u>אספרציה מח עצם</u></h1>
          </div>
          <div class="row" dir="rtl" style="display: flex;">
              <div class="col-12" style="width: 100%;text-align: center;float: right;">
                  <p>תאריך: `+ data.RecievingDate + `</p>
              </div>
          </div>
          <div class="col-2" style="float: right;">
                  <h5>מספר מקרה: <br>`+ data.PatientDetails.CaseNumber + `</h5>
              </div>
              <div class="col-2" style="float: right;">
                  <h5>ת.ז: <br>`+ data.PatientDetails.Passport + `</h5>
              </div>
              <div class="col-2" style="float: right;">
                  <h5>שם מלא: <br>`+ data.PatientDetails.FirstName + ` ` + data.PatientDetails.LastName + `</h5>
              </div>
              <div class="col-2" style="float: right;">
                  <h5>כתובת: <br>`+ data.PatientDetails.Address + `</h5>
              </div>
              <div class="col-2" style="float: right;">
                  <h5>תאריך לידה: <br>`+ data.PatientDetails.DOB + `</h5>
              </div>
              <div class="col-2" style="float: right;">
                  <h5>מס' טלפון: <br>`+ data.PatientDetails.PhoneNumber + `</h5>
              </div>`;
    if (data.RecievingType != '') this.pdfString += `
              <div class="col-12">
                  <div class="row">
                      <h1><u>התקבלה מח עצם:</u><br><p>`+ data.RecievingType + `</p></h1>
                  </div>
              </div>`;
    if (data.RedRow != '') this.pdfString += `<div class="col-12">
                  <div class="row">
                      <h1><u>שורה אדומה:</u><br><p>`+ data.RedRow + `</p></h1>
                  </div>
              </div>`;
    if (data.WhiteRow != '') this.pdfString += `<div class="col-12">
                  <div class="row">
                      <h1><u>שורה לבנה:</u><br>
                      <p>`+ data.WhiteRow + `</p></h1>
                  </div>
              </div>`;
    if (data.Eosinophils != '') this.pdfString += `<div class="col-12">
                  <div class="row">
                      <h1><u>אאוזינופילים:</u><br>
                      <p>`+ data.Eosinophils + `</p></h1>
                  </div>
              </div>`;
    if (data.Lymphocytes != '') this.pdfString += `<div class="col-12">
                  <div class="row">
                      <h1><u>לימפוציטים:</u><br>
                      <p>`+ data.Lymphocytes + `</p></h1>
                  </div>
              </div>`;
    if (data.PlasmaCells != '') this.pdfString += `<div class="col-12">
                  <div class="row">
                      <h1><u>תאי פלסמה:</u><br>
                      <p>`+ data.PlasmaCells + `</p></h1>
                  </div>
              </div>`;
    if (data.Megakaryocytes != '') this.pdfString += `<div class="col-12">
                  <div class="row">
                      <h1><u>מגקריוציטים:</u><br>
                      <p>`+ data.Megakaryocytes + `</p></h1>
                  </div>
              </div>`;
    if (data.IronPainting != '') this.pdfString += `<div class="col-12">
                  <div class="row">
                      <h1><u>צביעת ברזל:</u><br>
                      <p>`+ data.IronPainting + `</p></h1>
                  </div>
              </div>`;
    if (data.Summary != '') this.pdfString += `<div class="col-12">
                  <div class="row">
                      <h1><u>סיכום:</u><br>
                      <p>`+ data.Summary + `</p></h1>
                  </div>
              </div>`;
    this.pdfString += `<div class="col-12">
                  <div class="row text-center">
                      <h1><u>חתימת רופא:</u><br>
                      <p>`+ data.DoctorSign + `</p></h1>
                  </div>
              </div>
          </div>
      </div>
    </body></html>`;
    $("#loader_2").removeClass("d-none");
    // this.http.post("http://srv-ipracticom:8080/WebService.asmx/createBoneMarrowPdf", {
    this.http.post(environment.url + "createBoneMarrowPdf", {
      _patient: data.PatientDetails,
      html: this.pdfString,
      Catigory: "ZPO_BONMRW"
    }
    )
      .subscribe((Response) => {
        let that = this;
        setTimeout(() => {
          // that.http.post("http://srv-ipracticom:756/WebService.asmx/LinkPdfToPatientNamer", {
          that.http.post(environment.url + "LinkPdfToPatientNamer", {
            CaseNumber:
              data.PatientDetails.CaseNumber,
            FormID: data.Row_ID,
            Catigory: "ZPO_BONMRW",
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
                this.getBoneMarrowList();
              } else {
                that.openSnackBar("! משהו לא תקין");
              }
            });
        }, 1000);
      });
  }

  openSnackBar(message) {
    this._snackBar.open(message, "X", {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

}
