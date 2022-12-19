import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MenuPerm } from "../menu-perm";
import { AddOrEditMasterHpidComponent } from "./add-or-edit-master-hpid/add-or-edit-master-hpid.component";
export interface MasterHPID {
    RowId: string;
    HPID: string;
    CurrentRoom: string;
    CurrentCabinet: string;
    CurrentU: string;
    CurrentHeightU: string;
    PhysicalName: string;
    DeviceType: string;
    Serial: string;
    CustomerID: string;
    PowerCabels: string;
    ShelfRailsEars: string;
    MovePhase: string;
    FutureRoom: string;
    FutureCab: string;
    FutureU: string;
    Owner: string;
    DeviceCategory: string;
    F1st: string;
    F2nd: string;
    F3rd: string;
    OldRoom: string;
    UpdateDateTime: string;
    InsertDateTime: string;
    UserUpdate: string;
    UserInsert: string;
    FutureIndex: string;
    CurrentIndex: string;
    LogicalName: string;
}
@Component({
    selector: "app-master-hpid",
    templateUrl: "./master-hpid.component.html",
    styleUrls: ["./master-hpid.component.css"],
})
export class MasterHpidComponent implements OnInit {
    TABLE_DATA: MasterHPID[] = [];
    dataSource = new MatTableDataSource<MasterHPID>(this.TABLE_DATA);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns: string[] = [
        "HPID",
        "CurrentRoom",
        "DeviceType",
        "Serial",
        "CustomerID",
        "Owner",
        "DeviceCategory",
        "editIPPoint",
    ];
    resultsLength = 0;
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
        mMenuPerm.setRoutName("masterhpid");
        setTimeout(() => {
            if (!mMenuPerm.getHasPerm()) {
                localStorage.clear();
                this.router.navigate(["login"]);
            }
        }, 2000);
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
    ngOnInit(): void {
        this.getTableFromMasterHPID();
    }
    open(): void {
        const element: MasterHPID = {
            RowId: "0",
            HPID: "",
            CurrentRoom: "",
            CurrentCabinet: "",
            CurrentU: "",
            CurrentHeightU: "",
            PhysicalName: "",
            DeviceType: "",
            Serial: "",
            CustomerID: "",
            PowerCabels: "",
            ShelfRailsEars: "",
            MovePhase: "",
            FutureRoom: "",
            FutureCab: "",
            FutureU: "",
            Owner: "",
            DeviceCategory: "",
            F1st: "",
            F2nd: "",
            F3rd: "",
            OldRoom: "",
            UserInsert: "",
            InsertDateTime: "",
            UpdateDateTime: "",
            UserUpdate: "",
            FutureIndex: "",
            CurrentIndex: "",
            LogicalName: "",
        };
        const dialogRef = this.dialog.open(AddOrEditMasterHpidComponent, {
            data: {
                element: element,
                dialog: this.dialog,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
            this.getTableFromMasterHPID();
        });
    }
    editRow(element: MasterHPID): void {
        const dialogRef = this.dialog.open(AddOrEditMasterHpidComponent, {
            data: {
                element: element,
                dialog: this.dialog,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
            this.getTableFromMasterHPID();
        });
    }
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    public getTableFromMasterHPID() {
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // ////////debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        ////debugger
        //http://srv-apps-prod/RCF_WS/WebService.asmx/
        //http://srv-apps-prod/RCF_WS/WebService.asmx/
        this.http
            //.post("http://localhost:64964/WebService.asmx/getAllMasterHPID", {
                .post("http://srv-apps-prod/RCF_WS/WebService.asmx/getAllMasterHPID",{
            })
            .subscribe((Response) => {
                //////////debugger
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                this.TABLE_DATA = Response["d"];
                ////debugger

                this.dataSource = new MatTableDataSource<MasterHPID>(
                    this.TABLE_DATA
                );
                // debugger
                this.resultsLength = this.TABLE_DATA.length;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                setTimeout(function () {
                    //////////debugger
                    //if (tableLoader) {
                    $("#loader").addClass("d-none");
                    // }
                });
            });
    }
}
