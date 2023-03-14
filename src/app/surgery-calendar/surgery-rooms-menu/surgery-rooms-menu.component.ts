import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { SurgeriesManagementComponent } from '../surgery-rooms-menu/surgeries-management/surgeries-management.component';

@Component({
  selector: 'app-surgery-rooms-menu',
  templateUrl: './surgery-rooms-menu.component.html',
  styleUrls: ['./surgery-rooms-menu.component.css']
})
export class SurgeryRoomsMenuComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  surgeryRooms: any = [];
  dayNamesArray = [
    { number: 0, name: "ראשון" },
    { number: 1, name: "שני" },
    { number: 2, name: "שלישי" },
    { number: 3, name: "רביעי" },
    { number: 4, name: "חמישי" },
    { number: 5, name: "שישי" },
    { number: 6, name: "שבת" },
  ];
  todaysName: string = "";
  userName = localStorage.getItem('loginUserName');
  userObject: any;

  constructor(public dialogRef: MatDialogRef<SurgeryRoomsMenuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    public dialog: MatDialog,) {
    this.surgeryRooms = data.event.day.events;
    this.todaysName = this.dayNamesArray[data.event.day.day].name;
  }


  ngOnInit(): void {
    this.getUserTypeForPermissions(this.userName.toLowerCase());
  }

  getUserTypeForPermissions(userName) {
    this.http
      .post(environment.url + "GetSurgeriesCalendarUserNamePermissions", {
        _userName: userName
      })
      .subscribe((Response) => {
        this.userObject = Response["d"];
      });
  }


  openSurgeryRoomSchedule(room) {
    // open the dialog only by super user and user of the same department and if the surgery room is empty! tooo much SHITTTT IS GOING ON
    if (this.userObject.UserDepartment.includes("All") || (this.userObject.UserDepartment.includes(room.S_DEPARTMENT_NAME) || room.S_DEPARTMENT_NAME == null)) {
      const dialogRef = this.dialog.open(SurgeriesManagementComponent, {
        data: {
          room: room,
          roomsList: this.surgeryRooms,
          user: this.userObject
        },
        disableClose: true
      })
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    } else {
      this.openSnackBar("אינך מורשה לפתוח תיבה זו");
    }
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

}
