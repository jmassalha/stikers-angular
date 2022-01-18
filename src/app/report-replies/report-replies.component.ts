import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-replies',
  templateUrl: './report-replies.component.html',
  styleUrls: ['./report-replies.component.css']
})
export class ReportRepliesComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';


  constructor(
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
  ) { }


  messanger: FormGroup;
  FirstName: string = "";
  LastName: string = "";
  reportTitle: string;
  MessageDate: string = "";
  MTime: string = "";
  CompID: string = "";
  all_complaints_filter = [];
  messagesArray = [];
  UserName = localStorage.getItem("loginUserName").toLowerCase();
  reportID: string;

  ngOnInit(): void {
    this.messanger = this.formBuilder.group({
      ResponseText: ['', null],
      UserName: [this.UserName, null],
      MessageDate: ['', null],
      MessageTime: ['', null],
      ReportIDFK: ['', null]
    });
    this.getAndSendMessages(this.reportID);
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  deleteMessage(messageID, ReportID) {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/DeleteReportMessage", {
        _messageID: messageID
      })
      .subscribe((Response) => {
        if (Response["d"] == "success") {
          this.openSnackBar("!הודעה נמחקה");
        } else {
          this.openSnackBar("משהו השתבש, הודעה לא נמחקה");
        }
        this.getAndSendMessages(ReportID);
      });
  }

  getAndSendMessages(reportID) {
    let UserName = localStorage.getItem("loginUserName").toLowerCase();
    let myDate = new Date();
    let messageDate = this.datePipe.transform(myDate, 'yyyy/MM/dd');
    let messageTime = myDate.getHours() + ':' + myDate.getMinutes() + ':' + myDate.getSeconds();
    this.messanger.controls['ReportIDFK'].setValue(reportID);
    this.messanger.controls['MessageDate'].setValue(messageDate);
    this.messanger.controls['MessageTime'].setValue(messageTime);
    this.messanger.controls['UserName'].setValue(UserName);
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetSendReportResponse", {
        _messageClass: this.messanger.value,
      })
      .subscribe((Response) => {
        this.messagesArray = Response["d"];
        if (this.messagesArray.length > 0) {
          this.reportTitle = this.messagesArray[0].ReportTitle;
        }
        this.messanger.controls['ResponseText'].setValue("");
      });
  }

}
