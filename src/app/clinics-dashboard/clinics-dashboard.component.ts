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
import { ManageClinicPriceComponent } from '../manage-clinic-price/manage-clinic-price.component';
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
  DepartName: string;
}

@Component({
  selector: 'app-clinics-dashboard',
  templateUrl: './clinics-dashboard.component.html',
  styleUrls: ['./clinics-dashboard.component.css']
})
export class ClinicsDashboardComponent implements OnInit {

  displayedColumns: string[] = ['code', 'name', 'quantity'];
  displayedColumns2: string[] = ['code', 'name', 'quantity', 'price', 'total'];
  displayedColumns3: string[] = ['date', 'passport', 'name', 'totalP', 'versions', 'print', 'edit'];
  dataSource = new MatTableDataSource<Services>();
  dataSource2 = new MatTableDataSource<Services>();
  dataSource3 = new MatTableDataSource<Patient>();

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  isLinear = false;
  selectV: string = "";
  detailsFormGroup2: Patient;
  servicesFormGroup: FormGroup;
  now = new Date();
  date2: string;
  time2: string;
  patientRecords = [];


  ELEMENT_DATA = [];

  constructor(
    public dialog: MatDialog,
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
  deptChosen: boolean = false;
  searchPatientProgressBar: boolean = true;
  print: boolean = false;
  newPatient: boolean = false;
  UserName = localStorage.getItem("loginUserName").toLowerCase();

  ngOnInit(): void {
    this.searchPatient = this.fb.group({
      chooseID: ['1', null],
      Passport: ['', null],
      CaseNumber: ['', null]
    });
    this.servicesFormGroup = this.fb.group({
      DepartNumber: ['', Validators.required],
      DepartCode: ['', Validators.required],
    });
    this.date2 = this.datePipe.transform(this.now, 'dd-MM-yyyy');
    this.time2 = this.datePipe.transform(this.now, 'HH:mm:ss');

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


  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  printClinicPrice(element) {
    if (this.selectV == "") {
      this.openSnackBar("אנא בחר גרסה");
    } else {
      let passport = this.searchPatient.controls['Passport'].value;
      this.http
        .post("http://srv-apps/wsrfc/WebService.asmx/PrintReciept", {
          _patientPassport: passport,
          _patientRecordID: element.Row_ID,
          _versionNum: this.selectV,
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
              TotalPrice: relevantServices[relevantServices.length-1].TotalVersionPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ","),//.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              DepartName: relevantServices[1].DepartName,
            });
            if (this.detailsFormGroup2.Gender == '1') {
              this.genderText = "זכר";
            } else if (this.detailsFormGroup2.Gender == '2') {
              this.genderText = "נקבה";
            } else {
              this.genderText = "אחר";
            }
            this.ELEMENT_DATA = [];
            for (let i = 1; i < relevantServices.length; i++) {
              let total = relevantServices[i].ServicePrice * relevantServices[i].ServiceQuantity;
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
            this.patientFound = true;
            setTimeout(() => {
              window.print();
            }, 1000);

          }
        });
    }

  }

  clearSearch() {
    this.searchPatient.controls['Passport'].setValue('');
    this.patientFound = false;
  }

  openClinicManagementModel(element, ifEdit) {
    if (this.selectV == "" && element.Row_ID != null && ifEdit == 1) {
      this.openSnackBar("עליך לבחור גרסה");
    } else {
      let dialogRef = this.dialog.open(ManageClinicPriceComponent);
      dialogRef.componentInstance.PatientElement = element;
      dialogRef.componentInstance.ifEdit = ifEdit;
      dialogRef.componentInstance.versionSelection = this.selectV;
    }
  }

  getPatients() {
    let passport = this.searchPatient.controls['Passport'].value;
    this.searchPatientProgressBar = false;
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetRecordAndPatients", {
        _patientPassport: passport
      })
      .subscribe((Response) => {
        let ELEMENT_DATA = [];
        this.searchPatientProgressBar = true;
        this.patientRecords = Response["d"];
        if (this.patientRecords[0].Row_ID == null && this.patientRecords[0].PatientPersonID != null) {
          this.newPatient = false;
          this.openClinicManagementModel(this.patientRecords[0], 0);
        } else {
          if (this.patientRecords[0].PatientPersonID == null) {
            this.openSnackBar("מספר תעודת זהות לא נמצא");
            this.patientFound = false;
            this.newPatient = false;
          } else {
            for (let i = 0; i < this.patientRecords.length; i++) {
              let versionsArr = [];
              let patientItem;
              for (let j = 0; j < this.patientRecords[i].PatientVersionsList.length; j++) {
                versionsArr.push(this.patientRecords[i].PatientVersionsList[j].NumberOfVersions);
              }
              patientItem = {
                RecordTime: this.patientRecords[i].RecordTime,
                RecordDate: this.datePipe.transform(this.patientRecords[i].RecordDate, 'dd/MM/yyyy'),
                Row_ID: this.patientRecords[i].Row_ID,
                FirstName: this.patientRecords[i].PatientFirstName,
                LastName: this.patientRecords[i].PatientLastName,
                PersonID: this.patientRecords[i].PatientPersonID,
                RecordVersion: versionsArr,
                TotalPrice: this.patientRecords[i].TotalPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              }
              ELEMENT_DATA.push(patientItem);
            }
            this.dataSource3 = new MatTableDataSource<Patient>(ELEMENT_DATA);
            this.newPatient = true;
          }
        }

      });
  }
}
