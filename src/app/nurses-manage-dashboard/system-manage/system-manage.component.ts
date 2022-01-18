import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfirmationDialogService } from 'src/app/confirmation-dialog/confirmation-dialog.service';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import * as XLSX from 'xlsx';
export interface UsersData {
  name: string;
  id: number;
}
const ELEMENT_DATA: any[] = [];
@Component({
  selector: 'app-system-manage',
  templateUrl: './system-manage.component.html',
  styleUrls: ['./system-manage.component.css']
})
export class SystemManageComponent implements OnInit {

  displayedColumns: string[] = ['rowid', 'namerid', 'departname', 'numberofbeds', 'saveBtn'];
  dataSource = ELEMENT_DATA;

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  openDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'הוסף') {
        this.addRowData(result.data);
      } else if (result.event == 'עדכן') {
        this.updateRowData(result.data);
      } else if (result.event == 'מחק') {
        this.deleteRowData(result.data);
      }
    });
  }

  /*name of the excel-file which will be downloaded. */
  fileName = 'ExcelSheet.xlsx';

  exportexcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  addRowData(row_obj) {
    var d = new Date();
    this.dataSource.push({
      id: d.getTime(),
      number_of_beds: row_obj.number_of_beds
    });
    this.table.renderRows();
  }

  updateRowData(row_obj) {
    this.submitUpdateBeds(row_obj, '0');
  }

  deleteRowData(row_obj) {
    this.submitUpdateBeds(row_obj, '1');
    // this.dataSource = this.dataSource.filter((value,key)=>{
    //   return value.Row_ID != row_obj.Row_ID;
    // });
  }

  TABLE_DATA: any[] = [];
  UserName = localStorage.getItem("loginUserName").toLowerCase();
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  // dataSource = new MatTableDataSource(this.TABLE_DATA);
  @ViewChild('numberOfBeds') numberOfBeds: ElementRef;

  constructor(public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private confirmationDialogService: ConfirmationDialogService,) { }

  updateBedsGroup: FormGroup;
  updateNurseDept: FormGroup;
  // departmentfilter = new FormControl();
  nurseName = new FormControl();
  nurseDept = new FormControl();
  filteredOptions3: Observable<string[]>;
  // filteredOptions2: Observable<string[]>;
  filteredOptions: Observable<string[]>;
  // department = [];
  depts = [];
  employees = [];

  ngOnInit(): void {

    this.updateBedsGroup = this.formBuilder.group({
      RowID: ['', null],
      EmployeeID: ['', null],
      FirstName: ['', null],
      LastName: ['', null],
      DepartnentCode: ['', null],
      DepartnentDescripton: ['', null],
    });
    this.getDepartmentsToUpdateBeds();
    this.getEmployeesToUpdateDept();
    this.getDepartsForEmployees();
    this.filteredOptions = this.nurseName.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    this.filteredOptions3 = this.nurseDept.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter3(value))
      );
  }

  displayFn(user: any): string {
    return user && user.DepartnentDescripton ? user.DepartnentDescripton : '';
  }
  displayFn2(user2: any): string {
    let name;
    if (user2 != null) {
      name = user2.FirstName + " " + user2.LastName;
    }
    return user2 && name ? name : '';
  }

  private _filter(value: any): string[] {
    let filterValue2;
    if (value.EmployeeID == undefined) {
      filterValue2 = value;
    } else {
      filterValue2 = value.EmployeeID;
    }
    let empl: any = this.employees.filter(t => t.EmployeeID === filterValue2);
    if (empl.length > 0) {
      this.nurseDept.setValue(empl[0]);
      this.updateBedsGroup.controls['DepartnentCode'].setValue(this.nurseDept.value);
      this.updateBedsGroup.controls['RowID'].setValue(empl[0].RowID);
    }
    return this.employees.filter(option => option.FirstName.includes(filterValue2));
  }
  private _filter3(value: string): string[] {
    const filterValue3 = value;
    let empl: any = this.depts.filter(t => t.DepartnentCode === filterValue3);
    if (empl.length > 0) {
      this.nurseDept.setValue(empl[0]);
      this.updateBedsGroup.controls['DepartnentCode'].setValue(this.nurseDept.value);
    }
    return this.depts.filter(option => option.DepartnentDescripton.includes(filterValue3));
  }


  getDepartmentsToUpdateBeds() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetDepartmentsToUpdateBeds", {
      })
      .subscribe((Response) => {
        let all_departs_filter = Response["d"];
        this.dataSource = all_departs_filter;
      });
  }

  getEmployeesToUpdateDept() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetEmployeesToUpdateDept", {
      })
      .subscribe((Response) => {
        let all_employees_filter = Response["d"];
        all_employees_filter.forEach(element => {
          this.employees.push(element);
        })
      });
  }

  getDepartsForEmployees() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetDepartsForEmployees", {
      })
      .subscribe((Response) => {
        let all_departs_filter = Response["d"];

        all_departs_filter.forEach(element => {
          this.depts.push(element);
        })
      });
  }

  submitUpdateEmployee() {
    let deptCode = this.nurseDept.value.DepartnentCode;
    let employeeRowID = this.updateBedsGroup.controls['RowID'].value;
    if (deptCode != "") {
      this.http
        .post("http://srv-apps-prod/RCF_WS/WebService.asmx/SubmitUpdateEmployee", {
          _deptCode: deptCode,
          _employeeRowID: employeeRowID,
        })
        .subscribe((Response) => {
          if (Response["d"]) {
            this.openSnackBar("שינוי התבצע בהצלחה");
            this.getEmployeesToUpdateDept();
          }
          else {
            this.openSnackBar("משהו השתבש לא התבצע");
          }
        });
    } else {
      this.openSnackBar("נא לבחור עובד מהרשימה");
    }
  }

  test(event, rowID, v) {
    console.log(event.key);
  }

  submitUpdateBeds(row, ifDelete) {
    if (row.number_of_beds != "") {
      this.http
        .post("http://srv-apps-prod/RCF_WS/WebService.asmx/SubmitUpdateBeds", {
          _row_ID: row.Row_ID,
          _numberOfBeds: row.number_of_beds,
          _ifDelete: ifDelete
        })
        .subscribe((Response) => {
          if (Response["d"]) {
            this.openSnackBar("שינוי התבצע בהצלחה");
            this.ngOnInit();
          }
          else {
            this.openSnackBar("משהו השתבש לא התבצע");
          }
        });
    } else {
      this.openSnackBar("נא להכניס ערך");
    }
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

}
