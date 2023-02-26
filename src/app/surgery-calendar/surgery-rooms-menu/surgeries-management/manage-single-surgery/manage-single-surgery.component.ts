import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manage-single-surgery',
  templateUrl: './manage-single-surgery.component.html',
  styleUrls: ['./manage-single-surgery.component.css']
})
export class ManageSingleSurgeryComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  surgeonCtrl = new FormControl('');
  surgeonsList: any[] = [];
  filteredOptions: Observable<any[]>;
  surgeriesCtrl = new FormControl('');
  surgeriesList: any[] = [];
  filteredOptionssurgeries: Observable<any[]>;

  constructor(
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<ManageSingleSurgeryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  SurgeryFormGroup: FormGroup;
  SurgeryDepartments = [];


  ngOnInit(): void {
    this.getSurgeryDepartmentsList();
    this.buildFormGroup(this.data.action);
    this.filteredOptions = this.surgeonCtrl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.FirstName;
        return name ? this._filter(name as string) : this.surgeonsList.slice();
      }),
    );
    this.filteredOptionssurgeries = this.surgeriesCtrl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.S_SERVICE_VAL;
        return name ? this._filter2(name as string) : this.surgeriesList.slice();
      }),
    );
  }

  displayFnSurgery(surgery: any): string {
    return surgery && surgery.S_SERVICE_VAL ? surgery.S_SERVICE_VAL : '';
  }

  displayFnSurgeon(user: any): string {
    let fullName = user;
    if (user !== "") {
      fullName = user.FirstName + ' ' + user.LastName;
    }
    return fullName && fullName ? fullName : '';
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.surgeonsList.filter(option => option.FirstName.toLowerCase().includes(filterValue));
  }

  private _filter2(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.surgeriesList.filter(option => option.S_SERVICE_VAL.toLowerCase().includes(filterValue));
  }

  buildFormGroup(action) {
    if (action == "New") {
      this.SurgeryFormGroup = this.fb.group({
        SurgeryPatientDetails: this.fb.group({
          PM_PATIENT_ID: new FormControl('', Validators.required),
          PM_CASE_NUMBER: new FormControl('', null),
          PM_FIRST_NAME: new FormControl('', Validators.required),
          PM_LAST_NAME: new FormControl('', Validators.required),
          PM_PATIENT_GENDER: new FormControl('', null),
          PM_DOB: new FormControl('', null),
          PM_MOVE_DEPART_SEODE: new FormControl('', null)
        }),
        SurgeryRequestDepartments: this.fb.group({
          SD_Priority: new FormControl('', null),
          SD_ROW_ID: new FormControl('', null),
          S_DEPARTMENT: new FormControl('', null),
          S_DEPARTMENT_NAME: new FormControl('', null),
          S_DEPARTMENT_SHORT_DESC: new FormControl('', null)
        }),
        SurgeryServicesName: this.fb.group({
          S_CATALOG: new FormControl('', null),
          S_END_DATE: new FormControl('', null),
          S_ID: new FormControl('', null),
          S_PRIMARY_KEY: new FormControl('', null),
          S_ROW_ID: new FormControl('', null),
          S_SERVICE_VAL: new FormControl('', null),
          S_START_DATE: new FormControl('', null),
          S_SERVICE_DURATION: new FormControl('', null),
          S_SERVICE_DOC: new FormControl('', null)
        }),
        DoctorSurgeon: this.fb.group({
          DocLicence: new FormControl('', null),
          Email: new FormControl('', null),
          EmployeeID: new FormControl('', null),
          FirstName: new FormControl('', null),
          LastName: new FormControl('', null),
          RowID: new FormControl('', null),
        }),
        ArrivalDate: new FormControl('', Validators.required),
        ArrivalTime: new FormControl('', Validators.required),
        EndTime: new FormControl('', null),
      });
    } else {
      this.SurgeryFormGroup = this.fb.group({
        SurgeryPatientDetails: this.fb.group({
          PM_PATIENT_ID: new FormControl(this.data.event.SurgeryPatientDetails.PM_PATIENT_ID, Validators.required),
          PM_CASE_NUMBER: new FormControl(this.data.event.SurgeryPatientDetails.PM_CASE_NUMBER, null),
          PM_FIRST_NAME: new FormControl(this.data.event.SurgeryPatientDetails.PM_FIRST_NAME, Validators.required),
          PM_LAST_NAME: new FormControl(this.data.event.SurgeryPatientDetails.PM_LAST_NAME, Validators.required),
          PM_PATIENT_GENDER: new FormControl(this.data.event.SurgeryPatientDetails.PM_PATIENT_GENDER, null),
          PM_DOB: new FormControl(this.data.event.SurgeryPatientDetails.PM_DOB, null),
          PM_MOVE_DEPART_SEODE: new FormControl(this.data.event.SurgeryPatientDetails.PM_MOVE_DEPART_SEODE, null)
        }),
        SurgeryRequestDepartments: this.fb.group({
          SD_Priority: new FormControl(this.data.event.SurgeryRequestDepartments.SD_Priority, null),
          SD_ROW_ID: new FormControl(this.data.event.SurgeryRequestDepartments.SD_ROW_ID, null),
          S_DEPARTMENT: new FormControl(this.data.event.SurgeryRequestDepartments.S_DEPARTMENT, null),
          S_DEPARTMENT_NAME: new FormControl(this.data.event.SurgeryRequestDepartments.S_DEPARTMENT_NAME, null),
          S_DEPARTMENT_SHORT_DESC: new FormControl(this.data.event.SurgeryRequestDepartments.S_DEPARTMENT_SHORT_DESC, null)
        }),
        SurgeryServicesName: this.fb.group({
          S_CATALOG: new FormControl(this.data.event.SurgeryServicesName.S_CATALOG, null),
          S_END_DATE: new FormControl(this.data.event.SurgeryServicesName.S_END_DATE, null),
          S_ID: new FormControl(this.data.event.SurgeryServicesName.S_ID, null),
          S_PRIMARY_KEY: new FormControl(this.data.event.SurgeryServicesName.S_PRIMARY_KEY, null),
          S_ROW_ID: new FormControl(this.data.event.SurgeryServicesName.S_ROW_ID, null),
          S_SERVICE_VAL: new FormControl(this.data.event.SurgeryServicesName.S_SERVICE_VAL, null),
          S_START_DATE: new FormControl(this.data.event.SurgeryServicesName.S_START_DATE, null),
          S_SERVICE_DURATION: new FormControl(this.data.event.SurgeryServicesName.S_SERVICE_DURATION, null),
          S_SERVICE_DOC: new FormControl(this.data.event.SurgeryServicesName.S_SERVICE_DOC, null)
        }),
        DoctorSurgeon: this.fb.group({
          DocLicence: new FormControl(this.data.event.DoctorSurgeon.DocLicence, null),
          Email: new FormControl(this.data.event.DoctorSurgeon.Email, null),
          EmployeeID: new FormControl(this.data.event.DoctorSurgeon.EmployeeID, null),
          FirstName: new FormControl(this.data.event.DoctorSurgeon.FirstName, null),
          LastName: new FormControl(this.data.event.DoctorSurgeon.LastName, null),
          RowID: new FormControl(this.data.event.DoctorSurgeon.RowID, null),
        }),
        ArrivalDate: new FormControl(this.data.event.start, Validators.required),
        ArrivalTime: new FormControl(this.data.event.ArrivalTime, Validators.required),
        EndTime: new FormControl(this.data.event.EndTime, null),
      });
      this.surgeonCtrl.setValue(this.SurgeryFormGroup.controls['DoctorSurgeon'].value);
      this.surgeriesCtrl.setValue(this.SurgeryFormGroup.controls['SurgeryServicesName'].value);
    }
  }

  selectedRequestedDepartment(departmentRowID) {
    let department = this.SurgeryDepartments.filter(x => x.SD_ROW_ID == departmentRowID);
    delete department[0].__type;
    this.SurgeryFormGroup.controls['SurgeryRequestDepartments'].setValue(department[0]);
  }

  saveSurgeyDetails() {
    if (this.checkAutoCompleteSelection()) {
      this.SurgeryFormGroup.controls['DoctorSurgeon'].setValue(this.surgeonCtrl.value);
      this.SurgeryFormGroup.controls['SurgeryServicesName'].setValue(this.surgeriesCtrl.value);
      console.log(this.SurgeryFormGroup.value);
    }
  }

  checkAutoCompleteSelection() {
    if (this.surgeriesCtrl.value.S_ROW_ID == undefined) {
      this.openSnackBar("לבחור ניתוח מתוך הרשימה ולא הקלדה ידנית");
      return false;
    }
    if (this.surgeonCtrl.value.RowID == undefined) {
      this.openSnackBar("לבחור מנתח מתוך הרשימה ולא הקלדה ידנית");
      return false;
    }
    return true;
  }

  getSurgeryDepartmentsList() {
    this.http
      .post(environment.url + "GetSurgeriesServicesNames", {
      })
      .subscribe((Response) => {
        this.SurgeryDepartments = Response["d"].surgeryRequestDepartments;
        this.surgeriesList = Response["d"].surgeriesList;
        this.surgeonsList = Response["d"].surgeonsList;
      });
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

}
