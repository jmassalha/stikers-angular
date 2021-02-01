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

    resultsLength = 0;
    fliterVal = "";

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
    ngOnInit() {
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
            this.getDataFormServer(
                this.startdateVal,
                this.enddateVal,
                this.paginator.pageIndex,
                10,
                filterValue,
                this.Depart
            );
        }
        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    quart_change(event: MatRadioChange) {
        ////debugger;
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
                this.Depart
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
                this.Depart
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
                this.Depart
            );
    }
    public getDataFormServer(
        _startDate: string,
        _endDate: string,
        _pageIndex: number,
        _pageSize: number,
        _filterVal: string,
        _Depart: string
    ) {
        let _surgeryType = "";
        let _counter = 0;
        let _yearStart = new Date(_startDate).getFullYear();
        let _yearEnd = new Date(_endDate).getFullYear();

        if (_counter == 4) {
            _surgeryType = "ALL";
        }
        ////////debugger
        $("#loader").removeClass("d-none");
        this.http
            .post(
                "http://srv-apps/wsrfc/WebService.asmx/GetBekoremAmbolatorimApp",
                {
                    _fromDate: _startDate,
                    _toDate: _endDate,
                    _pageIndex: _pageIndex,
                    _pageSize: _pageSize,
                    _freeText: _filterVal,
                    _depart: _Depart,
                }
            )
            .subscribe(
                (Response) => {
                    $("#_departments").empty();
                    // //////debugger
                    this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                    var json = $.parseJSON(Response["d"]);
                    this._fun.drawCharToDom(
                        "bar",
                        $.parseJSON(json["DepartSeodeName"]),
                        $.parseJSON(json["DepartCounterBekorem"]),
                        "bekoremCount",
                        "canvbekoremCount",
                        'סה"כ',
                        ""
                    );
                    var SeodeRoomNameNow = $.parseJSON(
                        json["SeodeRoomNameNow"]
                    );
                    var SeodeRoomCounterNow = $.parseJSON(
                        json["SeodeRoomCounterNow"]
                    );
                    var SeodeRoomDepartNow = $.parseJSON(
                        json["SeodeRoomDepartNow"]
                    );
                    var SeodeRoomNamePast = $.parseJSON(
                        json["SeodeRoomNamePast"]
                    );
                    var SeodeRoomCounterPast = $.parseJSON(
                        json["SeodeRoomCounterPast"]
                    );
                    var SeodeRoomDepartPast = $.parseJSON(
                        json["SeodeRoomDepartPast"]
                    );
                    var _monthsLabels = $.parseJSON(json["_monthsLabels"]);
                    var _monthsNowVal = $.parseJSON(json["_monthsNowVal"]);
                    var _monthsPastVal = $.parseJSON(json["_monthsPastVal"]);
                    ////////debugger
                    var DepartName = $.parseJSON(json["DepartName"]);

                    var DepartSeodeName = $.parseJSON(json["DepartSeodeName"]);
                    var DepartNameSeodeRoomNew = $.parseJSON(
                        json["DepartNameSeodeRoomNew"]
                    );
                    var DepartNameRoomNew = $.parseJSON(
                        json["DepartNameRoomNew"]
                    );
                    var DepartCounterBekoremRoomNew = $.parseJSON(
                        json["DepartCounterBekoremRoomNew"]
                    );
                    var DepartNameSeodeRoomNotNew = $.parseJSON(
                        json["DepartNameSeodeRoomNotNew"]
                    );
                    var DepartNameRoomNotNew = $.parseJSON(
                        json["DepartNameRoomNotNew"]
                    );
                    var DepartCounterBekoremRoomNotNew = $.parseJSON(
                        json["DepartCounterBekoremRoomNotNew"]
                    );
                    var DepartSeodeNameNew = $.parseJSON(
                        json["DepartSeodeNameNew"]
                    );
                    var DepartNameSeodeNotNew = $.parseJSON(
                        json["DepartNameSeodeNotNew"]
                    );
                    var DepartNameSeodePast = $.parseJSON(
                        json["DepartNameSeodePast"]
                    );
                    var DepartSeodeNameNewPast = $.parseJSON(
                        json["DepartSeodeNameNewPast"]
                    );
                    var DepartSeodeNameNotNewPast = $.parseJSON(
                        json["DepartSeodeNameNotNewPast"]
                    );

                    var DepartCounterBekorem = $.parseJSON(
                        json["DepartCounterBekorem"]
                    );
                    var DepartNameNew = $.parseJSON(json["DepartNameNew"]);
                    var DepartCounterBekoremNew = $.parseJSON(
                        json["DepartCounterBekoremNew"]
                    );
                    var DepartNameNotNew = $.parseJSON(
                        json["DepartNameNotNew"]
                    );
                    var DepartCounterBekoremNotNew = $.parseJSON(
                        json["DepartCounterBekoremNotNew"]
                    );
                    var DepartNamePast = $.parseJSON(json["DepartNamePast"]);
                    var DepartCounterBekoremPast = $.parseJSON(
                        json["DepartCounterBekoremPast"]
                    );
                    var DepartNameNewPast = $.parseJSON(
                        json["DepartNameNewPast"]
                    );
                    var DepartCounterBekoremNewPast = $.parseJSON(
                        json["DepartCounterBekoremNewPast"]
                    );
                    var DepartNameNotNewPast = $.parseJSON(
                        json["DepartNameNotNewPast"]
                    );
                    var DepartCounterBekoremNotNewPast = $.parseJSON(
                        json["DepartCounterBekoremNotNewPast"]
                    );
                    debugger;

                    this._fun.drawCharToDom(
                        "line",
                        _monthsLabels,
                        [_monthsNowVal, _monthsPastVal],
                        "totalLineChart",
                        "canvsLineChart",
                        _yearStart.toString(),
                        (_yearStart - 1).toString()
                    );
                    let _div = $(
                        '<div class="card text-right" dir="rtl"></div>'
                    );
                    let _header = $(
                        '<div class="card-header"><h1 class="row"><span class="col-4"><span class="depname"></span></span><span class="col-2 text-center">מס ביקורים ' +
                            _yearEnd +
                            '</span><span class="col-2 text-center">מס ביקורים ' +
                            (_yearStart - 1) +
                            '</span><span class="col-2 text-center">מס מבקרים חדשים</span><span class="col-2 text-center">מס מבקרים חוזרים</span></h1></div>'
                    );
                    let _bodyCard = $('<div class="card-body"></div>');
                    let _row = $(
                        '<p class="row rowBord"><span class="col-4 dep"></span><span class="col-2 text-center new"></span><span class="col-2 text-center past"></span><span class="col-2 text-center new2"></span><span class="col-2 text-center past2"></span></p>'
                    );
                    let _footer = $(
                        '<div class="card-footer"><h5 class="row"><span class="col-4 text-left">סה"כ</span><span class="col-2 text-center fnew"></span><span class="col-2 text-center fpast"></span><span class="col-2 text-center fnew2"></span><span class="col-2 text-center fpast2"></span></h5></div>'
                    );
                    let i = 0;
                    let _depName = "";
                    var derpCounterForYear = 0;
                    var derpCounterForPastYear = 0;
                    var derpCounterNewForYear = 0;
                    var derpCounterNotForYear = 0;
                    var totAll = 0;
                    var totAllPast = 0;
                    for (i = 0; i < DepartName.length; i++) {
                        if (i == 0) {
                            _depName = DepartName[i];
                            _header.find(".depname").text(_depName);
                            _div.append(_header.clone());
                        }
                        if (_depName != DepartName[i]) {
                            _footer.find(".fnew").text(derpCounterForYear);
                            _footer.find(".fpast").text(derpCounterForPastYear);
                            _footer.find(".fnew2").text(derpCounterNewForYear);
                            _footer.find(".fpast2").text(derpCounterNotForYear);
                            _div.append(_footer.clone());
                            //_div.append('<br>');
                            $("#_departments").append(_div.clone());
                            _depName = DepartName[i];
                            derpCounterForYear = 0;
                            derpCounterForPastYear = 0;
                            derpCounterNewForYear = 0;
                            derpCounterNotForYear = 0;
                            _div.empty();
                            _header.find(".depname").text(_depName);
                            _div.append(_header.clone());
                        }
                        let _rowClone = _row.clone();
                        _rowClone.find(".dep").text(DepartSeodeName[i]);

                        _rowClone.find(".new").text(DepartCounterBekorem[i]);
                        derpCounterForYear += parseInt(DepartCounterBekorem[i]);
                        if (
                            $.inArray(
                                DepartSeodeName[i],
                                DepartNameSeodePast
                            ) != -1
                        ) {
                            _rowClone
                                .find(".past")
                                .text(
                                    DepartCounterBekoremPast[
                                        $.inArray(
                                            DepartSeodeName[i],
                                            DepartNameSeodePast
                                        )
                                    ]
                                );
                            derpCounterForPastYear += parseInt(
                                DepartCounterBekoremPast[
                                    $.inArray(
                                        DepartSeodeName[i],
                                        DepartNameSeodePast
                                    )
                                ]
                            );
                        } else {
                            _rowClone.find(".past").text(0);
                        }
                        if (
                            $.inArray(DepartSeodeName[i], DepartSeodeNameNew) !=
                            -1
                        ) {
                            _rowClone
                                .find(".new2")
                                .text(
                                    DepartCounterBekoremNew[
                                        $.inArray(
                                            DepartSeodeName[i],
                                            DepartSeodeNameNew
                                        )
                                    ]
                                );
                            derpCounterNewForYear += parseInt(
                                DepartCounterBekoremNew[
                                    $.inArray(
                                        DepartSeodeName[i],
                                        DepartSeodeNameNew
                                    )
                                ]
                            );
                        } else {
                            _rowClone.find(".new2").text(0);
                        }
                        if (
                            $.inArray(
                                DepartSeodeName[i],
                                DepartNameSeodeNotNew
                            ) != -1
                        ) {
                            _rowClone
                                .find(".past2")
                                .text(
                                    DepartCounterBekoremNotNew[
                                        $.inArray(
                                            DepartSeodeName[i],
                                            DepartNameSeodeNotNew
                                        )
                                    ]
                                );
                            derpCounterNotForYear += parseInt(
                                DepartCounterBekoremNotNew[
                                    $.inArray(
                                        DepartSeodeName[i],
                                        DepartNameSeodeNotNew
                                    )
                                ]
                            );
                        } else {
                            _rowClone.find(".past2").text(0);
                        }
                        _div.append(_rowClone);
                        totAll += parseInt(DepartCounterBekorem[i]);
                        //debugger
                        if (
                            DepartSeodeName[i] == "מר-קרד-כ" ||
                            DepartSeodeName[i] == "מר-המט" ||
                            DepartSeodeName[i] == "מכ-או-כ" ||
                            DepartSeodeName[i] == "מר-פג" ||
                            DepartSeodeName[i] == "מר-ראומט"
                        ) {
                            /*
                            SeodeRoomNameNow
    SeodeRoomCounterNow
    SeodeRoomDepartNow
    SeodeRoomNamePast
    SeodeRoomCounterPast
    SeodeRoomDepartPast
                            */
                            debugger;
                            for (
                                var sIn = 0;
                                sIn < SeodeRoomNameNow.length;
                                sIn++
                            ) {
                                var _rowClone2;
                                if (DepartSeodeName[i] == "מכ-או-כ") {
                                    if (
                                        SeodeRoomNameNow[sIn].indexOf(
                                            "מכון אונקולוגיה"
                                        ) >= 0
                                    ) {
                                        _rowClone2 = _row.clone();
                                        _rowClone2
                                            .find(".dep")
                                            .addClass("tab-1");
                                        _rowClone2
                                            .find(".dep")
                                            .html(
                                                "  --  " + SeodeRoomNameNow[sIn]
                                            );

                                        _rowClone2
                                            .find(".new")
                                            .text(SeodeRoomCounterNow[sIn]);

                                        if (
                                            $.inArray(
                                                SeodeRoomNameNow[sIn],
                                                SeodeRoomNamePast
                                            ) != -1
                                        ) {
                                            _rowClone2
                                                .find(".past")
                                                .text(
                                                    SeodeRoomCounterPast[
                                                        $.inArray(
                                                            SeodeRoomNameNow[
                                                                sIn
                                                            ],
                                                            SeodeRoomNamePast
                                                        )
                                                    ]
                                                );
                                        } else {
                                            _rowClone2.find(".past").text(0);
                                        }
                                    }
                                } else if (DepartSeodeName[i] == "מר-המט") {
                                    if (
                                        SeodeRoomNameNow[sIn].indexOf(
                                            "מרפאה המוטולוגית"
                                        ) >= 0
                                    ) {
                                        _rowClone2 = _row.clone();
                                        _rowClone2
                                            .find(".dep")
                                            .addClass("tab-1");
                                        _rowClone2
                                            .find(".dep")
                                            .html(
                                                "  --  " + SeodeRoomNameNow[sIn]
                                            );

                                        _rowClone2
                                            .find(".new")
                                            .text(SeodeRoomCounterNow[sIn]);

                                        if (
                                            $.inArray(
                                                SeodeRoomNameNow[sIn],
                                                SeodeRoomNamePast
                                            ) != -1
                                        ) {
                                            _rowClone2
                                                .find(".past")
                                                .text(
                                                    SeodeRoomCounterPast[
                                                        $.inArray(
                                                            SeodeRoomNameNow[
                                                                sIn
                                                            ],
                                                            SeodeRoomNamePast
                                                        )
                                                    ]
                                                );
                                        } else {
                                            _rowClone2.find(".past").text(0);
                                        }
                                    }
                                } else {
                                    _rowClone2 = _row.clone();
                                    _rowClone2.find(".dep").addClass("tab-1");
                                    _rowClone2
                                        .find(".dep")
                                        .html("  --  " + SeodeRoomNameNow[sIn]);

                                    _rowClone2
                                        .find(".new")
                                        .text(SeodeRoomCounterNow[sIn]);

                                    if (
                                        $.inArray(
                                            SeodeRoomNameNow[sIn],
                                            SeodeRoomNamePast
                                        ) != -1
                                    ) {
                                        _rowClone2
                                            .find(".past")
                                            .text(
                                                SeodeRoomCounterPast[
                                                    $.inArray(
                                                        SeodeRoomNameNow[sIn],
                                                        SeodeRoomNamePast
                                                    )
                                                ]
                                            );
                                    } else {
                                        _rowClone2.find(".past").text(0);
                                    }
                                }

                                // if (
                                //     $.inArray(
                                //         DepartSeodeName[i],
                                //         DepartSeodeNameNew
                                //     ) != -1
                                // ) {
                                //     _rowClone2
                                //         .find(".new2")
                                //         .text(
                                //             DepartCounterBekoremNew[
                                //                 $.inArray(
                                //                     DepartSeodeName[i],
                                //                     DepartSeodeNameNew
                                //                 )
                                //             ]
                                //         );

                                // } else {
                                //     _rowClone2.find(".new2").text(0);
                                // }
                                // if (
                                //     $.inArray(
                                //         DepartSeodeName[i],
                                //         DepartNameSeodeNotNew
                                //     ) != -1
                                // ) {
                                //     _rowClone2
                                //         .find(".past2")
                                //         .text(
                                //             DepartCounterBekoremNotNew[
                                //                 $.inArray(
                                //                     DepartSeodeName[i],
                                //                     DepartNameSeodeNotNew
                                //                 )
                                //             ]
                                //         );

                                // } else {
                                //     _rowClone2.find(".past2").text(0);
                                // }
                                _div.append(_rowClone2);
                            }
                        }
                    }
                    // //////debugger;

                    totAllPast = 0;
                    for (i = 0; i < DepartNamePast.length; i++) {
                        totAllPast += parseInt(DepartCounterBekoremPast[i]);
                    }
                    //////debugger;
                    this._fun.drawCharToDom(
                        "bar",
                        [(_yearStart - 1).toString(), _yearStart.toString()],
                        [totAllPast, totAll],
                        "totalBarChart",
                        "canvstotalBarChart",
                        'סה"כ',
                        ""
                    );
                    _footer.find(".fnew").text(derpCounterForYear);
                    _footer.find(".fpast").text(totAllPast);
                    _footer.find(".fnew2").text(derpCounterNewForYear);
                    _footer.find(".fpast2").text(derpCounterNotForYear);
                    _div.append(_footer.clone());
                    $("#_departments").append(_div.clone());
                    setTimeout(() => {
                        //this.dataSource.paginator = this.paginator
                        $("#loader").addClass("d-none");
                    });
                    //this.dataSource.paginator = this.paginator;
                },
                (error) => {
                    // //////debugger;
                    $("#loader").addClass("d-none");
                }
            );
    }
}
