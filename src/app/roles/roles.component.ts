import {
    Component,
    OnInit,
    ViewChild,
    AfterViewInit,
    Input,
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
} from "@ng-bootstrap/ng-bootstrap";
import * as $ from "jquery";
import * as Fun from "../public.functions";
import { Time } from "@angular/common";
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
} from "@angular/forms";

export interface Role {
    R_ROW_ID: number;
    R_ROLE_NAME: string;
    R_ROW_STATUS: string;
}

@Component({
    selector: "app-roles",
    templateUrl: "./roles.component.html",
    styleUrls: ["./roles.component.css"],
})
export class RolesComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    displayedColumns: string[] = [
        "R_ROLE_NAME", //"D_SHEET_ID",
        "D_CLICK",
    ];

    modalOptions: NgbModalOptions;
    closeResult: string;
    TABLE_DATA: Role[] = [];
    rowFormData = {} as Role;
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    tableLoader: Boolean;
    resultsLength = 0;
    RoleStatus = 0;
    fliterVal = "";
    rolesForm: FormGroup;
    submitted = false;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private formBuilder: FormBuilder
    ) {}
    @Input()
    foo: string = "bar";
    startdateVal: string;
    enddateVal: string;
    Sdate: FormControl;
    Edate: FormControl;
    fullnameVal: string;
    rowIdVal: string;
    rowElement: Role = {
        R_ROW_ID: 0,
        R_ROLE_NAME: "",
        R_ROW_STATUS: "",
    };
    ngOnInit(): void {
        this.fullnameVal = "";
        this.rowIdVal = "0";
        this.loader = false;
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);
        this.rolesForm = this.formBuilder.group({
            fullnameVal: ["", Validators.required],
            rowIdVal: ["", false],
        });

        if (
            localStorage.getItem("loginState") != "true" ||
            localStorage.getItem("loginUserName") == ""
        ) {
            this.router.navigate(["login"]);
        } else if (
            localStorage.getItem("loginUserName").toLowerCase() ==
                "jmassalha" ||
                localStorage.getItem("loginUserName").toLowerCase() ==
                    "eonn" ||
            localStorage.getItem("loginUserName").toLowerCase() == "samer" ||
            localStorage.getItem("loginUserName").toLowerCase() == "mbilya" ||
            localStorage.getItem("loginUserName").toLowerCase() == "owertheim"
        ) {
        } else {
            this.router.navigate(["login"]);
            ///$("#chadTable").DataTable();
        }
        this.getReport(this);
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
    onSubmit() {
        this.submitted = true;
        ////debugger
        // stop here if form is invalid
        if (this.rolesForm.invalid) {
            return;
        }

        this.rowElement.R_ROLE_NAME = this.rolesForm.value.fullnameVal;
        this.rowElement.R_ROW_ID = this.rolesForm.value.rowIdVal;
       // //debugger
        this.http
            .post("http://srv-apps/wsrfc/WebService.asmx//PoriaRoles", {
                _roleName: this.rolesForm.value.fullnameVal,
                _roleStatus: 1,
                _rowId: this.rolesForm.value.rowIdVal,
            })
            .subscribe((Response) => {
                var json = Response["d"].split(", ");
                //debugger
                if (" UPDATE" != json[2]) {
                    this.rowElement.R_ROLE_NAME = json[0];
                    this.rowElement.R_ROW_ID = json[1];
                    this.TABLE_DATA.push(this.rowElement);
                    this.dataSource = new MatTableDataSource<any>(
                        this.TABLE_DATA
                    );
                    this.resultsLength = this.resultsLength + 1;
                }

                //var vars = json.split
                // //debugger;
                // //debugger 888888
                this.openSnackBar();
            });
        // display form values on success
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.rolesForm.value, null, 4));
        this.modalService.dismissAll();
    }
    editRow(content, _type, _element) {
        ////debugger
        this.rowElement = _element;
        this.fullnameVal = _element.R_ROLE_NAME;
        this.rowIdVal = _element.R_ROW_ID;
        this.rolesForm = this.formBuilder.group({
            fullnameVal: [this.fullnameVal, Validators.required],
            rowIdVal: [this.rowIdVal, false],
        });
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                ////debugger
                if ("Save" == result) {
                    // //debugger;
                    //this.saveChad(_element.ROW_ID);
                }
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }
    getReport($event: any): void {
        ////debugger
        this.getTableFromServer(this.paginator.pageIndex, 10, this.fliterVal);
    }
    applyFilter(filterValue: string) {
        this.fliterVal = filterValue;

        this.getTableFromServer(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.fliterVal
        );

        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    open(content, _type, _element) {
        //$('#free_text').text(_element.FreeText);
        ////debugger

        this.rowElement = {
            R_ROW_ID: 0,
            R_ROLE_NAME: "",
            R_ROW_STATUS: "",
        };

        this.fullnameVal = "";
        this.rowIdVal = "0";

        this.rolesForm = this.formBuilder.group({
            fullnameVal: ["", Validators.required],
            rowIdVal: ["0", false],
        });
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                ////debugger
                if ("Save" == result) {
                    // //debugger;
                    //this.saveChad(_element.ROW_ID);
                }
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return "by pressing ESC";
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return "by clicking on a backdrop";
        } else {
            return `with: ${reason}`;
        }
    }

    ngAfterViewInit(): void {}
    getPaginatorData(event: PageEvent) {
        //console.log(this.paginator.pageIndex);

        this.getTableFromServer(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.fliterVal
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
        this.http
            .post("http://srv-apps/wsrfc/WebService.asmx//GetPoriaRoles", {
                _pageIndex: _pageIndex,
                _pageSize: _pageSize,
                _FreeText: _FreeText,
            })
            .subscribe((Response) => {
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                var json = $.parseJSON(Response["d"]);
                let RolesData = $.parseJSON(json["aaData"]);
                ////debugger
                for (var i = 0; i < RolesData.length; i++) {
                    ////debugger
                    this.TABLE_DATA.push({
                        R_ROW_ID: RolesData[i].R_ROW_ID,
                        R_ROLE_NAME: RolesData[i].R_ROLE_NAME,
                        R_ROW_STATUS: RolesData[i].R_ROW_STATUS,
                    });
                }

                // //debugger
                this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                this.resultsLength = parseInt(json["iTotalRecords"]);
                setTimeout(function () {
                    ////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }
}
