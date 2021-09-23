import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from '@angular/material/dialog';
import { VisitorsRegistrationComponent } from '../visitors-monitoring/visitors-registration/visitors-registration.component';
import { DatePipe } from '@angular/common';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-visitors-monitoring',
  templateUrl: './visitors-monitoring.component.html',
  styleUrls: ['./visitors-monitoring.component.css']
})
export class VisitorsMonitoringComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  all_departments_array = [];
  all_visitors_array = [];
  ER_Occupancy = [];
  searchWord: string;
  hospitalBedsInUse: string;
  resparotriesCount: string;

  constructor(
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private confirmationDialogService: ConfirmationDialogService) { }


  Departmints = {
    departs: [],
    total: 0,
  };
  numberOfDays = 0;
  newDate: string;
  dateToDisplayString: string;
  loaded: boolean;

  ngOnInit(): void {
    this.loaded = false;
    this.searchWord = "";
    this.getAllDeparts();
    this.getAllCurrentVisitors();
  }

  openDialogToFill(departCode, Dept_Name) {
    let dialogRef = this.dialog.open(VisitorsRegistrationComponent, {});
    dialogRef.componentInstance.departCode = departCode;
    dialogRef.componentInstance.Dept_Name = Dept_Name;
  }

  getAllDeparts() {
    this.loaded = false;
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetVisitorsSystemDepartments", {
      })
      .subscribe((Response) => {
        this.all_departments_array = Response["d"];
        this.loaded = true;
      });
  }

  getAllCurrentVisitors() {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetAllCurrentVisitors", {
      })
      .subscribe((Response) => {
        this.all_visitors_array = Response["d"];
      });
  }

  unRegisterVisitor(patientCaseNumber, visitorName) {
    this.confirmationDialogService
      .confirm("נא לאשר..", "האם אתה בטוח ...? ")
      .then((confirmed) => {
        console.log("User confirmed:", confirmed);
        if (confirmed) {
          this.http
            .post("http://srv-apps/wsrfc/WebService.asmx/MarkAsHasVisitor", {
              _patientCaseNumber: patientCaseNumber,
              _visitorName: visitorName
            })
            .subscribe((Response) => {
              if (Response["d"] == "success") {
                this.openSnackBar("התבצע בהצלחה");
                this.getAllCurrentVisitors();
              } else {
                this.openSnackBar("משהו השתבש, לא נשמר");
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

  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

}
