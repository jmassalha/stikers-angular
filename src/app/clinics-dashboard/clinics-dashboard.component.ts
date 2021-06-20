import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
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
export interface Patient {
  PersonID: string;
  LastName: string;
  FirstName: string;
  PatientAddress: string;
  Email: string;
  Gender: string;
  PhoneNumber: string;
  DOB: string;
  TotalPrice: string;
}

@Component({
  selector: 'app-clinics-dashboard',
  templateUrl: './clinics-dashboard.component.html',
  styleUrls: ['./clinics-dashboard.component.css']
})
export class ClinicsDashboardComponent implements OnInit {

  displayedColumns: string[] = ['code', 'name', 'quantity'];
  displayedColumns2: string[] = ['code', 'name', 'quantity', 'price','total'];
  dataSource = new MatTableDataSource<Services>();
  dataSource2 = new MatTableDataSource<Services>();

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  isLinear = false;
  detailsFormGroup: FormGroup;
  detailsFormGroup2: Patient;
  servicesFormGroup: FormGroup;
  now = new Date();
  date2: string;
  time2: string;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ELEMENT_DATA = [];

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
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
  print: boolean = false;

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
      DepartNumber: ['', Validators.required],
      DepartCode: ['', Validators.required],
    });
    this.date2 = this.datePipe.transform(this.now, 'yyyy-MM-dd');
    this.time2 = this.datePipe.transform(this.now, 'HH:mm:ss');
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
    if (//userName.toLowerCase() == "adahabre" ||
      userName.toLowerCase() == "jmassalha" ||
      userName.toLowerCase() == "samer") {
      return true;
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
    let departNumber = this.servicesFormGroup.controls['DepartNumber'].value;
    if (departNumber == null || departNumber == "" || departNumber == undefined) {
      this.openSnackBar("עליך לבחור מחלקה");
    } else {
      this.http
        .post("http://srv-apps/wsrfc/WebService.asmx/GetClinicsServices", {
          _departmentNumber: departNumber,
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
              ServiceQuantity: [0, Validators.required],
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

  searchPatientDetails() {
    let choose = this.searchPatient.controls['chooseID'].value;
    let passport = this.searchPatient.controls['Passport'].value;
    let caseNumber = this.searchPatient.controls['CaseNumber'].value;
    if (passport == "" && caseNumber == "") {
      this.openSnackBar("עליך להקליד מזהה מטופל");
    } else {
      if (this.usersWithPermission(localStorage.getItem("loginUserName").toLowerCase())) {
        this.http
          .post("http://srv-apps/wsrfc/WebService.asmx/GetClinicsPatientDetails", {
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
              this.patientFound = false;
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
              this.detailsFormGroup.controls['FirstName'].disable();
              this.detailsFormGroup.controls['LastName'].disable();
              this.detailsFormGroup.controls['PersonID'].disable();
              this.detailsFormGroup.controls['DOB'].disable();
              this.detailsFormGroup.controls['Gender'].disable();
              this.detailsFormGroup.controls['PhoneNumber'].disable();
              this.detailsFormGroup.controls['Address'].disable();
              // this.detailsFormGroup = this.fb.group({
              //   Row_ID: new FormControl({value: mPersonalDetails.Row_ID, diabled: true}, null),
              //   FirstName: new FormControl({value: mPersonalDetails.FirstName, diabled: true}, null),
              //   LastName: new FormControl({value: mPersonalDetails.LastName, diabled: true}, null),
              //   PersonID: new FormControl({value: mPersonalDetails.PersonID, diabled: true}, null),
              //   DOB: new FormControl({value: mPersonalDetails.DOB, diabled: true}, null),
              //   Gender: new FormControl({value: mPersonalDetails.Gender, diabled: true}, null),
              //   PhoneNumber: new FormControl({value: mPersonalDetails.PhoneNumber, diabled: true}, null),
              //   Email: new FormControl({value: mPersonalDetails.Email, diabled: true}, null),
              //   Address: new FormControl({value: mPersonalDetails.Address, diabled: true}, null),
              // });

              if (this.detailsFormGroup.controls['Gender'].value == '1') {
                this.genderText = "זכר";
              } else if (this.detailsFormGroup.controls['Gender'].value == '2') {
                this.genderText = "נקבה";
              } else {
                this.genderText = "אחר";
              }
              this.patientFound = true;
              if (this.usersWithPermission(localStorage.getItem("loginUserName").toLowerCase())) {
                this.permission = true;
              }
            }
          });
      } else {
        this.http
          .post("http://srv-apps/wsrfc/WebService.asmx/PrintReciept", {
            _patientPassport: passport,
          })
          .subscribe((Response) => {
            this.print = true;
            let relevantServices = [];
            relevantServices = Response["d"];
            if (relevantServices.length == 0) {
              this.openSnackBar("לא נמצאו רשומות עבור המטופל");
              this.patientFound = false;
            } else {
              var ServiceArray: any = this.fb.array([]);
              var ServiceItem;
              this.deptChosen = true;
              this.detailsFormGroup2 = ({
                PersonID: relevantServices[0].PersonID,
                LastName: relevantServices[0].LastName,
                FirstName: relevantServices[0].FirstName,
                PatientAddress: relevantServices[0].PatientAddress,
                Email: relevantServices[0].Email,
                Gender: relevantServices[0].Gender,
                PhoneNumber: relevantServices[0].PhoneNumber,
                DOB: relevantServices[0].DOB,
                TotalPrice: relevantServices[0].TotalPrice,
              });
              if (this.detailsFormGroup2.Gender == '1') {
                this.genderText = "זכר";
              } else if (this.detailsFormGroup2.Gender == '2') {
                this.genderText = "נקבה";
              } else {
                this.genderText = "אחר";
              }
              for (let i = 1; i < relevantServices.length; i++) {
                let total = relevantServices[i].ServicePrice * relevantServices[i].ServiceQuantity
                ServiceItem = this.fb.group({
                  ServiceNumber: relevantServices[i].ServiceNumber,
                  ServiceName: relevantServices[i].ServiceName,
                  ServiceQuantity: relevantServices[i].ServiceQuantity,
                  ServicePrice: relevantServices[i].ServicePrice,
                  Total: total,
                });
                this.ELEMENT_DATA.push(ServiceItem);
              }
              this.servicesFormGroup = this.fb.group({
                ServiceArray: ServiceArray
              });
              this.dataSource = new MatTableDataSource<Services>(this.ELEMENT_DATA);
              this.searchingProgress = false;
              this.patientFound = true;
            }
          });
      }
    }
  }

  getDepartments() {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetClinicsPricingDeparts", {
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
        .post("http://srv-apps/wsrfc/WebService.asmx/SendTreatmentToReception", {
          _patientDetails: this.detailsFormGroup.getRawValue(),
          _serviceDetails: this.servicesFormGroup.getRawValue(),
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
