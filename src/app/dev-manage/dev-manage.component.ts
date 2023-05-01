import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfirmationDialogService } from 'src/app/confirmation-dialog/confirmation-dialog.service';
import { environment } from 'src/environments/environment';

const ELEMENT_DATA: any[] = [];
@Component({
  selector: 'app-dev-manage',
  templateUrl: './dev-manage.component.html',
  styleUrls: ['./dev-manage.component.css']
})
export class DevManageComponent implements OnInit {

  displayedColumns: string[] = ['user', 'pc1', 'pc2', 'pc3', 'pc4', 'pc5', 'pc6', 'pc7', 'tablet', 'change'];
  dataSource = ELEMENT_DATA;
  TABLE_DATA: any[] = [];
  UserName = localStorage.getItem("loginUserName").toLowerCase();
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  UserNameUpdate: any;
  IpAddress: any;
  IpAddress2: any;
  IpAddress3: any;
  IpAddress4: any;
  IpAddress5: any;
  IpAddress6: any;
  IpAddress7: any;
  TabletAddress: any;
  loadingGpt: boolean = false;
  chatGpt: any;
  chatGptToken: any;
  chatGptAnswerlist: any = [];
  options: any;
  api_url: any;
  modelSelection: any;

  constructor(public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private formBuilder: FormBuilder) { }

  changeUser: FormGroup;
  permissionPassword: FormGroup;
  userfilter = new FormControl();
  permission: boolean = false;
  filteredOptions2: Observable<string[]>;
  users = [];

  ngOnInit(): void {
    this.permissionPassword = this.formBuilder.group({
      passwordLogin: ['', null],
    });

    this.changeUser = this.formBuilder.group({
      Row_ID: ['', null],
      newUser: ['', null],
    });
    this.getUsersToUpdateUser();
    this.filteredOptions2 = this.userfilter.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter2(value))
      );
    this.getNursesUsersToUpdatePermission();
  }

  chooseModel() {
    if (this.modelSelection == "completions") {
      this.api_url = "https://api.openai.com/v1/chat/completions";
      this.options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.chatGptToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: this.chatGpt,
            },
          ],
        }),
      };
    } else if (this.modelSelection == "moderations") {
      this.api_url = "https://api.openai.com/v1/moderations";
      this.options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.chatGptToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: this.chatGpt
        }),
      };
    } else if (this.modelSelection == "images/generations") {
      this.api_url = "https://api.openai.com/v1/images/generations";
      this.options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.chatGptToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: this.chatGpt,
          n: 2,
          size: "1024x1024"
        }),
      };
    }
    this.run();
  }

  run = async () => {
    this.loadingGpt = true;
    const options = this.options;

    const chatGPTResults = await fetch(
      this.api_url,
      options
    ).then((res) => res.json());
    this.loadingGpt = false;
    if (this.modelSelection == "completions") {
      this.chatGptAnswerlist.push(chatGPTResults.choices[0].message.content);
    } else if (this.modelSelection == "moderations") {
      this.chatGptAnswerlist.push(JSON.stringify(chatGPTResults.results[0].categories));
    } else if (this.modelSelection == "images/generations") {
      this.chatGptAnswerlist.push(chatGPTResults.data);
    }

    // console.log("ChatGPT says:", JSON.stringify(chatGPTResults, null, 2));
  };


  private _filter2(value: string): string[] {
    const filterValue2 = value;
    let depart: any = this.users.filter(t => t.firstname === filterValue2);
    let userToChange;
    if (depart.length > 0) {
      userToChange = depart[0].email.split("@", 1)[0];
      localStorage.setItem("loginUserName", userToChange.toLowerCase());
      this.openSnackBar("התחלף בהצלחה");
      window.location.reload();
    }
    return this.users.filter(option => option.firstname.includes(filterValue2));
  }

  updateUserPermission(element) {
    let dialogRef = this.dialog.open(this.modalContent, { width: '40%', disableClose: true });
    this.UserNameUpdate = element.UserName;
    this.IpAddress = element.IpAddress;
    this.IpAddress2 = element.IpAddress2;
    this.IpAddress3 = element.IpAddress3;
    this.IpAddress4 = element.IpAddress4;
    this.IpAddress5 = element.IpAddress5;
    this.IpAddress6 = element.IpAddress6;
    this.IpAddress7 = element.IpAddress7;
    this.TabletAddress = element.TabletAddress;
  }

  submitUpdate() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/SubmitUpdateNursesUsers", {
        UserNameUpdate: this.UserNameUpdate,
        IpAddress: this.IpAddress,
        IpAddress2: this.IpAddress2,
        IpAddress3: this.IpAddress3,
        IpAddress4: this.IpAddress4,
        IpAddress5: this.IpAddress5,
        IpAddress6: this.IpAddress6,
        IpAddress7: this.IpAddress7,
        TabletAddress: this.TabletAddress
      })
      .subscribe((Response) => {
        if (Response["d"]) {
          this.openSnackBar("התחלף בהצלחה");
        } else {
          this.openSnackBar("משהו השתבש");
        }
      });
  }

  getNursesUsersToUpdatePermission() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetNursesUsersToUpdatePermission", {
      })
      .subscribe((Response) => {
        let all_departs_filter = Response["d"];
        this.dataSource = all_departs_filter;
      });
  }

  getUsersToUpdateUser() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetUsersForInquiries", {
      })
      .subscribe((Response) => {
        let all_users_filter = Response["d"];
        all_users_filter.forEach(element => {
          this.users.push({
            firstname: element.firstname + " " + element.lastname,
            id: element.id,
            email: element.email
          });
        })
      });
  }

  checkPassword() {
    if (this.permissionPassword.controls['passwordLogin'].value == '1948') {
      this.permission = true;
    } else {
      this.openSnackBar("סיסמה לא נכונה");
    }
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

}