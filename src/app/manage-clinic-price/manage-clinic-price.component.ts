import { SelectionModel } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { map, startWith } from 'rxjs/operators';


export interface Department {
  Row_ID: string;
  DepartName: string;
  DepartNumber: string;
}
export interface Services {
  ServiceId: string;
  ServiceNumber: string;
  ServiceName: string;
  ServiceQuantity: string;
}
@Component({
  selector: 'app-manage-clinic-price',
  templateUrl: './manage-clinic-price.component.html',
  styleUrls: ['./manage-clinic-price.component.css']
})
export class ManageClinicPriceComponent implements OnInit {

  displayedColumns: string[] = ['code', 'name', 'quantity'];
  dataSource = new MatTableDataSource<Services>();

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  isLinear = false;
  selectV: string = "";
  now = new Date();
  date2: string;
  time2: string;
  detailsFormGroup: FormGroup;
  servicesFormGroup: FormGroup;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  constructor(public dialog: MatDialog,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private http: HttpClient,
    private _snackBar: MatSnackBar) { }

  PatientElement: any;
  ifEdit: number;
  versionSelection: string;
  genderText: string;
  departments: Department[] = [];
  searchPatient: FormGroup;
  deptChosen: boolean = false;
  searchingProgress: boolean = false;
  print: boolean = false;
  userDR: boolean = false;
  UserName = localStorage.getItem("loginUserName").toLowerCase();

  ngOnInit(): void {
    this.detailsFormGroup = this.fb.group({
      FirstName: ['', null],
      LastName: ['', null],
      PersonID: ['', null],
      DOB: ['', null],
      Gender: ['', null],
      PhoneNumber: ['', null],
      Email: ['', null],
      Address: ['', null],
    });
    this.servicesFormGroup = this.fb.group({
      DepartNumber: ['', Validators.required],
      DepartCode: ['', Validators.required],
    });
    this.searchPatientDetails();
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  searchPatientDetails() {
    let passport;
    if (this.ifEdit == 1) {
      passport = this.PatientElement.PersonID;
      this.http
        .post("http://localhost:64964/WebService.asmx/GetPatientDetailsFromClinicsDB", {
          _patientPassport: passport
        })
        .subscribe((Response) => {
          let mPersonalDetails = Response["d"];
          this.detailsFormGroup = this.fb.group({
            Row_ID: new FormControl(mPersonalDetails.Row_ID, null),
            FirstName: new FormControl(mPersonalDetails.PatientFirstName, null),
            LastName: new FormControl(mPersonalDetails.PatientLastName, null),
            PersonID: new FormControl(mPersonalDetails.PatientPersonID, null),
            DOB: new FormControl(mPersonalDetails.PatientDOB, null),
            Gender: new FormControl(mPersonalDetails.PatientGender, null),
            PhoneNumber: new FormControl(mPersonalDetails.PatientPhoneNumber, null),
            Email: new FormControl(mPersonalDetails.PatientEmail, null),
            Address: new FormControl(mPersonalDetails.PatientAddress, null),
          });
          this.detailsFormGroup.controls['FirstName'].disable();
          this.detailsFormGroup.controls['LastName'].disable();
          this.detailsFormGroup.controls['PersonID'].disable();
          this.detailsFormGroup.controls['DOB'].disable();
          this.detailsFormGroup.controls['Gender'].disable();
          this.detailsFormGroup.controls['PhoneNumber'].disable();
          this.detailsFormGroup.controls['Address'].disable();

          this.servicesFormGroup.controls['DepartNumber'].setValue(mPersonalDetails.PatientVersionsList[0].DepartNumber);
          this.searchServices();
        });
    } else {
      let mPersonalDetails = this.PatientElement;
      this.detailsFormGroup = this.fb.group({
        Row_ID: new FormControl(mPersonalDetails.Row_ID, null),
        FirstName: new FormControl(mPersonalDetails.PatientFirstName, null),
        LastName: new FormControl(mPersonalDetails.PatientLastName, null),
        PersonID: new FormControl(mPersonalDetails.PatientPersonID, null),
        DOB: new FormControl(mPersonalDetails.PatientDOB, null),
        Gender: new FormControl(mPersonalDetails.PatientGender, null),
        PhoneNumber: new FormControl(mPersonalDetails.PatientPhoneNumber, null),
        Email: new FormControl(mPersonalDetails.PatientEmail, null),
        Address: new FormControl(mPersonalDetails.PatientAddress, null),
      });
      this.detailsFormGroup.controls['FirstName'].disable();
      this.detailsFormGroup.controls['LastName'].disable();
      this.detailsFormGroup.controls['PersonID'].disable();
      this.detailsFormGroup.controls['DOB'].disable();
      this.detailsFormGroup.controls['Gender'].disable();
      this.detailsFormGroup.controls['PhoneNumber'].disable();
      this.detailsFormGroup.controls['Address'].disable();
    }
    this.getDepartments();
  }

  searchServices() {
    this.searchingProgress = true;
    let departNumber = this.servicesFormGroup.controls['DepartNumber'].value;
    let patientRowID = this.PatientElement.Row_ID;
    let recordVersion = this.versionSelection;
    if (departNumber == null || departNumber == "" || departNumber == undefined) {
      this.openSnackBar("עליך לבחור מחלקה");
    } else {
      this.http
        .post("http://localhost:64964/WebService.asmx/GetClinicsServices", {
          _departmentNumber: departNumber,
          _patientRowID: patientRowID,
          _recordVersion: recordVersion,
          _ifEdit: this.ifEdit,
        })
        .subscribe((Response) => {
          let relevantServices = [];
          relevantServices = Response["d"];
          var PatientsServicesList: any = this.fb.array([]);
          var ServiceItem;
          let ELEMENT_DATA = [];
          this.deptChosen = true;
          let departCode;
          for (let i = 0; i < relevantServices.length; i++) {
            departCode = relevantServices[0].DepartCode;
            ServiceItem = this.fb.group({
              ServiceId: [i, null],
              ServiceNumber: [{ value: relevantServices[i].ServiceNumber, disabled: true }, null],
              ServiceName: [{ value: relevantServices[i].ServiceName, disabled: true }, null],
              ServicePrice: [{ value: relevantServices[i].ServicePrice, disabled: true }, null],
              ServiceQuantity: [relevantServices[i].ServiceQuantity, Validators.required],
            });
            let serialNumber = {
              value: i,
              name: relevantServices[i].ServiceName
            }
            ELEMENT_DATA.push(serialNumber);
            PatientsServicesList.push(ServiceItem);
          }
          this.servicesFormGroup = this.fb.group({
            DepartNumber: departNumber,
            DepartCode: departCode,
            PatientsServicesList: PatientsServicesList
          });
          this.dataSource = new MatTableDataSource<Services>(ELEMENT_DATA);
          this.searchingProgress = false;
        });
    }

  }

  getDepartments() {
    this.http
      .post("http://localhost:64964/WebService.asmx/GetClinicsPricingDeparts", {
      })
      .subscribe((Response) => {
        let clinicsDeparts = [];
        clinicsDeparts = Response["d"];
        clinicsDeparts.forEach(element => {
          this.departments.push(element);
        })
      });
  }

  onSubmit() {
    if (!this.servicesFormGroup.invalid) {
      this.http
        .post("http://localhost:64964/WebService.asmx/SendTreatmentToReception", {
          _patientDetails: this.detailsFormGroup.getRawValue(),
          _serviceDetails: this.servicesFormGroup.getRawValue(),
          _ifEdit: this.ifEdit,
        })
        .subscribe((Response) => {
          let message = Response["d"];
          if (message == "Success") {
            this.openSnackBar("הצעת טיפול נשלחה בהצלחה");
            window.location.reload();
          } else if (message == "noServices") {
            this.openSnackBar("לא נשמר, לא נבחרו שירותים עבור המטופל");
          } else {
            this.openSnackBar("משהו השתבש, לא נשלח");
          }
        });
    } else {
      this.openSnackBar("לא בחרת שירותים עבור המטופל");
    }
  }



}
