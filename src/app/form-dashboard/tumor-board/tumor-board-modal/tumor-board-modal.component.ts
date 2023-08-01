import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PatientDetails, TumorBoardForm } from '../Tumor-data';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tumor-board-modal',
  templateUrl: './tumor-board-modal.component.html',
  styleUrls: ['./tumor-board-modal.component.css']
})
export class TumorBoardModalComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = "start";
  verticalPosition: MatSnackBarVerticalPosition = "bottom";
  formControl = new FormControl(['']);
  users = [];
  doctors = [];
  filteredDoctors: Observable<string[]>;
  @ViewChild('doctorsInput') doctorsInput: ElementRef<HTMLInputElement>;

  constructor(public dialog: MatDialogRef<TumorBoardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public DataDialog: any,
    private fb: FormBuilder,
    private http: HttpClient,
    private _snackBar: MatSnackBar) {
    this.filteredDoctors = this.formControl.valueChanges.pipe(
      startWith(null),
      map((doctor: string | null) => (doctor ? this._filter(doctor) : this.users.slice())),
    );
  }

  url = environment.url;

  selectable = true;
  removable = true;
  patientGroup: FormGroup;
  fullForm: FormGroup;
  all_doctors_filter = [];
  pipe = new DatePipe('en-US');
  myDate = new Date();

  ngOnInit(): void {
    let patient: PatientDetails;
    let form: TumorBoardForm;
    if (this.DataDialog.PatientDetails == undefined) {
      // edit
      this.editFormFunc(this.DataDialog.data);
    } else {
      // new
      patient = this.DataDialog.PatientDetails;
      form = this.DataDialog.PatientDetails;
      this.patientGroup = this.fb.group({
        RowID: patient.RowID,
        Passport: patient.Passport,
        FirstName: patient.FirstName,
        LastName: patient.LastName,
        PhoneNumber: patient.PhoneNumber,
        CaseNumber: patient.CaseNumber,
        Address: patient.Address,
        DOB: patient.DOB,
      });

      this.fullForm = this.fb.group({
        RowID: form.RowID,
        DateOfForm: this.pipe.transform(this.myDate, 'yyyy-MM-dd'),
        TimeOfForm: this.pipe.transform(this.myDate, 'hh:mm'),
        OutSourceDoctors: form.OutSourceDoctors,
        ContentData: form.ContentData,
        Status: true
      });
    }
    this.getDoctorsList();
  }

  editFormFunc(data) {
    this.patientGroup = this.fb.group({
      RowID: data.PatientDetails.RowID,
      Passport: data.PatientDetails.Passport,
      FirstName: data.PatientDetails.FirstName,
      LastName: data.PatientDetails.LastName,
      PhoneNumber: data.PatientDetails.PhoneNumber,
      CaseNumber: data.PatientDetails.CaseNumber,
      Address: data.PatientDetails.Address,
      DOB: data.PatientDetails.DOB,
    });

    this.fullForm = this.fb.group({
      RowID: data.RowID,
      DateOfForm: this.pipe.transform(this.myDate, 'yyyy-MM-dd'),
      TimeOfForm: this.pipe.transform(this.myDate, 'hh:mm'),
      OutSourceDoctors: undefined,
      ContentData: data.ContentData,
      Status: true
    });
    this.DataDialog.data.OutSourceDoctors.forEach(x => {
      this.doctors.push({
        RowID: x.RowID,
        DoctorEmployeeIDFK: x.DoctorEmployeeIDFK,
        Employee_Id: "",
        email: "",
        Status: true
      });
    });
  }

  private _filter(value: any): string[] {
    let filterValue;
    if (value.DoctorEmployeeIDFK == undefined) {
      // string word
      filterValue = value.toLowerCase();
    } else {
      // json object
      filterValue = value.DoctorEmployeeIDFK.toLowerCase();
    }
    return this.users.filter(doctor => doctor.DoctorEmployeeIDFK.toLowerCase().includes(filterValue));
  }

  removeKeyword(keyword: any, index: number) {
    // const index = this.doctors.indexOf(keyword);
    // if (index >= 0) {
    //   this.doctors.splice(index, 1);
    // }
    this.doctors[index].Status = false;
    if (this.doctors[index].RowID == null) {
      delete this.doctors[index];
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      this.doctors.push({
        RowID: "",
        DoctorEmployeeIDFK: value,
        Employee_Id: "",
        email: "",
        Status: true
      });
    }

    // Clear the input value
    this.formControl.setValue(null);
    this.doctorsInput.nativeElement.value = '';
    // event.chipInput!.clear();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let element = event.option.value;
    this.doctors.push({
      RowID: "",
      DoctorEmployeeIDFK: element.DoctorEmployeeIDFK,
      Employee_Id: element.Employee_Id,
      email: element.email,
      Status: true
    });
    this.doctorsInput.nativeElement.value = '';
    this.formControl.setValue(null);
  }

  closeModal() {
    this.dialog.close();
  }

  openSnackBar(message) {
    this._snackBar.open(message, "X", {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  getDoctorsList() {
    this.http
      .post(this.url + "GetUsersForInquiries", {
      })
      .subscribe((Response) => {
        this.all_doctors_filter = Response["d"];

        this.all_doctors_filter.forEach(element => {
          this.users.push({
            RowID: "",
            DoctorEmployeeIDFK: element.firstname + " " + element.lastname,
            Employee_Id: element.id,
            email: element.email,
            Status: true
          });
          // this.users.push(element.firstname + " " + element.lastname);
        })
      });
  }

  submitForm() {
    this.fullForm.controls['OutSourceDoctors'].setValue(this.doctors);
    // console.log(this.fullForm.value);
    this.http
      .post(this.url + "SaveTumorBoardForm", {
        _fullForm: this.fullForm.value,
        _patientDetails: this.patientGroup.value
      })
      .subscribe((Response) => {
        if (Response["d"]) {
          this.openSnackBar("נשמר בהצלחה");
          this.closeModal();
        } else {
          this.openSnackBar("משהו השתבש, לא נשמר");
        }
      });
  }

}
