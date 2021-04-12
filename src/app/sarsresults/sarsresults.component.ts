import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
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
import { formatDate, Time } from "@angular/common";
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
} from "@angular/forms";
export interface TableRow {
    L_ROW_ID: string;
    L_CASE_NUMBER: string;
    L_REQUEST_DATE: string;
    L_RESULT_DATE: string;
    L_PATIENT_ID: string;
    L_F_NAME: string;
    L_L_NAME: string;
    L_GENDER: string;
    L_PHONE_NUMBER: string;
    L_RESULTS: string;
    L_LABEL: string;
    L_F_E_NAME: string;
    L_L_E_NAME: string;
    L_DOB: Date;
    L_PASSPORT: string;
    L_RESULT_TIME: string;
    L_SEND_DATE: string;
    L_MOBILE: string;
    L_EMAIL: string;
    L_PATIENT_NUMBER: string;
    L_PASSWORD: string;
}

@Component({
    selector: "app-sarsresults",
    templateUrl: "./sarsresults.component.html",
    styleUrls: ["./sarsresults.component.css"],
})
export class SarsresultsComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    displayedColumns: string[] = [
        // 'ROW_ID',
        "L_CASE_NUMBER",
        "L_PATIENT_ID",
        "L_REQUEST_DATE",
        "L_RESULT_DATE",
        "L_F_NAME",
        "L_L_NAME",
        "L_PASSWORD",
        "CLICK",
    ];
    modalOptions: NgbModalOptions;
    closeResult: string;
    TABLE_DATA: TableRow[] = [];
    rowFormData = {} as TableRow;
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    tableLoader: Boolean;
    resultsLength = 0;
    fliterVal = "";
    SarsResultsForm: FormGroup;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        public fb: FormBuilder,
        private formBuilder: FormBuilder
    ) {
        this.SarsResultsForm = this.fb.group({
            L_MOBILE: ["", Validators.required],
            L_EMAIL: ["", Validators.required],
            L_DOB: ["", Validators.required],
            L_ROW_ID: ["", Validators.required],
        });
    }
    startdateVal: string;
    enddateVal: string;
    Sdate;
    Edate;
    openSnackBar(txt, type) {
        this._snackBar.open(txt, "", {
            duration: 2500,
            direction: "rtl",
            panelClass: type,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
    ngOnInit(): void {
        if (
            localStorage.getItem("loginState") != "true" ||
            localStorage.getItem("loginUserName") == ""
        ) {
            this.router.navigate(["login"]);
        } else if (
            localStorage.getItem("loginUserName").toLowerCase() ==
                "jmassalha" ||
            localStorage.getItem("loginUserName").toLowerCase() == "eonn" ||
            localStorage.getItem("loginUserName").toLowerCase() == "samer" ||
            localStorage.getItem("loginUserName").toLowerCase() ==
                "owertheim" ||
            localStorage.getItem("loginUserName").toLowerCase() ==
                "habuzayyad" ||
            localStorage.getItem("loginUserName").toLowerCase() == "hmizrahi" ||
            localStorage.getItem("loginUserName").toLowerCase() == "mruach" ||
            localStorage.getItem("loginUserName").toLowerCase() ==
                "yarosenfel" ||
            localStorage.getItem("loginUserName").toLowerCase() == "mmatan" ||
            localStorage.getItem("loginUserName").toLowerCase() == "etalor" ||
            localStorage.getItem("loginUserName").toLowerCase() == "batzadok" ||
            localStorage.getItem("loginUserName").toLowerCase() == "mmadmon" ||
            localStorage.getItem("loginUserName").toLowerCase() == "mlehrer" ||
            localStorage.getItem("loginUserName").toLowerCase() == "nsela" ||
            localStorage.getItem("loginUserName").toLowerCase() == "ssabach" ||
            localStorage.getItem("loginUserName").toLowerCase() == "dsalameh" ||
            localStorage.getItem("loginUserName").toLowerCase() ==
                "bmonastirsky" ||
            localStorage.getItem("loginUserName").toLowerCase() ==
                "mgershovich" ||
            localStorage.getItem("loginUserName").toLowerCase() == "klibai" ||
            localStorage.getItem("loginUserName").toLowerCase() == "aasheri" ||
            localStorage.getItem("loginUserName").toLowerCase() == "obenor" ||
            localStorage.getItem("loginUserName").toLowerCase() == "ohaccoun" ||
            localStorage.getItem("loginUserName").toLowerCase() == "iaharon" ||
            localStorage.getItem("loginUserName").toLowerCase() == "jubartal" ||
            localStorage.getItem("loginUserName").toLowerCase() == "hseffada" ||
            localStorage.getItem("loginUserName").toLowerCase() == "waraidy" ||
            localStorage.getItem("loginUserName").toLowerCase() == "cmagen" ||
            localStorage.getItem("loginUserName").toLowerCase() == "tlivnat" ||
            localStorage.getItem("loginUserName").toLowerCase() == "mjourno" ||
            localStorage.getItem("loginUserName").toLowerCase() == "nali" ||
            localStorage.getItem("loginUserName").toLowerCase() == "emansour" ||
            localStorage.getItem("loginUserName").toLowerCase() == "kmandel" ||
            localStorage.getItem("loginUserName").toLowerCase() == "smatta" ||
            localStorage.getItem("loginUserName").toLowerCase() ==
                "sabuhanna" ||
            localStorage.getItem("loginUserName").toLowerCase() == "rnakhle" ||
            localStorage.getItem("loginUserName").toLowerCase() == "aibrahim" ||
            localStorage.getItem("loginUserName").toLowerCase() == "mkheer" ||
            localStorage.getItem("loginUserName").toLowerCase() == "ssarusi" ||
            localStorage.getItem("loginUserName").toLowerCase() == "samos" ||
            localStorage.getItem("loginUserName").toLowerCase() == "thajouj" ||
            localStorage.getItem("loginUserName").toLowerCase() == "ssarusi" ||
            localStorage.getItem("loginUserName").toLowerCase() == "gmoldavsky"  ||
            localStorage.getItem("loginUserName").toLowerCase() == "ekellerman" ||
            localStorage.getItem("loginUserName").toLowerCase() == "tklinger"
        ) {
        } else {
            this.router.navigate(["login"]);
            ///$("#chadTable").DataTable();
        }
        this.loader = false;
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);
        let dateIn = new Date();
        dateIn.setDate(dateIn.getDate() - 1);
        this.Sdate = new FormControl(dateIn);
        this.Edate = new FormControl(new Date());
        this.startdateVal = this.Sdate.value;
        this.enddateVal = this.Edate.value;
        if (
            localStorage.getItem("loginState") != "true" ||
            localStorage.getItem("loginUserName") == ""
        ) {
            this.router.navigate(["login"]);
        } else if (
            localStorage.getItem("loginUserName").toLowerCase() ==
                "jmassalha" ||
            localStorage.getItem("loginUserName").toLowerCase() == "samer" ||
            localStorage.getItem("loginUserName").toLowerCase() == "owertheim"
        ) {
        } else {
            //this.router.navigate(["login"]);
            ///$("#chadTable").DataTable();
        }
        //this.dataSource = new MatTableDataSource(this.TABLE_DATA);
        //console.log(this.paginator.pageIndex);
        // $(document).on('submit', '#sendForm', function(e){
        //     ////debugger
        // })
        this.getTableFromServer(
            this.startdateVal,
            this.enddateVal,
            this.paginator.pageIndex,
            50,
            this.fliterVal
        );
    }
    getReport($event: any): void {
        if (this.startdateVal && this.enddateVal)
            this.getTableFromServer(
                this.startdateVal,
                this.enddateVal,
                this.paginator.pageIndex,
                this.paginator.pageSize,
                this.fliterVal
            );
    }
    applyFilter(filterValue: string) {
        this.fliterVal = filterValue;
        if (this.startdateVal && this.enddateVal) {
            this.getTableFromServer(
                this.startdateVal,
                this.enddateVal,
                this.paginator.pageIndex,
                this.paginator.pageSize,
                this.fliterVal
            );
        }
        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    open(content, _type, _element) {
        this.rowFormData = _element;

        //debugger;
        this.SarsResultsForm = this.fb.group({
            L_MOBILE: [this.rowFormData.L_MOBILE, Validators.required],
            L_EMAIL: [this.rowFormData.L_EMAIL, Validators.required],
            L_DOB: [this.rowFormData.L_DOB, Validators.required],
            L_ROW_ID: [this.rowFormData.L_ROW_ID, Validators.required],
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
    getPaginatorData(event: PageEvent) {
        //console.log(this.paginator.pageIndex);
        if (this.startdateVal && this.enddateVal) {
            this.getTableFromServer(
                this.startdateVal,
                this.enddateVal,
                this.paginator.pageIndex,
                this.paginator.pageSize,
                this.fliterVal
            );
        }
    }
    public getTableFromServer(
        _startDate: string,
        _endDate: string,
        _pageIndex: number,
        _pageSize: number,
        _FreeText: string
    ) {
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // ////debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        //http://srv-apps/wsrfc/WebService.asmx/
        this.http
            .post(
                "http://srv-apps/wsrfc/WebService.asmx/GetAllSarscov2Results",
                {
                    _fromDate: _startDate,
                    _toDate: _endDate,
                    _pageIndex: _pageIndex,
                    _pageSize: _pageSize,
                    _FreeText: _FreeText,
                }
            )
            .subscribe((Response) => {
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                var json = $.parseJSON(Response["d"]);
                // //debugger
                let SarsData = $.parseJSON(json["aaData"]);
                 //debugger;
                for (var i = 0; i < SarsData.length; i++) {
                    ////debugger
                    var dateIn = SarsData[i].L_DOB.split('/');

                    this.TABLE_DATA.push({
                        L_ROW_ID: SarsData[i].L_ROW_ID,
                        L_CASE_NUMBER: SarsData[i].L_CASE_NUMBER,
                        L_REQUEST_DATE: SarsData[i].L_REQUEST_DATE,
                        L_RESULT_DATE: SarsData[i].L_RESULT_DATE,
                        L_PATIENT_ID: SarsData[i].L_PATIENT_ID,
                        L_F_NAME: SarsData[i].L_F_NAME,
                        L_L_NAME: SarsData[i].L_L_NAME,
                        L_GENDER: SarsData[i].L_GENDER,
                        L_PHONE_NUMBER: SarsData[i].L_PHONE_NUMBER,
                        L_RESULTS: SarsData[i].L_RESULTS,
                        L_LABEL: SarsData[i].L_LABEL,
                        L_F_E_NAME: SarsData[i].L_F_E_NAME,
                        L_L_E_NAME: SarsData[i].L_L_E_NAME,
                        L_DOB: new Date(dateIn[2], dateIn[1], dateIn[0]),
                        L_PASSPORT: SarsData[i].L_PASSPORT,
                        L_RESULT_TIME: SarsData[i].L_RESULT_TIME,
                        L_SEND_DATE: SarsData[i].L_SEND_DATE,
                        L_MOBILE: SarsData[i].L_MOBILE,
                        L_EMAIL: SarsData[i].L_EMAIL,
                        L_PATIENT_NUMBER: SarsData[i].L_PATIENT_NUMBER,
                        L_PASSWORD: SarsData[i].L_PASSWORD,
                    });
                }

                // ////debugger
                this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                this.resultsLength = parseInt(
                    $.parseJSON(json["iTotalRecords"])
                );
                setTimeout(function () {
                    //////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }
    onSubmit() {
        $("#loader").removeClass("d-none");
        //debugger;
        // stop here if form is invalid
        this.SarsResultsForm.value.L_DOB = formatDate(
            this.SarsResultsForm.value.L_DOB,
            "yyyy-MM-dd",
            "en-US"
        );
        if (this.SarsResultsForm.invalid) {
            return;
        }
        //http://srv-ipracticom:8080/WebService.asmx
        ////debugger
        this.http
            .post(
                "http://srv-ipracticom:8080/WebService.asmx/SarsResultsFormSubmit",
                {
                    sarsResultForm: this.SarsResultsForm.value,
                }
            )
            .subscribe(
                (Response) => {
                    //////debugger;
                    setTimeout(() => {
                        //this.dataSource.paginator = this.paginator
                        this.openSnackBar("נשלח בהצלחה", "success");
                        $("#loader").addClass("d-none");
                        this.getTableFromServer(
                            this.startdateVal,
                            this.enddateVal,
                            this.paginator.pageIndex,
                            this.paginator.pageSize,
                            this.fliterVal
                        );
                    });
                    //this.dataSource.paginator = this.paginator;
                    this.modalService.dismissAll();
                },
                (error) => {
                    // //////debugger;
                    $("#loader").addClass("d-none");
                }
            );
    }
}
