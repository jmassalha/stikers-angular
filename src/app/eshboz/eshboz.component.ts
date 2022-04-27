import { Component, OnInit, ViewChild } from "@angular/core";
import { MatRadioChange } from "@angular/material/radio";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";

import * as Fun from "../public.functions";
import * as $ from "jquery";
import { Time } from "@angular/common";
import { FormControl } from "@angular/forms";
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
    selector: "app-eshboz",
    templateUrl: "./eshboz.component.html",
    styleUrls: ["./eshboz.component.css"],
})
export class EshbozComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    modalOptions: NgbModalOptions;
    closeResult: string;
    Depart: string[];
    DaysToCalc: number;
    displayedColumns: string[] = [
        "PM_CASE_NUMBER",
        "PM_MOVE_DATE",
        "PM_MOVE_TIME",
        "PM_MOVE_DEPART",
        "PM_CASE_TYPE",
        "PM_LAST_NAME",
        "PM_FIRST_NAME",
    ];
    pasttoshow: boolean = true;
    In = {
        ראורל: 4,
        "ראול-יל": 0,
        ראור: 20,
        "רא-א-ג": 5,
        "רא-א-ג-י": 0,
        "רגרי-ש": 18,
        "רטנ-ילד": 4,
        "רטנ-כ": 4,
        "רטנ-ל": 9,
        "רטנ-פ-י": {
            "רטנ-פ-י": 14,
            "רטנ-ילוד": 10,
        },
        ריול: 39,
        רילד: 25,
        "רילו-ב": 39,
        רכיר: 26,
        "רכיר-חז": 0,
        "רכיר-יל": 4,
        רנורול: 0,
        רנש: 4,
        רעינ: 2,
        "רעינ-יל": 0,
        "רפ-ל": 5,
        "רפ-ל-יל": 0,
        "רפנ-א": 32,
        "רפנ-א-טמ": 4,
        "רפנ-ב": 32,
        "רפנ-ב-טמ": 4,
        רצינת: 0,
        רקרדיו: 23,
        "רשבצ-מ": 0,
    };
    TABLE_DATA: Bekorem[] = [];
    dataSource = new MatTableDataSource(this.TABLE_DATA);

    _selectedYear = 0;
    resultsLength = 0;
    fliterVal = "";
    _yearToSearch = 0;
    chart = null;
    isShow = false;
    constructor(private router: Router, private http: HttpClient) {}
    startdateVal: string;
    enddateVal: string;
    depart: any[];
    FDepartKabalot: any[];
    FKabalotD7of: any[];
    FKabalotNotD7of: any[];
    FKabalotD7ofPast: any[];
    FKabalotNotD7ofPast: any[];
    depart7ozrem: any[];
    depart7ozremTot: any[];
    depart7ozremPastTot: any[];
    departBedsIn: any[];
    eshpoz: any[];
    kabalot: any[];
    departPast: any[];
    eshpozPast: any[];
    kabalotPast: any[];
    yearStart: string;
    yearEnd: string;
    TotalDaysInRange: number;
    yearsToSelect: { list: {} };
    _fun = new Fun.Functions();
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
        // this.Depart[0] = "-1";
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
                this.Depart
            );
            this.getDataCharts(
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
        //////////debugger;

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
            
            this.getDataCharts(
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
        if (this.startdateVal && this.enddateVal) {
            let sDate = new Date(this.enddateVal);
            let eDate = new Date(this.startdateVal);

            let diffTime: any = sDate.getTime() - eDate.getTime();
            // //////debugger
            this.DaysToCalc = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            ////////debugger
            this.getDataFormServer(
                this.startdateVal,
                this.enddateVal,
                0,
                10,
                this.fliterVal,
                this.Depart
            );
            this.getDataCharts(
                this.startdateVal,
                this.enddateVal,
                0,
                10,
                this.fliterVal,
                this.Depart
            );
        }
    }
    getReportExcel($event: any): void {
        if (this.startdateVal && this.enddateVal){
            this.getDataFormServer(
                this.startdateVal,
                this.enddateVal,
                0,
                10,
                this.fliterVal,
                this.Depart
            );
            this.getDataCharts(
                this.startdateVal,
                this.enddateVal,
               0,
                10,
                this.fliterVal,
                this.Depart
            );
        }
            
    }
    public newData() {
        this.http
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/EshbozimAppNew", {
            //.post("http://localhost:64964/WebService.asmx/EshbozimAppNew", {
                _fromDate: this.startdateVal,
                _toDate: this.enddateVal,
                _freeText: this.fliterVal,
                _depart: this.Depart,
            })
            .subscribe((Response) => {
                $("#_departments").empty();
                //debugger
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                var json = JSON.parse(Response["d"]);
                ////debugger
                this.depart = JSON.parse(json["DepartName"]);
                this.eshpoz = JSON.parse(json["DepartEshpozim"]);
                this.kabalot = JSON.parse(json["DepartKblot"]);
                this.departPast = JSON.parse(json["DepartKblotPast"]);
                this.eshpozPast = JSON.parse(json["DepartEshpozimPast"]);
                this.kabalotPast = JSON.parse(json["DepartNamePast"]);
            });
    }
    calculateDiff(dateStart, dateEnd) {
        let currentDate = new Date(dateEnd);
        dateStart = new Date(dateStart);

        return Math.floor(
            (Date.UTC(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate()
            ) -
                Date.UTC(
                    dateStart.getFullYear(),
                    dateStart.getMonth(),
                    dateStart.getDate()
                )) /
                (1000 * 60 * 60 * 24)
        );
    }
    public getDataFormServer(
        _startDate: string,
        _endDate: string,
        _pageIndex: number,
        _pageSize: number,
        _filterVal: string,
        _Depart: string[]
    ) {
        let _surgeryType = "";
        let _counter = 0;
        this.TotalDaysInRange = this.calculateDiff(_startDate, _endDate);
        
        let _yearStart = new Date(_startDate).getFullYear();
        let _yearEnd = new Date(_endDate).getFullYear();
        this.yearStart = new Date(_startDate).getFullYear().toString();
        this.yearEnd = (new Date(_startDate).getFullYear() - 1).toString();
        //this.newData();
        if (_counter == 4) {
            _surgeryType = "ALL";
        }
        if (_Depart == undefined || _Depart == null) {
            ////////debugger;
            _Depart = ["-1"];
        }
        //////debugger;
        $("#loader").removeClass("d-none");
        this.http
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/EshbozimAppNew", {
                
            //.post("http://localhost:64964/WebService.asmx/EshbozimAppNew", {
                _fromDate: this.startdateVal,
                _toDate: this.enddateVal,
                _freeText: this.fliterVal,
                _depart: this.Depart,
            })
            .subscribe(
                (Response) => {
                    
                    //////////debugger
                    this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                    var json = JSON.parse(Response["d"]);
                    ////debugger
                    this.depart = JSON.parse(json["DepartName"]);
                    this.eshpoz = JSON.parse(json["DepartEshpozim"]);
                    this.kabalot = JSON.parse(json["DepartKblot"]);
                    this.kabalotPast = JSON.parse(json["DepartKblotPast"]);
                    
                    this.eshpozPast = JSON.parse(json["DepartEshpozimPast"]);
                    this.departPast = JSON.parse(json["DepartNamePast"]);
                    this.departBedsIn = JSON.parse(json["DepartBeds"]);
                    this.FDepartKabalot = JSON.parse(json["FDepartKabalot"]);
                    this.FKabalotD7of = JSON.parse(json["FKabalotD7of"]);
                    this.FKabalotNotD7of = JSON.parse(json["FKabalotNotD7of"]);
                    this.FKabalotD7ofPast = JSON.parse(json["FKabalotD7ofPast"]);
                    this.FKabalotNotD7ofPast = JSON.parse(json["FKabalotNotD7ofPast"]);
                    this.depart7ozrem = JSON.parse(json["Eshpoz7ozerDeparts"]);
                    this.depart7ozremTot = JSON.parse(json["Eshpoz7ozer"]);
                    this.depart7ozremPastTot = JSON.parse(json["Eshpoz7ozerPast"]);
                    //debugger
                    if(this.Depart[0] == "-1"){
                        this.pasttoshow = false;

                    }else{
                        this.pasttoshow = true;
                    }
                    setTimeout(() => {
                        $("#_department1s1").removeClass('d-none');
                        //this.dataSource.paginator = this.paginator
                        $("#loader").addClass("d-none");
                    });
                    //this.dataSource.paginator = this.paginator;
                },
                (error) => {
                    // ////////debugger;
                    $("#loader").addClass("d-none");
                }
            );
    }
    public getDataCharts(
        _startDate: string,
        _endDate: string,
        _pageIndex: number,
        _pageSize: number,
        _filterVal: string,
        _Depart: string[]
    ) {
        let _surgeryType = "";
        let _counter = 0;
        let _yearStart = new Date(_startDate).getFullYear();
        let _yearEnd = new Date(_endDate).getFullYear();

        if (_counter == 4) {
            _surgeryType = "ALL";
        }
        //////debugger
        $("#loader").removeClass("d-none");
        this.http
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetEshbozemApp", {
            
            //.post("http://localhost:64964/WebService.asmx/GetEshbozemApp", {
                _fromDate: _startDate,
                _toDate: _endDate,
                _pageIndex: _pageIndex,
                _pageSize: _pageSize,
                _freeText: _filterVal,
                _depart: _Depart
            })
            .subscribe(
                Response => {
                    var json = JSON.parse(Response["d"]);
                    var LineName = JSON.parse(json["LineName"]);
                    var LineCounter = JSON.parse(json["LineCounter"]);
                    var LineCounterPast = JSON.parse(json["LineCounterPast"]);
                    this._fun.drawCharToDom(
                        "line",
                        LineName,
                        [LineCounter, LineCounterPast],
                        "LineChart",
                        "canvsLineChart",
                        _yearStart.toString(),
                        (_yearStart - 1).toString()
                    );
                    this._fun.drawCharToDom(
                        "bar",
                        JSON.parse(json["DepartName"]),
                        JSON.parse(json["DepartCounter"]),
                        "bekoremCount",
                        "canvbekoremCount",
                        'סה"כ',
                        ''
                    );
                }
            )
    }
}
