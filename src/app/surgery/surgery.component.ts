import {
    Component,
    OnInit,
    ViewChild
} from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatRadioChange } from "@angular/material/radio";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import {
    NgbModal,
    NgbModalOptions
} from "@ng-bootstrap/ng-bootstrap";
import * as $ from "jquery";
import { Chart } from "chart.js";
import { Time } from "@angular/common";
import { FormControl } from "@angular/forms";
import * as Fun from "../public.functions";
export interface Surgens {
    id: string;
    name: string;
}
export interface DropOption {
    ID: string;
    S_DEPARTMENT: string;
}
export interface Surgery {
    S_ID: number;
    S_SURGERY_NUMBER: string;
    S_CASE_NUMBER: string;
    S_DEPARTMENT: string;
    S_SURGERY_DATE: Date;
    S_DEPARTMENT_REQUEST: string;
    S_ROOM_NUMBER: string;
    S_SURGERY_CODE: string;
    S_SURGERY_NAME: string;
    S_SURGERY_TYPE: string;
    S_TIME_ROOM_ENTER: Time;
    S_TIME_START_NARCOTIC: Time;
    S_TIME_SURGERY_START: Time;
    S_TIME_SURGERY_END: Time;
    S_TIME_END_NARCOTIC: Time;
    S_TIME_ROOM_EXIT: Time;
    S_SURGEON_NAME: string;
    S_NARCOTIC_TYPE: string;
    S_NAME_OF_NARCOTIC: string;
    S_SURGEON_STAFF: string;
    S_ROW_ID: number;
}

@Component({
    selector: "app-surgery",
    templateUrl: "./surgery.component.html",
    styleUrls: ["./surgery.component.css"]
})
export class SurgeryComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    modalOptions: NgbModalOptions;
    closeResult: string;
    Shift: string;
    Depart: string[];
    Departs: DropOption[];
    SurgenType: string[];
    Surgen: string;
    /**
     * Method is use to download file.
     * @param data - Array Buffer data
     * @param type - type of the document.
     */
    downLoadFile(data: any, type: string) {
        let blob = new Blob([data], { type: type });
        let url = window.URL.createObjectURL(blob);
        let pwa = window.open(url);
        if (!pwa || pwa.closed || typeof pwa.closed == "undefined") {
            alert("Please disable your Pop-up blocker and try again.");
        }
    }
    _SurgeryTypeArray: string[] = ["SISIOT", "D7OF", "AMBOLATORY", "ELECTIVE"];
    displayedColumns: string[] = [
        // 'ROW_ID',
        "S_CASE_NUMBER",
        "S_SURGERY_DATE",
        "S_DEPARTMENT_REQUEST",
        "S_DEPARTMENT",
        "S_ROOM_NUMBER",
        "S_TIME_ROOM_ENTER",
        "S_TIME_SURGERY_START",
        "S_TIME_SURGERY_END",
        "S_TIME_ROOM_EXIT",
        "S_SURGEON_NAME"
    ];
    TABLE_DATA: Surgery[] = [];
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    _selectedYear = 0;
    resultsLength = 0;
    fliterVal = "";
    SurgeryType: boolean[] = [true, true, true, true];
    Quart: boolean[] = [true, true, true, true];
    master_checked: boolean = true;
    master_indeterminate: boolean = false;
    chart = null;
    isShow = false;
    constructor(
        private router: Router,
        private http: HttpClient,
    ) {}
    startdateVal: string;
    enddateVal: string;
    yearsToSelect : {list:{}};
    _fun = new Fun.Functions();
    Sdate: FormControl;
    Edate: FormControl;
    SurgensList: Surgens[] = [];
    _yearToSearch = 0;
    ngOnInit() {
        this.Depart = ["-1"];
        this.SurgenType = ["-1"];
        this.Surgen = "0";
        this.getSurgens();
        this.getDropDownFromServer();
        this._fun.RunFunction();
        this.yearsToSelect = this._fun.yearsToSelect;
        if(this.yearsToSelect.list[0]["checked"]){
            this._selectedYear = parseInt(this.yearsToSelect.list[0]["ID"]);
            this.Sdate = new FormControl(new Date(parseInt(this.yearsToSelect.list[0]["ID"]), 0, 1));
            this.Edate = new FormControl(new Date(parseInt(this.yearsToSelect.list[0]["ID"]), 11, 31));
            this.startdateVal = this.Sdate.value;
            this.enddateVal = this.Edate.value;
         }     
        //this.SurgeryType[0] = true;
        this.Shift = "-1";
        //this.Depart[0] = "-1";
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);

        if (
            localStorage.getItem("loginState") != "true" ||
            localStorage.getItem("loginUserName") == ""
        ) {
            this.router.navigate(["login"]);
        } else {
            ///$("#chadTable").DataTable();
        }
        $(document).on('click', '#download', function(e){
            e.preventDefault();
            var href = $(this).attr('href');
            href = href.replace('//', '\\\\');
            href = href.replace('/', '\\');
            href = href.replace('http:', '');
            //debugger;
            var win = window.open('', "_blank");
            
            win.document.write('<script>window.location("'+href+'");//debugger</script>');       

            
        })
        //console.log(this.paginator.pageIndex);
    }
    getSurgens() {
        $("#loader").removeClass("d-none");
        this.http
            .post("https://srv-apps:4433/WebService.asmx/GetSurgens", {})
            .subscribe((Response) => {
                //// ////debugger
                this.SurgensList = [];

                var json = JSON.parse(Response["d"]);
                // // ////debugger
                var _d = JSON.parse(json["surgensList"]);

                for (const [key, value] of Object.entries(_d)) {
                  //  debugger
                    var _sD: Surgens = { id: key, name: value.toString() };

                    this.SurgensList.push(_sD);
                }

                $("#loader").addClass("d-none");
                /*
                  $(_d).each(function(i,k){
                      // ////debugger
                      //var _sD: Depart = {id: i, name: k};

                      //this.departs.push(_sD);
                  })*/
                //// ////debugger
            });
    }
    radioChange(event: MatRadioChange) {
         ////debugger
         this._fun.radioChange(event);
         this.startdateVal = this._fun.Sdate.value;
         this.enddateVal = this._fun.Edate.value;
    }
    master_change() {
        for (var i = 0; i < this.SurgeryType.length; i++) {
            this.SurgeryType[i] = this.master_checked;
        }
    }
    list_change() {
        let checked_count = 0;
        for (var i = 0; i < this.SurgeryType.length; i++) {
            if (this.SurgeryType[i]) {
                checked_count++;
            }
        }
        if (checked_count > 0 && checked_count < this.SurgeryType.length) {
            // If some checkboxes are checked but not all; then set Indeterminate state of the master to true.
            this.master_indeterminate = true;
        } else if (checked_count == this.SurgeryType.length) {
            //If checked count is equal to total items; then check the master checkbox and also set Indeterminate state to false.
            this.master_indeterminate = false;
            this.master_checked = true;
        } else {
            //If none of the checkboxes in the list is checked then uncheck master also set Indeterminate to false.
            this.master_indeterminate = false;
            this.master_checked = false;
        }
    }
    quart_change(event: MatRadioChange) {
        ////debugger;
        //////debugger;
        this._fun.quart_change(event);
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
                this.paginator.pageSize,
                filterValue,
                this.Shift,
                this.Depart,
                this.SurgenType,
                this.Surgen
            );
        }
        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    ngAfterViewInit(): void {}
    getPaginatorData(event: PageEvent) {
        //console.log(this.paginator.pageIndex);
        if (this.startdateVal && this.enddateVal) {
            this.getDataFormServer(
                this.startdateVal,
                this.enddateVal,
                this.paginator.pageIndex,
                this.paginator.pageSize,
                this.fliterVal,
                this.Shift,
                this.Depart,
                this.SurgenType,
                this.Surgen
            );
        }
    }
    getReport($event: any): void {
        console.log(this.SurgeryType);

        if (this.startdateVal && this.enddateVal)
            this.getDataFormServer(
                this.startdateVal,
                this.enddateVal,
                0,
                this.paginator.pageSize,
                this.fliterVal,
                this.Shift,
                this.Depart,
                this.SurgenType,
                this.Surgen,
            );
    }
    
    getReportExcel($event: any): void {
        if (this.startdateVal && this.enddateVal)
            this.getExcelDataFormServer(
                this.startdateVal,
                this.enddateVal,
                this.fliterVal,
                this.Shift,
                this.Depart
            );
    }
    public getExcelDataFormServer(
        _startDate: string,
        _endDate: string,
        _filterVal: string,
        _surgeryShift: string,
        _Depart: string[]
    ) {
        let _surgeryType = "";
        let _counter = 0;
        let _yearStart = new Date(_startDate).getFullYear();
        let _yearEnd = new Date(_endDate).getFullYear();
        ////debugger
        for (var i = 0; i < this.SurgeryType.length; i++) {
            if (this.SurgeryType[i]) {
                _counter++;
                _surgeryType += this._SurgeryTypeArray[i] + "_";
            }
        }
        if (_counter == 4) {
            _surgeryType = "ALL";
        }
        ////debugger
        $("#loader").removeClass("d-none");
        this.http
            .post(
                "https://srv-apps:4433/WebService.asmx/GetSurgeryExcelFile",
                {
                    _fromDate: _startDate,
                    _toDate: _endDate,
                    _freeText: _filterVal,
                    _surgeryShift: _surgeryShift,
                    _surgeryType: _surgeryType,
                    _depart: _Depart
                }
            )
            .subscribe(
                Response => {
                    $("#_departments").empty();
                    //debugger
                    $(document)
                            .find("#download").remove();
                    $("body").append(
                        '<a id="download" class="d-no1ne" trget="_blank" href="' +
                            Response["d"] +
                            '">test</a>'
                    );

                    setTimeout(() => {
                        $(document).find("#download").click();
                        //this.dataSource.paginator = this.paginator
                        $("#loader").addClass("d-none");
                    });
                    //this.dataSource.paginator = this.paginator;
                },
                error => {
                    // //debugger;
                    $("#loader").addClass("d-none");
                }
            );
    }
    public getDropDownFromServer() {
        debugger

        this.http
            .post(
                "https://srv-apps:4433/WebService.asmx/getSurgeryDeparts",
                {}
            )
            .subscribe((Response) => {
                var json = JSON.parse(Response["d"]);
                json = JSON.parse(json["SurgeryDeparts"]);
                debugger
                this.Departs = json;
            });
    }
    public getDataFormServer(
        _startDate: string,
        _endDate: string,
        _pageIndex: number,
        _pageSize: number,
        _filterVal: string,
        _surgeryShift: string,
        _Depart: string[],
        _SurgenType: string[],
        _Surgen: string,
    ) {
        if(_Depart == undefined || _Depart == null){
            ////debugger;
            _Depart = ["-1"];
        }
        if(_SurgenType == undefined || _SurgenType == null){
            ////debugger;
            _SurgenType = ["-1"];
        }
        let _surgeryType = "";
        let _counter = 0;
        let _yearStart = new Date(_startDate).getFullYear();
        let _yearEnd = new Date(_endDate).getFullYear();
        //debugger
        for (var i = 0; i < this.SurgeryType.length; i++) {
            if (this.SurgeryType[i]) {
                _counter++;
                _surgeryType += this._SurgeryTypeArray[i] + "_";
            }
        }
        if (_counter == 4) {
            _surgeryType = "ALL";
        }
        debugger
        $("#loader").removeClass("d-none");
        this.http
            .post("https://srv-apps:4433/WebService.asmx/GetSurgeries", {
                _fromDate: _startDate,
                _toDate: _endDate,
                _pageIndex: _pageIndex,
                _pageSize: _pageSize,
                _freeText: _filterVal,
                _surgeryShift: _surgeryShift,
                _surgeryType: _surgeryType,
                _depart: _Depart,
                _surgenType: _SurgenType,
                _surgen: _Surgen,
            })
            .subscribe(
                Response => {
                    $("#_departments").empty();
                    debugger
                    this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                    var json = JSON.parse(Response["d"]);
                    //let surgeries = JSON.parse(json["aaData"]);
                    //debugger
                    //  for(var i = 0; i < surgeries.length; i++) {
                    //    ////debugger;
                    //    this.TABLE_DATA.push({
                    //       S_ID:surgeries[i].S_ID,
                    //       S_SURGERY_NUMBER:surgeries[i].S_SURGERY_NUMBER,
                    //       S_CASE_NUMBER:surgeries[i].S_CASE_NUMBER,
                    //       S_DEPARTMENT:surgeries[i].S_DEPARTMENT,
                    //       S_SURGERY_DATE:surgeries[i].S_SURGERY_DATE,
                    //       S_DEPARTMENT_REQUEST:surgeries[i].S_DEPARTMENT_REQUEST,
                    //       S_ROOM_NUMBER:surgeries[i].S_ROOM_NUMBER,
                    //       S_SURGERY_CODE:surgeries[i].S_SURGERY_CODE,
                    //       S_SURGERY_NAME:surgeries[i].S_SURGERY_NAME,
                    //       S_SURGERY_TYPE:surgeries[i].S_SURGERY_TYPE,
                    //       S_TIME_ROOM_ENTER:surgeries[i].S_TIME_ROOM_ENTER,
                    //       S_TIME_START_NARCOTIC:surgeries[i].S_TIME_START_NARCOTIC,
                    //       S_TIME_SURGERY_START:surgeries[i].S_TIME_SURGERY_START,
                    //       S_TIME_SURGERY_END:surgeries[i].S_TIME_SURGERY_END,
                    //       S_TIME_END_NARCOTIC:surgeries[i].S_TIME_END_NARCOTIC,
                    //       S_TIME_ROOM_EXIT:surgeries[i].S_TIME_ROOM_EXIT,
                    //       S_SURGEON_NAME:surgeries[i].S_SURGEON_NAME,
                    //       S_NARCOTIC_TYPE:surgeries[i].S_NARCOTIC_TYPE,
                    //       S_NAME_OF_NARCOTIC:surgeries[i].S_NAME_OF_NARCOTIC,
                    //       S_SURGEON_STAFF:surgeries[i].S_SURGEON_STAFF,
                    //       S_ROW_ID:surgeries[i].S_ROW_ID
                    //    });
                    //  }

                    // //debugger
                    this.dataSource = new MatTableDataSource<any>(
                        this.TABLE_DATA
                    );
                    this.resultsLength = parseInt(json["iTotalRecords"]);
                    let _CharMonthLable = JSON.parse(json["_CharMonthLable"]);
                    let _CharMonthVal = JSON.parse(json["_CharMonthVal"]);
                    let _CharPastMonthVal = JSON.parse(
                        json["_CharPastMonthVal"]
                    );
                    ////debugger;
                    /*LineChart*/
                    this._fun.drawCharToDom(
                        "line",
                        _CharMonthLable,
                        [_CharMonthVal, _CharPastMonthVal],
                        "LineChart",
                        "canvsLineChart",
                        _yearStart.toString(),
                        (_yearStart - 1).toString()
                    );
                    this._fun.drawCharToDom(
                        "bar",
                        JSON.parse(json["DepartName"]),
                        JSON.parse(json["DepartCounterSurgery"]),
                        "surgeryCount",
                        "canvsurgeryCount",
                        'סה"כ',
                        ""
                    );
                    let _div = $(
                        '<div class="card text-right" dir="rtl"></div>'
                    );
                    let _departToCheck = JSON.parse(json["SurgeryDepart"])[0];
                    let counts = {};
                    let rowIn = 0;
                    let totalNow = 0;
                    let totalPast = 0;
                    let _footer = $('<div class="card-footer"></div>');

                    //let allNow = 0;
                    for (
                        let s = 0;
                        s < JSON.parse(json["SurgeryDepart"]).length;
                        s++
                    ) {
                        //_footer.empty().append('<p class="row"><span class="col-md-8 col-sm-8 col-xs-8">סה"כ</span><span class="col-md-2 col-sm-2 col-xs-2">'+totalPast+'</span><span  class="col-md-2 col-sm-2 col-xs-2">'+totalNow+'</span><p>');

                        if (
                            _departToCheck !=
                                JSON.parse(json["SurgeryDepart"])[s] ||
                            s == 0
                        ) {
                            for (
                                var k = 0;
                                k <
                                JSON.parse(json["SurgeryDepartPast"]).length;
                                k++
                            ) {
                                if (
                                    JSON.parse(json["SurgeryDepartPast"])[k] ==
                                    _departToCheck
                                ) {
                                    totalPast += parseInt(
                                        JSON.parse(json["SurgeryCounterPast"])[
                                            k
                                        ]
                                    );
                                }
                            }
                            _footer
                                .empty()
                                .append(
                                    '<p class="row"><span class="col-md-8 col-sm-8 col-xs-8  text-left">סה"כ לתקופה: </span><span  class="col-md-2 col-sm-2 col-xs-2">' +
                                        totalNow +
                                        '</span><span class="col-md-2 col-sm-2 col-xs-2">' +
                                        totalPast +
                                        "</span><p>"
                                );
                            _departToCheck = JSON.parse(json["SurgeryDepart"])[
                                s
                            ];
                            if (s > 0) {
                                _div.append(_footer);
                                $("#_departments").append(_div.clone());
                            }

                            _div.empty();
                            let _header = $(
                                '<div class="card-header"><h1 class="row"><span class="col-md-8 col-sm-8 col-xs-8">' +
                                    _departToCheck +
                                    '</span><span class="col-md-2 col-sm-2 col-xs-2">' +
                                    _yearStart +
                                    '</span><span class="col-md-2 col-sm-2 col-xs-2">' +
                                    (_yearStart - 1) +
                                    "</span></h1></div>"
                            );
                            _div.append(_header);
                            let _bodyCard = $('<div class="card-body"></div>');
                            _div.append(_bodyCard);

                            rowIn = 0;
                            totalNow = 0;
                            totalPast = 0;
                        }
                        let _val = 0;
                        let _index = JSON.parse(
                            json["SurgeryDepartPastCom"]
                        ).indexOf(
                            JSON.parse(json["SurgeryDepart"])[s] +
                                "_" +
                                JSON.parse(json["SurgeryName"])[s]
                        );
                        if (_index >= 0) {
                            _val = JSON.parse(json["SurgeryCounterPast"])[
                                _index
                            ];
                        }
                        let _p = $(
                            '<p class="row"><span class="col-md-8 col-sm-8 col-xs-8">' +
                                JSON.parse(json["SurgeryName"])[s] +
                                '</span><span class="col-md-2 col-sm-2 col-xs-2">' +
                                JSON.parse(json["SurgeryCounter"])[s] +
                                '</span><span class="col-md-2 col-sm-2 col-xs-2">' +
                                _val +
                                "</span></p>"
                        );
                        if (rowIn < 4 || 1) {
                            $(_div)
                                .find(".card-body")
                                .append(_p);
                        }
                        totalNow += parseInt(
                            JSON.parse(json["SurgeryCounter"])[s]
                        );
                        //allNow += parseInt(JSON.parse(json["SurgeryCounter"])[s]);
                        rowIn++;
                    }
                    //let allPast = 0;
                    for (
                        var k = 0;
                        k < JSON.parse(json["SurgeryDepartPast"]).length;
                        k++
                    ) {
                        if (
                            JSON.parse(json["SurgeryDepartPast"])[k] ==
                            _departToCheck
                        ) {
                            totalPast += parseInt(
                                JSON.parse(json["SurgeryCounterPast"])[k]
                            );
                        }
                        //allPast += parseInt(JSON.parse(json["SurgeryCounterPast"])[k]);
                    }

                    let allNow = JSON.parse(json["TotalNowSurgery"]);
                    let allPast = JSON.parse(json["TotalSurgeryPast"]);
                    ////debugger
                    this._fun.drawCharToDom(
                        "bar",
                        [_yearStart.toString(), (_yearStart - 1).toString()],
                        [allNow[0], allPast[0]],
                        "totalBarChart",
                        "canvstotalBarChart",
                        'סה"כ',
                        ""
                    );

                    _footer
                        .empty()
                        .append(
                            '<p class="row"><span class="col-md-8 col-sm-8 col-xs-8 text-left">סה"כ לתקופה: </span><span  class="col-md-2 col-sm-2 col-xs-2">' +
                                totalNow +
                                '</span><span class="col-md-2 col-sm-2 col-xs-2">' +
                                totalPast +
                                "</span><p>"
                        );
                    _div.append(_footer);
                    $("#_departments").append(_div.clone());
                    //this.drawCharToDom('bar', JSON.parse(json["SurgeryName"]), JSON.parse(json["SurgeryCounter"]), 'departSurgery', 'canvdepartSurgery');
                    //this.paginator. = parseInt(json["iTotalRecords"]);
                    //this.dataSource.sort = this.sort;
                    // //debugger
                    setTimeout(() => {
                        //this.dataSource.paginator = this.paginator
                        $("#loader").addClass("d-none");
                    });
                    //this.dataSource.paginator = this.paginator;
                },
                error => {
                    // //debugger;
                    $("#loader").addClass("d-none");
                }
            );
    }
}
