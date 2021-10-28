import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfirmationDialogService } from 'src/app/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-system-manage',
  templateUrl: './system-manage.component.html',
  styleUrls: ['./system-manage.component.css']
})
export class SystemManageComponent implements OnInit {

  TABLE_DATA: any[] = [];
  UserName = localStorage.getItem("loginUserName").toLowerCase();
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  displayedColumns: string[] = ['rowid', 'namerid', 'departname', 'numberofbeds','saveBtn'];
  dataSource = new MatTableDataSource(this.TABLE_DATA);
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
  // nurseName = new FormControl();
  // nurseDept = new FormControl();
  // filteredOptions3: Observable<string[]>;
  // filteredOptions2: Observable<string[]>;
  // filteredOptions: Observable<string[]>;
  // department = [];
  // depts = [];
  // employees = [];

  ngOnInit(): void {

    this.updateBedsGroup = this.formBuilder.group({
      Row_ID: ['', null],
      Namer_ID: ['', null],
      Depart_Name: ['', null],
      Depts_For_Nurses_Dashboard: ['', null],
      number_of_beds: ['', null],
      RowID: ['', null],
      EmployeeID: ['', null],
      FirstName: ['', null],
      LastName: ['', null],
      DepartnentCode: ['', null],
      DepartnentDescripton: ['', null],
    });
    this.getDepartmentsToUpdateBeds();
    // this.getEmployeesToUpdateDept();
    // this.getDepartsForEmployees();
    // this.filteredOptions2 = this.departmentfilter.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this._filter2(value))
    //   );
    // this.filteredOptions = this.nurseName.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this._filter(value))
    //   );
    // this.filteredOptions3 = this.nurseDept.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this._filter3(value))
    //   );
  }

  // private _filter2(value: string): string[] {
  //   const filterValue1 = value;
  //   let depart: any = this.department.filter(t => t.Namer_ID === filterValue1);
  //   if (depart.length > 0) {
  //     this.updateBedsGroup.controls['number_of_beds'].setValue(depart[0].number_of_beds);
  //     this.updateBedsGroup.controls['Row_ID'].setValue(depart[0].Row_ID);
  //   }
  //   return this.department.filter(option => option.Depart_Name.includes(filterValue1));
  // }

  // private _filter(value: string): string[] {
  //   const filterValue2 = value;
  //   let empl: any = this.employees.filter(t => t.EmployeeID === filterValue2);
  //   if (empl.length > 0) {
  //     this.nurseDept.setValue(empl[0].DepartnentCode);
  //     this.updateBedsGroup.controls['DepartnentCode'].setValue(this.nurseDept.value);
  //     this.updateBedsGroup.controls['RowID'].setValue(empl[0].RowID);
  //   }
  //   return this.employees.filter(option => option.FirstName.includes(filterValue2));
  // }
  // private _filter3(value: string): string[] {
  //   const filterValue3 = value;
  //   let empl: any = this.depts.filter(t => t.DepartnentCode === filterValue3);
  //   if (empl.length > 0) {
  //     this.nurseDept.setValue(empl[0].DepartnentCode);
  //     this.updateBedsGroup.controls['DepartnentCode'].setValue(this.nurseDept.value);
  //   }
  //   return this.depts.filter(option => option.DepartnentDescripton.includes(filterValue3));
  // }


  getDepartmentsToUpdateBeds() {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetDepartmentsToUpdateBeds", {
      })
      .subscribe((Response) => {
        let all_departs_filter = Response["d"];
        this.dataSource = new MatTableDataSource<any>(all_departs_filter);
        // all_departs_filter.forEach(element => {
        //   this.department.push(element);
        // })
      });
  }

  // getEmployeesToUpdateDept() {
  //   this.http
  //     .post("http://srv-apps/wsrfc/WebService.asmx/GetEmployeesToUpdateDept", {
  //     })
  //     .subscribe((Response) => {
  //       let all_employees_filter = Response["d"];
  //       all_employees_filter.forEach(element => {
  //         this.employees.push(element);
  //       })
  //     });
  // }
  
  // getDepartsForEmployees() {
  //   this.http
  //     .post("http://srv-apps/wsrfc/WebService.asmx/GetDepartsForEmployees", {
  //     })
  //     .subscribe((Response) => {
  //       let all_departs_filter = Response["d"];

  //       all_departs_filter.forEach(element => {
  //         this.depts.push(element);
  //       })
  //     });
  // }

  submitUpdateEmployee() {
    let deptCode = this.updateBedsGroup.controls['DepartnentCode'].value;
    let employeeRowID = this.updateBedsGroup.controls['RowID'].value;
    if (deptCode != "") {
      this.http
        .post("http://srv-apps/wsrfc/WebService.asmx/SufbmitUpdateEmployee", {
          _deptCode: deptCode,
          _employeeRowID: employeeRowID,
        })
        .subscribe((Response) => {
          if (Response["d"]) {
            this.openSnackBar("שינוי התבצע בהצלחה");
          }
          else {
            this.openSnackBar("משהו השתבש לא התבצע");
          }
        });
    } else {
      this.openSnackBar("נא לבחור עובד מהרשימה");
    }
  }

  test(event,rowID,v){
    console.log(event.key);
  }

  submitUpdateBeds(row_Id,numberOfBeds) {
    // let numberOfBeds = this.updateBedsGroup.controls['number_of_beds'].value;
    // let Row_ID = this.updateBedsGroup.controls['Row_ID'].value;
    if (numberOfBeds != "") {
      this.http
        .post("http://srv-apps/wsrfc/WebService.asmx/SubmitUpdateBeds", {
          _row_ID: row_Id,
          _numberOfBeds: numberOfBeds
        })
        .subscribe((Response) => {
          if (Response["d"]) {
            this.openSnackBar("שינוי התבצע בהצלחה");
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
