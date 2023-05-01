import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogService } from "../../../../confirmation-dialog/confirmation-dialog.service";

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
  surgeryNotes: any[] = [];
  filteredOptionssurgeries: Observable<any[]>;

  constructor(
    public datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    public fb: FormBuilder,
    private confirmationDialogService: ConfirmationDialogService,
    public dialogRef: MatDialogRef<ManageSingleSurgeryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  SurgeryFormGroup: FormGroup;
  SurgeryDepartments = [];
  SurgeryRoomsList = [];
  patientsList = [{
    PM_ROW_ID: "",
    PM_CASE_NUMBER: "",
    PM_MOVE_DEPART_SEODE: "",
    PM_PATIENT_GENDER: "",
    PM_LAST_NAME: "",
    PM_FIRST_NAME: "",
    PM_DOB: "",
    PM_PATIENT_ID: "",
    RECORD_EXISTS: "",
    ArrivalDate: "",
  }];

  ngOnInit(): void {
    this.getSurgeryDepartmentsList();
    this.buildFormGroup(this.data.action);
    this.SurgeryRoomsList = this.data.event.RoomsList;
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
    delete surgery.__type;
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

    return this.surgeonsList.filter(option => option.FirstName.toLowerCase().includes(filterValue) || option.LastName.toLowerCase().includes(filterValue));
  }

  private _filter2(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.surgeriesList.filter(option => option.S_SERVICE_VAL.toLowerCase().includes(filterValue));
  }

  buildFormGroup(action) {
    if (action == "New") {
      this.SurgeryFormGroup = this.fb.group({
        SurgeryPatientDetails: this.fb.group({
          PM_ROW_ID: new FormControl('', null),
          PM_PATIENT_ID: new FormControl('', Validators.required),
          PM_CASE_NUMBER: new FormControl('', null),
          PM_FIRST_NAME: new FormControl('', Validators.required),
          PM_LAST_NAME: new FormControl('', Validators.required),
          PM_PATIENT_GENDER: new FormControl('', null),
          PM_DOB: new FormControl('', null),
          PM_MOVE_DEPART_SEODE: new FormControl('', null),
          RECORD_EXISTS: new FormControl('', null)
        }),
        SurgeryRequestDepartments: this.fb.group({
          SD_Priority: new FormControl('', null),
          SD_ROW_ID: new FormControl('', null),
          S_DEPARTMENT: new FormControl('', Validators.required),
          S_DEPARTMENT_NAME: new FormControl('', null),
          S_DEPARTMENT_SHORT_DESC: new FormControl('', null)
        }),
        SurgeryServicesName: this.fb.group({
          S_CATALOG: new FormControl('', null),
          S_END_DATE: new FormControl('', null),
          S_ID: new FormControl('', Validators.required),
          S_PRIMARY_KEY: new FormControl('', null),
          S_ROW_ID: new FormControl('', Validators.required),
          S_SERVICE_VAL: new FormControl('', Validators.required),
          S_START_DATE: new FormControl('', null),
          S_SERVICE_DURATION: new FormControl('', null),
          S_SERVICE_DOC: new FormControl('', null)
        }),
        DoctorSurgeon: this.fb.group({
          DocLicence: new FormControl('', null),
          Email: new FormControl('', null),
          EmployeeID: new FormControl('', null),
          FirstName: new FormControl('', Validators.required),
          LastName: new FormControl('', Validators.required),
          RowID: new FormControl('', Validators.required),
        }),
        AdditionalDetails: this.buildAdditionalFormGroupByDepartment(""),
        Row_ID: new FormControl(null, null),
        SurgeryNote: new FormControl('', null),
        ArrivalDate: new FormControl(this.data.event.start, Validators.required),
        ArrivalTime: new FormControl('', Validators.required),
        SurgeryRoom: new FormControl(this.data.event.SurgeryRoom, Validators.required),
        EndTime: new FormControl({ value: '', disabled: true }, null),
        LastUpdateUserName: new FormControl({ value: localStorage.getItem('loginUserName'), disabled: true }, null),
      });
    } else {
      this.SurgeryFormGroup = this.fb.group({
        SurgeryPatientDetails: this.fb.group({
          PM_ROW_ID: new FormControl(this.data.event.SurgeryPatientDetails.PM_ROW_ID, null),
          PM_PATIENT_ID: new FormControl(this.data.event.SurgeryPatientDetails.PM_PATIENT_ID, Validators.required),
          PM_CASE_NUMBER: new FormControl(this.data.event.SurgeryPatientDetails.PM_CASE_NUMBER, null),
          PM_FIRST_NAME: new FormControl(this.data.event.SurgeryPatientDetails.PM_FIRST_NAME, Validators.required),
          PM_LAST_NAME: new FormControl(this.data.event.SurgeryPatientDetails.PM_LAST_NAME, Validators.required),
          PM_PATIENT_GENDER: new FormControl(this.data.event.SurgeryPatientDetails.PM_PATIENT_GENDER, null),
          PM_DOB: new FormControl(this.data.event.SurgeryPatientDetails.PM_DOB, null),
          PM_MOVE_DEPART_SEODE: new FormControl(this.data.event.SurgeryPatientDetails.PM_MOVE_DEPART_SEODE, null),
          RECORD_EXISTS: new FormControl(this.data.event.SurgeryPatientDetails.RECORD_EXISTS, null)
        }),
        SurgeryRequestDepartments: this.fb.group({
          SD_Priority: new FormControl(this.data.event.SurgeryRequestDepartments.SD_Priority, null),
          SD_ROW_ID: new FormControl(this.data.event.SurgeryRequestDepartments.SD_ROW_ID, null),
          S_DEPARTMENT: new FormControl(this.data.event.SurgeryRequestDepartments.S_DEPARTMENT, Validators.required),
          S_DEPARTMENT_NAME: new FormControl(this.data.event.SurgeryRequestDepartments.S_DEPARTMENT_NAME, null),
          S_DEPARTMENT_SHORT_DESC: new FormControl(this.data.event.SurgeryRequestDepartments.S_DEPARTMENT_SHORT_DESC, null)
        }),
        SurgeryServicesName: this.fb.group({
          S_CATALOG: new FormControl(this.data.event.SurgeryServicesName.S_CATALOG, null),
          S_END_DATE: new FormControl(this.data.event.SurgeryServicesName.S_END_DATE, null),
          S_ID: new FormControl(this.data.event.SurgeryServicesName.S_ID, Validators.required),
          S_PRIMARY_KEY: new FormControl(this.data.event.SurgeryServicesName.S_PRIMARY_KEY, null),
          S_ROW_ID: new FormControl(this.data.event.SurgeryServicesName.S_ROW_ID, Validators.required),
          S_SERVICE_VAL: new FormControl(this.data.event.SurgeryServicesName.S_SERVICE_VAL, Validators.required),
          S_START_DATE: new FormControl(this.data.event.SurgeryServicesName.S_START_DATE, null),
          S_SERVICE_DURATION: new FormControl(this.data.event.SurgeryServicesName.S_SERVICE_DURATION, null),
          S_SERVICE_DOC: new FormControl(this.data.event.SurgeryServicesName.S_SERVICE_DOC, null)
        }),
        DoctorSurgeon: this.fb.group({
          DocLicence: new FormControl(this.data.event.DoctorSurgeon.DocLicence, null),
          Email: new FormControl(this.data.event.DoctorSurgeon.Email, null),
          EmployeeID: new FormControl(this.data.event.DoctorSurgeon.EmployeeID, null),
          FirstName: new FormControl(this.data.event.DoctorSurgeon.FirstName, Validators.required),
          LastName: new FormControl(this.data.event.DoctorSurgeon.LastName, Validators.required),
          RowID: new FormControl(this.data.event.DoctorSurgeon.RowID, Validators.required),
        }),
        AdditionalDetails: this.buildAdditionalFormGroupByDepartment(this.data.event.AdditionalDetails),
        Row_ID: new FormControl(this.data.event.Row_ID, Validators.required),
        SurgeryNote: new FormControl(this.data.event.SurgeryNote.Row_ID, null),
        ArrivalDate: new FormControl(this.data.event.start, Validators.required),
        ArrivalTime: new FormControl(this.data.event.ArrivalTime, Validators.required),
        SurgeryRoom: new FormControl(this.data.event.SurgeryRoom, Validators.required),
        EndTime: new FormControl({ value: this.data.event.EndTime, disabled: true }, null),
        LastUpdateUserName: new FormControl({ value: localStorage.getItem('loginUserName'), disabled: true }, null),
      });
      this.surgeonCtrl.setValue(this.SurgeryFormGroup.controls['DoctorSurgeon'].value);
      this.surgeriesCtrl.setValue(this.SurgeryFormGroup.controls['SurgeryServicesName'].value);
      this.calculateSurgeryDuration('endTime');
    }
    this.enableDisableSurgeryNameSelect();
  }

  buildAdditionalFormGroupByDepartment(details) {
    /*
    אף אוזן וגרון 11
    אורתופדיה 2
    כירורגיה 1
    אורולוגיה 8 
    פה ולסת 24
    טיפול נמרץ לב 16
    חדר לידה ??
    פלסטיקה 18
    נשים 13
    קרדיולוגיה 20
    כירורגיה חזה 38
    */
    let x: FormGroup;
    x = this.fb.group({
      LAP_OR_OPEN: new FormControl(details.LAP_OR_OPEN, null),
      SIDE: new FormControl(details.SIDE, null),
      LEYING_POSITION: new FormControl(details.LEYING_POSITION, null),
      ISOLATION: new FormControl(details.ISOLATION, null),
      BLOOD_BANK: new FormControl(details.BLOOD_BANK, null),
      NOTE: new FormControl(details.NOTE, null),
      TOOLS: new FormControl(details.TOOLS, null),
      ANESTHESIA: new FormControl(details.ANESTHESIA, null),
      DIMOT: new FormControl(details.DIMOT, null),
      HOSPITALIZATION: new FormControl(details.HOSPITALIZATION, null),
    });

    // switch (department.SD_ROW_ID) {
    //   case 11:
    //     x = this.fb.group({

    //     });
    //     break;
    //   case 2:
    //     x = this.fb.group({

    //     });
    //     break;
    //   case 1:
    //     x = this.fb.group({

    //     });
    //     break;
    //   case 8:
    //     x = this.fb.group({

    //     });
    //     break;
    //   case 24:
    //     x = this.fb.group({

    //     });
    //     break;
    //   case 16:
    //     x = this.fb.group({

    //     });
    //     break;
    //   case 0:
    //     x = this.fb.group({

    //     });
    //     break;
    //   case 18:
    //     x = this.fb.group({

    //     });
    //     break;
    //   case 13:
    //     x = this.fb.group({

    //     });
    //     break;
    //   case 20:
    //     x = this.fb.group({

    //     });
    //     break;
    //   case 38:
    //     x = this.fb.group({

    //     });
    //     break;
    // }
    return x;
  }

  selectedRequestedDepartment(departmentRowID) {
    let department = this.SurgeryDepartments.filter(x => x.S_DEPARTMENT == departmentRowID);
    delete department[0].__type;
    this.SurgeryFormGroup.controls['SurgeryRequestDepartments'].setValue(department[0]);
    // build the additional fields of the form by the requesting department
    this.buildAdditionalFormGroupByDepartment(department[0]);
    // get surgery names by requested department
    this.getSurgeriesByRequestedDepartment(department);
  }

  getSurgeriesByRequestedDepartment(department) {
    this.http
      .post(environment.url + "GetAllSurgeryServicesNameByRequestingDepartment", {
        _requestingDepartmentCode: department[0].S_DEPARTMENT
      })
      .subscribe((Response) => {
        this.surgeriesList = Response["d"];
        // update the surgery names list after getting a response
        this.filteredOptionssurgeries = this.surgeriesCtrl.valueChanges.pipe(
          startWith(''),
          map(value => {
            const name = typeof value === 'string' ? value : value?.S_SERVICE_VAL;
            return name ? this._filter2(name as string) : this.surgeriesList.slice();
          }),
        );
      });
  }

  selectedSurgeryRoom(surgeryRoomRowID) {
    this.SurgeryFormGroup.controls['SurgeryRoom'].setValue(surgeryRoomRowID);
  }

  selectedSurgeryServiceName() {
    if (this.surgeriesCtrl.value != "") {
      setTimeout(() => {
        this.SurgeryFormGroup.controls['SurgeryServicesName'].setValue(this.surgeriesCtrl.value);
        this.calculateSurgeryDuration('duration');
      }, 500);
    }
  }

  enableDisableSurgeryNameSelect() {
    if (this.SurgeryFormGroup.controls['ArrivalTime'].value == "" || this.SurgeryFormGroup.controls['ArrivalDate'].value == "" || this.SurgeryFormGroup.controls['ArrivalDate'].value == null) {
      this.surgeriesCtrl.disable();
    } else {
      this.surgeriesCtrl.enable();
    }
  }

  calculateSurgeryDuration(type) {
    let datefordiff = this.datePipe.transform(this.SurgeryFormGroup.value.ArrivalDate, 'yyyy-MM-dd');
    let before = new Date(datefordiff + ' ' + this.SurgeryFormGroup.value.ArrivalTime);
    let after = new Date(datefordiff + ' ' + this.SurgeryFormGroup.getRawValue().EndTime);
    if (type == 'endTime') {
      let diff = Math.abs(after.getTime() - before.getTime());//difference in time
      let hours = Math.floor((diff % 86400000) / 3600000);//hours
      let minutes = Math.round(((diff % 86400000) % 3600000) / 60000);//minutes
      this.SurgeryFormGroup.controls['SurgeryServicesName']['controls'].S_SERVICE_DURATION.setValue(hours + '.' + minutes);
    } else {
      let duration = this.SurgeryFormGroup.value.SurgeryServicesName.S_SERVICE_DURATION;
      after.setTime(before.getTime() + (duration * 60 * 60 * 1000));
      this.SurgeryFormGroup.controls['EndTime'].setValue(this.datePipe.transform(after, 'HH:mm'));
    }
  }

  checkIfPatientExists() {
    if (this.SurgeryFormGroup.value.SurgeryPatientDetails.PM_PATIENT_ID == "") {
      this.openSnackBar("לא הקלדת ת.ז של מטופל");
    } else {
      this.http
        .post(environment.url + "GetSurgeryCalendarPatientDetailsByIdNumber", {
          IDNumber: this.SurgeryFormGroup.value.SurgeryPatientDetails.PM_PATIENT_ID
        })
        .subscribe((Response) => {
          this.patientsList = Response["d"];
          if (this.patientsList.length == 0) {
            this.openSnackBar("מטופל לא נמצא, הקלד ידנית");
          } else {
            let patientDetails = {
              PM_ROW_ID: this.patientsList[0].PM_ROW_ID,
              PM_CASE_NUMBER: this.patientsList[0].PM_CASE_NUMBER,
              PM_MOVE_DEPART_SEODE: this.patientsList[0].PM_MOVE_DEPART_SEODE,
              PM_PATIENT_GENDER: this.patientsList[0].PM_PATIENT_GENDER,
              PM_LAST_NAME: this.patientsList[0].PM_LAST_NAME,
              PM_FIRST_NAME: this.patientsList[0].PM_FIRST_NAME,
              PM_DOB: this.patientsList[0].PM_DOB,
              PM_PATIENT_ID: this.patientsList[0].PM_PATIENT_ID,
              RECORD_EXISTS: this.patientsList[0].RECORD_EXISTS,
            }
            this.SurgeryFormGroup.controls['SurgeryPatientDetails'].setValue(patientDetails);
          }
        });
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
        // get the requested departments list only if its new or the day is empty of surgeries

        // get the surgeries by the department code on edit view
        if (this.data.event.SurgeryRequestDepartments != undefined) {
          this.SurgeryDepartments = [this.data.event.SurgeryRequestDepartments];
          this.selectedRequestedDepartment(this.data.event.SurgeryRequestDepartments.S_DEPARTMENT);
        } else {
          this.SurgeryDepartments = Response["d"].surgeryRequestDepartments;
        }
        this.surgeonsList = Response["d"].surgeonsList;
        this.surgeryNotes = Response["d"].surgeriesFixedNotes;
      });
  }

  saveSurgeryDetails() {
    try {
      this.SurgeryFormGroup.controls['DoctorSurgeon'].setValue(this.surgeonCtrl.value);
      // this.SurgeryFormGroup.controls['SurgeryServicesName'].setValue(this.surgeriesCtrl.value);
      this.SurgeryFormGroup.controls['ArrivalDate'].setValue(this.datePipe.transform(this.SurgeryFormGroup.value.ArrivalDate, 'yyyy-MM-dd'));
    } catch (err) {
      this.openSnackBar("שדות לא מולאו");
    }
    if (this.checkAutoCompleteSelection() && !this.SurgeryFormGroup.invalid) {
      this.confirmationDialogService
        .confirm("נא לאשר..", "האם אתה בטוח ...? ")
        .then((confirmed) => {
          console.log("User confirmed:", confirmed);
          if (confirmed) {
            this.http
              .post(environment.url + "SubmitNewOrUpdateCalendarSurgeryRecord", {
                surgeryFormData: this.SurgeryFormGroup.getRawValue()
              })
              .subscribe((Response) => {
                if (Response["d"] == "Saved") {
                  this.openSnackBar("נשמר בהצלחה");
                  this.dialogRef.close(Response["d"]);
                } else if (Response["d"] == "Exists") {
                  this.openSnackBar("לא נשמר, מתוכנן ניתוח באותו מקום באותו זמן");
                } else {
                  this.openSnackBar("משהו השתבש, לא נשמר!");
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

    } else {
      this.openSnackBar("שכחת למלא שדה חובה");
    }
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

}
