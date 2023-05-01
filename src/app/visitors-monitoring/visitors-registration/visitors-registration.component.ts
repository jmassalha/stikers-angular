import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'visitor-name-dialog',
  templateUrl: 'visitor-name-dialog.html',
})
export class VisitorNameDialog {

  constructor(
    public dialogRef: MatDialogRef<VisitorNameDialog>,
    @Inject(MAT_DIALOG_DATA) public data: string) { }

  visitorGroup: FormGroup;

  ngOnInit() {
    this.visitorGroup = new FormGroup({
      visitorName: new FormControl('', null)
    });
  }

  onNoClick(): void {
    this.dialogRef.close(this.visitorGroup.controls['visitorName'].value);
  }

}

@Component({
  selector: 'app-visitors-registration',
  templateUrl: './visitors-registration.component.html',
  styleUrls: ['./visitors-registration.component.css']
})
export class VisitorsRegistrationComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  displayedColumns2: string[] = ['firstname', 'dadname', 'lastname', 'gender', 'enterdate', 'entertime', 'visitorstatus'];
  dataSource2 = new MatTableDataSource<any>();

  applyFilter(event: Event, filval: string) {
    if (filval == '') {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource2.filter = filterValue;
    } else {
      this.dataSource2.filter = filval;
    }
  }

  constructor(public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private confirmationDialogService: ConfirmationDialogService) { }


  departCode: string;
  Dept_Name: string;
  visitorName: string;
  visitorStatus: string;
  loading: boolean;
  Patientsloading: boolean;
  patientsTable: boolean;
  departmentArray = [];
  ELEMENT_DATA = [];
  ELEMENT_DATA2 = [];
  date = new Date();
  myDate = this.datePipe.transform(this.date, 'yyyy-MM-dd');

  ngOnInit(): void {
    this.loading = true;
    this.patientsTable = false;
    this.Patientsloading = false;
    this.getPatientsPerDepart();
  }

  closeModal() {
    this.dialog.closeAll();
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }


  registerVisitor(patientCaseNumber, visitorStatus) {
    if (visitorStatus == '0' && (this.visitorName == "" || this.visitorName == undefined)) {
      this.openSnackBar("לא נשמר בלי שם מבקר");
    } else {
      this.confirmationDialogService
        .confirm("נא לאשר..", "האם אתה בטוח ...? ")
        .then((confirmed) => {
          console.log("User confirmed:", confirmed);
          if (confirmed) {
            this.http
              .post("http://srv-apps-prod/RCF_WS/WebService.asmx/MarkAsHasVisitor", {
                _patientCaseNumber: patientCaseNumber,
                _visitorName: this.visitorName
              })
              .subscribe((Response) => {
                if (Response["d"] == "success") {
                  this.openSnackBar("התבצע בהצלחה");
                } else {
                  this.openSnackBar("משהו השתבש, לא נשמר");
                }
                this.getPatientsPerDepart();
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
  }

  chooseWhatToDo(patientCaseNumber, visitorStatus) {
    if (visitorStatus != "1") {
      this.openDialog(patientCaseNumber, visitorStatus);
    } else {
      this.visitorName = " ";
      this.registerVisitor(patientCaseNumber, visitorStatus);
    }
  }

  openDialog(patientCaseNumber, visitorStatus): void {
    const dialogRef = this.dialog.open(VisitorNameDialog, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.visitorName = result;
      if (visitorStatus == "") {
        visitorStatus = "0";
      }
      this.registerVisitor(patientCaseNumber, visitorStatus);
    });
  }

  getPatientsPerDepart() {
    this.Patientsloading = true;
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetPatientsPerDepart", {
        _departCode: this.departCode
      })
      .subscribe((Response) => {
        this.dataSource2 = new MatTableDataSource<any>(Response["d"]);
        this.Patientsloading = false;
      });
  }

}
