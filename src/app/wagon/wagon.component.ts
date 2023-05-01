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
import { AddOrEditWagonsComponent } from "./add-or-edit-wagons/add-or-edit-wagons.component";
export interface Wagon {
  RowId: string;
  WagonName: string;
  SerialNumber: string;
  Degem: string;
  Type: string;
  Location: string;
  ConnectionType: string;
  Status: string;
  AddedByUser: string;
  AddedDate: string;
  UpdatedByUser: string;
  UpdatedDate: string;
}
@Component({
  selector: 'app-wagon',
  templateUrl: './wagon.component.html',
  styleUrls: ['./wagon.component.css']
})
export class WagonComponent implements OnInit {
  
  TABLE_DATA: Wagon[] = [];
  dataSource = new MatTableDataSource<Wagon>(this.TABLE_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    "WagonName",
    "SerialNumber",
    "Degem",
    "Type",
    "Location",
    "ConnectionType",
    "Status",
    "editWagon",
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
    mMenuPerm.setRoutName("wagons");
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
    this.getTableFromWagons();
  }
  open(): void {
    const element: Wagon = {
      RowId: "0",
      WagonName: "",
      SerialNumber: "",
      Degem: "",
      Type: "",
      Location: "",
      ConnectionType: "",
      Status: "",
      AddedByUser: "",
      AddedDate: "",
      UpdatedByUser: "",
      UpdatedDate: ""
    };
    const dialogRef = this.dialog.open(AddOrEditWagonsComponent, {
      data: {
        element: element,
        dialog: this.dialog,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.getTableFromWagons();
    });
  }
  editRow(element: Wagon): void {
    const dialogRef = this.dialog.open(AddOrEditWagonsComponent, {
      data: {
        element: element,
        dialog: this.dialog,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.getTableFromWagons();
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  public getTableFromWagons() {
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
      //.post("http://srv-apps-prod/RCF_WS/WebService.asmx/getAllWagons", {
      .post("http://localhost:64964/WebService.asmx/getAllWagons", {
      })
      .subscribe((Response) => {
        //////////debugger
        this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
        this.TABLE_DATA = Response["d"];
        ////debugger

        this.dataSource = new MatTableDataSource<Wagon>(
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
