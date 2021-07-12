import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { EmployeesComponent } from '../employees/employees.component';
import { isEmpty, map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-status-complaint',
  templateUrl: './status-complaint.component.html',
  styleUrls: ['./status-complaint.component.css']
})
export class StatusComplaintComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private confirmationDialogService: ConfirmationDialogService,
  ) { }


  users = [];
  all_users_filter = [];
  urlID: number;
  complaintID: number;
  messanger: FormGroup;
  FirstName: string = "";
  LastName: string = "";
  MessageDate: string = "";
  MTime: string = "";
  CompID: string = "";
  ComplaintSubject: string = "";
  _choosed: boolean;
  all_complaints_filter = [];
  messagesArray = [];
  UserName = localStorage.getItem("loginUserName").toLowerCase();
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();


  ngOnInit(): void {
    this._choosed = false;
    this.messanger = this.formBuilder.group({
      MessageValue: ['', null],
      UserName: [this.UserName, null],
      MessageDate: ['', null],
      MessageTime: ['', null],
      Complaint: ['', null]
    });
    this.getRelevantComplaints(this.urlID);
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  deleteMessage(messageID, ComplaintID) {
    // this.confirmationDialogService
    //   .confirm("נא לאשר..", "האם אתה בטוח ...? ")
    //   .then((confirmed) => {
    //     console.log("User confirmed:", confirmed);
    //     if (confirmed) {
    //       console.log("deleted");
    //     }
    //   });
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/DeleteMessage", {
        _messageID: messageID
      })
      .subscribe((Response) => {
        this.getAndSendMessages(ComplaintID);
        this.openSnackBar("!הודעה נמחקה");
      });
  }

  getRelevantComplaints(urlID) {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetRelevantComplaints", {
        _urlID: urlID,
        _userName: this.UserName
      })
      .subscribe((Response) => {
        this.all_complaints_filter = Response["d"];
      });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(option => option.firstname.includes(filterValue));
  }

  shareComplaintWithOthers() {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/AttachCompToUser", {
        userId: this.myControl.value,
        compId: this.complaintID,
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

  getAndSendMessages(formid) {
    this._choosed = true;
    let UserName = localStorage.getItem("loginUserName").toLowerCase();
    let myDate = new Date();
    let messageDate = this.datePipe.transform(myDate, 'yyyy/MM/dd');
    let messageTime = myDate.getHours() + ':' + myDate.getMinutes() + ':' + myDate.getSeconds();
    this.messanger.controls['Complaint'].setValue(formid);
    this.messanger.controls['MessageDate'].setValue(messageDate);
    this.messanger.controls['MessageTime'].setValue(messageTime);
    this.messanger.controls['UserName'].setValue(UserName);
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/ComplaintMessanger", {
        _messageClass: this.messanger.value,
      })
      .subscribe((Response) => {
        this.messagesArray = Response["d"];
        this.complaintID = formid;
        // this.CompID = this.messagesArray[0].Complaint;
        this.ComplaintSubject = Response["d"][Response["d"].length-1].ComplaintSubject;
        this.messagesArray.splice(-1,1);
        this.messanger.controls['MessageValue'].setValue("");
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
