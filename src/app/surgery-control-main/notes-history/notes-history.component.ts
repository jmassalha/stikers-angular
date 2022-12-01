import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
    FormArray,
} from "@angular/forms";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
export interface Staff {
    Department: string;
    FullName: string;
    PhoneNumber: string;
}
export interface Surgeries {
    RoomGroup: string;
    Department: string;
    QuarterYear: string;
    RoomNumber: string;

    WorkRooms: number;
    WorkRoomsLastQ: number;
    WorkRoomsPreviousYearQ: number;
    DiffWorkRoomsLastQ: number;
    DiffWorkRoomsPreviousYearQ: number;
    TotalMinutes: number;
    TotalMinutesLastQ: number;
    TotalMinutesPreviousYearQ: number;
    DiffTotalMinutesLastQ: number;
    DiffTotalMinutesPreviousYearQ: number;

    TotalQuantity: number;
    TotalQuantityLastQ: number;
    TotalQuantityPreviousYearQ: number;
    DiffDepartTotalQuantityLastQ: number;
    DiffDepartTotalQuantityPreviousYearQ: number;
    Blank_1: string;
    Blank_2: string;
    Staffs: Staff;
    RowType: string;
}
export interface DialogData {
    element: Surgeries;
    dialog: MatDialog;
}
export interface SurgeryControlMainNoteData {
  PhoneNumber: string;
  RoomGroupDesc: string;
  QuarterYear: string;
  Department: string;
  Room: string;
  SmsValue: string;
  SendDate: string;
  RequestDate: string;
  SmsKey: string;
  NoteValue: string;
  FullName: string;
}
@Component({
    selector: "app-notes-history",
    templateUrl: "./notes-history.component.html",
    styleUrls: ["./notes-history.component.css"],
})
export class NotesHistoryComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private http: HttpClient
    ) {
        
    }
    notesData:SurgeryControlMainNoteData[] = [];
    ngOnInit(): void {
      this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/GetSurgeryControlMainNotes",
                //"http://localhost:64964/WebService.asmx/GetSurgeryControlMainNotes",
                {
                  RoomGroup: this.data.element.RoomGroup,
                  Department: this.data.element.Department,
                  QuarterYear: this.data.element.QuarterYear,
                  RoomNumber: this.data.element.RoomNumber
                }
            )
            .subscribe((Response) => {
                
                this.notesData = Response["d"];
                setTimeout(function () {

                    $("#loader").addClass("d-none");
                });
            });
    }
}
