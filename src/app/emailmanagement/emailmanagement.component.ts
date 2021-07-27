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
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


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
export interface CompDepts {
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
    { value: '1', viewValue: 'בזמן אשפוז' },
    { value: '3', viewValue: 'לאחר שחרור מאשפוז' },
  ];
  compDepts: any[] = [
    { value: 'MRI', viewValue: 'MRI' },
    { value: 'מיילדותי us', viewValue: 'מיילדותי us' },
    { value: 'אונקולוגיה', viewValue: 'אונקולוגיה' },
    { value: 'אורולוגיה', viewValue: 'אורולוגיה' },
    { value: 'אורטופידיה', viewValue: 'אורטופידיה' },
    { value: 'אף אוזן גרון', viewValue: 'אף אוזן גרון' },
    { value: 'בטחון', viewValue: 'בטחון' },
    { value: 'גזברות', viewValue: 'גזברות' },
    { value: 'גסטרואנטרולוגיה', viewValue: 'גסטרואנטרולוגיה' },
    { value: 'דיאליזה', viewValue: 'דיאליזה' },
    { value: 'IVF - הפרייה חוץ גופית', viewValue: 'IVF - הפרייה חוץ גופית' },
    { value: 'זימון תורים', viewValue: 'זימון תורים' },
    { value: 'חדר ניתוח', viewValue: 'חדר ניתוח' },
    { value: 'חדרי לידה', viewValue: 'חדרי לידה' },
    { value: 'טיפול נמרץ כללי', viewValue: 'טיפול נמרץ כללי' },
    { value: 'טיפול נמרץ לב', viewValue: 'טיפול נמרץ לב' },
    { value: 'יולדות', viewValue: 'יולדות' },
    { value: 'ילדים', viewValue: 'ילדים' },
    { value: 'ילודים', viewValue: 'ילודים' },
    { value: 'כירורגיה כללית', viewValue: 'כירורגיה כללית' },
    { value: 'כירורגיה פלסטית', viewValue: 'כירורגיה פלסטית' },
    { value: 'כירורגיה לב חזה', viewValue: 'כירורגיה לב חזה' },
    { value: 'מלר"ד', viewValue: 'מלר"ד' },
    { value: 'מלר"ד ילדים', viewValue: 'מלר"ד ילדים' },
    { value: 'מעברים', viewValue: 'מעברים' },
    { value: 'מרפאה אורולוגיה', viewValue: 'מרפאה אורולוגיה' },
    { value: 'מרפאה אורטופידית', viewValue: 'מרפאה אורטופידית' },
    { value: 'מרפאה נשים', viewValue: 'מרפאה נשים' },
    { value: 'מרפאה עיניים', viewValue: 'מרפאה עיניים' },
    { value: 'מרפאה ראומטולוגיה', viewValue: 'מרפאה ראומטולוגיה' },
    { value: 'מרפאת חוץ', viewValue: 'מרפאת חוץ' },
    { value: 'משרד קבלת חולים', viewValue: 'משרד קבלת חולים' },
    { value: 'נוירולוגיה', viewValue: 'נוירולוגיה' },
    { value: 'נשים', viewValue: 'נשים' },
    { value: 'עיניים', viewValue: 'עיניים' },
    { value: 'פגייה', viewValue: 'פגייה' },
    { value: 'פה ולסת', viewValue: 'פה ולסת' },
    { value: 'פנימית א', viewValue: 'פנימית א' },
    { value: 'פנימית ב', viewValue: 'פנימית ב' },
    { value: 'קורונה', viewValue: 'קורונה' },
    { value: 'פגייה', viewValue: 'פגייה' },
    { value: 'קרדיולוגיה', viewValue: 'קרדיולוגיה' },
    { value: 'רנטגן', viewValue: 'רנטגן' },
    { value: 'רשומות ומידע רפואי', viewValue: 'רשומות ומידע רפואי' },
    { value: 'שבץ מוחי', viewValue: 'שבץ מוחי' },
    { value: 'שונות', viewValue: 'שונות' },
    { value: 'שינוע', viewValue: 'שינוע' },
    { value: 'שיקומית', viewValue: 'שיקומית' },
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
  maxDate = new Date(this.currentYear, this.currentMonth + 2, this.currentDay - 6);


  constructor(
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
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


  myControl = new FormControl();
  departmentfilter = new FormControl();
  filteredOptions: Observable<string[]>;
  filteredOptions2: Observable<string[]>;
  toppings = new FormControl();
  chooseComp: boolean;
  _ifUpdate: boolean;
  _ifSplit: string;
  _stepper: boolean;

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
      RelevantEmployee1: ['', null],
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
  }

  // displayFn(user: string): string {
  //   return user && user.DepartName ? user.DepartName : '';
  // }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(option => option.firstname.includes(filterValue));
  }
  private _filter2(value: string): string[] {
    const filterValue2 = value;
    return this.compDepts.filter(option => option.value.includes(filterValue2));
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
      .post("http://srv-apps/wsrfc/WebService.asmx/AttachCompToUser", {
        userId: this.myControl.value,
        compId: this.complainID,
      })
      .subscribe((Response) => {
        if (Response["d"] == "found") {
          this.openSnackBar("! נשלח בהצלחה לנמען");
        } else if(Response["d"] == "Exists"){
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
    if (!_ifUpdate) {
      if (this.emailSenderGroup.controls['EmailDateTime'].value == null || this.emailSenderGroup.controls['EmailDateTime'].value == "") {
        this.emailSenderGroup.controls['EmailDateTime'].setValue("");
      } else {
        this.emailSenderGroup.controls['EmailDateTime'].setValue(pipe.transform(this.emailSenderGroup.controls['EmailDateTime'].value, 'yyyy-MM-dd'));
        this.emailSenderGroup.controls['EmailDateTime'].setValidators(null);
      }
    }
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
    this.emailSenderGroup.controls['EmailDateTime'].setValue(this.manageComplaintForm.controls['Comp_Date'].value);
    if (!this.manageComplaintForm.invalid && !this.emailSenderGroup.invalid) {
      this.http
        .post("http://srv-apps/wsrfc/WebService.asmx/UpdateComplaint", {
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
    } else {
      if(this.manageComplaintForm.controls['Comp_Department'].value === null){
        this.openSnackBar("נא לבחור מחלקה");
      }else{
        this.openSnackBar("שדה חובה לא תקין");
      }
    }
  }

  getDepatments() {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetInquiryDeparts", {

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
      .post("http://srv-apps/wsrfc/WebService.asmx/GetRelevantComplaints", {
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
      .post("http://srv-apps/wsrfc/WebService.asmx/Manage_Emails", {
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
        }

        this.emailSubjectsArr = this.all_email_management[this.all_email_management.length - 1];
      });


    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetInquiryDeparts", {

      })
      .subscribe((Response) => {
        this.all_departs_filter = Response["d"];

        this.all_departs_filter.forEach(element => {
          this.department.push(element);
        })
      });

    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetUsersForInquiries", {

      })
      .subscribe((Response) => {
        this.all_users_filter = Response["d"];

        this.all_users_filter.forEach(element => {
          this.users.push(element);
        })
      });


  }
}
