import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';


export interface EmailManagement {
  Row_ID: string;
  Comp_Date: string;
  Comp_Type: string;
  Comp_Source: string;
  Comp_Pesron_Relate: string;
  Comp_Department: string;
  PersonID: string;
  Comp_Sektor: string;
  RelevantEmployee1: string;
  Ambolatory: string;
  Eshpoz: string;
  ImprovementNote: string;
  Comp_Note: string;
  Comp_Answer: string;
  Comp_Closing_Date: string;
  Related_User: string;
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

export interface CompType {
  value: string;
  viewValue: string;
}

export interface CompRelated {
  value: string;
  viewValue: string;
}

export interface EmailDepartment {
  deptVal: string;
}

export interface CompSource {
  value: string;
  viewValue: string;
}
export interface CompSektor {
  value: string;
  viewValue: string;
}
export interface DeadLine {
  value: string;
  viewValue: string;
}

export interface CompAmbolatory {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-emailmanagement',
  templateUrl: './emailmanagement.component.html',
  styleUrls: ['./emailmanagement.component.css']
})

export class EmailmanagementComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  compTypeList: CompType[] = [
    { value: 'Job', viewValue: 'חיפוש משרה' },
    { value: 'Thank', viewValue: 'תודה' },
    { value: 'Complaint', viewValue: 'תלונה' },
    { value: 'Inquiry', viewValue: 'פנייה' },
    { value: 'Other', viewValue: 'אחר' },
  ];

  compRelatedPerson: CompRelated[] = [
    { value: 'Patient', viewValue: 'מטופל' },
    { value: 'Family', viewValue: 'בן משפחה' },
    { value: 'Clinic', viewValue: 'מרפאה' },
    { value: 'HealthMinistry', viewValue: 'משרד הבריאות' },
    { value: 'Lawyer', viewValue: 'עו"ד' },
    { value: 'Other', viewValue: 'אחר' },
  ];

  compAmbolatory: CompAmbolatory[] = [
    { value: '0', viewValue: 'אמבולטורי' },
    { value: '1', viewValue: 'אשפוז' },
    { value: '3', viewValue: 'אחר' },
  ];
  deadline: DeadLine[] = [
    { value: '1', viewValue: 'שבוע' },
    { value: '2', viewValue: 'שבועיים' },
    { value: '3', viewValue: '3 שבועות' },
  ];

  compSektor: CompSektor[] = [
    { value: 'Nursing', viewValue: 'סיעוד' },
    { value: 'Manmash', viewValue: 'מנמ"ש' },
    { value: 'Medical', viewValue: 'רפואי' },
    { value: 'ParaMedical', viewValue: 'פרא רפואי' },
    { value: 'Other', viewValue: 'אחר' },
  ];

  compSource: CompSource[] = [
    { value: 'MedicalCenterWebsite', viewValue: 'אתר המרכז הרפואי' },
    { value: 'Fax', viewValue: 'פקס' },
    { value: 'Survey', viewValue: 'סקר' },
    { value: 'Email', viewValue: 'אימייל' },
    { value: 'Phone', viewValue: 'טלפון' },
    { value: 'Facebook', viewValue: 'פייסבוק' },
    { value: 'Frontal', viewValue: 'פנייה פרונטלית' },
    { value: 'PublicInquiryBox', viewValue: 'תיבת פניות ציבור' },
  ];

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();
  currentDay = new Date().getDay();
  maxDate =  new Date(this.currentYear, this.currentMonth+2, this.currentDay - 6);
  

  constructor(
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
  ) { }

  all_email_management = [];
  all_complaints_filter = [];
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
  

  myControl = new FormControl();
  departmentfilter = new FormControl();
  filteredOptions: Observable<string[]>;
  filteredOptions2: Observable<string[]>;
  toppings = new FormControl();
  chooseComp: boolean;
  _ifUpdate:boolean;
  _ifSplit:string;
  _stepper:boolean;

  ngOnInit(): void {
    this.manageComplaintForm = this.formBuilder.group({
      Comp_Date: ['', Validators.compose([Validators.required])],
      Comp_Type: ['', null],
      Comp_Source: ['', null],
      Comp_Pesron_Relat: ['', null],
      Comp_Department: ['', null],
      Comp_Sektor: ['', null],
      PersonID: ['', null],
      ImprovementNote: ['', null],
      RelevantEmployee1: ['', null],
      Ambolatory: ['', null],
      Comp_Note: ['', null],
      Comp_Answer: ['', null],
      Comp_Closing_Date: ['', null],
      Related_User: ['', null,],
      DeadLine: ['', null,]
    });

    this.emailSenderGroup = this.formBuilder.group({
      EmailSubject: ['', Validators.compose([Validators.required])],
      CompSubject: ['', Validators.compose([Validators.required])],
      CompName: ['', Validators.compose([Validators.required])],
      ContentToShow: ['', null],
      CompPhone: ['', null],
      CompEmail: ['', null],
      EmailDateTime: ['', Validators.compose([Validators.required])],
      EmailDepartment: ['', Validators.compose([Validators.required])],
    });

    //to split the complaint
    if(this.fakeID == 0 && this.urlID != 0){
      this._ifUpdate = true;
      this.chooseComp = false;
      this._stepper = false;
      this._ifSplit = "1";
      this.getEmailManagement(this.urlID,this._ifSplit);
      //for genrating new complaint 
    }else if(this.urlID == 0 && this.fakeID == 0){
      this._ifUpdate = false;
      this.chooseComp = false;
      this._stepper = true;
      this._ifSplit = "0";
      this.getDepatments();
      //open the complaints cards
    }else{
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
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(option => option.firstname.toLowerCase().includes(filterValue));
  }
  private _filter2(value: string): string[] {
    const filterValue2 = value;
    return this.department.filter(option => option.Depart_Name.includes(filterValue2));
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  shareComplaintWithOthers(){

      this.http
      .post("http://localhost:64964/WebService.asmx/AttachCompToUser", {
        userId: this.myControl.value,
        compId: this.complainID,
      })
      .subscribe((Response) => {
        if(Response["d"] == true){
          this.openSnackBar("! נשלח בהצלחה לנמען");
        }else{
          this.openSnackBar("! נמען לא קיים");
        }
      });
  }

  submitComplaint(_ifUpdate,_ifSplit) {
    this.manageComplaintForm.controls['Comp_Department'].setValue(this.departmentfilter.value);
    let pipe = new DatePipe('en-US');
    if(this.manageComplaintForm.controls['Comp_Closing_Date'].value == null || this.manageComplaintForm.controls['Comp_Closing_Date'].value == ""){
      this.manageComplaintForm.controls['Comp_Closing_Date'].setValue("");
    }else{
      this.manageComplaintForm.controls['Comp_Closing_Date'].setValue(pipe.transform(this.manageComplaintForm.controls['Comp_Closing_Date'].value, 'yyyy-MM-dd'));
      this.manageComplaintForm.controls['Comp_Closing_Date'].setValidators(null);
    }
    if(_ifSplit == "0"){
      this.manageComplaintForm.setValidators(null);
    }
    if(!this.manageComplaintForm.invalid || !this.emailSenderGroup.invalid){
    this.http
      .post("http://localhost:64964/WebService.asmx/UpdateComplaint", {
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
    this.router.navigate(['emailsdashboard']);
    window.location.reload();
    }else{
      this.openSnackBar("!לא תקין");
    }
  }

  getDepatments(){
    this.http
      .post("http://localhost:64964/WebService.asmx/GetInquiryDeparts", {

      })
      .subscribe((Response) => {
        this.all_departs_filter = Response["d"];

        this.all_departs_filter.forEach(element => {
          this.department.push(element);
        })
      });
  }

  getRelevantComplaints(urlID){
    let userName = localStorage.getItem("loginUserName").toLowerCase();
    this.http
      .post("http://localhost:64964/WebService.asmx/GetRelevantComplaints", {
        _urlID: urlID,
        _userName: userName
      })
      .subscribe((Response) => {
        this.all_complaints_filter = Response["d"];
      });
  }

  getEmailManagement(urlID,ifSplit) {
    this.chooseComp = false;
    if(ifSplit == "1"){
      this._stepper = false;
    }else if(ifSplit == "3"){
      this._stepper = false;
    }
    else{
      this._stepper = true;
    }
     
    this.http
      .post("http://localhost:64964/WebService.asmx/Manage_Emails", {
        _compID: urlID,
        _ifSplit: ifSplit
      })
      .subscribe((Response) => {
        this.all_email_management = Response["d"];
        this.complaintName = this.all_email_management[0].ComplaintName;
        this.complainID = this.all_email_management[0].Row_ID;

        this.manageComplaintForm = this.formBuilder.group({
          Row_ID: new FormControl(this.all_email_management[0].Row_ID, null),
          Comp_Date: new FormControl(this.all_email_management[0].Comp_Date, null),
          Comp_Type: new FormControl(this.all_email_management[0].Comp_Type, null),
          Comp_Source: new FormControl(this.all_email_management[0].Comp_Source, null),
          Comp_Pesron_Relat: new FormControl(this.all_email_management[0].Comp_Pesron_Relat , null),
          Comp_Department: new FormControl(this.all_email_management[0].Comp_Department, null),
          Comp_Sektor: new FormControl(this.all_email_management[0].Comp_Sektor, null),
          Comp_Status: new FormControl(this.all_email_management[0].Comp_Status, null),
          Comp_Note: new FormControl(this.all_email_management[0].Comp_Note, null),
          RelevantEmployee1: new FormControl(this.all_email_management[0].RelevantEmployee1, null),
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
        
      });      
      

      this.http
      .post("http://localhost:64964/WebService.asmx/GetInquiryDeparts", {

      })
      .subscribe((Response) => {
        this.all_departs_filter = Response["d"];

        this.all_departs_filter.forEach(element => {
          this.department.push(element);
        })
      });

      this.http
      .post("http://localhost:64964/WebService.asmx/GetUsersForInquiries", {

      })
      .subscribe((Response) => {
        this.all_users_filter = Response["d"];

        this.all_users_filter.forEach(element => {
          this.users.push(element);
        })
      });


  }
}
