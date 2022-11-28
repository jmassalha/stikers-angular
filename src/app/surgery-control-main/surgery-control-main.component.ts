import { I } from "@angular/cdk/keycodes";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MenuPerm } from "../menu-perm";
import { AddNewNoteComponent } from "./add-new-note/add-new-note.component";

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
}

@Component({
    selector: "app-surgery-control-main",
    templateUrl: "./surgery-control-main.component.html",
    styleUrls: ["./surgery-control-main.component.css"],
})
export class SurgeryControlMainComponent implements OnInit {
    displayedColumns: string[] = [
        "RoomGroup",
        "Department",
        "QuarterYear",
        // "DepartWorkRooms",
        "DiffWorkRoomsLastQ",
        "DiffWorkRoomsPreviousYearQ",
        "Blank_1",
        "DiffTotalMinutesLastQ",
        "DiffTotalMinutesPreviousYearQ",
        "Blank_2",
        "DiffDepartTotalQuantityLastQ",
        "DiffDepartTotalQuantityPreviousYearQ",
        "addNote",
    ];
    displayedColumnsRooms: string[] = [
        "RoomGroup",
        //"Department",
        "QuarterYear",
        "RoomNumber",
        // "DepartWorkRooms",
        "DiffWorkRoomsLastQ",
        "DiffWorkRoomsPreviousYearQ",
        "Blank_1",
        "DiffTotalMinutesLastQ",
        "DiffTotalMinutesPreviousYearQ",
        "Blank_2",
        "DiffDepartTotalQuantityLastQ",
        "DiffDepartTotalQuantityPreviousYearQ",
        "addNote",
    ];
    selectedBtn = "חדר ניתוח כללי";
    dataTable_Top: Surgeries[] = [];
    dataTable_Max: Surgeries[] = [];
    dataTable_Rooms: Surgeries[] = [];
    dataSourceTop = new MatTableDataSource(this.dataTable_Top);
    dataSourceMax = new MatTableDataSource(this.dataTable_Max);
    dataSourceRooms = new MatTableDataSource(this.dataTable_Rooms);
    SurgeryRooms: Surgeries[] = [];
    SurgeryRoomsNumber: Surgeries[] = [];
    RoomsNumbers: string[] = [];
    QuarterYear: Surgeries[] = [];
    selectedQuarterYear: string[] = [];
    constructor(
        private _snackBarUsers: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalServiceresearchesusers: NgbModal,
        private formBuilderUsers: FormBuilder,
        activeModal: NgbActiveModal,
        private mMenuPerm: MenuPerm,
        public dialog: MatDialog
    ) {
        mMenuPerm.setRoutName("surgerycontrolmain");
        setTimeout(() => {
            if (!mMenuPerm.getHasPerm()) {
                localStorage.clear();
                this.router.navigate(["login"]);
            }
        }, 2000);
    }

    ngOnInit(): void {
        this.getDataFromServer("Top");
        this.getDataFromServer("Max");
        this.getDataFromServer("Rooms");
        this.getDataFromServer("RoomGroupDesc");
        this.getDataFromServer("QuarterYear");
        this.getDataFromServer("RoomsNumbers");
    }

    getToolTipText(row: Surgeries) {
        //debugger
        //console.log(row)
        var QuarterYear = row.QuarterYear.split("-");
        var currentYear = QuarterYear[0];
        var lastYear = "";
        var prevYear = "";
        var cuurentQ = QuarterYear[1];
        var lastQ = "";
        var prevQ = "";
        switch (QuarterYear[1]) {
            case "Q1":
                lastYear = (parseInt(currentYear) - 1).toString();
                prevYear = (parseInt(currentYear) - 1).toString();
                lastQ = "Q4";
                prevQ = QuarterYear[1];
                break;
            case "Q2":
                lastYear = parseInt(currentYear).toString();
                prevYear = (parseInt(currentYear) - 1).toString();
                lastQ = "Q1";
                prevQ = QuarterYear[1];
                break;
            case "Q3":
                lastYear = parseInt(currentYear).toString();
                prevYear = (parseInt(currentYear) - 1).toString();
                lastQ = "Q2";
                prevQ = QuarterYear[1];
                break;
            case "Q4":
                lastYear = parseInt(currentYear).toString();
                prevYear = (parseInt(currentYear) - 1).toString();
                lastQ = "Q3";
                prevQ = QuarterYear[1];
                break;
        }
        if (QuarterYear[1] == "Q1") {
            prevYear = (parseInt(currentYear) - 1).toString();
            lastQ = "Q4";
        }
        return `Rooms:\r\n\  ${currentYear}-${cuurentQ}: ${row.WorkRooms}\r\n\ ${lastYear}-${lastQ}: ${row.WorkRoomsLastQ}\r\n\ ${prevYear}-${prevQ}: ${row.WorkRoomsPreviousYearQ}\r\n\ \r\n\ Time:\r\n\ ${currentYear}-${cuurentQ}: ${(row.TotalMinutes / 60).toFixed(2)}\r\n\ ${lastYear}-${lastQ}: ${(row.TotalMinutesLastQ / 60).toFixed(2)}\r\n\ ${prevYear}-${prevQ}: ${(row.TotalMinutesPreviousYearQ / 60).toFixed(2)}\r\n\ \r\n\ Quantity:\r\n\ ${currentYear}-${cuurentQ}: ${row.TotalQuantity}\r\n\ ${lastYear}-${lastQ}: ${row.TotalQuantityLastQ}\r\n\ ${prevYear}-${prevQ}: ${row.TotalQuantityPreviousYearQ}`;
    }
    filterDataByQuarterYear(event) {
        if (event.checked) {
            if (
                this.selectedQuarterYear.indexOf(
                    event.source._elementRef.nativeElement.innerText
                ) === -1
            )
                this.selectedQuarterYear.push(
                    event.source._elementRef.nativeElement.innerText
                );
        } else {
            this.selectedQuarterYear.forEach((element, index) => {
                if (element == event.source._elementRef.nativeElement.innerText)
                    this.selectedQuarterYear.splice(index, 1);
            });
        }
        console.log(this.selectedQuarterYear);
        //debugger
        this.getDataFromServer("Top");
        this.getDataFromServer("Max");
        this.getDataFromServer("RoomsNumbers");
    }
    filterDataBy(RoomGroup) {
        this.selectedBtn = RoomGroup;
        this.getDataFromServer("Top");
        this.getDataFromServer("Max");
        //this.getDataFromServer("RoomsNumbers");
    }
    filterDataByRoom(event) {
        if (event.checked) {
            if (
                this.RoomsNumbers.indexOf(
                    event.source._elementRef.nativeElement.innerText
                ) === -1
            )
                this.RoomsNumbers.push(
                    event.source._elementRef.nativeElement.innerText
                );
        } else {
            this.RoomsNumbers.forEach((element, index) => {
                if (element == event.source._elementRef.nativeElement.innerText)
                    this.RoomsNumbers.splice(index, 1);
            });
        }
        this.getDataFromServer("RoomsNumbers");
    }
    openAddNoteDialog(element) {
        const dialogRef = this.dialog.open(AddNewNoteComponent, {
            data: {
                element: element,
                dialog: this.dialog,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
        });
    }
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSourceTop.filter = filterValue.trim().toLowerCase();
        this.dataSourceMax.filter = filterValue.trim().toLowerCase();
    }
    getDataFromServer(type) {
        if ($("#loader").hasClass("d-none")) {
            $("#loader").removeClass("d-none");
        }
        this.http
            .post(
                //"http://srv-apps-prod/RCF_WS/WebService.asmx/GetSurgeryControlMain",
                "http://srv-apps-prod/RCF_WS/WebService.asmx/GetSurgeryControlMain",
                {
                    type: type,
                    room: this.selectedBtn,
                    quarterYear: this.selectedQuarterYear,
                    roomnumbers: this.RoomsNumbers,
                }
            )
            .subscribe((Response) => {
                if (type == "Top") {
                    this.dataTable_Top.splice(0, this.dataTable_Top.length);
                    ////debugger
                    this.dataTable_Top = Response["d"];
                    this.dataSourceTop = new MatTableDataSource(
                        this.dataTable_Top
                    );
                    this.dataSourceTop.filter = this.selectedBtn
                        .trim()
                        .toLowerCase();
                } else if (type == "Max") {
                    this.dataTable_Max.splice(0, this.dataTable_Max.length);
                    ////debugger
                    this.dataTable_Max = Response["d"];

                    this.dataSourceMax = new MatTableDataSource(
                        this.dataTable_Max
                    );
                    this.dataSourceMax.filter = this.selectedBtn
                        .trim()
                        .toLowerCase();
                }else if (type == "RoomsNumbers") {
                    debugger
                    this.dataTable_Rooms.splice(0, this.dataTable_Rooms.length);
                    ////debugger
                    this.dataTable_Rooms = Response["d"];

                    this.dataSourceRooms = new MatTableDataSource(
                        this.dataTable_Rooms
                    );
                    this.dataSourceRooms.filter = this.selectedBtn
                        .trim()
                        .toLowerCase();
                } else if (type == "RoomGroupDesc") {
                    this.SurgeryRooms.splice(0, this.SurgeryRooms.length);
                    //debugger
                    this.SurgeryRooms = Response["d"];
                } else if (type == "Rooms") {
                    this.SurgeryRoomsNumber.splice(0, this.SurgeryRoomsNumber.length);
                    //debugger
                    this.SurgeryRoomsNumber = Response["d"];
                } else if (type == "QuarterYear") {
                    this.QuarterYear.splice(0, this.QuarterYear.length);
                    //debugger
                    this.QuarterYear = Response["d"];
                }
                console.log(this.dataSourceTop);
                console.log(this.dataSourceMax);
                console.log(this.SurgeryRooms);
                setTimeout(function () {
                    //////debugger

                    $("#loader").addClass("d-none");
                });
            });
    }
}
