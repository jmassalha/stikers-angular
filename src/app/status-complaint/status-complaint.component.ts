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
    private datePipe: DatePipe
  ) { }


  urlID: number;
  messanger: FormGroup;
  FirstName: string = "";
  LastName: string = "";
  MessageDate: string = "";
  MTime: string = "";
  CompID: string = "";
  _choosed: boolean;
  all_complaints_filter = [];
  messagesArray = [];
  UserName = localStorage.getItem("loginUserName").toLowerCase();


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
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  deleteMessage(messageID,ComplaintID){
      this.http
        .post("http://srv-apps/wsrfc/WebService.asmx//DeleteMessage", {
          _messageID: messageID
        })
        .subscribe((Response) => {
          this.getAndSendMessages(ComplaintID);
          this.openSnackBar("!הודעה נמחקה");
        });
  }

  getRelevantComplaints(urlID){
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx//GetRelevantComplaints", {
        _urlID: urlID
      })
      .subscribe((Response) => {
        this.all_complaints_filter = Response["d"];
      });
  }

  getAndSendMessages(urlID) {
    this._choosed = true;
    let UserName = localStorage.getItem("loginUserName").toLowerCase();
    let myDate = new Date();
    let messageDate = this.datePipe.transform(myDate, 'yyyy/MM/dd');
    let messageTime = myDate.getHours()+':'+myDate.getMinutes()+':'+myDate.getSeconds(); 
    this.messanger.controls['Complaint'].setValue(urlID);
    this.messanger.controls['MessageDate'].setValue(messageDate);
    this.messanger.controls['MessageTime'].setValue(messageTime);
    this.messanger.controls['UserName'].setValue(UserName);
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx//ComplaintMessanger", {
        _messageClass: this.messanger.value,
      })
      .subscribe((Response) => {
        this.messagesArray = Response["d"];
        this.CompID = this.messagesArray[0].Complaint;
        this.messanger.controls['MessageValue'].setValue("");
      });
  }
}
