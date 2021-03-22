import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-status-complaint',
  templateUrl: './status-complaint.component.html',
  styleUrls: ['./status-complaint.component.css']
})
export class StatusComplaintComponent implements OnInit {

  constructor(
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
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
      MessageDate: [Date.now, null],
      MessageTime: [Date.now, null],
      Complaint: ['', null]
    });
    this.getRelevantComplaints(this.urlID);
  }

  getRelevantComplaints(urlID){
    this.http
      .post("http://localhost:64964/WebService.asmx/GetRelevantComplaints", {
        _urlID: urlID
      })
      .subscribe((Response) => {
        this.all_complaints_filter = Response["d"];
      });
  }

  sendMessage() {
    console.log(this.messanger.value);
  }

  getComplaintForMessaging(urlID) {
    this._choosed = true;
    this.messanger.controls['Complaint'].setValue(urlID); 
    this.http
      .post("http://localhost:64964/WebService.asmx/ComplaintMessanger", {
        _messageClass: this.messanger.value,
      })
      .subscribe((Response) => {
        this.messagesArray = Response["d"];
        console.log(this.messagesArray);
        // this.messanger = this.formBuilder.group({
        //   MessageValue: new FormControl('', null),
        //   FirstName: new FormControl('', null),
        //   LastName: new FormControl('', null),
        //   MessageDate: new FormControl(Response["d"].MessageDate, null),
        //   MessageTime: new FormControl(Response["d"].MessageTime, null),
        //   Complaint: new FormControl(Response["d"].Complaint , null),
        // });

      });
  }
}
