import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatRadioChange } from "@angular/material/radio";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import * as $ from "jquery";
import * as Fun from "../public.functions";
import { Time } from "@angular/common";
import { FormControl } from "@angular/forms";
import { TableUtil } from "./tableUtil";
import { MenuPerm } from "../menu-perm";
export interface Dimot {
    D_ROW_ID: number;
    D_CASE_NUMBER: string;
    D_PATIENT_NUMBER: string;
    D_SERVICE_ID: string;
    D_SERVICE_NAME: string;
    D_REQUEST_DATE: Date;
    D_REQUEST_TIME: Time;
    D_TECH_DOING_DATE: Date;
    D_TECH_DOING_TIME: Time;
    D_DOC_DOING_DATE: Date;
    D_DOC_DOING_TIME: Time;
    D_REQUEST_DEPARTMENT: string;
    D_DOING_DEPARTMENT: string;
    D_CHEK_TYPE: string;
    D_TECH_NAME: string;
    D_DOC_NAME: string;
    D_NEED_TO_CHECK: string;
    D_TIME_UNTIL_DONIG_IN_DAYS: number;
    //D_DOC_ANSWER: string;
}

@Component({
    selector: "app-dimot",
    templateUrl: "./dimot.component.html",
    styleUrls: ["./dimot.component.css"]
})
export class DimotComponent implements OnInit, AfterViewInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    displayedColumns: string[] = [
        // 'ROW_ID',
        "D_CASE_NUMBER",
        "D_PATIENT_NUMBER",
        "D_SERVICE_NAME",
        "D_TECH_DOING_DATE",
        "D_TECH_DOING_TIME",
        "D_DOC_DOING_DATE",
        "D_DOC_DOING_TIME",
        "D_REQUEST_DEPARTMENT",
        "D_DOING_DEPARTMENT",
       // "D_TECH_NAME",
     //   "D_DOC_NAME",
      //  "D_NEED_TO_CHECK",
        "D_TIME_UNTIL_DONIG_IN_DAYS"
    ];
    modalOptions: NgbModalOptions;
    closeResult: string;
    TABLE_DATA: Dimot[] = [];
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    tableLoader: Boolean;
    _selectedYear = 0;
    resultsLength = 0;
    fliterVal = "";
    _yearToSearch = 0;
    chart = null;
    isShow = false;
    constructor(private router: Router, private http: HttpClient,
        private mMenuPerm: MenuPerm
    ) {
        mMenuPerm.setRoutName("dimot");
        setTimeout(() => {
            if(!mMenuPerm.getHasPerm()){
                localStorage.clear();
                this.router.navigate(["login"]);
            }
        }, 2000);}
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
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);

        
        //this.dataSource = new MatTableDataSource(this.TABLE_DATA);
        //console.log(this.paginator.pageIndex);
    }
    exportTable() {
        TableUtil.exportToExcel("dimotTable");
    }
    radioChange(event: MatRadioChange) {
        //////debugger
        this._fun.radioChange(event);
        this.startdateVal = this._fun.Sdate.value;
        this.enddateVal = this._fun.Edate.value;
    }
    applyFilter(filterValue: string) {
        this.fliterVal = filterValue;
        if (this.startdateVal && this.enddateVal) {
            this.getTableFromServer(
                this.startdateVal,
                this.enddateVal,
                this.paginator.pageIndex,
                this.paginator.pageSize,
                this.Depart,
                this.fliterVal,
                this.Shift,
                this.RequestType
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
            this.getTableFromServer(
                this.startdateVal,
                this.enddateVal,
                this.paginator.pageIndex,
                this.paginator.pageSize,
                this.Depart,
                this.fliterVal,
                this.Shift,
                this.RequestType
            );
        }
    }
    getReport($event: any): void {
        if (this.startdateVal && this.enddateVal)
            this.getDataFormServer(
                this.startdateVal,
                this.enddateVal,
                this.paginator.pageIndex,
                this.paginator.pageSize,
                this.Depart,
                this.Shift,
                this.RequestType
            );
    }

    getReportExcel($event: any): void {
        if (this.startdateVal && this.enddateVal)
            this.getDataFormServer(
                this.startdateVal,
                this.enddateVal,
                0,
                10,
                this.Depart,
                this.Shift,
                this.RequestType
            );
    }
    public getTableFromServer(
        _startDate: string,
        _endDate: string,
        _pageIndex: number,
        _pageSize: number,
        _Depart: string,
        _FreeText: string,
        _Shift: string,
        _RequestType: string
    ) {
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // ////debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        this.http
            .post(
               "http://srv-apps-prod/RCF_WS/WebService.asmx/GetDimotTableApp",
             //   "http://localhost:64964/WebService.asmx/GetDimotTableApp",
                {
                    _fromDate: _startDate,
                    _toDate: _endDate,
                    _pageIndex: _pageIndex,
                    _pageSize: _pageSize,
                    _depart: _Depart,
                    _FreeText: _FreeText,
                    _shift: this.Shift,
                    _requestType: this.RequestType
                }
            )
            .subscribe(Response => {
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                var json = JSON.parse(Response["d"]);
                let DimotData = JSON.parse(json["aaData"]);
                for (var i = 0; i < DimotData.length; i++) {
                    this.TABLE_DATA.push({
                        D_ROW_ID: DimotData[i].D_ROW_ID,
                        D_CASE_NUMBER: DimotData[i].D_CASE_NUMBER,
                        D_PATIENT_NUMBER: DimotData[i].D_PATIENT_NUMBER,
                        D_SERVICE_ID: DimotData[i].D_SERVICE_ID,
                        D_SERVICE_NAME: DimotData[i].D_SERVICE_NAME,
                        D_REQUEST_DATE: DimotData[i].D_REQUEST_DATE,
                        D_REQUEST_TIME: DimotData[i].D_REQUEST_TIME,
                        D_TECH_DOING_DATE: DimotData[i].D_TECH_DOING_DATE,
                        D_TECH_DOING_TIME: DimotData[i].D_TECH_DOING_TIME,
                        D_DOC_DOING_DATE: DimotData[i].D_DOC_DOING_DATE,
                        D_DOC_DOING_TIME: DimotData[i].D_DOC_DOING_TIME,
                        D_REQUEST_DEPARTMENT: DimotData[i].D_REQUEST_DEPARTMENT,
                        D_DOING_DEPARTMENT: DimotData[i].D_DOING_DEPARTMENT,
                        D_CHEK_TYPE: DimotData[i].D_CHEK_TYPE,
                        D_TECH_NAME: DimotData[i].D_TECH_NAME,
                        D_DOC_NAME: DimotData[i].D_DOC_NAME,
                        D_NEED_TO_CHECK: DimotData[i].D_NEED_TO_CHECK,
                        D_TIME_UNTIL_DONIG_IN_DAYS:
                            DimotData[i].D_TIME_UNTIL_DONIG_IN_DAYS
                        //D_DOC_ANSWER: DimotData[i].D_DOC_ANSWER
                    });
                }

                // ////debugger
                this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                this.resultsLength = parseInt(json["iTotalRecords"]);
                setTimeout(function() {
                    //////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }
    public getDataFormServer(
        _startDate: string,
        _endDate: string,
        _pageIndex: number,
        _pageSize: number,
        _Depart: string,
        _Shift: string,
        _RequestType: string
    ) {
        // ////debugger
        let _counter = 0;
        let _yearStart = new Date(_startDate).getFullYear();
        let _yearEnd = new Date(_endDate).getFullYear();
        $("#loader").removeClass("d-none");
        this.loader = true;
        this.getTableFromServer(
            _startDate,
            _endDate,
            _pageIndex,
            _pageSize,
            _Depart,
            this.fliterVal,
            this.Shift,
            this.RequestType
        );
        ////////debugger
        this.http
            //.post("http://localhost:64964/WebService.asmx/GetDimotApp", {
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetDimotApp", {
                _fromDate: _startDate,
                _toDate: _endDate,
                _pageIndex: _pageIndex,
                _pageSize: _pageSize,
                _depart: _Depart,
                _shift: this.Shift,
                _requestType: this.RequestType
            })
            .subscribe(
                Response => {
                    //////debugger
                    var json = JSON.parse(Response["d"]);
                    var _monthsDoingLabels = JSON.parse(
                        json["_monthsDoingLabels"]
                    );
                    var _doingTechRang = JSON.parse(json["_doingTechRang"]);
                    var _doingTechVal = JSON.parse(json["_doingTechVal"]);
                    var _doingDocRang = JSON.parse(json["_doingDocRang"]);
                    var _doingDocVal = JSON.parse(json["_doingDocVal"]);
                    var _monthsDoingVal = JSON.parse(json["_monthsDoingVal"]);
                    var _monthsTechVal = JSON.parse(json["_monthsTechVal"]);

                    var _serviceDocRang = JSON.parse(json["_serviceDocRang"]);
                    var _serviceDocVal = JSON.parse(json["_serviceDocVal"]);

                    var _checkTypeRang = JSON.parse(json["_checkTypeRang"]);
                    var _checkTypeVal = JSON.parse(json["_checkTypeVal"]);

                    var _docRang = JSON.parse(json["_docRang"]);
                    var _docVal = JSON.parse(json["_docVal"]);

                    var _serviceTechRang = JSON.parse(
                        json["_serviceTechRang"]
                    );
                    var _serviceTechVal = JSON.parse(json["_serviceTechVal"]);

                    var _totalRang = JSON.parse(json["_totalRang"]);
                    var _totalVal = JSON.parse(json["_totalVal"]);

                    this._fun.drawCharToDom(
                        "bar",
                        _docRang,
                        _docVal,
                        "DocChart",
                        "canvDocChart",
                        "סיכום",
                        ""
                    );
                    this._fun.drawCharToDom(
                        "bar",
                        _totalRang,
                        _totalVal,
                        "totalChart",
                        "canvtotalChart",
                        "סיכום",
                        ""
                    );
                    this._fun.drawCharToDom(
                        "bar",
                        _checkTypeRang,
                        _checkTypeVal,
                        "checkTypeChart",
                        "canvcheckTypeChart",
                        "סוג בדיקה",
                        ""
                    );
                    this._fun.drawCharToDom(
                        "line",
                        _monthsDoingLabels,
                        [_monthsDoingVal, _monthsTechVal],
                        "LineChart",
                        "canvsLineChart",
                        "פוענח",
                        "בוצע"
                    );
                    /*
                    docCount
                    techCount
                    */
                    this._fun.drawCharToDom(
                        "bar",
                        _doingDocRang,
                        _doingDocVal,
                        "docCount",
                        "canvdocCount",
                        "פוענח",
                        ""
                    );
                    this._fun.drawCharToDom(
                        "bar",
                        _doingTechRang,
                        _doingTechVal,
                        "techCount",
                        "canvtechCount",
                        "בוצע",
                        ""
                    );
                    this._fun.drawCharToDom(
                        "bar",
                        _serviceDocRang,
                        _serviceDocVal,
                        "servicedocCount",
                        "canvservicedocCount",
                        "פוענח",
                        ""
                    );
                    this._fun.drawCharToDom(
                        "bar",
                        _serviceTechRang,
                        _serviceTechVal,
                        "servicetechCount",
                        "canvservicetechCount",
                        "בוצע",
                        ""
                    );
                    setTimeout(() => {
                        //this.dataSource.paginator = this.paginator
                        $("#loader").addClass("d-none");
                        this.loader = false;
                    });
                    //this.dataSource.paginator = this.paginator;
                },
                error => {
                    // //////debugger;
                    $("#loader").addClass("d-none");
                    this.loader = false;
                }
            );
    }
}
