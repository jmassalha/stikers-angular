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
import { AddOrEditCablesComponent } from "./add-or-edit-cables/add-or-edit-cables.component";
export interface Cables {
    RowId: string;
    SourceRoom: string;
    SourceCab: string;
    SourceU: string;
    HeightU: string;
    HPID: string;
    Name: string;
    DeviceType: string;
    Owner: string;
    CableType: string;
    CurrentConnectionSlotPort: string;
    CurrentConnectionVlan: string;
    CurrentConnectionCable: string;
    PP1NamePort: string;
    PP1Cable: string;
    PP2NamePort: string;
    PP2Cable: string;
    TargetCab: string;
    TargetHPID: string;
    TargetName: string;
    TargetSlotPort: string;
    FuturePhaseMoveNumber: string;
    FutureRoom: string;
    FutureCab: string;
    FutureU: string;
    FutureCableColor: string;
    FutureCable: string;
    FuturePP1NamePort: string;
    FuturePP2Cable: string;
    FuturePP2NamePort: string;
    TargetU: string;
    UpdateDateTime: string;
    InsertDateTime: string;
    UserUpdate: string;
    UserInsert: string;
}
@Component({
    selector: "app-cables",
    templateUrl: "./cables.component.html",
    styleUrls: ["./cables.component.css"],
})
export class CablesComponent implements OnInit {
    TABLE_DATA: Cables[] = [];
    dataSource = new MatTableDataSource<Cables>(this.TABLE_DATA);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns: string[] = [
        "SourceRoom",
        "Name",
        "DeviceType",
        "CableType",
        "editCable",
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
        mMenuPerm.setRoutName("cables");
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
        this.getTableFromCables();
    }
    open(): void {
        const element: Cables = {
            RowId: "0",
            SourceRoom:"",
            SourceCab: "",
            SourceU: "",
            HeightU: "",
            HPID: "",
            Name: "",
            DeviceType: "",
            Owner: "",
            CableType: "",
            CurrentConnectionSlotPort: "",
            CurrentConnectionVlan: "",
            CurrentConnectionCable: "",
            PP1NamePort: "",
            PP1Cable: "",
            PP2NamePort: "",
            PP2Cable: "",
            TargetCab: "",
            TargetHPID: "",
            TargetName: "",
            TargetSlotPort: "",
            FuturePhaseMoveNumber: "",
            FutureRoom: "",
            FutureCab: "",
            FutureU: "",
            FutureCableColor: "",
            FutureCable: "",
            FuturePP1NamePort: "",
            FuturePP2Cable: "",
            FuturePP2NamePort: "",
            TargetU: "",
            UserInsert: "",
            InsertDateTime: "",
            UpdateDateTime: "",
            UserUpdate: "",
        };
        const dialogRef = this.dialog.open(AddOrEditCablesComponent, {
            data: {
                element: element,
                dialog: this.dialog,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
            this.getTableFromCables();
        });
    }
    editRow(element: Cables): void {
        const dialogRef = this.dialog.open(AddOrEditCablesComponent, {
            data: {
                element: element,
                dialog: this.dialog,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
            this.getTableFromCables();
        });
    }
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    public getTableFromCables() {
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
            //.post("http://srv-apps-prod/RCF_WS/WebService.asmx/getAllCables", {
               .post("http://srv-apps-prod/RCF_WS/WebService.asmx/getAllCables",{
            })
            .subscribe((Response) => {
                //////////debugger
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                this.TABLE_DATA = Response["d"];
                ////debugger

                this.dataSource = new MatTableDataSource<Cables>(
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
