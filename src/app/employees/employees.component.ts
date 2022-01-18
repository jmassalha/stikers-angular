import {
    Component,
    OnInit,
    ViewChild,
    AfterViewInit,
    Input,
    EventEmitter,
    Output,
} from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatRadioChange } from "@angular/material/radio";
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";

import {
    NgbModal,
    ModalDismissReasons,
    NgbModalOptions,
    NgbActiveModal,
} from "@ng-bootstrap/ng-bootstrap";
import * as $ from "jquery";
import * as Fun from "../public.functions";
import { formatDate, Time } from "@angular/common";
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
} from "@angular/forms";

export interface Employees {
    RowID: string;
    StartWorkDate: string;
    EmployeeSektorDescription: string;
    EmployeeSektorBlossomDescription: string;
    Title: string;
    FunctionDescription: string;
    DepartnentCode: string;
    EmployeeID: string;
    FirstName: string;
    LastName: string;
    Email: string;
    CellNumber: string;
    DateOfBirth: string;
    Address: string;
    totalRows: string;
}

@Component({
    selector: "app-employees",
    templateUrl: "./employees.component.html",
    styleUrls: ["./employees.component.css"],
})
export class EmployeesComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    displayedColumns: string[] = [
        "EmployeeID",
        "FirstName",
        "LastName",
        "Email",
        "CellNumber",
        "Click",
    ];

    modalOptions: NgbModalOptions = {
        windowClass: "marg-t-60",
    };
    closeResult: string;
    TABLE_DATA: Employees[] = [];
    rowFormData = {} as Employees;
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    tableLoader: Boolean;
    UserSmsStatus: Boolean;
    UserEmailStatus: Boolean;
    resultsLength = 0;
    fliterValEmlpoyees = "";
    StatusPatient = "-1";
    patientForm: FormGroup;

    GroupID = localStorage.getItem("GroupID");
    submitted = false;
    activeModal: NgbActiveModal;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalServicematernitypatients: NgbModal,
        private formBuilder: FormBuilder,
        activeModal: NgbActiveModal
    ) {
        this.activeModal = activeModal;
    }
    @Input()
    foo: string = "bar";
    startdateVal: string;
    enddateVal: string;
    Sdate: FormControl;
    Edate: FormControl;
    fullnameVal: string;
    rowIdVal: string;
    ngOnInit(): void {
        // debugger
        this.UserSmsStatus = false;
        this.UserEmailStatus = false;
        this.fullnameVal = "";
        this.rowIdVal = "0";
        this.loader = false;
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);

        if (
            localStorage.getItem("loginState") != "true" ||
            localStorage.getItem("loginUserName") == ""
        ) {
            this.router.navigate(["login"]);
        } else if (
            localStorage.getItem("loginUserName").toLowerCase() ==
                "jmassalha" ||
            this.GroupID != "0"
        ) {
        } else {
            this.router.navigate(["login"]);
            ///$("#chadTable").DataTable();
        }
        this.getReportEmlpoyeess(this);
    }
    openSnackBar() {
        this._snackBar.open("נשמר בהצלחה", "", {
            duration: 2500,
            direction: "rtl",
            panelClass: "success",
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
    addToGroup(_element) {
      
      //debugger;
      this.http
          .post(
              "http://srv-apps-prod/RCF_WS/WebService.asmx/AddMemberToGroup",
              {
                MemberId: _element.RowID,
                GroupId: this.GroupID,
              }
          )
          .subscribe((Response) => {
              //this.applyFiltermaternitypatients(this.fliterValEmlpoyees);
              this.openSnackBar();
              this.parentFun.emit();
          });
    }
    getReportEmlpoyeess($event: any): void {
        ////debugger
        this.getTableFromServer(
          this.paginator.pageIndex,
          10,
            this.fliterValEmlpoyees
        );
    }
    applyFiltermaternitypatients(filterValue: string) {
        this.fliterValEmlpoyees = filterValue;

        this.getTableFromServer(
          this.paginator.pageIndex,
          this.paginator.pageSize,
            this.fliterValEmlpoyees
        );

        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    getPaginatorData(event: PageEvent) {
        //console.log(this.paginator.pageIndex);

        this.getTableFromServer(
           this.paginator.pageIndex,
            this.paginator.pageSize,
            this.fliterValEmlpoyees
        );
    }

    public getTableFromServer(
        _pageIndex: number,
        _pageSize: number,
        _FreeText: string
    ) {
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // //debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
      //  debugger
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/GetEmployees",
                {
                  pageIndex: _pageIndex,
                  pageSize: _pageSize,
                  serachTxt: _FreeText
                }
            )
            .subscribe((Response) => {
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                //debugger
                this.TABLE_DATA = Response["d"];
                

                // //debugger
                this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                this.resultsLength = parseInt(this.TABLE_DATA[0].totalRows);
                setTimeout(function () {
                    ////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }
}
