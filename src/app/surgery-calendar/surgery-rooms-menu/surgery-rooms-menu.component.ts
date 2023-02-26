import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SurgeriesManagementComponent } from '../surgery-rooms-menu/surgeries-management/surgeries-management.component';

@Component({
  selector: 'app-surgery-rooms-menu',
  templateUrl: './surgery-rooms-menu.component.html',
  styleUrls: ['./surgery-rooms-menu.component.css']
})
export class SurgeryRoomsMenuComponent implements OnInit {


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

  constructor(public dialogRef: MatDialogRef<SurgeryRoomsMenuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,) {
    this.surgeryRooms = data.event.day.events;
    this.todaysName = this.dayNamesArray[data.event.day.day].name;
  }


  ngOnInit(): void {
  }


  openSurgeryRoomSchedule(room) {
    const dialogRef = this.dialog.open(SurgeriesManagementComponent, {
      data: room
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
