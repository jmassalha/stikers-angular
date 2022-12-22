import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Injectable, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { isEmpty, map, startWith } from 'rxjs/operators';


export interface EmailManagement {
  Row_ID: string;
  Comp_Date: string;
  Comp_Type: string;
  Comp_Source: string;
  Comp_Pesron_Relate: string;
  Comp_Department: string;
  PersonID: string;
  Comp_Sektor: string;
  EmployeesToAttach: User[];
  Ambolatory: string;
  Eshpoz: string;
  ImprovementNote: string;
  Comp_Note: string;
  Comp_Answer: string;
  Comp_Closing_Date: string;
  Related_User: string;
  DeadLine: string;
  CompName2: string;
  CompPhone2: string;
  CompEmail2: string;
  EmailSubject2: string;
  CompSubject2: string;
  ContentToShow2: string;
}
export interface EmailSender {
  Row_ID: string;
  EmailSubject: string;
  CompSubject: string;
  CompName: string;
  ContentToShow: string;
  CompPhone: string;
  CompEmail: string;
  EmailDateTime: string;
}

export interface EmailDepartment {
  deptVal: string;
}

export interface DeadLine {
  value: string;
  viewValue: string;
}

export interface CompDepts {
  value: string;
  viewValue: string;
}

export interface User {
  Employee_Name: string;
  Employee_Id: string;
  email: string;
  Status: string;
  selected: boolean;
}

@Component({
  selector: 'app-emailmanagement',
  templateUrl: './emailmanagement.component.html',
  styleUrls: ['./emailmanagement.component.css']
})

export class EmailmanagementComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  compTypeList: any[] = [];
  compRelatedPerson: any[] = [];
  compAmbolatory: any[] = [];
  compDepts: any[] = [];

  
  deadline: DeadLine[] = [
    { value: '1', viewValue: 'שבוע' },
    { value: '2', viewValue: 'שבועיים' },
    { value: '3', viewValue: '3 שבועות' },
  ];

  compSektor: any[] = [];

  compSource: any[] = [];

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();
  currentDay = new Date().getDay();
  maxDate = new Date(this.currentYear, this.currentMonth + 2, this.currentDay - 6);


  constructor(
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EmailmanagementComponent>,
  ) { }

  all_email_management = [];
  all_complaints_filter = [];
  emailSubjectsArr = [];
  FormDepartment: string = "";
  all_departs_filter = [];
  all_users_filter = [];
  department = [];
  users = [];
  // usersNames = [];
  email: EmailManagement;
  complaintName: string = "";
  complainID: string = "";
  urlID: number;
  fakeID: number;
  manageComplaintForm: FormGroup;
  emailSenderGroup: FormGroup;
  firstManagementGroup: FormGroup;

  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: User[] = [];
  allFruits: string[] = [];
  myControl = new FormControl();
  departmentfilter = new FormControl();
  filteredOptions: Observable<string[]>;
  filteredOptions2: Observable<string[]>;
  toppings = new FormControl();
  chooseComp: boolean;
  _ifUpdate: boolean;
  _ifSplit: string;
  _stepper: boolean;
  // selectData: Array<User> = [];
  @Output() result = new EventEmitter<{ key: string, data: Array<string> }>();
  @Input() key: string = '';
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;

  ngOnInit(): void {

    this.manageComplaintForm = this.formBuilder.group({
      Comp_Date: ['', Validators.compose([Validators.required])],
      Comp_Type: ['', Validators.compose([Validators.required])],
      Comp_Source: ['', null],
      Comp_Pesron_Relat: ['', null],
      Comp_Department: ['', null],
      Comp_Sektor: ['', null],
      PersonID: ['', null],
      ImprovementNote: ['', null],
      EmployeesToAttach: this.formBuilder.array([{
        Employee_Name: '',
        Employee_Id: '',
        email: '',
        Status: ''
      }]),
      Ambolatory: ['', null],
      Comp_Note: ['', null],
      Comp_Answer: ['', null],
      Comp_Closing_Date: ['', null],
      Related_User: ['', null,],
      DeadLine: ['', null,],
    });

    this.emailSenderGroup = this.formBuilder.group({
      Row_ID: ['0', null],
      EmailSubject: ['', null],
      CompSubject: ['', null],
      CompName: ['', Validators.compose([Validators.required])],
      ContentToShow: ['', null],
      CompPhone: ['', Validators.compose([Validators.required])],
      CompEmail: ['', null],
      EmailDateTime: ['', null],
      EmailDepartment: ['', null],
    });

    //to split the complaint
    if (this.fakeID == 0 && this.urlID != 0) {
      this._ifUpdate = true;
      this.chooseComp = false;
      this._stepper = false;
      this._ifSplit = "1";
      this.getEmailManagement(this.urlID, this._ifSplit);
      //for genrating new complaint 
    } else if (this.urlID == 0 && this.fakeID == 0) {
      this._ifUpdate = false;
      this.chooseComp = false;
      this._stepper = true;
      this._ifSplit = "0";
      // this.getDepatments();
      this.getEmailManagement(this.urlID, this._ifSplit);
      //open the complaints cards
    } else {
      this._ifUpdate = true;
      this.chooseComp = true;
      this._stepper = false;
      this._ifSplit = "0";
    }

    this.getRelevantComplaints(this.urlID);

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.filteredOptions2 = this.departmentfilter.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter2(value))
      );
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter3(fruit) : this.users.slice()));
  }

  // displayFn(user: string): string {
  //   return user && user.DepartName ? user.DepartName : '';
  // }

  add(event: MatChipInputEvent): void {
    const value: any = (event.value || '').trim();
    if (value) {
      value.Status = 'True';
      this.fruits.push(value);
    }
    // event.chipInput!.clear();
    this.fruitCtrl.setValue(null);
  }

  // remove(fruit: string): void {
  //   const index = this.fruits.indexOf(fruit);
  //   if (index >= 0) {
  //     this.fruits.splice(index, 1);
  //   }
  // }
  remove(fruit: User): void {
    let index = this.fruits.findIndex(x => x.Employee_Id === fruit.Employee_Id);
    delete this.fruits[index];
    this.fruits.length -= 1;
    // fruit.Status = 'False';

  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.value);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter3(value: any): string[] {
    let filterValue = "";
    if (value != '' && value.Employee_Name == undefined) {
      filterValue = value.toLowerCase();
    }
    return this.users.filter(fruit => fruit.Employee_Name.toLowerCase().includes(filterValue));
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(option => option.firstname.includes(filterValue));
  }
  private _filter2(value: string): string[] {
    const filterValue2 = value;
    return this.compDepts.filter(option => option.includes(filterValue2));
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  shareComplaintWithOthers() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/AttachCompToUser", {
        userId: this.myControl.value,
        compId: this.complainID,
      })
      .subscribe((Response) => {
        if (Response["d"] == "found") {
          this.openSnackBar("! נשלח בהצלחה לנמען");
        } else if (Response["d"] == "Exists") {
          this.openSnackBar("! כבר משוייך לפנייה");
        } else {
          this.openSnackBar("! נמען לא קיים");
        }
      });
  }

  submitComplaint(_ifUpdate, _ifSplit) {
    this.manageComplaintForm.controls['Comp_Department'].setValue(this.departmentfilter.value);
    let pipe = new DatePipe('en-US');
    if (this.manageComplaintForm.controls['Comp_Closing_Date'].value == null || this.manageComplaintForm.controls['Comp_Closing_Date'].value == "") {
      this.manageComplaintForm.controls['Comp_Closing_Date'].setValue("");
    } else {
      this.manageComplaintForm.controls['Comp_Closing_Date'].setValue(pipe.transform(this.manageComplaintForm.controls['Comp_Closing_Date'].value, 'yyyy-MM-dd'));
      this.manageComplaintForm.controls['Comp_Closing_Date'].setValidators(null);
    }
    // if (!_ifUpdate) {
    //   if (this.emailSenderGroup.controls['EmailDateTime'].value == null || this.emailSenderGroup.controls['EmailDateTime'].value == "") {
    //     this.emailSenderGroup.controls['EmailDateTime'].setValue("");
    //   } else {
    //     this.emailSenderGroup.controls['EmailDateTime'].setValue(pipe.transform(this.emailSenderGroup.controls['EmailDateTime'].value, 'yyyy-MM-dd'));
    //     this.emailSenderGroup.controls['EmailDateTime'].setValidators(null);
    //   }
    // }
    if (this.manageComplaintForm.controls['DeadLine'].value == null || this.manageComplaintForm.controls['DeadLine'].value == "") {
      this.manageComplaintForm.controls['DeadLine'].setValue("");
    } else {
      this.manageComplaintForm.controls['DeadLine'].setValue(pipe.transform(this.manageComplaintForm.controls['DeadLine'].value, 'yyyy-MM-dd'));
      this.manageComplaintForm.controls['DeadLine'].setValidators(null);
    }
    if (this.manageComplaintForm.controls['Comp_Date'].value == null || this.manageComplaintForm.controls['Comp_Date'].value == "") {
      this.manageComplaintForm.controls['Comp_Date'].setValue("");
    } else {
      this.manageComplaintForm.controls['Comp_Date'].setValue(pipe.transform(this.manageComplaintForm.controls['Comp_Date'].value, 'yyyy-MM-dd'));
      this.manageComplaintForm.controls['Comp_Date'].setValidators(null);
    }
    if (_ifSplit == "0") {
      this.manageComplaintForm.setValidators(null);
    }
    if (this.fruits.length > 0) {
      this.manageComplaintForm.controls['EmployeesToAttach'].setValue(this.fruits);
    }
    // this.emailSenderGroup.controls['EmailDateTime'].setValue(this.manageComplaintForm.controls['Comp_Date'].value);
    if (!this.manageComplaintForm.invalid && !this.emailSenderGroup.invalid) {
      this.http
        .post("http://srv-apps-prod/RCF_WS/WebService.asmx/UpdateComplaint", {
          _compToUpdate: this.manageComplaintForm.value,
          _emailToInsert: this.emailSenderGroup.value,
          ifUpdate: _ifUpdate,
          ifSplit: _ifSplit,
          urlID: this.urlID
        })
        .subscribe((Response) => {
          this.openSnackBar("!נשמר בהצלחה");
        });
      this.dialog.closeAll();
    } else {
      if (this.manageComplaintForm.controls['Comp_Department'].value === null) {
        this.openSnackBar("נא לבחור מחלקה");
      } else {
        this.openSnackBar("שדה חובה לא תקין");
      }
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  getDepatments() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetInquiryDeparts", {

      })
      .subscribe((Response) => {
        this.all_departs_filter = Response["d"];

        this.all_departs_filter.forEach(element => {
          this.department.push(element);
        })
      });
  }

  getRelevantComplaints(urlID) {
    let userName = localStorage.getItem("loginUserName").toLowerCase();
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetRelevantComplaints", {
        _urlID: urlID,
        _userName: userName
      })
      .subscribe((Response) => {
        this.all_complaints_filter = Response["d"];
      });
  }

  calculateDepartCapacity(inUse, current) {
    let result: any = Math.round((Number(inUse) / Number(current)) * 100);
    if (isNaN(result)) {
      result = "אין נתונים";
    }
    return result;
  }

  getEmailManagement(urlID, ifSplit) {
    this.chooseComp = false;
    if (ifSplit == "1") {
      this._stepper = false;
    } else if (ifSplit == "3") {
      this._stepper = false;
    }
    else {
      this._stepper = true;
    }

    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/Manage_Emails", {
        _compID: urlID,
        _ifSplit: ifSplit
      })
      .subscribe((Response) => {
        this.all_email_management = Response["d"];
        if (this.all_email_management.length > 1) {
          this.complaintName = this.all_email_management[0].ComplaintName;
          this.complainID = this.all_email_management[0].Row_ID;
          this.emailSenderGroup = this.formBuilder.group({
            Row_ID: new FormControl(this.all_email_management[1].Row_ID, null),
            CompName: new FormControl(this.all_email_management[1].CompName, null),
            CompPhone: new FormControl(this.all_email_management[1].CompPhone, null),
            CompEmail: new FormControl(this.all_email_management[1].CompEmail, null),
            EmailSubject: new FormControl(this.all_email_management[1].EmailSubject, null),
            CompSubject: new FormControl(this.all_email_management[1].CompSubject, null),
            ContentToShow: new FormControl(this.all_email_management[1].ContentToShow, null)
          });
          this.manageComplaintForm = this.formBuilder.group({
            Row_ID: new FormControl(this.all_email_management[0].Row_ID, null),
            Comp_Date: new FormControl(this.all_email_management[0].Comp_Date, null),
            Comp_Type: new FormControl(this.all_email_management[0].Comp_Type, null),
            Comp_Source: new FormControl(this.all_email_management[0].Comp_Source, null),
            Comp_Pesron_Relat: new FormControl(this.all_email_management[0].Comp_Pesron_Relat, null),
            Comp_Department: new FormControl(this.all_email_management[0].Comp_Department, null),
            Comp_Sektor: new FormControl(this.all_email_management[0].Comp_Sektor, null),
            Comp_Status: new FormControl(this.all_email_management[0].Comp_Status, null),
            Comp_Note: new FormControl(this.all_email_management[0].Comp_Note, null),
            EmployeesToAttach: new FormControl(this.all_email_management[0].EmployeesToAttach, null),
            Ambolatory: new FormControl(this.all_email_management[0].Ambolatory, null),
            ImprovementNote: new FormControl(this.all_email_management[0].ImprovementNote, null),
            Comp_Answer: new FormControl(this.all_email_management[0].Comp_Answer, null),
            PersonID: new FormControl(this.all_email_management[0].PersonID, null),
            Comp_Closing_Date: new FormControl(this.all_email_management[0].Comp_Closing_Date, null),
            Row_ID_FK: new FormControl(this.all_email_management[0].Row_ID_FK, null),
            Related_User: new FormControl(this.all_email_management[0].email, null),
            DeadLine: new FormControl(this.all_email_management[0].DeadLine, null),
          });
          this.departmentfilter.setValue(this.all_email_management[0].Comp_Department);
          this.fruits = this.all_email_management[0].EmployeesToAttach;
        }

        this.emailSubjectsArr = this.all_email_management[this.all_email_management.length - 1];
      });


    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetInquiryDeparts", {

      })
      .subscribe((Response) => {
        this.all_departs_filter = Response["d"];

        this.all_departs_filter.forEach(element => {
          this.department.push(element);
        })
      });

    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetUsersForInquiries", {

      })
      .subscribe((Response) => {
        this.all_users_filter = Response["d"];

        this.all_users_filter.forEach(element => {
          this.users.push({
            Employee_Name: element.firstname + " " + element.lastname,
            Employee_Id: element.id,
            email: element.email,
            Status: 'True'
          });
        })
      });
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetAmbolatory", {

      })
      .subscribe((Response) => {
        Response["d"].forEach(element => {
          this.compAmbolatory.push(element);
        })
      });
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetEmailSubject", {

      })
      .subscribe((Response) => {
        Response["d"].forEach(element => {
          this.compSource.push(element);
        })
      });
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetCompTypes", {
      })
      .subscribe((Response) => {
        Response["d"].forEach(element => {
          this.compTypeList.push(element);
        })
      });
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetCompPesronRelat", {
      })
      .subscribe((Response) => {
        Response["d"].forEach(element => {
          this.compRelatedPerson.push(element);
        })
      });
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetSektors", {
      })
      .subscribe((Response) => {
        Response["d"].forEach(element => {
          this.compSektor.push(element);
        })
      });
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetCompDepartments", {
      })
      .subscribe((Response) => {
        Response["d"].forEach(element => {
          this.compDepts.push(element.Dept_Name);
        })
      });
  }
}
