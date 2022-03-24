import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatRadioChange } from "@angular/material/radio";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import * as $ from "jquery";
import { Time } from "@angular/common";
import { FormControl } from "@angular/forms";
import * as Fun from "../public.functions";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

export interface Bekorem {
    PM_CASE_NUMBER: number;
    PM_MOVE_NUMBER: string;
    PM_MOVE_CAT: string;
    PM_MOVE_TYPE: string;
    PM_MOVE_DATE: Date;
    PM_MOVE_TIME: Time;
    PM_MOVE_STATUS: string;
    PM_MOVE_DATE_END: Date;
    PM_MOVE_TIME_END: Time;
    PM_DANGER_CASE: string;
    PM_MOVE_DEPART: Time;
    PM_MOVE_DEPART_SEODE: Time;
    PM_ROOM_NUMBER: string;
    PM_BED_NUMBER: string;
    PM_CASE_TYPE: string;
    PM_PATIENT_NUMBER: string;
    PM_BEKORET_NUMBER: string;
    PM_PATIENT_GENDER: string;
    PM_LAST_NAME: string;
    PM_FIRST_NAME: string;
    PM_FATHER_NAME: string;
    PM_DOB: Date;
    PM_DEATH_DATE: Date;
    PM_DEATH_TIME: Time;
    PM_POST_CODE: string;
    PM_CITY: string;
    PM_STREET_NAME: string;
    PM_MOVE_RANGE: string;
    PM_PATIENT_ID: string;
}
export interface ClinicName {
    ClinicTitle: string;
    DepartID: string;
}
export interface ClinicDoing {
    ClinicParent: string;
    ClinicName: string;
    Counter: string;
    CounterPast: string;
    NewPatientCounter: string;
    RepeatPatientCounter: string;
}

@Component({
    selector: "app-mrbaot",
    templateUrl: "./mrbaot.component.html",
    styleUrls: ["./mrbaot.component.css"],
})
export class MrbaotComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    modalOptions: NgbModalOptions;
    closeResult: string;
    Depart: string;
    PatientType: string;
    ClinicsNames: ClinicName[] = [];
    ClinicDoings: ClinicDoing[] = [];
    displayedColumns: string[] = [
        "PM_CASE_NUMBER",
        "PM_MOVE_DATE",
        "PM_MOVE_TIME",
        "PM_MOVE_DEPART",
        "PM_CASE_TYPE",
        "PM_LAST_NAME",
        "PM_FIRST_NAME",
    ];
    TABLE_DATA: Bekorem[] = [];
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    _yearStart;
    resultsLength = 0;
    fliterVal = "";
    cards: any = [];
    chart = null;
    isShow = false;
    _selectedYear = 0;
    constructor(private router: Router, private http: HttpClient) {}
    startdateVal: string;
    enddateVal: string;
    yearsToSelect: { list: {} };
    _fun = new Fun.Functions();
    _yearToSearch = 0;
    Sdate: FormControl;
    Edate: FormControl;
    totalNow: number = 0;
    totalPast: number = 0;
    totalNew: number = 0;
    totalNotNew: number = 0;
    ngOnInit() {
        this.getClinicsNames();
        this.PatientType = "-1";
        this._fun.RunFunction();
        this.yearsToSelect = this._fun.yearsToSelect;
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
        //this.SurgeryType[0] = true;
        this.Depart = "-1";
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);

        
        //console.log(this.paginator.pageIndex);
    }
    radioChange(event: MatRadioChange) {
        ////////debugger
        this._fun.radioChange(event);
        this.startdateVal = this._fun.Sdate.value;
        this.enddateVal = this._fun.Edate.value;
    }
    applyFilter(filterValue: string) {
        this.fliterVal = filterValue;
        if (this.startdateVal && this.enddateVal) {
            this.getDataFormServer(
                this.startdateVal,
                this.enddateVal,
                this.paginator.pageIndex,
                10,
                filterValue,
                this.Depart,
                this.PatientType
            );
        }
        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    quart_change(event: MatRadioChange) {
        ////////debugger;
        this._fun.quart_change(event);
        this.startdateVal = this._fun.Sdate.value;
        this.enddateVal = this._fun.Edate.value;
    }
    ngAfterViewInit(): void {}
    getPaginatorData(event: PageEvent) {
        //console.log(this.paginator.pageIndex);
        if (this.startdateVal && this.enddateVal) {
            this.getDataFormServer(
                this.startdateVal,
                this.enddateVal,
                this.paginator.pageIndex,
                10,
                this.fliterVal,
                this.Depart,
                this.PatientType
            );
        }
    }
    getReport($event: any): void {
        if (this.startdateVal && this.enddateVal)
            this.getDataFormServer(
                this.startdateVal,
                this.enddateVal,
                0,
                10,
                this.fliterVal,
                this.Depart,
                this.PatientType
            );
    }

    getReportExcel($event: any): void {
        if (this.startdateVal && this.enddateVal)
            this.getDataFormServer(
                this.startdateVal,
                this.enddateVal,
                0,
                10,
                this.fliterVal,
                this.Depart,
                this.PatientType
            );
    }
    public getDataFormServer(
        _startDate: string,
        _endDate: string,
        _pageIndex: number,
        _pageSize: number,
        _filterVal: string,
        _Depart: string,
        _PatientType: string
    ) {
        ////debugger
        let _surgeryType = "";
        let _counter = 0;
        this._yearStart = new Date(_startDate).getFullYear();
        let _yearEnd = new Date(_endDate).getFullYear();

        if (_counter == 4) {
            _surgeryType = "ALL";
        }
        ////////////debugger
        $("#loader").removeClass("d-none");
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/GetBekoremAmbolatorimApp",
                {
                    _fromDate: _startDate,
                    _toDate: _endDate,
                    _pageIndex: _pageIndex,
                    _pageSize: _pageSize,
                    _freeText: _filterVal,
                    _depart: _Depart,
                    _PatientType: _PatientType,
                }
            )
            .subscribe(
                (Response) => {
                    this.ClinicDoings = [];
                    this.cards = [];
                    var json = Response["d"];
                    if (json["YearCount"].length == 0) {
                        setTimeout(() => {
                            //this.dataSource.paginator = this.paginator
                            $("#loader").addClass("d-none");
                            $("#totalBarChart").addClass("d-none");
                            $("#totalLineChart").addClass("d-none");
                        });
                        //return;
                    } else {
                        
                        $("#totalBarChart").removeClass("d-none");
                        $("#totalLineChart").removeClass("d-none");
                        var YearCountPast = 0;
                        if(json["YearCountPast"][0] != undefined){
                            YearCountPast = parseInt(json["YearCountPast"][0]["COUNTER"]);
                        }
                        this._fun.drawCharToDom(
                            "bar",
                            [
                                this._yearStart,
                                this._yearStart - 1,
                            ],
                            [
                                parseInt(json["YearCount"][0]["COUNTER"]),
                                YearCountPast,
                            ],
                            "totalBarChart",
                            "canvbekoremCount",
                            'סה"כ',
                            ""
                        );
                        var _monthsLabels = [];
                        var _monthsCounter = [];
                        var _monthsCounterPast = [];
                        for (var i = 0; i < json["MonthCount"].length; i++) {
                            _monthsLabels.push(json["MonthCount"][i]["MONTH"]);
                            _monthsCounter.push(
                                parseInt(json["MonthCount"][i]["COUNTER"])
                            );
                            if (json["MonthCountPast"][i] != undefined) {
                                _monthsCounterPast.push(
                                    parseInt(
                                        json["MonthCountPast"][i]["COUNTER"]
                                    )
                                );
                            } else {
                                _monthsCounterPast.push(0);
                            }
                        }
                        this._fun.drawCharToDom(
                            "line",
                            _monthsLabels,
                            [_monthsCounter, _monthsCounterPast],
                            "totalLineChart",
                            "canvsLineChart",
                            this._yearStart.toString(),
                            (this._yearStart - 1).toString()
                        );
                        this.ClinicDoings = [];
                        this.totalNow = 0;
                        this.totalPast = 0;
                        this.totalNew = 0;
                        this.totalNotNew = 0;
                        var lastDepart = "";
                        for (var i = 0; i < json["DepartCount"].length; i++) {
                            var index = json["DepartCountPast"]
                                .map(function (e) {
                                    return e.ClinicName;
                                })
                                .indexOf(json["DepartCount"][i]["ClinicName"]);
                            var indexnew = json["DepartCountNew"]
                                .map(function (e) {
                                    return e.ClinicName;
                                })
                                .indexOf(json["DepartCount"][i]["ClinicName"]);
                            var indexnotnew = json["DepartCountNotNew"]
                                .map(function (e) {
                                    return e.ClinicName;
                                })
                                .indexOf(json["DepartCount"][i]["ClinicName"]);
                            var totPast = "0";
                            var totNew = "0";
                            var totNotNew = "0";
                            ////debugger
                            if (index >= 0) {
                                totPast =
                                    json["DepartCountPast"][index]["Counter"];
                            }
                            if (indexnew >= 0) {
                                totNew =
                                    json["DepartCountNew"][indexnew]["Counter"];
                            }
                            if (indexnotnew >= 0) {
                                totNotNew =
                                    json["DepartCountNotNew"][indexnotnew][
                                        "Counter"
                                    ];
                            }
                            var ClinicDoing: ClinicDoing = {
                                ClinicParent:
                                    json["DepartCount"][i]["DepartName"],
                                ClinicName:
                                    json["DepartCount"][i]["ClinicName"],
                                Counter: json["DepartCount"][i]["Counter"],
                                CounterPast: totPast,
                                NewPatientCounter: totNew,
                                RepeatPatientCounter: totNotNew,
                            };
                            this.totalNow += parseInt(
                                json["DepartCount"][i]["Counter"]
                            );
                            this.totalPast += parseInt(totPast);
                            this.totalNew += parseInt(totNew);
                            this.totalNotNew += parseInt(totNotNew);
                            this.ClinicDoings.push(ClinicDoing);
                            if (lastDepart == "") {
                                lastDepart = this.ClinicDoings[i].ClinicParent;
                                this.cards.push(lastDepart);
                            }
                            if (
                                lastDepart != this.ClinicDoings[i].ClinicParent
                            ) {
                                lastDepart = this.ClinicDoings[i].ClinicParent;
                                this.cards.push(lastDepart);
                            }
                        }
                        setTimeout(() => {
                            //this.dataSource.paginator = this.paginator
                            $("#loader").addClass("d-none");
                        });
                    }
                    // //debugger;

                    //this.dataSource.paginator = this.paginator;
                },
                (error) => {
                    // //////////debugger;
                    $("#loader").addClass("d-none");
                }
            );
    }
    public getClinicsNames() {
        $("#loader").removeClass("d-none");
        ////debugger;
        this.http
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetClinicsNames", {})
            .subscribe(
                (Response) => {
                    $("#_departments").empty();
                    //debugger

                    this.ClinicsNames = Response["d"];

                    setTimeout(() => {
                        //this.dataSource.paginator = this.paginator
                        $("#loader").addClass("d-none");
                    });
                    //this.dataSource.paginator = this.paginator;
                },
                (error) => {
                    ////debugger;
                    $("#loader").addClass("d-none");
                }
            );
    }
}
