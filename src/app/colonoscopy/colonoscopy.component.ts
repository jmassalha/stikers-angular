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
export interface Doctor {
    id: string;
    name: string;
}
export interface Colonoscopy {
    RowID: number;
    CreationTime: string;
    Measurment_ID: string;
    Hospital_ID: string;
    Patient_ID: string;
    Patientbikoret_ID: string;
    ID_Types: string;
    Case_Number: string;
    Hosp_Date: string;
    Birth_Year: string;
    Gender: string;
    Adress_Street: string;
    Adress_House: string;
    Adress_CityName: string;
    CityCode: string;
    SES: string;
    Insurance_Provider: string;
    ColonoscopyStart_Date: string;
    ColonoscopyStart_Time: string;
    Cecum_Time: string;
    ColonoscopyEnd_Date: string;
    Colonoscopy_Time: string;
    Polyp_Identification: string;
    Polyp_Resection: string;
    Colon_Stop_Prep: string;
    Previous_Polypectomy: string;
    Prev_Polypectomy_Date: string;
    Diagnosis: string;
    Relevant: string;
    RelevantTime: string;
    RelevantStaff: string;
    RelevantNote: string;
    MeasurementStatus: string;
    CreatedBy: string;
    Hide_Btn: Boolean;
}
@Component({
    selector: "app-colonoscopy",
    templateUrl: "./colonoscopy.component.html",
    styleUrls: ["./colonoscopy.component.css"],
})
export class ColonoscopyComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild("ColonoscopyStart_Date") ColonoscopyStart_Date: any;
    @ViewChild("ColonoscopyStart_Date") ColonoscopyEnd_Date: any;

    modalOptions: NgbModalOptions;
    closeResult: string;

    EditForm: FormGroup;
    RelevantForm: FormGroup;
    TABLE_DATA: Colonoscopy[] = [];
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    displayedColumns: string[] = [
        "Case_Number",
        "Patient_ID",
        "Hosp_Date",
        "ColonoscopyStart_Date",
        "ColonoscopyStart_Time",
        "Cecum_Time",
        "Colonoscopy_Time",
        "Polyp_Identification",
        "Polyp_Resection",
        "Colon_Stop_Prep",
        "Diagnosis",
        "CreatedBy",
        //"action",
        "relevant",
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

    doctorsList: Doctor[] = [];
    doctorName: string;
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
    doctors: any;
    DoctorsDoingTotal: any;
    DoingTotalNotGoods: any;
    DoingTotalGoods: any;
    allGoods: any;
    allNotGoods: any;
    totalWithEndTime: any;
    totalWithoutEndTime: any;
    totalWithCecomTime: any;
    totalWithoutCecomTime: any;
    totalWithStartTime: any;
    totalWithoutStartTime: any;
    totalWith6min: any;
    totalWithout6min: any;

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
        this.doctorName = "הכל";
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
        this.getDoctors();
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
                this.goodOrNot,
                this.Relevant,
                this.doctorName,
                this.cectom,
                this.sixmin,
                this.age,
                this.case_type,
            );
        }
        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    onSubmit() {
        /**
         * 
         *         }
Polyp_Identification
Polyp_Resection
Colon_Stop_Prep
ColonoscopyStart_Date
ColonoscopyEnd_Date
Cecum_Time
        */
        if (this.EditForm.value.Polyp_Resection) {
            this.EditForm.value.Polyp_Resection = "1";
        } else {
            this.EditForm.value.Polyp_Resection = "0";
        }
        if (this.EditForm.value.Colon_Stop_Prep) {
            this.EditForm.value.Colon_Stop_Prep = "1";
        } else {
            this.EditForm.value.Colon_Stop_Prep = "0";
        }
        if (this.EditForm.value.Polyp_Identification) {
            this.EditForm.value.Polyp_Identification = "1";
        } else {
            this.EditForm.value.Polyp_Identification = "0";
        }
        this.EditForm.value.ColonoscopyStart_Date;
        this.EditForm.value.ColonoscopyEnd_Date;
        this.EditForm.value.Cecum_Time;
        //return;
        this.http
            .post("https://srv-apps:4433/WebService.asmx/SaveColonoscopy", {
                mSaveColonoscopy: this.EditForm.value,
            })
            .subscribe((Response) => {
                //
                var json = jQuery.parseJSON(Response["d"]);
                this.getReport(null);
            });
        this.modalService.dismissAll();
    }
    onSubmitNote() {
        if (this.RelevantForm.value.Relevant) {
            this.RelevantForm.value.Relevant = "0";
        } else {
            this.RelevantForm.value.Relevant = "1";
        }
        // ;
        //return;
        this.http
            .post(
                "https://srv-apps:4433/WebService.asmx/SaveRelevantOrNotColonoscopy",
                {
                    mRelevantOrNot: this.RelevantForm.value,
                }
            )
            .subscribe((Response) => {
                //
                var json = jQuery.parseJSON(Response["d"]);
                this.getReport(null);
            });
        this.modalService.dismissAll();
    }
    onTabChanged($event) {
        let clickedIndex = $event.index;
        this.selectedIndexTab = clickedIndex;
        if (clickedIndex == 1 && this.doctors != null) {
            //debugger
            //let totalDataLength = 2;
            //let bgArray = this.getBackgroundArray(totalDataLength);
            this.titleC = "איתור פוליפים";
            this.typeC = "PieChart";
            this.dataC = [
                ["אותר", parseFloat(this.allGoods)],
                ["לא אותר", parseFloat(this.allNotGoods)],
            ];
            this.columnNamesC = ["אותר", "לא אותר"];

            this.optionsC = {
                //colors: ["#e0440e", "#e6693e"],
                is3D: true,
            };

            this.titleEndTime = "זמן סיום";
            this.typeEndTime = "PieChart";
            this.dataEndTime = [
                ["קיים זמן סיום", parseFloat(this.totalWithEndTime)],
                ["ללא זמן סיום", parseFloat(this.totalWithoutEndTime)],
            ];
            this.columnNamesEndTime = ["קיים זמן סיום", "ללא זמן סיום"];
            this.optionsEndTime = {
                // colors: ["#e0440e", "#e6693e"],
                is3D: true,
            };

/*
title6min
type6min
data6min
columnNames6min
options6min
*/
            this.title6min = "מדד 6 דקות מצקום להיפוך רקטום";
            this.type6min = "PieChart";
            this.data6min = [
                ["עמד", parseFloat(this.totalWith6min)],
                ["לא עמד", parseFloat(this.totalWithout6min)],
            ];
            this.columnNames6min = ["עמד", "לא עמד"];
            this.options6min = {
                // colors: ["#e0440e", "#e6693e"],
                is3D: true,
            };


            this.titleCecoum = "זמן צקום";
            this.typeCecoum = "PieChart";
            this.dataCecoum = [
                ["קיים זמן צקום", parseFloat(this.totalWithCecomTime)],
                ["ללא זמן צקום", parseFloat(this.totalWithoutCecomTime)],
            ];
            this.columnNamesCecoum = ["ללא זמן צקום", "קיים זמן צקום"];
            this.optionsCecoum = {
                // colors: ["#e0440e", "#e6693e"],
                is3D: true,
            };
            this.titleStartTime = "זמן התחלה";
            this.typeStartTime = "PieChart";
            this.dataStartTime = [
                ["קיים זמן התחלה", parseFloat(this.totalWithStartTime)],
                ["ללא זמן התחלה", parseFloat(this.totalWithoutStartTime)],
            ];
            this.columnNamesStartTime = ["ללא זמן התחלה", "קיים זמן התחלה"];
            this.optionsStartTime = {
                //colors: ["#e0440e", "#e6693e"],
                is3D: true,
            };
            //this.widthC = "100%";
            //this.heightC = "";
            this.titleB = "פעילות רופא";
            this.typeB = "ColumnChart";
            let dataChart = [];
            for (var d = 0; d < this.doctors.length; d++) {
                let dataIn = [
                    this.doctors[d],
                    parseFloat(this.DoctorsDoingTotal[d]),
                    parseFloat(this.DoctorsDoingTotal[d]),
                    parseFloat(this.DoingTotalGoods[d]),
                    parseFloat(this.DoingTotalGoods[d]),
                    parseFloat(this.DoingTotalNotGoods[d]),
                    parseFloat(this.DoingTotalNotGoods[d]),
                ];
                dataChart.push(dataIn);
            }
            if(dataChart.length == 0){
                dataChart = [["", 0, 0, 0, 0, 0, 0]]
            }
            this.dataB = dataChart;
            this.columnNamesB = [
                "",
             "הכול",
             { role: 'annotation' },
              "אותר",
              { role: 'annotation' },
              "לא אותר",
              { role: 'annotation' }
            ];
            this.optionsB = {
                // colors: ["#e0440e", "#e6693e"],
                //is3D: true,
            };
            debugger
            /*
            this.drawCharToDom(
                "multiBar",
                this.doctors,
                [
                    this.DoctorsDoingTotal,
                    this.DoingTotalGoods,
                    this.DoingTotalNotGoods,
                ],
                "DepartDoingWrapper",
                "canvDepartDoingWrapper"
            );*/
            /*
            this.drawCharToDom(
                "doughnut",
                ["אותר", "לא אותר"],
                [this.allGoods, this.allNotGoods],
                "tkenLoTken",
                "canvtkenLoTken"
            );
            this.drawCharToDom(
                "doughnut",
                ["ללא זמן התחלה", "קיים זמן התחלה"],
                [this.totalWithStartTime, this.totalWithoutStartTime],
                "start_time",
                "canvtstart_time"
            );
            this.drawCharToDom(
                "doughnut",
                ["ללא זמן צקום", "קיים זמן צקום"],
                [this.totalWithCecomTime, this.totalWithoutCecomTime],
                "cecum_time",
                "canvtcecum_time"
            );
            this.drawCharToDom(
                "doughnut",
                ["ללא זמן סיום", "קיים זמן סיום"],
                [this.totalWithEndTime, this.totalWithoutEndTime],
                "end_time",
                "canvtend_time"
            );*/
        }
    }

    getReport($event: any): void {
        if (this.startdateVal && this.enddateVal)
            this.getDataFormServer(
                this.startdateVal,
                this.enddateVal,
                0,
                this.paginator.pageSize,
                this.fliterVal,
                this.goodOrNot,
                this.Relevant,
                this.doctorName,
                this.cectom,
                this.sixmin,
                this.age,
                this.case_type,
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
    openRelevant(content, _type, _element) {
        //  //
        this.patientNumber = _element.Patient_ID;
        this.caseNumber = _element.Case_Number;
        var _Boolean = false;
        if (_element.Relevant == "0") {
            _Boolean = true;
        }
        this.RelevantForm = this.formBuilder.group({
            Relevant: [_Boolean, false],
            RelevantNote: [_element.RelevantNote, false],
            RelevantTime: [new FormControl(_element.RelevantTime).value, false],
            RelevantStaff: [localStorage.getItem("loginUserName"), false],
            RowID: [_element.RowID, false],
        });

        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                if ("Save" == result) {
                    // ////;
                    //this.saveChad(_element. RowID);
                }
            },
            (reason) => {}
        );
    }
    open(content, _type, _element) {
        this.patientNumber = _element.Patient_ID;
        this.caseNumber = _element.Case_Number;
        var _Boolean_1 = false;
        if (_element.Polyp_Identification == "1") {
            _Boolean_1 = true;
        }
        var _Boolean_2 = false;
        if (_element.Polyp_Resection == "1") {
            _Boolean_2 = true;
        }
        var _Boolean_3 = false;
        if (_element.Colon_Stop_Prep == "1") {
            _Boolean_3 = true;
        }

        var arrStart = [0, 0, 0];
        var arrEnd = [0, 0, 0];
        if (_element.ColonoscopyStart_Date != "") {
            arrStart = _element.ColonoscopyStart_Date.split("/");
        }
        if (_element.ColonoscopyEnd_Date != "") {
            arrEnd = _element.ColonoscopyEnd_Date.split("/");
        }
        let start =
            arrStart[1] +
            "/" +
            arrStart[0] +
            "/" +
            arrStart[2] +
            " " +
            _element.ColonoscopyStart_Time;
        let end =
            arrEnd[1] +
            "/" +
            arrEnd[0] +
            "/" +
            arrEnd[2] +
            " " +
            _element.Colonoscopy_Time;

        this.EditForm = this.formBuilder.group({
            Polyp_Identification: [_Boolean_1, false],
            Polyp_Resection: [_Boolean_2, false],
            Colon_Stop_Prep: [_Boolean_3, false],
            ColonoscopyStart_Date: [
                new FormControl(new Date(Date.parse(start))).value,
                Validators.required,
            ],
            ColonoscopyEnd_Date: [
                new FormControl(new Date(Date.parse(end))).value,
                Validators.required,
            ],
            Cecum_Time: [_element.Cecum_Time, false],
            RowID: [_element.RowID, false],
        });
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                if ("Save" == result) {
                    // ////;
                    //this.saveChad(_element. RowID);
                }
            },
            (reason) => {}
        );
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
                this.goodOrNot,
                this.Relevant,
                this.doctorName,
                this.cectom,
                this.sixmin,
                this.age,
                this.case_type,
            );
        }
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
    getDoctors() {
        this.http
            .post(
                "https://srv-apps:4433/WebService.asmx/GetColonoscopyDoctorsList",
                {}
            )
            .subscribe((Response) => {
                //// ////debugger
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                var json = JSON.parse(Response["d"]);
                // // ////debugger
                var _d = JSON.parse(json["DoctorsList"]);
                for (var doctor in _d) {
                    //// ////debugger
                    var _sD: Doctor = { id: doctor, name: doctor };

                    this.doctorsList.push(_sD);
                } /*
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
        _goodOrNot: string,
        _Relevant: string,
        _Doctor: string,
        _Cectom: string,
        _sixmin: string,
        age: string,
        case_type: string,
    ) {
        //;
        debugger
        $("#loader").removeClass("d-none");
        this.http
            .post("https://srv-apps:4433/WebService.asmx/getCOLONOSCOPY", {
                _fromDate: _startDate,
                _toDate: _endDate,
                _pageIndex: _pageIndex,
                _pageSize: _pageSize,
                _freeText: _filterVal,
                _goodOrNot: _goodOrNot,
                _Relevant: _Relevant,
                _Doctor: _Doctor,
                _Cectom: _Cectom,
                _sixmin: _sixmin,
                _age: age,
                _case_type: case_type,
            })
            .subscribe(
                (Response) => {
                    this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                    var json = JSON.parse(Response["d"]);

                    this.doctors = JSON.parse(json["Doctors"]);
                    this.DoctorsDoingTotal = JSON.parse(
                        json["DoctorsDoingTotal"]
                    );
                    this.DoingTotalGoods = JSON.parse(json["DoingTotalGoods"]);
                    this.DoingTotalNotGoods = JSON.parse(
                        json["DoingTotalNotGoods"]
                    );
                    this.allGoods = JSON.parse(json["totalGoods"]);
                    this.allNotGoods = JSON.parse(json["totalNotGoods"]);

                    this.totalWithStartTime = JSON.parse(
                        json["totalWithStartTime"]
                    );
                    this.totalWithoutStartTime = JSON.parse(
                        json["totalWithoutStartTime"]
                    );
                    this.totalWithCecomTime = JSON.parse(
                        json["totalWithCecomTime"]
                    );
                    this.totalWithoutCecomTime = JSON.parse(
                        json["totalWithoutCecomTime"]
                    );
                    this.totalWithEndTime = JSON.parse(
                        json["totalWithEndTime"]
                    );
                    this.totalWithoutEndTime = JSON.parse(
                        json["totalWithoutEndTime"]
                    );
                    
                    this.totalWith6min = JSON.parse(
                        json["totalWith6min"]
                    );
                    this.totalWithout6min = JSON.parse(
                        json["totalWithout6min"]
                    );

                    //debugger
                    let COLONOSCOPY = JSON.parse(json["aaData"]);
                    for (var i = 0; i < COLONOSCOPY.length; i++) {
                        if (COLONOSCOPY[i].MeasurementStatus != "1") {
                            this.isShow = false;
                        } else {
                            this.isShow = false;
                        }
                        this.TABLE_DATA.push({
                            RowID: COLONOSCOPY[i].RowID,
                            CreationTime: COLONOSCOPY[i].CreationTime,
                            Measurment_ID: COLONOSCOPY[i].Measurment_ID,
                            Hospital_ID: COLONOSCOPY[i].Hospital_ID,
                            Patient_ID: COLONOSCOPY[i].Patient_ID,
                            Patientbikoret_ID: COLONOSCOPY[i].Patientbikoret_ID,
                            ID_Types: COLONOSCOPY[i].ID_Types,
                            Case_Number: COLONOSCOPY[i].Case_Number,
                            Hosp_Date: COLONOSCOPY[i].Hosp_Date,
                            Birth_Year: COLONOSCOPY[i].Birth_Year,
                            Gender: COLONOSCOPY[i].Gender,
                            Adress_Street: COLONOSCOPY[i].Adress_Street,
                            Adress_House: COLONOSCOPY[i].Adress_House,
                            Adress_CityName: COLONOSCOPY[i].Adress_CityName,
                            CityCode: COLONOSCOPY[i].CityCode,
                            SES: COLONOSCOPY[i].SES,
                            Insurance_Provider:
                                COLONOSCOPY[i].Insurance_Provider,
                            ColonoscopyStart_Date:
                                COLONOSCOPY[i].ColonoscopyStart_Date,
                            ColonoscopyStart_Time:
                                COLONOSCOPY[i].ColonoscopyStart_Time,
                            Cecum_Time: COLONOSCOPY[i].Cecum_Time,
                            ColonoscopyEnd_Date:
                                COLONOSCOPY[i].ColonoscopyEnd_Date,
                            Colonoscopy_Time: COLONOSCOPY[i].Colonoscopy_Time,
                            Polyp_Identification:
                                COLONOSCOPY[i].Polyp_Identification,
                            Polyp_Resection: COLONOSCOPY[i].Polyp_Resection,
                            Colon_Stop_Prep: COLONOSCOPY[i].Colon_Stop_Prep,
                            Previous_Polypectomy:
                                COLONOSCOPY[i].Previous_Polypectomy,
                            Prev_Polypectomy_Date:
                                COLONOSCOPY[i].Prev_Polypectomy_Date,
                            Diagnosis: COLONOSCOPY[i].Diagnosis,
                            Relevant: COLONOSCOPY[i].Relevant,
                            RelevantTime: COLONOSCOPY[i].RelevantTime,
                            RelevantStaff: COLONOSCOPY[i].RelevantStaff,
                            RelevantNote: COLONOSCOPY[i].RelevantNote,
                            MeasurementStatus: COLONOSCOPY[i].MeasurementStatus,
                            CreatedBy: COLONOSCOPY[i].CreatedBy,
                            Hide_Btn: this.isShow,
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
