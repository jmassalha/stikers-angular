import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
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
  selector: 'app-clinics-dashboard',
  templateUrl: './clinics-dashboard.component.html',
  styleUrls: ['./clinics-dashboard.component.css']
})
export class ClinicsDashboardComponent implements OnInit {

  displayedColumns: string[] = ['code', 'name', 'quantity'];
  dataSource = new MatTableDataSource<Services>();

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  isLinear = false;
  detailsFormGroup: FormGroup;
  servicesFormGroup: FormGroup;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) { }

  // myControl = new FormControl();
  departments: Department[] = [];
  genderText: string;
  // filteredOptions: Observable<Department[]>;

  searchPatient: FormGroup;
  patientFound: boolean = false;
  permission: boolean = false;
  deptChosen: boolean = false;
  searchingProgress: boolean = false;

  ngOnInit(): void {
    this.searchPatient = this.fb.group({
      chooseID: ['1', null],
      Passport: ['', null],
      CaseNumber: ['', null]
    });
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
      Depart: ['', Validators.required],
    });
    this.getDepartments();
    // this.filteredOptions = this.myControl.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => typeof value === 'string' ? value : value.name),
    //     map(name => name ? this._filter(name) : this.departments.slice())
    //   );
  }

  // displayFn(user: Department): string {
  //   return user && user.DepartName ? user.DepartName : '';
  // }

  // private _filter(name: string): Department[] {
  //   const filterValue = name.toLowerCase();
  //   return this.departments.filter(option => option.DepartName.toLowerCase().indexOf(filterValue) === 0);
  // }

  usersWithPermission(userName) {
    if (userName.toLowerCase() == "adahabre" ||
      userName.toLowerCase() == "jmassalha" ||
      userName.toLowerCase() == "samer") {
      this.permission = true;
    }
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  printClinicPrice() {
    window.print();
  }

  clearSearch() {
    this.searchPatient.controls['Passport'].setValue('');
    this.searchPatient.controls['CaseNumber'].setValue('');
    this.patientFound = false;
  }

  searchServices() {
    this.searchingProgress = true;
    let departNumber = this.servicesFormGroup.controls['Depart'].value;
    if (departNumber == null || departNumber == "" || departNumber == undefined) {
      this.openSnackBar("עליך לבחור מחלקה");
    } else {
      this.http
        .post("http://localhost:64964/WebService.asmx/GetClinicsServices", {
          _departmentNumber: departNumber,
        })
        .subscribe((Response) => {
          let relevantServices = [];
          relevantServices = Response["d"];
          var ServiceArray: any = this.fb.array([]);
          var ServiceItem;
          let ELEMENT_DATA = [];
          this.deptChosen = true;
          for (let i = 0; i < relevantServices.length; i++) {
            ServiceItem = this.fb.group({
              ServiceId: [i, null],
              ServiceNumber: [{ value: relevantServices[i].ServiceNumber, disabled: true }, null],
              ServiceName: [{ value: relevantServices[i].ServiceName, disabled: true }, null],
              ServiceQuantity: [0, Validators.required],
            });
            let serialNumber = {
              value: i,
              name: relevantServices[i].ServiceName
            }
            ELEMENT_DATA.push(serialNumber);
            ServiceArray.push(ServiceItem);
          }
          this.servicesFormGroup = this.fb.group({
            Depart: departNumber,
            ServiceArray: ServiceArray
          });
          this.dataSource = new MatTableDataSource<Services>(ELEMENT_DATA);
          this.searchingProgress = false;
        });
    }

  }

  searchPatientDetails() {
    let choose = this.searchPatient.controls['chooseID'].value;
    let passport = this.searchPatient.controls['Passport'].value;
    let caseNumber = this.searchPatient.controls['CaseNumber'].value;
    if (passport == "" && caseNumber == "") {
      this.openSnackBar("עליך להקליד מזהה מטופל");
    } else {
      this.http
        .post("http://localhost:64964/WebService.asmx/GetClinicsPatientDetails", {
          _choose: "1",
          _passport: passport,
          _caseNumber: caseNumber
        })
        .subscribe((Response) => {
          // ***** 30910740
          // ***** 0010739355
          let mPersonalDetails = Response["d"];
          if (mPersonalDetails.PersonID == null && choose == '1') {
            this.openSnackBar("מספר תעודת זהות לא נמצא");
          } else if (mPersonalDetails.PersonID == null && choose == '2') {
            this.openSnackBar("מספר מקרה לא נמצא");
          } else {
            this.detailsFormGroup = this.fb.group({
              Row_ID: new FormControl(mPersonalDetails.Row_ID, null),
              FirstName: new FormControl(mPersonalDetails.FirstName, null),
              LastName: new FormControl(mPersonalDetails.LastName, null),
              PersonID: new FormControl(mPersonalDetails.PersonID, null),
              DOB: new FormControl(mPersonalDetails.DOB, null),
              Gender: new FormControl(mPersonalDetails.Gender, null),
              PhoneNumber: new FormControl(mPersonalDetails.PhoneNumber, null),
              Email: new FormControl(mPersonalDetails.Email, null),
              Address: new FormControl(mPersonalDetails.Address, null),
            });

            if (this.detailsFormGroup.controls['Gender'].value == '1') {
              this.genderText = "זכר";
            } else if (this.detailsFormGroup.controls['Gender'].value == '2') {
              this.genderText = "נקבה";
            } else {
              this.genderText = "אחר";
            }
            this.patientFound = true;
            this.usersWithPermission(localStorage.getItem("loginUserName").toLowerCase());
          }
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
    console.log(this.detailsFormGroup.value);
    console.log(this.servicesFormGroup.getRawValue());
    // this.http
    //     .post("http://localhost:64964/WebService.asmx/SendTreatmentToReception", {
    //       _patientDetails: this.detailsFormGroup.value,
    //       _serviceDetails: this.servicesFormGroup.getRawValue(),
    //     })
    //     .subscribe((Response) => {
    //       let message = Response["d"];
    //       if(message == "success"){
    //         this.openSnackBar("הצעת טיפול נשלחה בהצלחה");
    //       }else{
    //         this.openSnackBar("משהו השתבש, לא נשלח");
    //       }
    //     });
  }

}
