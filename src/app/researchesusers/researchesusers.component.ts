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
    NgbActiveModal,
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

export interface ResearchesUsers {
    RowID: number;
    UserName: string;
    UserFirstName: string;
    UserLastName: string;
    UserTel: string;
    DateInsert: string;
    UserStatus: string;
    UserSmsStatus: string;
    UserEmailStatus: string;
    UserEmail: string;
}

@Component({
    selector: "app-researchesusers",
    templateUrl: "./researchesusers.component.html",
    styleUrls: ["./researchesusers.component.css"],
})
export class ResearchesusersComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    displayedColumns: string[] = [
        "UserName",
        "UserFirstName",
        "UserLastName",
        "UserTel",
        "UserEmail",
        "UserStatus",
        "UserSmsStatus",
        "UserEmailStatus",
        "Click",
    ];

    modalOptions: NgbModalOptions = {
        windowClass: "marg-t-60",
    };
    closeResult: string;
    TABLE_DATA: ResearchesUsers[] = [];
    rowFormData = {} as ResearchesUsers;
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    tableLoader: Boolean;
    UserSmsStatus: Boolean;
    UserEmailStatus: Boolean;
    resultsLength = 0;
    fliterValUser = "";
    StatusUser = "-1";
    usersForm: FormGroup;
    submitted = false;
    ReseachRowId = localStorage.getItem("ReseachRowId");
    private activeModal: NgbActiveModal;
    constructor(
        private _snackBarUsers: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalServiceresearchesusers: NgbModal,
        private formBuilderUsers: FormBuilder,
        activeModal: NgbActiveModal
    ) {
        this.activeModal = activeModal;
    }
    @Input()
    foo: string = "bar";
    modalReferenceUsers: any;
    startdateVal: string;
    enddateVal: string;
    Sdate: FormControl;
    Edate: FormControl;
    fullnameValUsers: string;
    rowIdVal: string;
    hideInputs: boolean;
    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
    ngOnInit(): void {
        debugger;
        this.hideInputs = false;
        if (
            this.ReseachRowId == "0" ||
            this.ReseachRowId == undefined ||
            this.ReseachRowId == null
        ) {
            this.hideInputs = true;
            this.displayedColumns = ["UserName", "Click"];
        }
        this.UserSmsStatus = false;
        this.UserEmailStatus = false;
        this.fullnameValUsers = "";
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
            localStorage.getItem("loginUserName").toLowerCase() == "samer" ||
            localStorage.getItem("loginUserName").toLowerCase() == "okatz" ||
            localStorage.getItem("loginUserName").toLowerCase() ==
                "owertheim" ||
            this.ReseachRowId != "0"
        ) {
        } else {
            this.router.navigate(["login"]);
            ///$("#chadTable").DataTable();
        }
        this.getReportUsers(this);
    }
    openSnackBar() {
        this._snackBarUsers.open("נשמר בהצלחה", "", {
            duration: 2500,
            direction: "rtl",
            panelClass: "success",
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
    onSubmit() {
        this.submitted = true;
        debugger;
        // stop here if form is invalid
        if (this.usersForm.invalid) {
            return;
        }
        // //debugger
        this.http
            .post(
                "http://srv-apps/wsrfc/WebService.asmx/InsertOrUpdateResearchesUsers",
                {
                    _usersForm: this.usersForm.value,
                }
            )
            .subscribe((Response) => {
                //debugger
                this.applyFilterresearchesusers(this.fliterValUser);
                this.openSnackBar();
            });
        // display form values on success
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.usersForm.value, null, 4));
        //this.modalServiceresearchesusers.dismiss();
        this.activeModal.close();
        // debugger
        //this.activeModal.close();

        //this.modalReferenceUsers.close('');
    }
    UserSmsStatuschange(_event) {
        if (_event.value == "1") {
            this.UserSmsStatus = true;
        } else {
            this.UserSmsStatus = false;
        }
    }
    UserEmailStatuschange(_event) {
        if (_event.value == "1") {
            this.UserEmailStatus = true;
        } else {
            this.UserEmailStatus = false;
        }
    }
    editRow(content, _type, _element) {
        if (_element.UserSmsStatus == "1") {
            this.UserSmsStatus = true;
        } else {
            this.UserSmsStatus = false;
        }
        if (_element.UserEmailStatus == "1") {
            this.UserEmailStatus = true;
        } else {
            this.UserEmailStatus = false;
        }
        //debugger
        if (
            this.ReseachRowId == "0" ||
            this.ReseachRowId == undefined ||
            this.ReseachRowId == null
        ) {
            this.usersForm = this.formBuilderUsers.group({
                UserName: [_element.UserName, Validators.required],
                UserTel: [_element.UserTel, null],
                UserFirstName: [_element.UserFirstName, null],
                UserLastName: [_element.UserLastName, null],
                UserEmail: [_element.UserEmail, null],
                UserSmsStatus: [_element.UserSmsStatus + "", null],
                UserEmailStatus: [_element.UserEmailStatus + "", null],
                UserStatus: [_element.UserStatus + "", Validators.required],
                RowID: [_element.RowID, null],
                ReseachRowId: [this.ReseachRowId, null],
            });
        } else {
            this.usersForm = this.formBuilderUsers.group({
                UserName: [_element.UserName, Validators.required],
                UserTel: [
                    _element.UserTel,
                    [Validators.required, Validators.pattern("[0-9]{10}")],
                ],
                UserFirstName: [_element.UserFirstName, Validators.required],
                UserLastName: [_element.UserLastName, Validators.required],
                UserEmail: [_element.UserEmail, Validators.required],
                UserSmsStatus: [
                    _element.UserSmsStatus + "",
                    Validators.required,
                ],
                UserEmailStatus: [
                    _element.UserEmailStatus + "",
                    Validators.required,
                ],
                UserStatus: [_element.UserStatus + "", Validators.required],
                RowID: [_element.RowID, Validators.required],
                ReseachRowId: [this.ReseachRowId, Validators.required],
            });
        }

        this.activeModal = this.modalServiceresearchesusers.open(
            content,
            this.modalOptions
        );
    }
    getReportUsers($event: any): void {
        ////debugger
        this.getTableFromServer(
            this.paginator.pageIndex,
            10,
            this.fliterValUser,
            this.StatusUser
        );
    }
    applyFilterresearchesusers(filterValue: string) {
        this.fliterValUser = filterValue;

        this.getTableFromServer(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.fliterValUser,
            this.StatusUser
        );

        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    open(content, _type, _element) {
        //$('#free_text').text(_element.FreeText);
        ////debugger
        this.UserSmsStatus = false;
        this.UserEmailStatus = false;
        if (
            this.ReseachRowId == "0" ||
            this.ReseachRowId == undefined ||
            this.ReseachRowId == null
        ) {
            this.usersForm = this.formBuilderUsers.group({
                UserName: ["", Validators.required],
                UserTel: ["", null],
                UserFirstName: ["", null],
                UserLastName: ["", null],
                UserEmail: ["", null],
                UserSmsStatus: ["", null],
                UserEmailStatus: ["", null],
                UserStatus: ["1", Validators.required],
                RowID: ["0", null],
                ReseachRowId: ["0", null],
            });
        } else {
            this.usersForm = this.formBuilderUsers.group({
                UserName: ["", Validators.required],
                UserTel: [
                    "",
                    [Validators.required, Validators.pattern("[0-9]{10}")],
                ],
                UserFirstName: ["", Validators.required],
                UserLastName: ["", Validators.required],
                UserEmail: ["", Validators.required],
                UserSmsStatus: ["0", Validators.required],
                UserEmailStatus: ["0", Validators.required],
                UserStatus: ["1", Validators.required],
                RowID: [0, Validators.required],
                ReseachRowId: [this.ReseachRowId, Validators.required],
            });
        }
        //debugger
        this.activeModal = this.modalServiceresearchesusers.open(
            content,
            this.modalOptions
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
            this.fliterValUser,
            this.StatusUser
        );
    }

    public getTableFromServer(
        _pageIndex: number,
        _pageSize: number,
        _FreeText: string,
        _Status: string
    ) {
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // //debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        this.http
            .post(
                "http://srv-apps/wsrfc/WebService.asmx/getResearchesUsersTable",
                {
                    _pageIndex: _pageIndex,
                    _pageSize: _pageSize,
                    _FreeText: _FreeText,
                    _Status: _Status,
                    _ResearchID: this.ReseachRowId,
                }
            )
            .subscribe((Response) => {
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                //debugger
                var json = $.parseJSON(Response["d"]);
                let userssData = $.parseJSON(json["Users"]);
                for (var i = 0; i < userssData.length; i++) {
                    ////debugger
                    this.TABLE_DATA.push({
                        RowID: userssData[i].RowID,
                        UserName: userssData[i].UserName,
                        UserFirstName: userssData[i].UserFirstName,
                        UserLastName: userssData[i].UserLastName,
                        UserTel: userssData[i].UserTel,
                        DateInsert: userssData[i].DateInsert,
                        UserStatus: userssData[i].UserStatus,
                        UserSmsStatus: userssData[i].UserSmsStatus,
                        UserEmailStatus: userssData[i].UserEmailStatus,
                        UserEmail: userssData[i].UserEmail,
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
