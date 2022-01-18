import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatRadioChange } from "@angular/material/radio";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import * as $ from "jquery";
import * as Fun from "../public.functions";
import { Time } from "@angular/common";
import { FormControl } from "@angular/forms";

export interface DataTableInterface {
    ONE_1: String;
    TWO_1: String;
    THREE_1: String;
    THREE_2: String;
    THREE_4: String;
    THREE_3: String;
    THREE_5: String;
    FOUR_1: String;
    FIVE_1: String;
    SIX_1_1: String;
    SIX_1_2: String;
    SIX_1_3: String;
    SIX_1_4: String;
    SIX_1_5: String;
    SIX_2_1: String;
    SIX_2_2: String;
    SIX_2_3: String;
    SIX_2_4: String;
    SIX_2_5: String;
    SEVEN_1_1: String;
    SEVEN_1_2: String;
    SEVEN_1_3: String;
    SEVEN_1_4: String;
    SEVEN_1_5: String;
    SEVEN_2_1: String;
    SEVEN_2_2: String;
    SEVEN_2_3: String;
    SEVEN_2_4: String;
    SEVEN_2_5: String;
    EIGHT_1: String;
    NINE_1: String;
    NINE_2: String;
    NINE_3: String;
    NINE_4: String;
    NINE_5: String;
    SEROVE: String;
    DIED: String;
    DIEDANDCHECKED: String;
}

@Component({
    selector: "app-hearing",
    templateUrl: "./hearing.component.html",
    styleUrls: ["./hearing.component.css"]
})
export class HearingComponent implements OnInit {
    dataTable: DataTableInterface = {
        ONE_1: "",
        TWO_1: "",
        THREE_1: "",
        THREE_2: "",
        THREE_4: "",
        THREE_3: "",
        THREE_5: "",
        FOUR_1: "",
        FIVE_1: "",
        SIX_1_1: "",
        SIX_1_2: "",
        SIX_1_3: "",
        SIX_1_4: "",
        SIX_1_5: "",
        SIX_2_1: "",
        SIX_2_2: "",
        SIX_2_3: "",
        SIX_2_4: "",
        SIX_2_5: "",
        SEVEN_1_1: "",
        SEVEN_1_2: "",
        SEVEN_1_3: "",
        SEVEN_1_4: "",
        SEVEN_1_5: "",
        SEVEN_2_1: "",
        SEVEN_2_2: "",
        SEVEN_2_3: "",
        SEVEN_2_4: "",
        SEVEN_2_5: "",
        EIGHT_1: "",
        NINE_1: "",
        NINE_2: "",
        NINE_3: "",
        NINE_4: "",
        NINE_5: "",
        SEROVE: "",
        DIED: "",
        DIEDANDCHECKED: ""
    };

    loader: Boolean;
    tableLoader: Boolean;
    _selectedYear = 0;
    resultsLength = 0;
    fliterVal = "";
    _yearToSearch = 0;
    chart = null;
    isShow = false;
    constructor(private router: Router, private http: HttpClient) {}
    startdateVal: string;
    enddateVal: string;
    Sdate: FormControl;
    Edate: FormControl;
    Depart: string;
    Shift: string;
    RequestType: string;
    yearsToSelect: { list: {} };
    _fun = new Fun.Functions();
    ngOnInit() {
        this._fun.RunFunction();
        this.yearsToSelect = this._fun.yearsToSelect;
        this.loader = false;
        this.Depart = "-1";
        this.Shift = "-1";
        this.RequestType = "-1";
        if (this.yearsToSelect.list[0]["checked"]) {
            this._selectedYear = parseInt(this.yearsToSelect.list[0]["ID"]);
            this.Sdate = new FormControl(
                new Date(parseInt(this.yearsToSelect.list[0]["ID"]), 0, 1)
            );
            this.Edate = new FormControl(
                new Date(parseInt(this.yearsToSelect.list[0]["ID"]), 11, 31)
            );
            this.startdateVal = this.Sdate.value;
            this.enddateVal = this.Edate.value;
        }

        if (
            localStorage.getItem("loginState") != "true" ||
            localStorage.getItem("loginUserName") == ""
        ) {
            this.router.navigate(["login"]);
        } else {
            ///$("#chadTable").DataTable();
        }

        //console.log(this.paginator.pageIndex);
    }
    radioChange(event: MatRadioChange) {
        ////debugger
        this._fun.radioChange(event);
        this.startdateVal = this._fun.Sdate.value;
        this.enddateVal = this._fun.Edate.value;
    }
    applyFilter(filterValue: string) {
        this.fliterVal = filterValue;
        if (this.startdateVal && this.enddateVal) {
            this.getDataFormServer(this.startdateVal, this.enddateVal);
        }
        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    quart_change(event: MatRadioChange) {
        //////debugger;
        this._fun.quart_change(event);
        this.startdateVal = this._fun.Sdate.value;
        this.enddateVal = this._fun.Edate.value;
    }
    ngAfterViewInit(): void {}
    getReport($event: any): void {
        if (this.startdateVal && this.enddateVal)
            this.getDataFormServer(this.startdateVal, this.enddateVal);
    }

    getReportExcel($event: any): void {
        if (this.startdateVal && this.enddateVal)
            this.getDataFormServer(this.startdateVal, this.enddateVal);
    }

    public getDataFormServer(_startDate: string, _endDate: string) {
        // //debugger
        let _counter = 0;
        let _yearStart = new Date(_startDate).getFullYear();
        let _yearEnd = new Date(_endDate).getFullYear();
        $("#loader").removeClass("d-none");
        this.loader = true;
        //////debugger
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/RunHearingReportApp",
                {
                    _fromDate: _startDate,
                    _toDate: _endDate
                }
            )
            .subscribe(
                Response => {
                    ////debugger
                    var json = JSON.parse(Response["d"]);
                    this.dataTable = json;
                    setTimeout(() => {
                        //this.dataSource.paginator = this.paginator
                        $("#loader").addClass("d-none");
                        $("#table-section").removeClass("d-none");
                        this.loader = false;
                    });
                    //this.dataSource.paginator = this.paginator;
                },
                error => {
                    // ////debugger;
                    $("#loader").addClass("d-none");
                    this.loader = false;
                }
            );
    }
}