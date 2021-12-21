import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

export interface User {
  firstname: string;
  id: string;
  email: string;
  selected: boolean;
}

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

  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = [];
  allFruits: string[] = [];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;

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
  selectData: Array<User> = [];
  @Output() result = new EventEmitter<{ key: string, data: Array<string> }>();
  @Input() key: string = '';

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
    this.getUsers();
    // this.getAndSendMessages(this.urlID);
    // this.filteredOptions = this.myControl.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => typeof value === 'string' ? value : value.firstname),
    //     map(firstname => firstname ? this._filter(firstname) : this.users.slice())
    //   );
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter2(fruit) : this.users.slice()));
  }

  // selectChange = (event: any) => {
  //   const key: string = event.key;
  //   this.cardValue[key] = [ ...event.data ];
  // };

  displayFn(user: User): string {
    return user && user.firstname ? user.firstname : '';
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
  // optionClicked = (event: Event, data: User): void => {
  //   event.stopPropagation();
  //   this.toggleSelection(data);
  // }
  // toggleSelection = (data: User): void => {
  //   data.selected = !data.selected;
  //   if (data.selected === true) {
  //     this.selectData.push(data);
  //   } else {
  //     const i = this.selectData.findIndex(value => value.firstname === data.firstname);
  //     this.selectData.splice(i, 1);
  //   }
  //   this.myControl.setValue(this.selectData);
  //   this.emitAdjustedData();
  // }
  // emitAdjustedData = (): void => {
  //   const results: Array<string> = []
  //   this.selectData.forEach((data: User) => {
  //     results.push(data.firstname);
  //   });
  //   this.result.emit({ key: this.key, data: results });
  // };

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.fruits.push(value);
    }
    // event.chipInput!.clear();
    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);
    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.value);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter2(value: any): string[] {
    let filterValue = "";
    if (value != '' && value.firstname == undefined) {
      filterValue = value.toLowerCase();
    }
    return this.users.filter(fruit => fruit.firstname.toLowerCase().includes(filterValue));
  }

  getUsers() {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetUsersForInquiries", {

      })
      .subscribe((Response) => {
        this.all_users_filter = Response["d"];

        this.all_users_filter.forEach(element => {
          this.users.push({
            firstname: element.firstname + " " + element.lastname,
            id: element.id,
            email: element.email
          });
        })
      });
  }

  deleteMessage(messageID, ComplaintID) {
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
    this.myControl.setValue(this.fruits);
    if (this.myControl.value == null) {
      this.openSnackBar("נא לבחור אחראי לשליחה");
    } else {
      this.http
        .post("http://srv-apps/wsrfc/WebService.asmx/attachCompToUser", {
          users: this.myControl.value,
          compId: this.complaintID,
        })
        .subscribe((Response) => {
          if (Response["d"] == "found") {
            this.openSnackBar("! נשלח בהצלחה לנמענים");
          } else if (Response["d"] == "Exists") {
            this.openSnackBar("! כבר משוייך לפנייה");
          } else {
            this.openSnackBar("! נמען לא קיים");
          }
        });
    }
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
        this.ComplaintSubject = Response["d"][Response["d"].length - 1].ComplaintSubject;
        this.messagesArray.splice(-1, 1);
        this.messanger.controls['MessageValue'].setValue("");
      });
  }
}
