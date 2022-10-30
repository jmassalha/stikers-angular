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

export interface Surgeries {
    RoomGroup: string;
    Department: string;
    QuarterYear: string;

    WorkDays: number;
    WorkDaysLastQ: number
    WorkDaysPreviousYearQ: number
    DiffWorkDaysLastQ: number
    DiffWorkDaysPreviousYearQ: number

    TotalMinutes: number
    TotalMinutesLastQ: number
    TotalMinutesPreviousYearQ: number
    DiffTotalMinutesLastQ: number
    DiffTotalMinutesPreviousYearQ: number

    TotalQuantity: number
    TotalQuantityLastQ: number
    TotalQuantityPreviousYearQ: number
    DiffDepartTotalQuantityLastQ : number
    DiffDepartTotalQuantityPreviousYearQ: number
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
        // "DepartWorkDays",
        "DiffWorkDaysLastQ",
        "DiffWorkDaysPreviousYearQ",
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
    dataSourceTop = new MatTableDataSource(this.dataTable_Top);
    dataSourceMax = new MatTableDataSource(this.dataTable_Max);
    SurgeryRooms: Surgeries[] = [];
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
        mMenuPerm.setRoutName("servers");
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
        this.getDataFromServer("RoomGroupDesc");
    }

    getToolTipText(row: Surgeries) {
        return `ימי עבודה ברבעון נוכחי: ${row.WorkDays}
        ימי עבודה ברבעון הקודם: ${row.WorkDaysLastQ}
        ימי עבודה ברבעון שנה קודמת: ${row.WorkDaysPreviousYearQ}

        כמות ברבעון נוכחי: ${row.TotalQuantity}
        כמות ברבעון הקודם: ${row.TotalQuantityLastQ}
        כמות ברבעון שנה קודם: ${row.TotalQuantityLastQ}

        זמן ברבעון נוכחי: ${(row.TotalMinutes/60).toFixed(2)}
        זמן ברבעון הקודם: ${(row.TotalMinutesLastQ/60).toFixed(2)}
        זמן ברבעון שנה קודם: ${(row.TotalMinutesPreviousYearQ/60).toFixed(2)}
        `;
    }
    filterDataBy(RoomGroup) {
        this.selectedBtn = RoomGroup;
        this.getDataFromServer("Top");
        this.getDataFromServer("Max");
    }
    openAddNoteDialog(element) {
        const dialogRef = this.dialog.open(AddNewNoteComponent, {
            data: {
                element: element,
                dialog: this.dialog
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
                "http://localhost:64964/WebService.asmx/GetSurgeryControlMain",
               // "http://srv-apps-prod/RCF_WS/WebService.asmx/GetSurgeryControlMain",
                {
                    type: type,
                    room: this.selectedBtn,
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
                } else if (type == "RoomGroupDesc") {
                    this.SurgeryRooms.splice(0, this.SurgeryRooms.length);
                    //debugger
                    this.SurgeryRooms = Response["d"];
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
