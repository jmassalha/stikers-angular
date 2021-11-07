import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfirmationDialogService } from 'src/app/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-dev-manage',
  templateUrl: './dev-manage.component.html',
  styleUrls: ['./dev-manage.component.css']
})
export class DevManageComponent implements OnInit {

  UserName = localStorage.getItem("loginUserName").toLowerCase();
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private confirmationDialogService: ConfirmationDialogService,) { }

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
  }

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


  getUsersToUpdateUser() {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetUsersForInquiries", {
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

  checkPassword(){
    if(this.permissionPassword.controls['passwordLogin'].value == 'Monster1948'){
      this.permission = true;
    }else{
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
