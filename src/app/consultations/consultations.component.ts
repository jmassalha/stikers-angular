import {
    Component,
    OnInit,
    ViewChild,
    AfterViewInit,
    ElementRef,
} from "@angular/core";
import { ThemePalette } from "@angular/material/core";
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
    NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import * as $ from "jquery";
import * as Chart from "chart.js";
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
} from "@angular/forms";
import { MatRadioChange } from "@angular/material/radio";
import { data } from "jquery";
export interface Departs {
    id: string;
    name: string;
}
export interface Consultations {
    Row_Id: string;
    Case_Number: string;
    Patient_Numbae: string;
    Request_Depart: string;
    Request_Depart_Seode: string;
    Doing_Depart: string;
    Request_Persone_Name: string;
    Doing_Persone_Name: string;
    Request_Date: string;
    Request_Time: string;
    Doing_Date: string;
    Doing_Time: string;
    Cancel_Date: string;
    Cancel_Time: string;
    Waiting_Time: string;
    Case_Type: string;
    Patient_First_Name: string;
    Patient_Last_Name: string;
    Patient_ID: string;
    Patient_DOB: string;
    Patient_Gender: string;
    Service_Code: string;
    Service_Name: string;
    Hospital_Date: string;
    Discharge_Date: string;
    Order_Number: string;
}
@Component({
    selector: "app-consultations",
    templateUrl: "./consultations.component.html",
    styleUrls: ["./consultations.component.css"],
})
export class ConsultationsComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild("ConsultationsStart_Date") ConsultationsStart_Date: any;
    @ViewChild("ConsultationsStart_Date") ConsultationsEnd_Date: any;

    modalOptions: NgbModalOptions;
    closeResult: string;

    EditForm: FormGroup;
    RelevantForm: FormGroup;
    TABLE_DATA: Consultations[] = [];
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    displayedColumns: string[] = [
        "Case_Number",
        "Patient_Numbae",
        "Request_Depart_Seode",
        "Doing_Depart",
        "Request_Persone_Name",
        "Doing_Persone_Name",
        "Service_Name",
        "Request_Date",
        "Request_Time",
        "Doing_Date",
        "Doing_Time",
        "Waiting_Time",
    ];
    public disabled = false;
    public showSpinners = true;
    public showSeconds = false;
    public touchUi = false;
    public enableMeridian = false;
    public stepHour = 1;
    public stepMinute = 1;
    public stepSecond = 1;
    public color: ThemePalette = "primary";
    barChart: string = "BarChart";
    barChartC: string = "ColumnChart";
    titleDepartsChart: string = "יעוצים לפי מחלקה";
    titleWorkersChart: string = "יעוצים לפי רופא";
    departsList: Departs[] = [];
    requestdepartsList: Departs[] = [];
    departsName: string;
    requestdepartsName: string;
    workersList: Departs[] = [];
    workersName: string;
    isShow = true;
    startdateVal: string;
    enddateVal: string;
    resultsLength = 0;
    goodOrNot: string;
    sixmin: string;
    Relevant: string;
    cectom: string;
    age: string;
    case_type: string;
    selectedIndexTab: number;
    fliterVal = "";
    _selectedYear = 0;
    patientNumber: string;
    caseNumber: string;
    Sdate: FormControl;
    Edate: FormControl;
    _fun = new Fun.Functions();
    yearsToSelect: { list: {} };
    Departs: any;
    DepartsDoingTotal: any;
    WorkersDoingTotal: any;
    Workers: any;
    allGoods: any;
    optionsBars: any;
    optionsBarsV: any;
    allNotGoods: any;
    DepartsDataChart: any = [];
    WorkersDataChart: any = [];
    totalWithCecomTime: any;
    totalWithoutCecomTime: any;
    totalWithStartTime: any;
    totalWithoutStartTime: any;

    DepartsColumns: any = ["מחלקה", "יעוצים"];
    WorkersColumns: any = ["עובד", "יעוצים"];

    titleDepartDoingTotal: any = 'סה"כ יעוצים לפי מחלקה מזמינה';
    DepartsDataDoingTotal: any = [['', 0, '']];
    DepartsDoingTotalColumns: any = ["מחלקה מבצעת", 'סה"כ יעוצים' ,
    { role: 'style' }];

    titleDepartRequestTotal: any = 'סה"כ יעוצים לפי מחלקה מבצעת';
    DepartsDataRequestTotal: any = [['', 0, '']];
    DepartsRequestTotalColumns: any = ["מחלקה מזמינה", 'סה"כ יעוצים',
    { role: 'style' } ];

    titleDepartRequestAvg: any = 'ממוצע זמן למתן יעוץ לפי מחלקה מבצעת בשעות';
    DepartsDataRequestAvg: any = [['', 0, '']];
    DepartsRequestAvgColumns: any = [
        'מחלקה מזמינה',
        'זמן ממוצע לקבלת היעוץ',
        { role: 'style' }
    ];

    titleDepartDoingAvg: any = 'ממוצע זמן  לפי מחלקה מזמינה בשעות';
    DepartsDataDoingAvg: any = [['', 0, '']];
    DepartsDoingAvgColumns: any = [
        'מחלקה מבצעת',
        'זמן ממוצע למתן יעוץ',
        { role: 'style' }
    ];

    title6min: any;
    type6min: any;
    data6min: any;
    columnNames6min: any;
    options6min: any;

    titleC: any;
    typeC: any;
    dataC: any;
    columnNamesC: any;
    optionsC: any;
    widthC: any;
    heightC: any;

    MulBarsRequestDepart: any;
    MulBarsRequestDepartTotalRows: any;
    MulBarsRequestDepartAvgTime: any;

    MulBarsDoingDepart: any;
    MulBarsDoingDepartAvgTime: any;
    MulBarsDoingDepartTotalRows: any;

    titleMulBarsRequestDepart: any;
    typeMulBarsRequestDepart: any;
    dataMulBarsRequestDepart: any;
    columnNamesMulBarsRequestDepart: any;
    optionsMulBarsRequestDepart: any;

    titleMulBarsDoingDepart: any;
    typeMulBarsDoingDepart: any;
    dataMulBarsDoingDepart: any;
    columnNamesMulBarsDoingDepart: any;
    optionsMulBarsDoingDepart: any;

    titleEndTime: any;
    typeEndTime: any;
    dataEndTime: any;
    columnNamesEndTime: any;
    optionsEndTime: any;
    titleCecoum: any;
    typeCecoum: any;
    dataCecoum: any;
    columnNamesCecoum: any;
    optionsCecoum: any;
    titleStartTime: any;
    typeStartTime: any;
    dataStartTime: any;
    columnNamesStartTime: any;
    optionsStartTime: any;
    titleB: any;
    typeB: any;
    dataB: any;
    columnNamesB: any;
    optionsB: any;
    constructor(
        private router: Router,
        private snackBar: MatSnackBar,
        private http: HttpClient,
        private modalService: NgbModal,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit(): void {
        this.departsName = "הכל";
        this.requestdepartsName = "הכל";
        this.workersName = "הכל";
        this.cectom = "הכל";
        this.age = "1";
        this.case_type = "1";
        this.patientNumber = "";
        this.caseNumber = "";
        this.goodOrNot = "-1";
        this.sixmin = "-1";
        this.Relevant = "-1";
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
        this.RelevantForm = this.formBuilder.group({
            Relevant: [false, false],
            RelevantNote: ["", false],
            RelevantTime: [new FormControl(new Date()).value, false],
            RelevantStaff: [localStorage.getItem("loginUserName"), false],
            RowID: ["0", false],
        });
        this.selectedIndexTab = 0;
        this.getDeparts();
        this.getWorkers("");
        this.getRequest();
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
                this.departsName,
                this.workersName,
                this.requestdepartsName
            );
        }
        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    onTabChanged($event) {
        let clickedIndex = $event.index;
        this.selectedIndexTab = clickedIndex;
        this.optionsBars = {
            hAxis: {
                viewWindow: {
                    min: 0,
                    //max: 100
                },
                //ticks: [0, 25, 50, 75, 100] // display labels every 25
            },
        };
        this.optionsBarsV = {
            bars: 'vertical',
            hAxis:{direction:-1, slantedText:true, slantedTextAngle:90, showTextEvery:1},
        };
       // debugger;
        this.DepartsDataChart = [['', 0]];
        this.WorkersDataChart = [['', 0]];
        this.DepartsDataDoingTotal = [['', 0, '']];
        this.DepartsDataDoingAvg = [['', 0, '']];
        this.DepartsDataRequestTotal = [['', 0, '']];
        this.DepartsDataRequestAvg = [['', 0, '']];


        if (clickedIndex == 1 && this.MulBarsRequestDepart != null) {

            for (var s = 0; s < this.MulBarsRequestDepart.length; s++) {
                    var _d = [
                        this.MulBarsRequestDepart[s],
                        parseInt(this.MulBarsRequestDepartTotalRows[s]),
                        'color: #'+Math.floor(Math.random()*16777215).toString(16)
                    ];
                    var _s = [
                        this.MulBarsRequestDepart[s],
                        parseInt(this.MulBarsRequestDepartAvgTime[s]),
                        'color: #'+Math.floor(Math.random()*16777215).toString(16)
                    ];
                   // debugger
                    this.DepartsDataRequestTotal.push(_d);
                    this.DepartsDataRequestAvg.push(_s);
                
                }
        }
        if (clickedIndex == 1 && this.MulBarsDoingDepart != null) {

            for (var s = 0; s < this.MulBarsDoingDepart.length; s++) {
                    var _d = [
                        this.MulBarsDoingDepart[s],
                        parseInt(this.MulBarsDoingDepartTotalRows[s]),
                        'color: #'+Math.floor(Math.random()*16777215).toString(16)
                    ];
                    var _s = [
                        this.MulBarsDoingDepart[s],
                        parseInt(this.MulBarsDoingDepartAvgTime[s]),
                        'color: #'+Math.floor(Math.random()*16777215).toString(16)
                    ];
                   // debugger
                    this.DepartsDataDoingTotal.push(_d);
                    this.DepartsDataDoingAvg.push(_s);
                
                }
        }
        if (clickedIndex == 1 && this.Departs != null) {
            // debugger;
            for (const [key, value] of Object.entries(this.Departs)) {
                if (value != "") {
                    var _d = [
                        this.Departs[key],
                        parseInt(this.DepartsDoingTotal[key]),
                    ];
                    this.DepartsDataChart.push(_d);
                }
            }
        }
        if (clickedIndex == 1 && this.Workers != null) {
            for (const [key, value] of Object.entries(this.Workers)) {
                if (value != "") {
                    var _d = [
                        this.Workers[key],
                        parseInt(this.WorkersDoingTotal[key]),
                    ];
                    this.WorkersDataChart.push(_d);
                }
            }
        }
    }
    changeWorker(val) {
        this.getWorkers(val);
    }
    getReport($event: any): void {
        if (this.startdateVal && this.enddateVal)
            this.getDataFormServer(
                this.startdateVal,
                this.enddateVal,
                0,
                this.paginator.pageSize,
                this.fliterVal,
                this.departsName,
                this.workersName,
                this.requestdepartsName
            );
    }

    quart_change(event: MatRadioChange) {
        ////;
        this._fun.quart_change(event);
        this.startdateVal = this._fun.Sdate.value;
        this.enddateVal = this._fun.Edate.value;
    }

    radioChange(event: MatRadioChange) {
        ////
        this._fun.radioChange(event);
        this.startdateVal = this._fun.Sdate.value;
        this.enddateVal = this._fun.Edate.value;
    }

    getPaginatorData(event: PageEvent) {
        //console.log(this.paginator.pageIndex);
        if (this.startdateVal && this.enddateVal) {
            this.getDataFormServer(
                this.startdateVal,
                this.enddateVal,
                this.paginator.pageIndex,
                this.paginator.pageSize,
                this.fliterVal,
                this.departsName,
                this.workersName,
                this.requestdepartsName
            );
        }
    }
    public getBackgroundColor() {
        var f = Math.floor(Math.random() * 255 + 1);
        var s = Math.floor(Math.random() * 255 + 1);
        var t = Math.floor(Math.random() * 255 + 1);
        var backgound = "rgba(" + f + ", " + s + ", " + t + ", 1)";
        return backgound;
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
        if (_dataType == "multiBar") {
            $("#" + _wrapperId).empty();
            $("#" + _wrapperId).append(
                '<canvas id="' + _chartId + '"></canvas>'
            );
            //  // ////debugger
            var canvas: HTMLCanvasElement = <HTMLCanvasElement>(
                document.getElementById(_chartId)
            );
            var ctxIn: CanvasRenderingContext2D = canvas.getContext("2d");
            ////debugger
            var barChartData = {
                labels: _dataLable,
                datasets: [
                    {
                        label: "הכל",
                        stack: "Stack 1",
                        backgroundColor: "blue",
                        data: _data[0],
                    },
                    {
                        label: "בוצע",
                        backgroundColor: "green",
                        stack: "Stack 2",
                        data: _data[1],
                    },
                    {
                        label: "לא בוצע",
                        backgroundColor: "red",
                        stack: "Stack 3",
                        data: _data[2],
                    },
                ],
            };
            // ////debugger
            var myChart = new Chart(ctxIn, {
                type: "bar",
                data: barChartData,
                options: {
                    title: {
                        display: true,
                        text: "פעילות רופא",
                    },
                    tooltips: {
                        mode: "index",
                        intersect: true,
                    },
                    responsive: true,
                    scales: {
                        xAxes: [
                            {
                                stacked: true,
                            },
                        ],
                        yAxes: [
                            {
                                stacked: true,
                            },
                        ],
                    },
                },
            });
            return;
        } else if (_dataType == "pie" || _dataType == "doughnut") {
            bgArray = [
                ["#17dc14bb", "#dc1414bb"],
                ["#17dc14bb", "#dc1414bb"],
            ];
            optionCall = {
                tooltips: {
                    mode: "index",
                    intersect: true,
                    callbacks: {
                        label: function (tooltipItem, data) {
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
                        },
                    },
                },
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                            },
                        },
                    ],
                },
                animation: {
                    onProgress: function (animation) {
                        //   progress.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
                    },
                },
            };
        } else {
            optionCall = {
                tooltips: {
                    mode: "index",
                    intersect: true,
                },
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                            },
                        },
                    ],
                },
                animation: {
                    onProgress: function (animation) {
                        //   progress.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
                    },
                },
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
                        borderWidth: 1,
                    },
                ],
            },
            options: optionCall,
        });
    }
    getDeparts() {
        $("#loader").removeClass("d-none");
        this.http
            .post("http://srv-apps/wsrfc/WebService.asmx/GetNamerDeparts", {})
            .subscribe((Response) => {
                //// ////debugger
                this.departsList = [];

                var json = $.parseJSON(Response["d"]);
                // // ////debugger
                var _d = $.parseJSON(json["departsList"]);

                for (const [key, value] of Object.entries(_d)) {
                    //debugger
                    var _sD: Departs = { id: key, name: value.toString() };

                    this.departsList.push(_sD);
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
    getWorkers(valDepart) {
        $("#loader").removeClass("d-none");
        this.http
            .post("http://srv-apps/wsrfc/WebService.asmx/GetWorkers", {
                _Depart: valDepart,
            })
            .subscribe((Response) => {
                debugger
                this.workersList = [];
                var json = $.parseJSON(Response["d"]);
                // // ////debugger
                var _w = $.parseJSON(json["WorkersList"]);

                for (const [key, value] of Object.entries(_w)) {
                    //debugger
                    var _sD: Departs = { id: key, name: value.toString() };

                    this.workersList.push(_sD);
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
    getRequest() {
        $("#loader").removeClass("d-none");
        this.http
            .post("http://srv-apps/wsrfc/WebService.asmx/GetRequestDeparts", {})
            .subscribe((Response) => {
                //// ////debugger
                this.requestdepartsList = [];

                var json = $.parseJSON(Response["d"]);
                // // ////debugger

                var _r = $.parseJSON(json["seodedepartsList"]);

                for (const [key, value] of Object.entries(_r)) {
                    //debugger
                    var _sD: Departs = { id: key, name: value.toString() };

                    this.requestdepartsList.push(_sD);
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
    public getDataFormServer(
        _startDate: string,
        _endDate: string,
        _pageIndex: number,
        _pageSize: number,
        _filterVal: string,
        _Depart: string,
        _Workers: string,
        _Request: string
    ) {
        //;
        //debugger;
        $("#loader").removeClass("d-none");
        this.http
            .post("http://srv-apps/wsrfc/WebService.asmx/GetAllConsultations", {
                _fromDate: _startDate,
                _toDate: _endDate,
                _pageIndex: _pageIndex,
                _pageSize: _pageSize,
                _freeText: _filterVal,
                _Depart: _Depart,
                _Workers: _Workers,
                _Request: _Request,
            })
            .subscribe(
                (Response) => {
                    this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                    var json = $.parseJSON(Response["d"]);
                    debugger
                    this.Departs = $.parseJSON(json["Departs"]);
                    this.MulBarsRequestDepart = $.parseJSON(
                        json["MulBarsRequestDepart"]
                    );
                    this.MulBarsRequestDepartTotalRows = $.parseJSON(
                        json["MulBarsRequestDepartTotalRows"]
                    );
                    this.MulBarsRequestDepartAvgTime = $.parseJSON(
                        json["MulBarsRequestDepartAvgTime"]
                    );
                    this.MulBarsDoingDepart = $.parseJSON(
                        json["MulBarsDoingDepart"]
                    );
                    this.MulBarsDoingDepartAvgTime = $.parseJSON(
                        json["MulBarsDoingDepartAvgTime"]
                    );
                    this.MulBarsDoingDepartTotalRows = $.parseJSON(
                        json["MulBarsDoingDepartTotalRows"]
                    );

                    this.DepartsDoingTotal = $.parseJSON(
                        json["DepartsDoingTotal"]
                    );
                    this.WorkersDoingTotal = $.parseJSON(
                        json["WorkersDoingTotal"]
                    );
                    this.Workers = $.parseJSON(json["Workers"]);
                    debugger;
                    //debugger
                    let Consultations = $.parseJSON(json["aaData"]);
                    for (var i = 0; i < Consultations.length; i++) {
                        if (Consultations[i].MeasurementStatus != "1") {
                            this.isShow = false;
                        } else {
                            this.isShow = false;
                        }
                        this.TABLE_DATA.push({
                            Row_Id: Consultations[i].Row_Id,
                            Case_Number: Consultations[i].Case_Number,
                            Patient_Numbae: Consultations[i].Patient_Numbae,
                            Request_Depart: Consultations[i].Request_Depart,
                            Request_Depart_Seode:
                                Consultations[i].Request_Depart_Seode,
                            Doing_Depart: Consultations[i].Doing_Depart,
                            Request_Persone_Name:
                                Consultations[i].Request_Persone_Name,
                            Doing_Persone_Name:
                                Consultations[i].Doing_Persone_Name,
                            Request_Date: Consultations[i].Request_Date,
                            Request_Time: Consultations[i].Request_Time,
                            Doing_Date: Consultations[i].Doing_Date,
                            Doing_Time: Consultations[i].Doing_Time,
                            Cancel_Date: Consultations[i].Cancel_Date,
                            Cancel_Time: Consultations[i].Cancel_Time,
                            Waiting_Time: Consultations[i].Waiting_Time,
                            Case_Type: Consultations[i].Case_Type,
                            Patient_First_Name:
                                Consultations[i].Patient_First_Name,
                            Patient_Last_Name:
                                Consultations[i].Patient_Last_Name,
                            Patient_ID: Consultations[i].Patient_ID,
                            Patient_DOB: Consultations[i].Patient_DOB,
                            Patient_Gender: Consultations[i].Patient_Gender,
                            Service_Code: Consultations[i].Service_Code,
                            Service_Name: Consultations[i].Service_Name,
                            Hospital_Date: Consultations[i].Hospital_Date,
                            Discharge_Date: Consultations[i].Discharge_Date,
                            Order_Number: Consultations[i].Order_Number,
                        });
                    }
                    if (this.selectedIndexTab == 1) {
                        let eventIndex = {
                            index: 1,
                        };
                        this.onTabChanged(eventIndex);
                    }
                    this.dataSource = new MatTableDataSource<any>(
                        this.TABLE_DATA
                    );
                    this.resultsLength = parseInt(json["iTotalRecords"]);
                    //;
                    /* */
                    //this.paginator. = parseInt(json["iTotalRecords"]);
                    //this.dataSource.sort = this.sort;
                    // // ////
                    setTimeout(() => {
                        //this.dataSource.paginator = this.paginator
                        $("#loader").addClass("d-none");
                    });
                    //this.dataSource.paginator = this.paginator;
                },
                (error) => {
                    // // ////;
                    $("#loader").addClass("d-none");
                }
            );
    }
}
