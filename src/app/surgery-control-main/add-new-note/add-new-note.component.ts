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
    staffs: Surgeries[];
    smsTxt: string;
    dialog: MatDialog;
}
@Component({
    selector: "app-add-new-note",
    templateUrl: "./add-new-note.component.html",
    styleUrls: ["./add-new-note.component.css"],
})
export class AddNewNoteComponent implements OnInit {
    smsForm: FormGroup;
    SelectedStaffs: string[] = [];
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private formBuilder: FormBuilder,
        private http: HttpClient
    ) {
        this.smsForm = this.formBuilder.group({
            SmsValue: [this.data.smsTxt, Validators.required],
            RoomGroupDesc: [this.data.element.RoomGroup, Validators.required],
            QuarterYear: [this.data.element.QuarterYear, Validators.required],
            Department: [this.data.element.Department, Validators.required],
            Room: [this.data.element.RoomNumber, null],
            RowType: [this.data.element.RowType, null],
            Staffs: [this.SelectedStaffs, null],
        });
    }

    ngOnInit(): void {
        console.log(this.data.element);
    }

    logForm($event) {
        console.log($event.source.value);
        if ($event.checked) {
            if (this.SelectedStaffs.indexOf($event.source.value) < 0) {
                this.SelectedStaffs.push($event.source.value);
            }
        } else {
            this.SelectedStaffs.splice(
                this.SelectedStaffs.indexOf($event.source.value),
                1
            );
        }
        console.log(this.SelectedStaffs);
    }
    onSubmit() {
        console.log(this.smsForm.value);
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/SmsToSurgeryControlMain",
               // "http://localhost:64964/WebService.asmx/SmsToSurgeryControlMain",
                {
                    smsForm: this.smsForm.value,
                }
            )
            .subscribe((Response) => {
                this.data.dialog.closeAll();
                setTimeout(function () {
                    //////debugger

                    $("#loader").addClass("d-none");
                });
            });
    }
}
