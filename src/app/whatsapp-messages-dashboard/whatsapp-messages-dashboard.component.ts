import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-whatsapp-messages-dashboard',
  templateUrl: './whatsapp-messages-dashboard.component.html',
  styleUrls: ['./whatsapp-messages-dashboard.component.css']
})
export class WhatsappMessagesDashboardComponent implements OnInit {


  horizontalPosition: MatSnackBarHorizontalPosition = "start";
  verticalPosition: MatSnackBarVerticalPosition = "bottom";
  displayedColumns: string[] = ['sender', 'name', 'number', 'content', 'date'];
  dataSource = new MatTableDataSource([]);
  sendersList = [];
  customInputs: any[] = [];
  customForm: FormGroup;
  manyContacts: FormGroup;
  typeOfScreen: boolean;
  searchEmployeesGroup: FormGroup;
  WorkPlacesList = [];
  DepartmentsList = [];
  FunctionsList = [];
  SektorsList = [];
  screenTitle = 'יחידים';
  searchProgress: boolean = false;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.searchEmployeesGroup = this.fb.group({
      EmpID: new FormControl('', null),
      EmpFirstName: new FormControl('', null),
      EmpLastName: new FormControl('', null),
      On: new FormControl('1', null),
      MedGrad: new FormControl('0', null),
      PhoneNumber: new FormControl('', null),
      Department: new FormControl('', null),
      Role: new FormControl('', null),
      Sektor: new FormControl('', null),
      WorkPlace: new FormControl('', null),
      StatusRow: new FormControl('2', null),
      AcceptTerms: new FormControl(false, null),
      ApprovedToBlossom: new FormControl('2', null),
    });
    this.customForm = this.fb.group({
      customInputs: this.fb.array([])
    });
    this.manyContacts = this.fb.group({
      Phone_Number: new FormControl('', Validators.required),
      Message_Content: new FormControl('', Validators.required),
      SenderIDFK: new FormControl('1', Validators.required)
    });
    // this.getWhatsAppMessagesFromServer();
    this.getWhatsAppSendersFromServer();
    this.getEmployeeDepartmentList();
    this.getEmployeesFunctionsList();
    this.getSektorsList();
    this.getWorkPlacesList();
  }

  get customFormArray(): FormArray {
    return this.customForm.get('customInputs') as FormArray;
  }

  removecustomInput(index: number) {
    this.customFormArray.removeAt(index);
  }

  addInput(phone, fullName) {
    const contact = new FormGroup({
      Recipient_Type: new FormControl('0', Validators.required),
      Phone_Number: new FormControl(phone, Validators.required),
      Recipient: new FormControl(fullName, null),
      Message_Content: new FormControl('', Validators.required),
      SenderIDFK: new FormControl('1', Validators.required),
    });
    (<FormArray>this.customForm.get('customInputs')).push(contact);
  }

  deleteRow(row: any, index: number) {
    if (index >= 0) {
      (this.customForm.get('customInputs') as FormArray).removeAt(index);
      this.cd.detectChanges();
    }
  }

  deleteAllRow() {
    (this.customForm.get('customInputs') as FormArray).clear();
  }

  sendMessages() {
    if (!this.typeOfScreen) {
      if (!this.customForm.invalid && this.customForm.value.customInputs.length > 0) {
        this.http
          .post(environment.url + "Send_Custom_WhatsApp_Messages", {
            customForm: this.customForm.value
          })
          .subscribe((Response) => {
            if (Response["d"]) {
              this.openSnackBar('נוסף לתור השליחה');
              this.deleteAllRow();
            }
            else this.openSnackBar('תקלה!');
          });
      } else {
        this.openSnackBar("למלא שדות חובה");
      }
    } else {
      if (!this.manyContacts.invalid) {
        this.http
          .post(environment.url + "Send_ToMany_WhatsApp_Messages", {
            manyForm: this.manyContacts.value
          })
          .subscribe((Response) => {
            if (Response["d"]) {
              this.openSnackBar('נוסף לתור השליחה');
              this.deleteAllRow();
            }
            else this.openSnackBar('תקלה!');
          });
      } else {
        this.openSnackBar("למלא שדות חובה");
      }

    }
  }

  changeScreens() {
    this.typeOfScreen = !this.typeOfScreen;
    if (this.typeOfScreen) this.screenTitle = 'כללי';
    else this.screenTitle = 'יחידים';
  }

  getWhatsAppMessagesFromServer() {
    if (this.dataSource.filteredData.length > 0) this.dataSource = new MatTableDataSource<any>();
    else {
      this.http
        .post(environment.url + "GetWhatsAppMessagesFromServer", {
        })
        .subscribe((Response) => {
          this.dataSource = new MatTableDataSource<any>(Response["d"]);
        });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getWhatsAppSendersFromServer() {
    let that = this;
    this.getWhatsAppMessagesFromServerService('GetWhatsAppSendersFromServer').subscribe({
      next(res) {
        that.sendersList = res["d"];
      },
      error(err) {
        alert('אירעה תקלה');
        console.log(err);
      },
      complete() {
        console.log('נטען בהצלחה');
      }
    });
  }

  public getWhatsAppMessagesFromServerService(func): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('content-type', 'application/json');
    return this.http.get(environment.url + func, {
      headers
    });
  }

  openSnackBar(message) {
    this._snackBar.open(message, "X", {
      duration: 2000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  GetEmployeesToUpdate() {
    this.deleteAllRow();
    this.searchProgress = true;
    let empId = this.searchEmployeesGroup.controls['EmpID'].value;
    let empFirstName = this.searchEmployeesGroup.controls['EmpFirstName'].value;
    let empLastName = this.searchEmployeesGroup.controls['EmpLastName'].value;
    let on = this.searchEmployeesGroup.controls['On'].value;
    let medGrad = this.searchEmployeesGroup.controls['MedGrad'].value;
    let phoneNumber = this.searchEmployeesGroup.controls['PhoneNumber'].value;
    let department = this.searchEmployeesGroup.controls['Department'].value;
    let role = this.searchEmployeesGroup.controls['Role'].value;
    let sektor = this.searchEmployeesGroup.controls['Sektor'].value;
    let workPlace = this.searchEmployeesGroup.controls['WorkPlace'].value;
    let StatusRow = this.searchEmployeesGroup.controls['StatusRow'].value;
    let ApprovedToBlossom = this.searchEmployeesGroup.controls['ApprovedToBlossom'].value;
    if (empId == "" && empFirstName == "" && empLastName == "" && phoneNumber == "" && department == "" && role == "" && sektor == "" && workPlace == "") {
      console.log("Too Large Employees List!");
      this.searchProgress = false;
    } else {
      this.http
        .post(environment.url + "GetEmployeesToUpdate", {
          _empId: empId,
          _empFirstName: empFirstName,
          _empLastName: empLastName,
          _on: on,
          _medGrad: medGrad,
          _phoneNumber: phoneNumber,
          _department: department,
          _role: role,
          _managerType: "admin",
          _sektor: sektor,
          _workPlace: workPlace,
          _statusRow: StatusRow,
          _approvedToBlossom: ApprovedToBlossom,
          _userName: ""
        })
        .subscribe((Response) => {
          this.searchProgress = false;
          let t = Response["d"];
          for (let i = 0; i < t.length; i++) {
            this.addInput(t[i].CellNumber, t[i].FirstName + ' ' + t[i].LastName);
          }
        });
    }
  }

  fillAllMessageContentFields(id) {
    if (id == 0) {
      this.customForm.controls['customInputs'].value.forEach((element, index) => {
        this.customForm.controls['customInputs']['controls'][index].controls.Message_Content.setValue(this.customForm.controls['customInputs'].value[0].Message_Content);
      });
    }
  }


  getEmployeeDepartmentList() {
    this.http
      .post(environment.url + "GetEmployeeDepartmentList", {
      })
      .subscribe((Response) => {
        this.DepartmentsList = Response["d"];
      });
  }

  getEmployeesFunctionsList() {
    this.http
      .post(environment.url + "GetEmployeesFunctionsList", {
        _userName: ""
      })
      .subscribe((Response) => {
        this.FunctionsList = Response["d"];
      });
  }

  getSektorsList() {
    this.http
      .post(environment.url + "getEmployeesBlossomSektorList", {
      })
      .subscribe((Response) => {
        this.SektorsList = Response["d"];
      });
  }

  getWorkPlacesList() {
    this.http
      .post(environment.url + "GetWorkPlacesList", {
      })
      .subscribe((Response) => {
        this.WorkPlacesList = Response["d"];
      });
  }

}
