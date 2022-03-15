import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogService } from 'src/app/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-nurses-reinforcement',
  templateUrl: './nurses-reinforcement.component.html',
  styleUrls: ['./nurses-reinforcement.component.css']
})
export class NursesReinforcementComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  displayedColumns: string[] = [
    'FirstName', 'LastName', 'DepartnentDescripton', 'CellNumber', 'FunctionDescription'
  ];
  displayedColumns2: string[] = [
    'FirstName', 'LastName', 'DepartnentDescripton', 'CellNumber', 'FunctionDescription'
  ];
  dataSource = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild(MatSort) sort1: MatSort;
  @ViewChild(MatSort) sort2: MatSort;
  UserName = localStorage.getItem("loginUserName").toLowerCase();
  Reinf_nurse: any = {
    name: '',
    number: '',
    dept: '',
    id: '',
    type: 'מבקש תגבור'
  }
  Reinf_emp: any = {
    name: '',
    number: '',
    dept: '',
    id: '',
    type: 'מתגבר'
  }
  HighlightRow: Number;
  HighlightRow2: Number;
  // phoneNumber: any;

  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<NursesReinforcementComponent>,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private confirmationDialogService: ConfirmationDialogService,) { }

  ngOnInit(): void {
    this.GetNursesList();
    this.getReinforcementStaffList();
    this.dataSource.paginator = this.paginator1;
    this.dataSource2.paginator = this.paginator2;
    this.dataSource.sort = this.sort1;
    this.dataSource2.sort = this.sort2;
  }

  closeModal() {
    this.dialogRef.close();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter2(event: Event) {
    const filterValue2 = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue2.trim().toLowerCase();
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  chooseReinfNurse(nurse, i) {
    this.Reinf_nurse.name = nurse.FirstName + ' ' + nurse.LastName;
    this.Reinf_nurse.number = nurse.CellNumber;
    this.Reinf_nurse.dept = nurse.DepartnentDescripton;
    this.Reinf_nurse.id = nurse.EmployeeID;
    this.HighlightRow = i;
  }

  chooseReinfEmployee(employee, i) {
    this.Reinf_emp.name = employee.FirstName + ' ' + employee.LastName;
    this.Reinf_emp.number = employee.CellNumber;
    this.Reinf_emp.dept = employee.DepartnentDescripton;
    this.Reinf_emp.id = employee.EmployeeID;
    this.HighlightRow2 = i;
  }

  GetNursesList() {
    let empId = '';
    let empFirstName = '';
    let empLastName = '';
    // let elective = this.searchEmployeesGroup.controls['Elective'].value;
    let on = '1';
    let medGrad = '';
    let phoneNumber = '';
    let department = '';
    let role = '';
    let sektor = '039';
    let workPlace = '';
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetEmployeesToUpdate", {
        _empId: empId,
        _empFirstName: empFirstName,
        _empLastName: empLastName,
        // _elective: elective,
        _on: on,
        _medGrad: medGrad,
        _phoneNumber: phoneNumber,
        _department: department,
        _role: role,
        _managerType: "",
        _sektor: sektor,
        _workPlace: workPlace,
      })
      .subscribe((Response) => {
        this.dataSource = new MatTableDataSource<any>(Response["d"]);
        this.dataSource.paginator = this.paginator1;
        this.dataSource.sort = this.sort1;
      });
  }

  getReinforcementStaffList() {
    // 870  039  001
    let empId = '';
    let empFirstName = '';
    let empLastName = '';
    // let elective = this.searchEmployeesGroup.controls['Elective'].value;
    let on = '1';
    let medGrad = '';
    let phoneNumber = '';
    let department = '';
    let role = '';
    let sektor = "'039','870','001'";
    let workPlace = '';
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetEmployeesToUpdate", {
        _empId: empId,
        _empFirstName: empFirstName,
        _empLastName: empLastName,
        // _elective: elective,
        _on: on,
        _medGrad: medGrad,
        _phoneNumber: phoneNumber,
        _department: department,
        _role: role,
        _managerType: "",
        _sektor: sektor,
        _workPlace: workPlace,
      })
      .subscribe((Response) => {
        this.dataSource2 = new MatTableDataSource<any>(Response["d"]);
        this.dataSource2.paginator = this.paginator2;
        this.dataSource2.sort = this.sort2;
      });
  }

  sendSms() {
    if (this.Reinf_nurse.name == "") {
      this.openSnackBar(" שכחת לבחור" + this.Reinf_nurse.type);
    } else if (this.Reinf_emp.name == "") {
      this.openSnackBar(" שכחת לבחור" + this.Reinf_emp.type);
    } else if (this.Reinf_emp.number.length != 10 || this.Reinf_nurse.number.length != 10) {
      this.openSnackBar("אחד ממספרי הטלפון לא תקין, לא ניתן לשלוח");
    } else {
      this.Reinf_emp.name = this.Reinf_emp.name.replace(/['"]+/g, '');
      this.Reinf_nurse.name = this.Reinf_nurse.name.replace(/['"]+/g, '');
      this.confirmationDialogService
        .confirm("נא לאשר..", "אתה עומד לשלוח סמס ...? ")
        .then((confirmed) => {
          console.log("User confirmed:", confirmed);
          if (confirmed) {
            this.http
              .post("http://srv-apps-prod/RCF_WS/WebService.asmx/SendSmsNursesRienforcement", {
                _nurse_reinf: this.Reinf_nurse,
                _emp_reinf: this.Reinf_emp
              })
              .subscribe((Response) => {
                if (Response["d"]) {
                  this.openSnackBar("נשלח בהצלחה");
                  this.dialog.closeAll();
                } else {
                  this.openSnackBar("תקלה, לא נשלח");
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
  }



}
