import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
  urgentSurgeryRooms: any = [];
  physicalSurgeryRooms: any = {
    roomsNumber: 0,
    SurgeriesNumber: 0
  };
  virtualSurgeryRooms: any = {
    roomsNumber: 0,
    SurgeriesNumber: 0
  };
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
  @ViewChild('modalUrgentSurgeries', { static: true }) modalUrgentSurgeries: TemplateRef<any>;
  viewDate: Date;

  constructor(
    public dialogRef: MatDialogRef<SurgeryRoomsMenuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    public datePipe: DatePipe,
    private http: HttpClient,
    public dialog: MatDialog
  ) {
    this.surgeryRooms = data.event.day.events;
    this.surgeryRooms.forEach((element, index) => {
      let numberOfPhysical = element.SurgeryRooms.filter(x => x.SurgeryRoom.includes('פז'));
      let numberOfVirtual = element.SurgeryRooms.filter(x => x.SurgeryRoom.includes('ור'));
      this.surgeryRooms[index]['NumberOfSurgeriesRoomsPhysical'] = this.physicalSurgeryRooms.roomsNumber = numberOfPhysical.length;
      this.surgeryRooms[index]['NumberOfSurgeriesRoomsVirtual'] = numberOfVirtual.length;
      this.surgeryRooms[index]['NumberOfSurgeriesPhysical'] = 0
      this.surgeryRooms[index]['NumberOfSurgeriesVirtual'] = 0
      this.surgeryRooms[index].title2 = this.surgeryRooms[index].title.split('-')[0];
      for (let i = 0; i < numberOfPhysical.length; i++) {
        this.surgeryRooms[index]['NumberOfSurgeriesPhysical'] += parseInt(numberOfPhysical[i].NumberOfSurgeries);
      }
      for (let i = 0; i < numberOfVirtual.length; i++) {
        this.surgeryRooms[index]['NumberOfSurgeriesVirtual'] += parseInt(numberOfVirtual[i].NumberOfSurgeries);
      }
    });
    this.todaysName = this.dayNamesArray[data.event.day.day].name;
  }


  ngOnInit(): void {
    this.getUserTypeForPermissions(this.userName.toLowerCase());
    this.viewDate = this.data.event.day.date;
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


  openSurgeryRoomSchedule(room, type) {
    room['type'] = type;
    // open the dialog only by super user and user of the same department and if the surgery room is empty! tooo much SHITTTT IS GOING ON
    if (this.userObject.UserDepartment.includes("All") || (this.userObject.UserDepartment.includes(room.S_DEPARTMENT_NAME) || room.S_DEPARTMENT_NAME == null)) {
      const dialogRef = this.dialog.open(SurgeriesManagementComponent, {
        data: {
          room: room,
          roomsList: room.SurgeryRooms,
          user: this.userObject
        },
        width: '200%',
        disableClose: true
      })
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    } else {
      this.openSnackBar("אינך מורשה לפתוח תיבה זו");
    }
  }

  openUrgentSurgeriesSchedule() {
    let fullDate = this.datePipe.transform(this.viewDate, 'yyyy-MM-dd');
    this.http
      .post(environment.url + "GetUrgentSurgeriesByDate", {
        _fullDate: fullDate,
      })
      .subscribe((Response) => {
        this.urgentSurgeryRooms = Response["d"].SurgeriesCalendarClassList;
        this.urgentSurgeryRooms = this.urgentSurgeryRooms.sort((a, b) => a.SurgeryRoom.localeCompare(b.SurgeryRoom));
        this.dialog.open(this.modalUrgentSurgeries, {
          width: '60%',
          data: this.urgentSurgeryRooms,
          disableClose: false
        });
      });
  }

  closeModal() {
    this.dialog.closeAll();
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

}
