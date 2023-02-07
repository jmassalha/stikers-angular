
import { Component, OnInit, ViewChild, AfterViewInit, ViewContainerRef, ViewRef, TemplateRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';

export interface Teeth {
  value: string;
  viewValue: string;
}

export interface TeethGroup {
  disabled?: boolean;
  name: string;
  teeth: Teeth[];
}
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
  displayedColumns: string[] = ['code', 'name', 'price', 'teeth', 'quantity'];
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
  checked = false;

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
    private confirmationDialogService: ConfirmationDialogService,
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
  ServiceQuantityList = [];
  url = "http://srv-apps-prod/RCF_WS/WebService.asmx/";
  UserName = localStorage.getItem("loginUserName").toLowerCase();
  teethList: TeethGroup[] = [];
  PatientsServicesList: any = this.fb.array([]);

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
      DoctorName: ['', Validators.required],
    });
    this.servicesFormGroup = this.fb.group({
      DepartNumber: ['', Validators.required],
      DepartCode: ['', Validators.required],
      PatientsServicesList: this.PatientsServicesList,
    });
    this.searchPatientDetails();
    this.ServiceQuantityList.push("");
    for (let i = 0; i < 28; i++) {
      this.ServiceQuantityList.push(i + 1);
    }

  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  TeethNumbers() {
    // CONSTANT TEETH
    let teethTemp;
    // 11 - 18
    // 21 - 28
    // 31 - 38
    // 41 - 48
    teethTemp = {
      name: 'קבועות',
      teeth: []
    };
    for (let i = 1; i <= 4; i++) {
      for (let j = 1; j <= 8; j++) {
        let obj = {
          id: i,
          value: (i + '' + j).toString()
        };
        teethTemp.teeth.push(obj);
      }
    }
    this.teethList.push(teethTemp);

    // MILKEY TEETH
    // 51 - 54
    // 61 - 64
    // 71 - 74
    // 81 - 84
    teethTemp = {
      name: 'חלביות',
      teeth: []
    };
    for (let i = 5; i <= 8; i++) {
      for (let j = 1; j <= 4; j++) {
        let obj = {
          id: i,
          value: (i + '' + j).toString()
        };
        teethTemp.teeth.push(obj);
      }
    }
    this.teethList.push(teethTemp);
    // this.servicesFormGroup.value.PatientsServicesList[element.value].ServiceTeeth = this.teethList;
  }

  searchPatientDetails() {
    let passport;
    if (this.ifEdit == 1) {
      passport = this.PatientElement.Row_ID;
      this.http
        .post(this.url + "GetPatientDetailsFromClinicsDB", {
          _patientPassport: passport,
          _versionSelected: this.versionSelection
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
            DoctorName: new FormControl(mPersonalDetails.DoctorName, null),
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
              counter: i,
              value: mPersonalDetails.PatientVersionsList[i].value,
              number: mPersonalDetails.PatientVersionsList[i].ServiceNumber,
              name: mPersonalDetails.PatientVersionsList[i].ServiceName,
              price: mPersonalDetails.PatientVersionsList[i].ServicePrice,
              ServiceQuantity: mPersonalDetails.PatientVersionsList[i].ServiceQuantity,
              ServiceTeeth: mPersonalDetails.PatientVersionsList[i].ServiceTeeth,
            }
            this.addSelectedServiceToEdit(element);
          }
          this.servicesFormGroup.value.PatientsServicesList = this.displayArr.value;
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
        DoctorName: new FormControl(mPersonalDetails.DoctorName, null),
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

  selectedDept() {
    this.searchServices();
  }

  searchServices() {
    this.searchingProgress = true;
    let departNumber = this.servicesFormGroup.controls['DepartNumber'].value;
    let patientRowID = this.PatientElement.Row_ID;
    let recordVersion = this.versionSelection;
    this.http
      .post(this.url + "GetClinicsServices", {
        _departmentNumber: departNumber,
        _patientRowID: patientRowID,
        _recordVersion: recordVersion,
        _ifEdit: this.ifEdit,
      })
      .subscribe((Response) => {
        this.TeethNumbers();
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
            ServicePrice: [{ value: relevantServices[i].ServicePrice / 100, disabled: true }, null],
            ServiceQuantity: [relevantServices[i].ServiceQuantity, null],
            ServiceTeeth: [this.teethList, null]
          });
          let serialNumber = {
            value: i,
            name: relevantServices[i].ServiceName,
            number: relevantServices[i].ServiceNumber,
            quantity: parseInt(relevantServices[i].ServiceQuantity),
            price: relevantServices[i].ServicePrice,
            teeth: this.teethList,
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
    if (this.servicesFormGroup.value.PatientsServicesList[element.value].ServiceTeeth[0].name != null) {
      this.servicesFormGroup.value.PatientsServicesList[element.value].ServiceTeeth = [];
    }
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
    try {
      let serviceCtrl = this.fb.group({
        ServiceId: [element.value, null],
        ServiceNumber: [element.number, null],
        ServiceName: [element.name, null],
        ServicePrice: [element.price, null],
        ServiceQuantity: [quantity, null],
        ServiceTeeth: [this.servicesFormGroup.value.PatientsServicesList[element.value].ServiceTeeth, null],
      });
      if (serviceCtrl.controls['ServiceQuantity'].value > 0) {
        this.selectedServices.push(serviceCtrl);
      }
    } catch (err) {
      console.log(err);
    }
  }

  addSelectedServiceToEdit(element) {
    let duplicateVal = this.displayArr.controls.filter(s => s.value.ServiceNumber == element.number);
    if (duplicateVal.length > 0) {
      let index = this.displayArr.value.findIndex(x => x.ServiceNumber == element.number);
      this.displayArr.removeAt(index);
    }
    let quantity;
    let value = "";
    if (element.hasOwnProperty('Row_ID')) {
      value = "";
      quantity = parseInt(element.ServiceQuantity);
    } else {
      value = element.value;
      quantity = this.servicesFormGroup.value.PatientsServicesList[element.value].ServiceQuantity;
    }
    try {
      let serviceCtrl = this.fb.group({
        ServiceId: [element.value, null],
        ServiceNumber: [element.number, null],
        ServiceName: [element.name, null],
        ServicePrice: [element.price, null],
        ServiceQuantity: [parseInt(quantity), null],
        ServiceTeeth: [this.teethList, null],
      });
      if (serviceCtrl.controls['ServiceQuantity'].value > 0) {
        this.selectedServices.push(serviceCtrl);
      }
    } catch (err) {
      console.log(err);
    }
  }

  onSubmit() {
    let departNumber = this.servicesFormGroup.controls['DepartNumber'].value;
    // assign the new array of selected services to the form array
    this.servicesFormGroup.controls.PatientsServicesList = this.displayArr;
    if (departNumber == '' || departNumber == undefined || departNumber == null) {
      this.openSnackBar("חייב לבחור מחלקה ושירותים");
    } else if(this.detailsFormGroup.controls['DoctorName'].value == ""){
      this.openSnackBar("שכחת למלא את שם הרופא המטפל");
    } else {
      if (!this.servicesFormGroup.invalid) {
        this.confirmationDialogService
          .confirm("נא לאשר..", "האם אתה בטוח ...? ")
          .then((confirmed) => {
            console.log("User confirmed:", confirmed);
            if (confirmed) {
              this.http
                .post(this.url + "SendTreatmentToReception", {
                  _patientDetails: this.detailsFormGroup.getRawValue(),
                  _serviceDetails: this.servicesFormGroup.getRawValue(),
                  _ifEdit: this.ifEdit,
                })
                .subscribe((Response) => {
                  let message = Response["d"];
                  if (message == "Success") {
                    // this.openSnackBar("הצעת טיפול נשלחה בהצלחה");
                    this.dialogR.close(true);
                  } else if (message == "noServices") {
                    this.openSnackBar("לא נשמר, לא נבחרו שירותים עבור המטופל");
                  } else {
                    this.openSnackBar("משהו השתבש, לא נשלח");
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
        this.openSnackBar("לא בחרת שירותים עבור המטופל");
      }
    }

    // this.dialog.closeAll();
  }

  getDepartments() {
    this.http
      .post(this.url + "GetClinicsPricingDeparts", {
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