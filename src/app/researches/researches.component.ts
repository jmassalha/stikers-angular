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
import { formatDate } from "@angular/common";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";

import {
    NgbModal,
    ModalDismissReasons,
    NgbModalOptions,
    NgbActiveModal,
} from "@ng-bootstrap/ng-bootstrap";
import * as $ from "jquery";
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
} from "@angular/forms";

export interface Poria_Researches {
    RowID: number;
    ResearchNumber: string;
    ResearchName: string;
    ResearchInsertDate: string;
    ResearchUpdateDate: string;
    ResearchInsertUser: string;
    ResearchUpdateUser: string;
    ResearchStatus: string;
    ResearchStartDate: string;
    ResearchEndDate: string;
    ResearchDepart: string;
}
export interface DropOption {
    value: string;
    name: string;
}
export interface Poria_ResearchesPatients {
    RowID: number;
    PatientId: string;
    PatientFirstName: string;
    PatientLastName: string;
    DateInsert: string;
    UserIdInsert: string;
    DateUpdate: string;
    UserIdUpdate: string;
    PatientStatus: string;
    PatientNumber: string;
}

export interface Poria_ResearchesUsers {
    RowID: number;
    UserName: string;
    UserFirstName: string;
    UserLastName: string;
    UserTel: string;
    DateInsert: string;
    UserStatus: string;
    UserEmail: string;
    UserEmailStatus: string;
    UserSmsStatus: string;
}
export const getDate = function (date: any): string {
    const _date = new Date(date);
    return `${_date.getFullYear()}-${_date.getMonth()}-${_date.getDate()}`;
};
@Component({
    selector: "app-researches",
    templateUrl: "./researches.component.html",
    styleUrls: ["./researches.component.css"],
})
export class ResearchesComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    displayedColumns: string[] = [
        //"RowID", //"D_PERIOD_TO_REPLACE",
        "ResearchNumber",
        "ResearchName",
        "ResearchStartDate",
        "ResearchEndDate",
        "ResearchStatus",
        "CLICK",
        "CLICK_USERS",
        "CLICK_PATIENT",
    ];
    pemAdmin = 2;
    private activeModal: NgbActiveModal;
    modalOptions: NgbModalOptions;
    closeResult: string;
    TABLE_DATA: Poria_Researches[] = [];
    ResearchesUsers: Poria_ResearchesUsers[] = [];
    beds: Poria_ResearchesPatients[] = [];
    rowFormData = {} as Poria_Researches;
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    tableLoader: Boolean;
    Departs: DropOption[];
    resultsLength = 0;
    departStatus = 0;
    fliterVal = "";
    activeOrNot = "";
    ResearchesForm: FormGroup;
    ResearchesUsersForm: FormGroup;
    roomsBedsForm: FormGroup;
    submitted = false;
    perm: Boolean = false;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        activeModal: NgbActiveModal
    ) {
        // //debugger
        this.activeModal = activeModal;
        this.ResearchesUsersForm = this.formBuilder.group({
            roomsDetails: this.formBuilder.array([]),
        });
        this.roomsBedsForm = this.formBuilder.group({
            roomsBedsDetails: this.formBuilder.array([]),
        });
    }
    @Input()
    ResearchName: string;
    ResearchNumber: string;

    ngOnInit(): void {
        this.getDropDownFromServer();
        $("#loader").removeClass("d-none");
        this.getPermission();
        this.ResearchName = "";
        this.ResearchNumber = "";
        this.activeOrNot = "-1";
        this.loader = false;
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);
        this.ResearchesForm = this.formBuilder.group({
            ResearchNumber: ["", Validators.required],
            ResearchName: ["", Validators.required],
            ResearchStatus: ["", Validators.required],
            ResearchStartDate: ["", Validators.required],
            ResearchEndDate: ["", Validators.required],
            ResearchDepart: ["", Validators.required],
            ResearchInsertUser: [
                localStorage.getItem("loginUserName"),
                Validators.required,
            ],
            RowID: ["0", false],
        });
        setTimeout(() => {
            console.log("sleep");
            ////debugger
            if (
                localStorage.getItem("loginUserName").toLowerCase() ==
                    "jmassalha" ||
                localStorage.getItem("loginUserName").toLowerCase() ==
                    "samer" ||
                localStorage.getItem("loginUserName").toLowerCase() ==
                    "owertheim"
            ) {
                this.perm = true;
                this.pemAdmin = 1;
            }
            if (
                localStorage.getItem("loginState") != "true" ||
                localStorage.getItem("loginUserName") == "" ||
                !this.perm
            ) {
                this.router.navigate(["login"]);
            } else if (
                localStorage.getItem("loginUserName").toLowerCase() ==
                    "jmassalha" ||
                localStorage.getItem("loginUserName").toLowerCase() ==
                    "samer" ||
                localStorage.getItem("loginUserName").toLowerCase() ==
                    "owertheim" ||
                this.perm
            ) {
            } else {
                this.router.navigate(["login"]);
                ///$("#chadTable").DataTable();
            }
            this.getReport(this);
            // And any other code that should run only after 5s
        }, 1000);
        // //debugger
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
        //////debugger
        // stop here if form is invalid
        this.ResearchesForm.value.ResearchStartDate = formatDate(
            this.ResearchesForm.value.ResearchStartDate,
            "yyyy-MM-dd",
            "en-US"
        );
        this.ResearchesForm.value.ResearchEndDate = formatDate(
            this.ResearchesForm.value.ResearchEndDate,
            "yyyy-MM-dd",
            "en-US"
        );
        if (this.ResearchesForm.invalid) {
            return;
        }
        ////debugger
        setTimeout(function () {
            $("#loader").removeClass("d-none");
        });
        this.http
            .post(
                "http://srv-apps/wsrfc/WebService.asmx//InsertOrUpdateResearches",
                {
                    _ResearchesForm: this.ResearchesForm.value,
                }
            )
            .subscribe((Response) => {
                this.getReport(null);
                this.openSnackBar();
                setTimeout(function () {
                    $("#loader").addClass("d-none");
                });
            });
        // display form values on success
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.ResearchesForm.value, null, 4));
        this.modalService.dismissAll();
    }

    getPermission() {
        this.http
            .post(
                "http://srv-apps/wsrfc/WebService.asmx//getResearchPermission",
                {
                    _UserName: localStorage.getItem("loginUserName"),
                }
            )
            .subscribe((Response) => {
                // //////////debugger
                ////debugger
                var json = $.parseJSON(Response["d"]);
                switch (json) {
                    case 1:
                    case "1":
                        this.perm = true;
                        break;                   
                }
                setTimeout(function () {
                    // $("#loader").addClass("d-none");
                    //this.DeleteRowId = "";
                    //this.openSnackBar("נמחק בהצלחה", "success");
                }, 500);
            });
    }
    public getDropDownFromServer() {
        debugger

        this.http
            .post(
                "http://srv-apps/wsrfc/WebService.asmx//GetResearchesDepart",
                {}
            )
            .subscribe((Response) => {
                var json = $.parseJSON(Response["d"]);
                debugger
                this.Departs = json;
            });
    }
    showPatient(content, _type, _element) {
        localStorage.setItem("ReseachRowId", _element.RowID);
        this.modalService.open(content, this.modalOptions);
    }
    showResearchesUsers(content, _type, _element) {
        localStorage.setItem("ReseachRowId", _element.RowID);
        this.activeModal = this.modalService.open(content, this.modalOptions);
    }
    editRow(content, _type, _element) {
        this.ResearchName = _element.ResearchName;
        this.ResearchNumber = _element.ResearchNumber;
        //debugger;
        this.ResearchesForm = this.formBuilder.group({
            ResearchNumber: [_element.ResearchNumber, Validators.required],
            ResearchName: [_element.ResearchName, Validators.required],
            ResearchStatus: [_element.ResearchStatus + "", Validators.required],
            ResearchDepart: [_element.ResearchDepart , Validators.required],
            ResearchStartDate: [
                _element.ResearchStartDate,
                Validators.required,
            ],
            ResearchEndDate: [_element.ResearchEndDate, Validators.required],
            ResearchUpdateUser: [
                localStorage.getItem("loginUserName"),
                Validators.required,
            ],
            RowID: [_element.RowID, false],
        });
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                //////debugger
                if ("Save" == result) {
                    // ////debugger;
                    //this.saveChad(_element.ROW_ID);
                }
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }
    getReport($event: any): void {
        //////debugger
        this.getTableFromServer(
            this.paginator.pageIndex,
            10,
            this.fliterVal,
            this.activeOrNot
        );
    }
    applyFilter(filterValue: string) {
        this.fliterVal = filterValue;

        this.getTableFromServer(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.fliterVal,
            this.activeOrNot
        );

        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    open(content, _type, _element) {
        this.ResearchNumber = "";
        this.ResearchName = "חדש";
        ////debugger;
        this.ResearchesForm = this.formBuilder.group({
            ResearchNumber: ["", Validators.required],
            ResearchName: ["", Validators.required],
            ResearchStatus: ["1", Validators.required],
            ResearchStartDate: ["", Validators.required],
            ResearchEndDate: ["", Validators.required],
            ResearchDepart: ["", Validators.required],
            ResearchInsertUser: [
                localStorage.getItem("loginUserName"),
                Validators.required,
            ],
            RowID: ["0", false],
        });
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                //////debugger
                if ("Save" == result) {
                    // ////debugger;
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
            this.fliterVal,
            this.activeOrNot
        );
    }

    public getTableFromServer(
        _pageIndex: number,
        _pageSize: number,
        _FreeText: string,
        _activeOrNot: string
    ) {
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // ////debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        this.http
            .post("http://srv-apps/wsrfc/WebService.asmx//GetResearchesTable", {
                _pageIndex: _pageIndex,
                _pageSize: _pageSize,
                _freeText: _FreeText,
                _activeOrNot: _activeOrNot,
                _pemAdmin: this.pemAdmin,
                _userName: localStorage.getItem("loginUserName"),
            })
            .subscribe((Response) => {
                //////debugger
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                var json = $.parseJSON(Response["d"]);
                let Poria_Researches = $.parseJSON(json["Researches"]);
                //  //debugger
                for (var i = 0; i < Poria_Researches.length; i++) {
                    this.TABLE_DATA.push({
                        RowID: Poria_Researches[i].RowID,
                        ResearchNumber: Poria_Researches[i].ResearchNumber,
                        ResearchName: Poria_Researches[i].ResearchName,
                        ResearchInsertDate:
                            Poria_Researches[i].ResearchInsertDate,
                        ResearchUpdateDate:
                            Poria_Researches[i].ResearchUpdateDate,
                        ResearchInsertUser:
                            Poria_Researches[i].ResearchInsertUser,
                        ResearchUpdateUser:
                            Poria_Researches[i].ResearchUpdateUser,
                        ResearchStatus: Poria_Researches[i].ResearchStatus,
                        ResearchStartDate:
                            Poria_Researches[i].ResearchStartDate,
                        ResearchEndDate: Poria_Researches[i].ResearchEndDate,
                        ResearchDepart: Poria_Researches[i].ResearchDepart,
                    });
                }

                // ////debugger
                this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                this.resultsLength = parseInt(json["totalRows"]);
                setTimeout(function () {
                    //////debugger
                    //if (tableLoader) {
                    $("#loader").addClass("d-none");
                    // }
                });
            });
    }
}
