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
import { Time } from "@angular/common";
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
} from "@angular/forms";
export interface CovidResult {
    L_DOB: Date;
    L_FIRST_NAME: string;
    L_GENDER: string;
    L_LAST_NAME: string;
    L_PATIENT_ID: string;
    L_REQUEST_DATE: string;
    L_RESULTS: string;
    L_RESULT_DATE: string;
    L_LABEL: string;
    ICD_PATIENT_NUMBER: string;
    ICD_CASE_NUMBER: string;
    L_LAST_NAME_H: string;
    L_FIRST_NAME_H: string;
    L_PASSPORT: string;
    L_RESULT_TIME: Time
}
@Component({
    selector: "app-coronaresultform",
    templateUrl: "./coronaresultform.component.html",
    styleUrls: ["./coronaresultform.component.css"],
})
export class CoronaresultformComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";

    rowFormData = {} as CovidResult;
    fliterVal = "";
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private formBuilder: FormBuilder
    ) {}
    ngOnInit() {
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
            localStorage.getItem("loginUserName").toLowerCase() ==
                "owertheim" ||
            localStorage.getItem("loginUserName").toLowerCase() == "szidan" ||
            localStorage.getItem("loginUserName").toLowerCase() == "yshoa" ||
            localStorage.getItem("loginUserName").toLowerCase() == "sahadar" ||
            localStorage.getItem("loginUserName").toLowerCase() == "hyakobi" ||
            localStorage.getItem("loginUserName").toLowerCase() == "atekali" ||
            localStorage.getItem("loginUserName").toLowerCase() == "yradia" ||
            localStorage.getItem("loginUserName").toLowerCase() ==
                "zevensaban" ||
            localStorage.getItem("loginUserName").toLowerCase() == "nstepman" ||
            localStorage.getItem("loginUserName").toLowerCase() == "sgamliel" ||
            localStorage.getItem("loginUserName").toLowerCase() ==
                "sabuhanna" ||
                localStorage.getItem("loginUserName").toLowerCase() == "rnakhle"||
                localStorage.getItem("loginUserName").toLowerCase() == "aibrahim"||
                localStorage.getItem("loginUserName").toLowerCase() == "mkheer"||
                localStorage.getItem("loginUserName").toLowerCase() == "relmalem"||
                localStorage.getItem("loginUserName").toLowerCase() == "ssarusi"||
            localStorage.getItem("loginUserName").toLowerCase() == "samos" ||
            localStorage.getItem("loginUserName").toLowerCase() == "eliberty" ||
            localStorage.getItem("loginUserName").toLowerCase() == "tnapso"
        ) {
        } else {
            this.router.navigate(["login"]);
            ///$("#chadTable").DataTable();
        }
        //this.dataSource = new MatTableDataSource(this.TABLE_DATA);
        //console.log(this.paginator.pageIndex);
        // $(document).on('submit', '#sendForm', function(e){
        //     //debugger
        // })
    }
    openSnackBar() {
        return;
        this._snackBar.open("נשלח בהצלחה", "", {
            duration: 2500,
            direction: "rtl",
            panelClass: "success",
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

    getReport($event: any): void {
        if (this.fliterVal) this.getTableFromServer(this.fliterVal);
    }
    applyFilter(filterValue: string) {
        this.fliterVal = filterValue;
        if (this.fliterVal) {
            this.getTableFromServer(this.fliterVal);
        }
        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    toShortFormat(d: Date) {
        ////debugger;
        let monthNames = [
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
        ];
        ////debugger;
        let dayNames = [
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23",
            "24",
            "25",
            "26",
            "27",
            "28",
            "29",
            "30",
            "31",
        ];

        let day = dayNames[d.getDate() - 1];

        let monthIndex = d.getMonth();
        let monthName = monthNames[monthIndex];

        let year = d.getFullYear();
        ////debugger
        return `${day}/${monthName}/${year}`;
    }

    ngAfterViewInit(): void {}

    public getTableFromServer(_ID: string) {
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // //debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        this.http
            .post(
                "http://srv-apps/wsrfc/WebService.asmx/RunGetLastRequestResult",
                {
                    _ID: _ID,
                }
            )
            .subscribe((Response) => {
                var json = JSON.parse(Response["d"]);
                let CoronaData = JSON.parse(json["ITEMSMAP"]);
              //  //debugger;
                CoronaData.L_DOB = this.toShortFormat(
                    new Date(CoronaData.L_DOB)
                );
                CoronaData.L_REQUEST_DATE = this.toShortFormat(
                    new Date(CoronaData.L_REQUEST_DATE)
                );
                CoronaData.L_RESULT_DATE = this.toShortFormat(
                    new Date(CoronaData.L_RESULT_DATE)
                );
                if (CoronaData.L_RESULTS == "שלילי") {
                    CoronaData.L_RESULTS = "Negative";
                } else if (CoronaData.L_RESULTS == "חיובי") {
                    CoronaData.L_RESULTS = "Positive";
                } else if (CoronaData.L_RESULTS == "חיובי גבולי") {
                    CoronaData.L_RESULTS = "Marginal";
                } else if ((CoronaData.L_RESULTS) == "Not Detected") {
                    CoronaData.L_RESULTS = "Negative";
                } else if ((CoronaData.L_RESULTS) == "פסול") {
                    CoronaData.L_RESULTS = "Rejected";
                } else {
                    CoronaData.L_RESULTS = CoronaData.L_RESULTS;
                }
                if (CoronaData.L_GENDER == "ז" || CoronaData.L_GENDER == "זכר"  || CoronaData.L_GENDER == "male" || CoronaData.L_GENDER == "1" || CoronaData.L_GENDER == 1) {
                    CoronaData.L_GENDER = "male";
                } else {
                    CoronaData.L_GENDER = "female";
                }
                this.rowFormData = CoronaData;
                setTimeout(function () {
                    $("#loader").addClass("d-none");
                    window.print();
                }, 1500);
            });
    }
}
