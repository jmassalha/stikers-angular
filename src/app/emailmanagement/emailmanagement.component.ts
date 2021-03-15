import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Email } from '../emailsdashboard/emailsdashboard.component';
import { DatePipe } from '@angular/common';


export interface EmailManagement {
  Row_ID: string;
  Comp_Date: string;
  Comp_Type: string;
  Comp_Source: string;
  Comp_Pesron_Relate: string;
  Comp_Department: string;
  Comp_Status: string;
  Comp_Note: string;
  Comp_Answer: string;
  Comp_Closing_Date: string;
}

export interface CompType {
  value: string;
  viewValue: string;
}

export interface CompRelated {
  value: string;
  viewValue: string;
}

export interface CompStatus {
  value: string;
  viewValue: string;
}

export interface EmailDepartment {
  deptVal: string;
}

@Component({
  selector: 'app-emailmanagement',
  templateUrl: './emailmanagement.component.html',
  styleUrls: ['./emailmanagement.component.css']
})
export class EmailmanagementComponent implements OnInit {

  compTypeList: CompType[] = [
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

  compStatus: CompStatus[] = [
    { value: '1', viewValue: 'פתוח' },
    { value: '0', viewValue: 'סגור' },
  ];

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) { }

  all_email_management = [];
  FormDepartment: string = "";
  all_departs_filter = [];
  department = [];
  email: EmailManagement;
  complaintName: string = "";
  urlID: number;
  manageComplaintForm: FormGroup;

  maxDate = Date.now();

  ngOnInit(): void {
    this.manageComplaintForm = this.formBuilder.group({
      CompDateControl: ['', Validators.compose([Validators.required])],
      CompTypeControl: ['', Validators.compose([Validators.required])],
      CompSourceControl: ['', Validators.compose([Validators.required])],
      CompRelatedControl: ['', Validators.compose([Validators.required])],
      CompDepartmentControl: ['', Validators.compose([Validators.required])],
      CompNoteControl: ['', Validators.compose([Validators.required])],
      CompAnswerControl: ['', Validators.compose([Validators.required])],
      CompClosingDateControl: ['', Validators.compose([Validators.required])],
      CompStatusControl: ['', Validators.compose([Validators.required])],
    })
    this.getEmailMaanagement(this.urlID);
    
  }


  updateComplaint(){
    console.log(this.manageComplaintForm.value);
    
  }



  getEmailMaanagement(urlID) {
    this.http
      .post("http://localhost:64964/WebService.asmx/Manage_Emails", {
        _compID: urlID
      })
      .subscribe((Response) => {
        this.all_email_management = Response["d"];


        this.complaintName = this.all_email_management[0].ComplaintName;

        this.manageComplaintForm = this.formBuilder.group({
          CompDateControl: new FormControl(this.all_email_management[0].Comp_Date, null),
          CompTypeControl: new FormControl(this.all_email_management[0].Comp_Type, null),
          CompSourceControl: new FormControl(this.all_email_management[0].Comp_Source, null),
          CompRelatedControl: new FormControl(this.all_email_management[0].Comp_Pesron_Relat , null),
          CompDepartmentControl: new FormControl(this.all_email_management[0].Comp_Department, null),
          CompNoteControl: new FormControl(this.all_email_management[0].Comp_Note, null),
          CompAnswerControl: new FormControl(this.all_email_management[0].Comp_Answer, null),
          CompClosingDateControl: new FormControl(this.all_email_management[0].Comp_Closing_Date, null),
          CompStatusControl: new FormControl(this.all_email_management[0].Comp_Status, null),
        });
      });
      

      this.http
      .post("http://localhost:64964/WebService.asmx/GetFormsDeparts", {

      })
      .subscribe((Response) => {
        this.all_departs_filter = Response["d"];

        this.all_departs_filter.forEach(element => {
          this.department.push(element);
        })
      });
  }
}
