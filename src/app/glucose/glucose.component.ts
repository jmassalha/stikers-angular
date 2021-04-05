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
import { Chart } from "chart.js";
import { Time } from "@angular/common";
import { FormControl } from "@angular/forms";
import * as Fun from "../public.functions";
export interface Glucose {
    PGR_Sample_Number: string;
    PGR_Case_Number: string;
    PGR_Patient_Number: string;
    PGR_Patient_First_Name: string;
    PGR_Patient_Last_Name: string;
    PGR_Patient_Age: string;
    PGR_Patient_Depart_Request: string;
    PGR_Taking_Date: Date;
    PGR_Taking_Time: Time;
    PGR_Rate_Value: string;
}
@Component({
    selector: "app-glucose",
    templateUrl: "./glucose.component.html",
    styleUrls: ["./glucose.component.css"],
})
export class GlucoseComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    // @ViewChild(MatSort, { static: true }) sort: MatSort;
    displayedColumns: string[] = [
        // 'ROW_ID',
        "PGR_Sample_Number",
        "PGR_Case_Number",
        "PGR_Patient_Number",
        "PGR_Patient_Depart_Request",
        "PGR_Patient_First_Name",
        "PGR_Patient_Last_Name",
        "PGR_Patient_Age",
        "PGR_Taking_Date",
        "PGR_Taking_Time",
        "PGR_Rate_Value",
    ];
    TABLE_DATA: Glucose[] = [];
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    resultsLength = 0;
    chart = null;
    isShow = false;
    startdateVal: string;
    enddateVal: string;
    _fun = new Fun.Functions();
    Sdate: FormControl;
    Edate: FormControl;
    _yearToSearch = 0;

    fliterVal = "";
    constructor(private router: Router, private http: HttpClient) {}

    ngOnInit(): void {
        this._fun.RunFunction();
        this.Sdate = new FormControl(new Date());
        this.Edate = new FormControl(new Date());
        this.startdateVal = this.Sdate.value;
        this.enddateVal = this.Edate.value;
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);

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
            localStorage.getItem("loginUserName").toLowerCase() == "lshavit" ||
            localStorage.getItem("loginUserName").toLowerCase() == "mbadarni" ||
            localStorage.getItem("loginUserName").toLowerCase() ==
                "mubadarne" ||
            localStorage.getItem("loginUserName").toLowerCase() ==
                "muhbadarne" /*LShavit*/
        ) {
        } else {
            this.router.navigate(["login"]);
            ///$("#chadTable").DataTable();
        }
        this.getReport(null);
    }
    getPaginatorData(event: PageEvent) {
        //console.log(this.paginator.pageIndex);
        if (this.startdateVal && this.enddateVal) {
            this.getDataFormServer(this.startdateVal, this.enddateVal);
        }
    }
    getReport($event: any): void {
        if (this.startdateVal && this.enddateVal)
            this.getDataFormServer(this.startdateVal, this.enddateVal);
    }
    public getDataFormServer(_startDate: string, _endDate: string) {
        $("#loader").removeClass("d-none");
        this.http
            .post("http://srv-apps/wsrfc/WebService.asmx//GetGlucoseApp", {
                _fromDate: _startDate,
                _toDate: _endDate,
            })
            .subscribe(
                (Response) => {
                    $("#_departments").empty();
                    //  //debugger
                    this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                    var json = $.parseJSON(Response["d"]);
                    let tableData = $.parseJSON(json["tableData"]);
                    ////debugger;

                    this.dataSource = new MatTableDataSource<any>(
                        this.TABLE_DATA
                    );
                    this._fun.drawCharToDom(
                        "bar" /*'סה"כ בדיקות', 'סה"כ בדיקות בטווח',*/,
                        ['סה"כ בדיקות מתחת ל-71', 'סה"כ בדיקות מעל ל-250'],
                        [
                            /*parseInt(json["TotalCheckes"]),
                          parseInt(json["TotalCheckes_Normal"]),*/
                            parseInt(json["TotalCheckes_71"]),
                            parseInt(json["TotalCheckes_250"]),
                        ],
                        "totalBarChart",
                        "canvsBarCount",
                        'סה"כ',
                        ""
                    );
                    for (var i = 0; i < tableData.items.length; i++) {
                        //var t =  tableData.items[i].CS_SURVEY_DATE.split("T");
                        //var d =  tableData.items[i].CS_SURVEY_Q2_2.split(" ");
                        //var s =  tableData.items[i].CS_SURVEY_Q4_4.split(" ");
                        ////debugger
                        this.TABLE_DATA.push({
                            PGR_Patient_First_Name:
                                tableData.items[i].PGR_Patient_First_Name,
                            PGR_Patient_Last_Name:
                                tableData.items[i].PGR_Patient_Last_Name,
                            PGR_Patient_Age: tableData.items[i].PGR_Patient_Age,
                            PGR_Patient_Depart_Request:
                                tableData.items[i].PGR_Patient_Depart_Request,
                            PGR_Taking_Date: tableData.items[i].PGR_Taking_Date,
                            PGR_Taking_Time: tableData.items[i].PGR_Taking_Time,
                            PGR_Rate_Value: tableData.items[i].PGR_Rate_Value,
                            PGR_Sample_Number:
                                tableData.items[i].PGR_Sample_Number,
                            PGR_Case_Number: tableData.items[i].PGR_Case_Number,
                            PGR_Patient_Number:
                                tableData.items[i].PGR_Patient_Number,
                        });
                    }

                    // //debugger
                    this.dataSource = new MatTableDataSource<any>(
                        this.TABLE_DATA
                    );
                    this.resultsLength = parseInt(json["iTotalDisplayRecords"]);
                    setTimeout(() => {
                        //this.dataSource.paginator = this.paginator
                        $("#loader").addClass("d-none");
                    });
                    //this.dataSource.paginator = this.paginator;
                },
                (error) => {
                    // //debugger;
                    $("#loader").addClass("d-none");
                }
            );
    }
}
