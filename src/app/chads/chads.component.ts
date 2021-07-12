import {
    Component,
    OnInit,
    ViewChild,
    AfterViewInit,
    ElementRef
} from "@angular/core";

import * as Fun from "../public.functions";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import {
    NgbModal,
    ModalDismissReasons,
    NgbModalOptions
} from "@ng-bootstrap/ng-bootstrap";
import * as $ from "jquery";
import * as Chart from "chart.js";import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
  } from "@angular/forms";
import { MatRadioChange } from '@angular/material/radio';
export interface Depart{
    id: string;
    name: string;
}
export interface RelevantOrNot{
    RelevantOrNotCheck: string;
    RelevantNote: string;
    RelevantDate: string;
    RelevantDoc: string;
    ROW_ID: string;
}
export interface Chade {
    ROW_ID: number;
    Measurment_ID: string;
    Hospital_ID: string;
    Patient_ID: string;
    Patientbikoret_ID: string;
    ID_Types: string;
    Case_Number: string;
    Department_ID: string;
    Hosp_Date: Date;
    Discharge_Date: Date;
    Death_Date: Date;
    Birth_Year: string;
    Gender: string;
    Adress_Street: string;
    Adress_House: string;
    Adress_CityName: string;
    CityCode: string;
    SES: string;
    Insurance_Provider: string;
    CHADS2_Date: Date;
    CHADS2_Value: string;
    CHADS2_Tool: string;
    AntiCoag_Treat: string;
    Diagnosis_ICD: string;
    Remarks: string;
    PatiantNumber: string;
    KhroneOrNot: string;
    DoctorName: string;
    Chad_Type: string;
    Hide_Btn: Boolean;
    FreeText: string;
    Depart_Name: string;
    Tkeen: string;
    RelevantOrNotCheck: string;
    RelevantNote: string;
    RelevantDate: string;
    RelevantDoc: string;
}

@Component({
    selector: "app-chads",
    templateUrl: "./chads.component.html",
    styleUrls: ["./chads.component.css"]
})
export class ChadsComponent implements OnInit, AfterViewInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    modalOptions: NgbModalOptions;
    closeResult: string;
    /*
'ROW_ID', 'Measurment_ID', 'Hospital_ID', 'Patient_ID', 'Patientbikoret_ID', 'ID_Types', 'Case_Number', 'Department_ID',  'Hosp_Date', 'Discharge_Date',   'Death_Date',  'Birth_Year',  'Gender',  'Adress_Street',  'Adress_House',  'Adress_CityName',  'CityCode',  'SES',  'Insurance_Provider',  'CHADS2_Date',  'CHADS2_Value',  'CHADS2_Tool',  'AntiCoag_Treat',  'Diagnosis_ICD',  'Remarks',  'PatiantNumber',  'KhroneOrNot',  'DoctorName',  'Chad_Type'
*/
    departs: Depart[] = [];
    displayedColumns: string[] = [
        // 'ROW_ID',
        "Case_Number",
        "Depart_Name",
       // "PatiantNumber",
        "Hosp_Date",
        "Discharge_Date",
        "CHADS2_Date",
        "CHADS2_Value",
        "CHADS2_Tool",
        "AntiCoag_Treat",
        "DoctorName",
        "Chad_Type",
        "Tkeen",
        "action",
        "relevant"
    ];
    
    _fun = new Fun.Functions();
    TABLE_DATA: Chade[] = [];
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    patientNumber: string;
    caseNumber: string;
    resultsLength = 0;
    fliterVal = "";

    chart = null;
    isShow = false;
    constructor(
        private router: Router,
        private snackBar: MatSnackBar,
        private http: HttpClient,
        private modalService: NgbModal,
        private formBuilder: FormBuilder
    ) {}
    
    RelevantForm: FormGroup;
    ChadWithOutValByDocNameDoctorsNames= null;
    ChadWithOutValByDocName= null;
    totalRowsChadWithVal= null;
    totalRowsChadWithOutVal = null;

    yearsToSelect : {list:{}};
    
    ChadDeparts= null;
    ChadDepartsGoods = null;
    ChadDepartsNotGoods = null;
    startdateVal: string;
    enddateVal: string;
    goodOrNot: string;
    AntiCoagTreat: string;
    DepartmentID: string;
    Relevant: string;
    chadVal: string;
    chadDate: string;
    chadTool: string;
    selectedIndexTab: number;    
    _selectedYear = 0;    
    Sdate: FormControl;
    Edate: FormControl;
    ngOnInit() {
        this._fun.RunFunction();
        this.yearsToSelect = this._fun.yearsToSelect;
       if(this.yearsToSelect.list[0]["checked"]){
           this._selectedYear = parseInt(this.yearsToSelect.list[0]["ID"]);
           this.Sdate = new FormControl(new Date(parseInt(this.yearsToSelect.list[0]["ID"]), 0, 1));
           this.Edate = new FormControl(new Date(parseInt(this.yearsToSelect.list[0]["ID"]), 11, 31));
           this.startdateVal = this.Sdate.value;
           this.enddateVal = this.Edate.value;
        }   
        this.patientNumber = "";
        this.caseNumber = "";
        this.selectedIndexTab = 0;
        this.goodOrNot = "-1";
        this.AntiCoagTreat = "0";
        this.DepartmentID = "הכל";
        this.Relevant = "-1";
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);
        this.RelevantForm = this.formBuilder.group({
            RelevantOrNotCheck: [false, false],
            RelevantNote: ["", false],
            RelevantDate: [new FormControl(new Date()).value, false],
            RelevantDoc: [localStorage.getItem("loginUserName"), false],
            ROW_ID: ["0", false]
        });
        if (
            localStorage.getItem("loginState") != "true" ||
            localStorage.getItem("loginUserName") == ""
        ) {
            this.router.navigate(["login"]);
        } else {
            ///$("#chadTable").DataTable();
        }
        this.getDeparts();
        //console.log(this.paginator.pageIndex);
    }
    openRelevant(content, _type, _element) {
      //  //debugger
        this.patientNumber = _element.PatiantNumber;
        this.caseNumber =  _element.Case_Number;
        var _Boolean = false;
        if(_element.RelevantOrNotCheck == '0'){
            _Boolean = true;
        }
        this.RelevantForm = this.formBuilder.group({
            RelevantOrNotCheck: [_Boolean, false],
            RelevantNote: [_element.RelevantNote, false],
            RelevantDate: [new FormControl(_element.RelevantDate).value, false],
            RelevantDoc: [localStorage.getItem("loginUserName"), false],
            ROW_ID: [_element.ROW_ID, false]
        });
       
        this.modalService.open(content, this.modalOptions).result.then(
            result => {
                this.closeResult = `Closed with: ${result}`;
                if ("Save" == result) {
                    // ////debugger;
                   // this.saveChad(_element.ROW_ID);
                }
            },
            reason => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
        
    }
    onSubmitNote(){
        if(this.RelevantForm.value.RelevantOrNotCheck){
            this.RelevantForm.value.RelevantOrNotCheck = '0';
        }else{
            this.RelevantForm.value.RelevantOrNotCheck = '1';
        }
        ////debugger;
        //return;
        this.http
            .post("http://srv-apps/wsrfc/WebService.asmx/SaveRelevantOrNotChad", {
                mRelevantOrNot: this.RelevantForm.value
            })
            .subscribe(
                Response => {
                    var json = jQuery.parseJSON(Response["d"]);
                    this.getReport(null)
                }
            );
            this.modalService.dismissAll();
    }
    getDeparts(){
        this.http
            .post("http://srv-apps/wsrfc/WebService.asmx/GetChadsDeparts", {
                
            })
            .subscribe(
                Response => {
                    //// ////debugger
                    this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                    var json = JSON.parse(Response["d"]);
                   // // ////debugger
                    var _d = JSON.parse(json["Departs"]);
                    for (var depart in _d) {
                        //// ////debugger
                        var _sD: Depart = {id: depart, name: _d[depart]};

                        this.departs.push(_sD);
                    }/*
                    $(_d).each(function(i,k){
                        // ////debugger
                        //var _sD: Depart = {id: i, name: k};

                        //this.departs.push(_sD);
                    })*/
                    //// ////debugger
                }
            );
    }
    open(content, _type, _element) {
        //$('#free_text').text(_element.FreeText);
        // ////debugger
        this.chadVal = "";
        this.chadDate = "";
        this.chadTool = "";
        this.modalService.open(content, this.modalOptions).result.then(
            result => {
                this.closeResult = `Closed with: ${result}`;
                if ("Save" == result) {
                    // ////debugger;
                    this.saveChad(_element.ROW_ID);
                }
            },
            reason => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
        $(document)
            .find("#free_text")
            .html(_element.FreeText);
        this.chadDate = _element.Hosp_Date;
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
    private saveChad(_rowID) {
        $("#loader").removeClass("d-none");
        this.http
            .post("http://srv-apps/wsrfc/WebService.asmx/saveChad", {
                _chadVal: this.chadVal,
                _chadDate: this.chadDate,
                _chadTool: this.chadTool,
                _ROW_ID: _rowID
            })
            .subscribe(
                Response => {
                    // ////debugger;
                    setTimeout(() => {
                        //this.dataSource.paginator = this.paginator
                        $("#loader").addClass("d-none");
                    });
                    //this.dataSource.paginator = this.paginator;
                },
                error => {
                    // ////debugger;
                    $("#loader").addClass("d-none");
                }
            );
    }
    applyFilter(filterValue: string) {
        this.fliterVal = filterValue;
        if (this.startdateVal && this.enddateVal) {
            this.getDataFormServer(
                "CAHDE",
                this.startdateVal,
                this.enddateVal,
                this.paginator.pageIndex,
                this.paginator.pageSize,
                filterValue,
                this.goodOrNot,
                this.AntiCoagTreat,
                this.DepartmentID,
                this.Relevant
            );
        }
        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    ngAfterViewInit(): void {}
    getPaginatorData(event: PageEvent) {
        //console.log(this.paginator.pageIndex);
        if (this.startdateVal && this.enddateVal) {
            this.getDataFormServer(
                "CAHDE",
                this.startdateVal,
                this.enddateVal,
                this.paginator.pageIndex,
                this.paginator.pageSize,
                this.fliterVal,
                this.goodOrNot,
                this.AntiCoagTreat,
                this.DepartmentID,
                this.Relevant
            );
        }
    }
    getReport($event: any): void {
        if (this.startdateVal && this.enddateVal)
            this.getDataFormServer(
                "CAHDE",
                this.startdateVal,
                this.enddateVal,
                0,
                this.paginator.pageSize,
                this.fliterVal,
                this.goodOrNot,
                this.AntiCoagTreat,
                this.DepartmentID,
                this.Relevant
            );
    }
    public getBackgroundArray(_length) {
        var backgroundColorArray = [];
        var backgroundColorArrayOpacity = [];
        for (var e = 0; e < _length; e++) {
            var f = Math.floor(Math.random() * 255 + 1);
            var s = Math.floor(Math.random() * 255 + 1);
            var t = Math.floor(Math.random() * 255 + 1);
            var backgound = "rgba(" + f + ", " + s + ", " + t + ", 1)";
            var backgoundOpacity = "rgba(" + f + ", " + s + ", " + t + ", 0.7)";
            //// ////debugger;
            backgroundColorArray.push(backgound);

            backgroundColorArrayOpacity.push(backgoundOpacity);
        }
        return [backgroundColorArrayOpacity, backgroundColorArray];
    }
    public drawCharToDom(
        _dataType: string,
        _dataLable: string[],
        _data: any[],
        _wrapperId: string,
        _chartId: string
    ) {
        let optionCall;
        let totalDataLength = _data.length;
        let bgArray = this.getBackgroundArray(totalDataLength);
        //// ////debugger;
        if(_dataType == "multiBar") {
            $("#" + _wrapperId).empty();
            $("#" + _wrapperId).append('<canvas id="' + _chartId + '"></canvas>');
          //  // ////debugger
            var canvas: HTMLCanvasElement = <HTMLCanvasElement>(
                document.getElementById(_chartId)
            );
            var ctxIn: CanvasRenderingContext2D = canvas.getContext("2d");
            ////debugger
            var barChartData = {
                labels: _dataLable,
                datasets: [{
                    label: 'תקין',                   
                    stack: 'Stack 1',
                    backgroundColor: 'green',
                    data: _data[0]
                }, {
                    label: 'לא תקין',
                    backgroundColor: 'red',
                    stack: 'Stack 2',
                    data: _data[1]
                }]
    
            };    
            // ////debugger
            var myChart = new Chart(ctxIn, {
                type: 'bar',
                data: barChartData,
                options: {
					title: {
						display: true,
						text: 'תקין לא תקין לפי מחלקות'
					},
					tooltips: {
						mode: 'index',
						intersect: false
					},
					responsive: true,
					scales: {
						xAxes: [{
							stacked: true,
						}],
						yAxes: [{
							stacked: true
						}]
					}
				}
            });
            return;
        }
        else if (_dataType == "pie" || _dataType == "doughnut") {
            bgArray = [
                ["#17dc14bb", "#dc1414bb"],
                ["#17dc14bb", "#dc1414bb"]
            ];
            optionCall = {
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            //get the concerned dataset
                            var dataset =
                                data.datasets[tooltipItem.datasetIndex];
                            // // ////debugger;
                            var total = 0;
                            for (var t = 0; t < dataset.data.length; t++) {
                                total += parseInt(dataset.data[t]);
                            }

                            //get the current items value
                            var currentValue = parseInt(
                                dataset.data[tooltipItem.index]
                            );
                            //calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
                            var percentage = Math.floor(
                                (currentValue / total) * 100 + 0.5
                            );
                            console.log(currentValue);
                            console.log(dataset);
                            //return percentage + "%";
                            return percentage + "%";
                        }
                    }
                },
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true
                            }
                        }
                    ]
                },
                animation: {
                    onProgress: function(animation) {
                        //   progress.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
                    }
                }
            };
        } else {
            optionCall = {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true
                            }
                        }
                    ]
                },
                animation: {
                    onProgress: function(animation) {
                        //   progress.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
                    }
                }
            };
        }
        $("#" + _wrapperId).empty();
        $("#" + _wrapperId).append('<canvas id="' + _chartId + '"></canvas>');
      //  // ////debugger
        var canvas: HTMLCanvasElement = <HTMLCanvasElement>(
            document.getElementById(_chartId)
        );
        var ctxIn: CanvasRenderingContext2D = canvas.getContext("2d");

        var myChart = new Chart(ctxIn, {
            type: _dataType,
            data: {
                labels: _dataLable,
                datasets: [
                    {
                        label: ' סה"כ לא תקין',
                        data: _data,
                        backgroundColor: bgArray[0],
                        borderColor: bgArray[1],
                        borderWidth: 1
                    }
                ]
            },
            options: optionCall
        });
    }
    onTabChanged($event) {
        let clickedIndex = $event.index;
        this.selectedIndexTab = clickedIndex;
        if(clickedIndex == 1 && this.ChadWithOutValByDocNameDoctorsNames != null){
            this.drawCharToDom(
                "multiBar",                
                this.ChadDeparts
                ,
                [this.ChadDepartsGoods, this.ChadDepartsNotGoods],
                "DepartDoingWrapper",
                "canvDepartDoingWrapper"
            );
            this.drawCharToDom(
                "bar",
                this.ChadWithOutValByDocNameDoctorsNames,
                this.ChadWithOutValByDocName,
                "chadNoValByDocWrapper",
                "canvchadNoValByDocWrapper"
            );
            this.drawCharToDom(
                "doughnut",
                ["תקין", "לא תקין"],
                [
                    this.totalRowsChadWithVal,
                    this.totalRowsChadWithOutVal
                ],
                "tkenLoTken",
                "canvtkenLoTken"
            );
        }
    }
    
    quart_change(event: MatRadioChange) {
        ////debugger;
        this._fun.quart_change(event);
        this.startdateVal = this._fun.Sdate.value;
        this.enddateVal = this._fun.Edate.value;
    }

    
    radioChange(event: MatRadioChange) {
        ////debugger
        this._fun.radioChange(event);
        this.startdateVal = this._fun.Sdate.value;
        this.enddateVal = this._fun.Edate.value;
   }
    public getDataFormServer(
        _tableName: string,
        _startDate: string,
        _endDate: string,
        _pageIndex: number,
        _pageSize: number,
        _filterVal: string,
        _goodOrNot: string,
        _AntiCoagTreat: string,
        _DepartmentID: string,
        _Relevant: string
    ) {
        //// ////debugger
        $("#loader").removeClass("d-none");
        this.http
            .post("http://srv-apps/wsrfc/WebService.asmx/GetReportTable", {
                _reportTableName: _tableName,
                _fromDate: _startDate,
                _toDate: _endDate,
                _pageIndex: _pageIndex,
                _pageSize: _pageSize,
                _freeText: _filterVal,
                _goodOrNot: _goodOrNot,
                _AntiCoagTreat: _AntiCoagTreat,
                _DepartmentID: _DepartmentID,
                _Relevant: _Relevant,
            })
            .subscribe(
                Response => {
                    //// ////debugger
                    this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                    var json = JSON.parse(Response["d"]);
                    let chads = JSON.parse(json["aaData"]);
                    // ////debugger
                    for (var i = 0; i < chads.length; i++) {
                        if (
                            chads[i].AntiCoag_Treat == "2" ||
                            chads[i].AntiCoag_Treat == 2
                        ) {
                            chads[i].AntiCoag_Treat = "לא";
                        } else {
                            chads[i].AntiCoag_Treat = "כן";
                        }
                        if (
                            chads[i].CHADS2_Value == "" ||
                            chads[i].CHADS2_Value == null
                        ) {
                            this.isShow = false;
                        } else {
                            if(chads[i].Chad_Type == "FREE_TEXE"){
                                this.isShow = false;
                             }else{
                                  this.isShow = true;
                             }
                           // this.isShow = true;
                        }
                        // if(chads[i].Chad_Type == "FREE_TEXE"){
                        //     this.isShow = false;
                        // }else{
                        //     this.isShow = true;
                        // }
                        //// ////debugger;
                        var TkeenIN = "לא תקין";
                        if(chads[i].CHADS2_Value != ''){
                            TkeenIN = "תקין";
                        }
                        this.TABLE_DATA.push({
                            ROW_ID: chads[i].ROW_ID,
                            Measurment_ID: chads[i].Measurment_ID,
                            Hospital_ID: chads[i].Hospital_ID,
                            Patient_ID: chads[i].Patient_ID,
                            Patientbikoret_ID: chads[i].Patientbikoret_ID,
                            ID_Types: chads[i].ID_Types,
                            Case_Number: chads[i].Case_Number,
                            Department_ID: chads[i].Department_ID,
                            Hosp_Date: chads[i].Hosp_Date,
                            Discharge_Date: chads[i].Discharge_Date,
                            Death_Date: chads[i].Death_Date,
                            Birth_Year: chads[i].Birth_Year,
                            Gender: chads[i].Gender,
                            Adress_Street: chads[i].Adress_Street,
                            Adress_House: chads[i].Adress_House,
                            Adress_CityName: chads[i].Adress_CityName,
                            CityCode: chads[i].CityCode,
                            SES: chads[i].SES,
                            Insurance_Provider: chads[i].Insurance_Provider,
                            CHADS2_Date: chads[i].CHADS2_Date,
                            CHADS2_Value: chads[i].CHADS2_Value,
                            CHADS2_Tool: chads[i].CHADS2_Tool,
                            AntiCoag_Treat: chads[i].AntiCoag_Treat,
                            Diagnosis_ICD: chads[i].Diagnosis_ICD,
                            Remarks: chads[i].Remarks,
                            PatiantNumber: chads[i].PatiantNumber,
                            KhroneOrNot: chads[i].KhroneOrNot,
                            DoctorName: chads[i].DoctorName,
                            Chad_Type: chads[i].Chad_Type,
                            Hide_Btn: this.isShow,
                            FreeText: chads[i].FreeText,
                            Depart_Name: chads[i].Depart_Name,
                            Tkeen: TkeenIN,
                            RelevantOrNotCheck: chads[i].RelevantOrNot,
                            RelevantNote: chads[i].RelevantNote,
                            RelevantDate: chads[i].RelevantDate,
                            RelevantDoc: chads[i].RelevantDoc
                        });
                    }

                    // // ////debugger
                    this.dataSource = new MatTableDataSource<any>(
                        this.TABLE_DATA
                    );
                    this.resultsLength = parseInt(json["iTotalRecords"]);
                    this.ChadWithOutValByDocNameDoctorsNames = JSON.parse(
                        json["ChadWithOutValByDocNameDoctorsNames"]
                    );
                    this.ChadWithOutValByDocName = JSON.parse(
                        json["ChadWithOutValByDocName"]
                    );
                    this.totalRowsChadWithVal = json["totalRowsChadWithVal"];
                    this.totalRowsChadWithOutVal = json["totalRowsChadWithOutVal"];

                    this.ChadDeparts = JSON.parse(
                        json["ChadDeparts"]
                    );
                     ////debugger
                    this.ChadDepartsGoods = JSON.parse(json["ChadDepartsGoods"]);
                    this.ChadDepartsNotGoods = JSON.parse(json["ChadDepartsNotGoods"]);
                    if(this.selectedIndexTab == 1){
                        
                        this.drawCharToDom(
                            "multiBar",
                            this.ChadDeparts,
                            [this.ChadDepartsGoods , this.ChadDepartsNotGoods],
                            "DepartDoingWrapper",
                            "canvDepartDoingWrapper"
                        );
                        this.drawCharToDom(
                            "bar",
                            JSON.parse(
                                json["ChadWithOutValByDocNameDoctorsNames"]
                            ),
                            JSON.parse(json["ChadWithOutValByDocName"]),
                            "chadNoValByDocWrapper",
                            "canvchadNoValByDocWrapper"
                        );
                        this.drawCharToDom(
                            "doughnut",
                            ["תקין", "לא תקין"],
                            [
                                json["totalRowsChadWithVal"],
                                json["totalRowsChadWithOutVal"]
                            ],
                            "tkenLoTken",
                            "canvtkenLoTken"
                        );
                    }
                  /* */
                    //this.paginator. = parseInt(json["iTotalRecords"]);
                    //this.dataSource.sort = this.sort;
                    // // ////debugger
                    setTimeout(() => {
                        //this.dataSource.paginator = this.paginator
                        $("#loader").addClass("d-none");
                    });
                    //this.dataSource.paginator = this.paginator;
                },
                error => {
                    // // ////debugger;
                    $("#loader").addClass("d-none");
                }
            );
    }
}
