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
  searchForm: FormGroup;
  customInputs: any[] = [];
  customForm: FormGroup;
  manyContacts: FormGroup;
  typeOfScreen: boolean;
  screenTitle = 'יחידים';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      byPhone: new FormControl('', null),
      byName: new FormControl('', null),
      byType: new FormControl('', null)
    });
    this.customForm = this.fb.group({
      customInputs: this.fb.array([])
    });
    this.manyContacts = this.fb.group({
      Phone_Number: new FormControl('', null),
      Message_Content: new FormControl('', null),
      SenderIDFK: new FormControl('', null)
    });
    this.getWhatsAppMessagesFromServer();
    this.getWhatsAppSendersFromServer();
  }

  get customFormArray(): FormArray {
    return this.customForm.get('customInputs') as FormArray;
  }

  removecustomInput(index: number) {
    this.customFormArray.removeAt(index);
  }

  addInput() {
    const contact = new FormGroup({
      Recipient_Type: new FormControl('0', Validators.required),
      Phone_Number: new FormControl('', Validators.required),
      Recipient: new FormControl('', null),
      Message_Content: new FormControl('', Validators.required),
      SenderIDFK: new FormControl('', Validators.required),
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
      if (!this.customForm.invalid) {
        this.http
          .post(environment.url + "Send_Custom_WhatsApp_Messages", {
            customForm: this.customForm.value
          })
          .subscribe((Response) => {
            if (Response["d"]) this.openSnackBar('נוסף לתור השליחה');
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
            if (Response["d"]) this.openSnackBar('נוסף לתור השליחה');
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

  startSearch() {
    console.log(this.searchForm.value);
  }

  getWhatsAppMessagesFromServer() {
    let that = this;
    this.getWhatsAppMessagesFromServerService('GetWhatsAppMessagesFromServer').subscribe({
      next(res) {
        that.dataSource = new MatTableDataSource<any>(res["d"]);
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

}
