
import { Component, OnInit, ViewChild, AfterViewInit, ViewContainerRef, ViewRef, TemplateRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';


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
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['code', 'name', 'quantity'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  isLinear = false;
  selectV: string = "";
  now = new Date();
  date2: string;
  time2: string;
  detailsFormGroup: FormGroup;
  servicesFormGroup: FormGroup;

  applyFilter(event: Event, clicked) {
    if (clicked == '' || clicked == undefined) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    } else {
      this.dataSource.filter = clicked.trim().toLowerCase();
    }

  }

  constructor(public dialog: MatDialog,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private dialogR: MatDialogRef<ManageClinicPriceComponent>) { }
  resultsLength: any;
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
  displayArr = this.fb.array([]);
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
        .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetPatientDetailsFromClinicsDB", {
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
          // adding services from existing patient to display array for updating
          for (let i = 0; i < mPersonalDetails.PatientVersionsList.length; i++) {
            let element = {
              Row_ID: mPersonalDetails.PatientVersionsList[i].Row_ID,
              value: mPersonalDetails.PatientVersionsList[i].value,
              number: mPersonalDetails.PatientVersionsList[i].ServiceNumber,
              name: mPersonalDetails.PatientVersionsList[i].ServiceName,
              price: mPersonalDetails.PatientVersionsList[i].ServicePrice,
              ServiceQuantity: mPersonalDetails.PatientVersionsList[i].ServiceQuantity,
            }
            this.addSelectedServices(element);
          }
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

  // plusService(value) {
  //   let servVal = parseInt(this.servicesFormGroup.controls["PatientsServicesList"]["controls"][value].value.ServiceQuantity) + 1;
  //   this.servicesFormGroup.controls["PatientsServicesList"]["controls"][value].value.ServiceQuantity = servVal.toString();
  // }

  // minusService(value) {
  //   let servVal = parseInt(this.servicesFormGroup.controls["PatientsServicesList"]["controls"][value].value.ServiceQuantity) - 1;
  //   this.servicesFormGroup.controls["PatientsServicesList"]["controls"][value].value.ServiceQuantity = servVal.toString();
  // }

  selectedDept() {
    this.searchServices();
  }

  searchServices() {
    this.searchingProgress = true;
    let departNumber = this.servicesFormGroup.controls['DepartNumber'].value;
    let patientRowID = this.PatientElement.Row_ID;
    let recordVersion = this.versionSelection;
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetClinicsServices", {
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
        this.resultsLength = relevantServices.length;
        for (let i = 0; i < relevantServices.length; i++) {
          departCode = relevantServices[0].DepartCode;
          ServiceItem = this.fb.group({
            ServiceId: [i, null],
            ServiceNumber: [{ value: relevantServices[i].ServiceNumber, disabled: true }, null],
            ServiceName: [{ value: relevantServices[i].ServiceName, disabled: true }, null],
            ServicePrice: [{ value: relevantServices[i].ServicePrice, disabled: true }, null],
            ServiceQuantity: [relevantServices[i].ServiceQuantity, null],
          });
          let serialNumber = {
            value: i,
            name: relevantServices[i].ServiceName,
            number: relevantServices[i].ServiceNumber,
            quantity: relevantServices[i].ServiceQuantity,
            price: relevantServices[i].ServicePrice,
          }
          ELEMENT_DATA.push(serialNumber);
          PatientsServicesList.push(ServiceItem);
        }
        this.dataSource.paginator = this.paginator;
        this.servicesFormGroup = this.fb.group({
          DepartNumber: departNumber,
          DepartCode: departCode,
          PatientsServicesList: PatientsServicesList
        });
        this.dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.searchingProgress = false;
      });
  }

  get selectedServices() {
    return this.displayArr as FormArray;
  }

  updateServiceQuantity(element) {
    this.displayArr.removeAt(element.value);
  }

  closeModal() {
    this.dialogR.close(false);
  }

  // adding the selected service to the temp display array
  addSelectedServices(element) {
    let duplicateVal = this.displayArr.controls.filter(s => s.value.ServiceNumber == element.number);
    if (duplicateVal.length > 0) {
      let index = this.displayArr.value.findIndex(x => x.ServiceNumber == element.number);
      this.displayArr.removeAt(index);
    }
    let quantity = "";
    let value = "";
    if (element.hasOwnProperty('Row_ID')) {
      value = "";
      quantity = element.ServiceQuantity;
    } else {
      value = element.value;
      quantity = this.servicesFormGroup.value.PatientsServicesList[element.value].ServiceQuantity;
    }
    let serviceCtrl = this.fb.group({
      ServiceId: [element.value, null],
      ServiceNumber: [element.number, null],
      ServiceName: [element.name, null],
      ServicePrice: [element.price, null],
      ServiceQuantity: [quantity, null],
    });
    if (serviceCtrl.controls['ServiceQuantity'].value > 0) {
      this.selectedServices.push(serviceCtrl);
    } 
  }

  onSubmit() {
    let departNumber = this.servicesFormGroup.controls['DepartNumber'].value;
    // assign the new array of selected services to the form array
    this.servicesFormGroup.controls.PatientsServicesList = this.displayArr;
    if (departNumber == '' || departNumber == undefined || departNumber == null) {
      this.openSnackBar("עליך לבחור מחלקה");
    } else {
      if (!this.servicesFormGroup.invalid) {
        this.http
          .post("http://srv-apps-prod/RCF_WS/WebService.asmx/SendTreatmentToReception", {
            _patientDetails: this.detailsFormGroup.getRawValue(),
            _serviceDetails: this.servicesFormGroup.getRawValue(),
            _ifEdit: this.ifEdit,
          })
          .subscribe((Response) => {
            let message = Response["d"];
            if (message == "Success") {
              this.openSnackBar("הצעת טיפול נשלחה בהצלחה");
              this.dialogR.close(true);
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

    // this.dialog.closeAll();
  }

  getDepartments() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetClinicsPricingDeparts", {
      })
      .subscribe((Response) => {
        let clinicsDeparts = [];
        clinicsDeparts = Response["d"];
        clinicsDeparts.forEach(element => {
          this.departments.push(element);
        })
      });
  }



}