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
import { MenuPerm } from "../menu-perm";
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

    colors: string[] = [
        "#00838F",
        "#827717",
        "#0D47A1",
        "#C8E6C9",
        "#D1C4E9",
        "#FF6F00",
        "#3E2723",
        "#64B5F6",
        "#0288D1",
        "#40C4FF",
        "#FFFDE7",
        "#0097A7",
        "#FAFAFA",
        "#9E9E9E",
        "#A1887F",
        "#FFFF8D",
        "#AA00FF",
        "#004D40",
        "#009688",
        "#8E24AA",
        "#4FC3F7",
        "#FFF176",
        "#AED581",
        "#7CB342",
        "#90A4AE",
        "#F44336",
        "#EDE7F6",
        "#9C27B0",
        "#EF6C00",
        "#CFD8DC",
        "#3F51B5",
        "#FFF9C4",
        "#7B1FA2",
        "#FFA726",
        "#FCE4EC",
        "#039BE5",
        "#B3E5FC",
        "#1B5E20",
        "#FF7043",
        "#BBDEFB",
        "#F9A825",
        "#CE93D8",
        "#FFCA28",
        "#304FFE",
        "#64FFDA",
        "#00BCD4",
        "#F50057",
        "#ECEFF1",
        "#FF9800",
        "#B2EBF2",
        "#FF5722",
        "#4DB6AC",
        "#FF1744",
        "#3D5AFE",
        "#B9F6CA",
        "#7E57C2",
        "#C2185B",
        "#283593",
        "#512DA8",
        "#795548",
        "#8BC34A",
        "#EC407A",
        "#FFCC80",
        "#FB8C00",
        "#80CBC4",
        "#E1BEE7",
        "#26A69A",
        "#CDDC39",
        "#FFA000",
        "#80DEEA",
        "#9FA8DA",
        "#D81B60",
        "#E64A19",
        "#FBC02D",
        "#448AFF",
        "#FF8F00",
        "#FFE57F",
        "#4527A0",
        "#F48FB1",
        "#82B1FF",
        "#B71C1C",
        "#D500F9",
        "#FFEB3B",
        "#EFEBE9",
        "#B388FF",
        "#66BB6A",
        "#00E5FF",
        "#FFAB00",
        "#42A5F5",
        "#F3E5F5",
        "#689F38",
        "#4CAF50",
        "#000000",
        "#212121",
        "#536DFE",
        "#FF8A65",
        "#E65100",
        "#C5CAE9",
        "#3949AB",
        "#E57373",
    ];

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
    barChartC: string = "BarChart";
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
    typeOf = -1;
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

    DepartsColumns: any = [
        "מחלקה",
        "יעוצים",
        { role: "style" },
        { role: "annotation" },
    ];
    WorkersColumns: any = [
        "עובד",
        "יעוצים",
        { role: "style" },
        { role: "annotation" },
    ];

    titleDepartDoingTotal: any = "יעוצים לחישוב לפי מחלקה מזמינה";
    DepartsDataDoingTotal: any = [["", 0, "", 0]];
    DepartsDoingTotalColumns: any = [
        "מחלקה מבצעת",
        'סה"כ יעוצים',
        { role: "style" },
        { role: "annotation" },
    ];

    titleDepartRequestTotal: any = "יעוצים לחישוב לפי מחלקה מבצעת";
    DepartsDataRequestTotal: any = [["", 0, "", 0]];

    DepartsRequestTotalColumns: any = [
        "מחלקה מזמינה",
        'סה"כ יעוצים',
        { role: "style" },
        { role: "annotation" },
    ];

    titleDepartRequestTotalAll: any = 'סה"כ יעוצים לפי מחלקה מבצעת';
    DepartsDataRequestTotalAll: any = [["", 0, "", 0]];
    DepartsRequestTotalColumnsAll: any = [
        "מחלקה מזמינה",
        'סה"כ יעוצים',
        { role: "style" },
        { role: "annotation" },
    ];

    titleDepartRequestAvgAll: any = "ממוצע זמן למתן יעוץ לפי מחלקה מבצעת בשעות";
    DepartsDataRequestAvgAll: any = [["", 0, "", 0]];
    DepartsRequestAvgColumnsAll: any = [
        "מחלקה מזמינה",
        "זמן ממוצע לקבלת היעוץ",
        { role: "style" },
        { role: "annotation" },
    ];

    titleDepartRequestAvg: any = "ממוצע זמן למתן יעוץ לפי מחלקה מבצעת בשעות";
    DepartsDataRequestAvg: any = [["", 0, "", 0]];
    DepartsRequestAvgColumns: any = [
        "מחלקה מזמינה",
        "זמן ממוצע לקבלת היעוץ",
        { role: "style" },
        { role: "annotation" },
    ];

    titleDepartDoingAvg: any = "ממוצע זמן  לפי מחלקה מזמינה בשעות";
    DepartsDataDoingAvg: any = [["", 0, "", 0]];
    DepartsDoingAvgColumns: any = [
        "מחלקה מבצעת",
        "",
        { role: "style" },
        { role: "annotation" },
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

    /*
    titleDepartRequestTotalAll: any = 'סה"כ יעוצים לפי מחלקה מבצעת';
    DepartsDataRequestTotalAll: any = [["", 0, "", 0]];
    DepartsRequestTotalColumnsAll: any = [
        "מחלקה מזמינה",
        'סה"כ יעוצים',
        { role: "style" },
        { role: "annotation" },
    ];

    */
    titleDepartRequestTotalNotPara: any = 'סה"כ יעוצים לפי מחלקה מבצעת';
    DepartsDataRequestTotalNotPara: any = [["", 0, "", 0]];
    DepartsRequestTotalColumnsNotPara : any = [
        "מחלקה מזמינה",
        'סה"כ יעוצים',
        { role: "style" },
        { role: "annotation" },
    ];

    titleDepartRequestAvgNotPara: any = 'ממוצע זמן לפי מחלקה מבצעת';
    DepartsDataRequestAvgNotPara: any = [["", 0, "", 0]];
    DepartsRequestAvgColumnsNotPara : any = [
        "מחלקה מזמינה",
        'סה"כ יעוצים',
        { role: "style" },
        { role: "annotation" },
    ];

    titleDepartRequestTotalAllNotPara: any = 'סה"כ יעוצים לפי מחלקה מבצעת';
    DepartsDataRequestTotalAllNotPara: any = [["", 0, "", 0]];
    DepartsRequestTotalColumnsAllNotPara : any = [
        "מחלקה מזמינה",
        'סה"כ יעוצים',
        { role: "style" },
        { role: "annotation" },
    ];

    titleDepartRequestAvgAllNotPara: any = 'ממוצע זמן לפי מחלקה מבצעת';
    DepartsDataRequestAvgAllNotPara: any = [["", 0, "", 0]];
    DepartsRequestAvgColumnsAllNotPara : any = [
        "מחלקה מזמינה",
        'סה"כ יעוצים',
        { role: "style" },
        { role: "annotation" },
    ];

    titleDepartDoingTotalAll: any = 'סה"כ יעוץ לפי מחלקה מזמינה';
    DepartsDataDoingTotalAll: any = [["", 0, "", 0]];
    DepartsDoingTotalColumnsAll: any = [
        "מחלקה מזמינה",
        "",
        { role: "style" },
        { role: "annotation" },
    ];

    titleDepartDoingAvgAll: any = "ממוצע זמן  לפי מחלקה מזמינה בשעות";
    DepartsDataDoingAvgAll: any = [["", 0, "", 0]];
    DepartsDoingAvgColumnsAll: any = [
        "מחלקה מבצעת",
        "",
        { role: "style" },
        { role: "annotation" },
    ];

    MulBarsRequestDepart: any;
    MulBarsRequestDepartTotalRows: any;
    MulBarsRequestDepartAvgTime: any;

    
    /*
    DepartsDataRequestTotalNotPara
DepartsDataRequestAvgNotPara
DepartsDataRequestTotalAllNotPara
DepartsDataRequestAvgAllNotPara
    */
   MulBarsRequestDepartNotPara: any;
   MulBarsRequestDepartTotalRowsNotPara: any;
   MulBarsRequestDepartAvgTimeNotPara: any;
   MulBarsRequestDepartAvgTimeAllNotPara: any;
   MulBarsRequestDepartTotalRowsAllNotPara: any;
   MulBarsRequestDepartAllNotPara: any;

    MulBarsDoingDepart: any;
    MulBarsDoingDepartAvgTime: any;
    MulBarsDoingDepartTotalRows: any;

    MulBarsRequestDepartAll: any;
    MulBarsRequestDepartTotalRowsAll: any;
    MulBarsRequestDepartAvgTimeAll: any;

    MulBarsDoingDepartAll: any;
    MulBarsDoingDepartAvgTimeAll: any;
    MulBarsDoingDepartTotalRowsAll: any;

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
        private formBuilder: FormBuilder,
        private mMenuPerm: MenuPerm
    ) {
        mMenuPerm.setRoutName("consultations");
        setTimeout(() => {
            if(!mMenuPerm.getHasPerm()){
                localStorage.clear();
                this.router.navigate(["login"]);
            }
        }, 2000);}

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
            this._selectedYear = parseFloat(this.yearsToSelect.list[0]["ID"]);
            this.Sdate = new FormControl(
                new Date(parseFloat(this.yearsToSelect.list[0]["ID"]), 0, 1)
            );
            this.Edate = new FormControl(
                new Date(parseFloat(this.yearsToSelect.list[0]["ID"]), 11, 31)
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
    shuffle(array) {
        var currentIndex = array.length,
            temporaryValue,
            randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
    onTabChanged($event) {
        let clickedIndex = $event.index;
        this.selectedIndexTab = clickedIndex;
        this.optionsBars = {
            
            height: 1200,
            hAxis: {
                showTextEvery: 1,
                //gridlines: { count: 50 }
                //ticks: [0, 25, 50, 75, 100] // display labels every 25
            },
            vAxis: {
                showTextEvery: 1,
                gridlines: { count: 50 }
            },
        };
        this.optionsBarsV = {
            height: 1200,
           // bars: "vertical",
            hAxis: {
               // direction: -1,
                // slantedText: true,
                // slantedTextAngle: 90,
                showTextEvery: 1,
                
            },
            vAxis: {
                showTextEvery: 1,
                gridlines: { count: 50 }
            },
        };
        // ////debugger;
        this.DepartsDataChart = [["", 0, "", 0]];
        this.WorkersDataChart = [["", 0, "", 0]];
        this.DepartsDataDoingTotal = [["", 0, "", 0]];
        this.DepartsDataDoingAvg = [["", 0, "", 0]];
        this.DepartsDataDoingTotalAll = [["", 0, "", 0]];
        this.DepartsDataDoingAvgAll = [["", 0, "", 0]];
        this.DepartsDataRequestTotal = [["", 0, "", 0]];
        this.DepartsDataRequestAvg = [["", 0, "", 0]];
        //var t = this.shuffle(this.colors);
        ////debugger;
        if (clickedIndex == 1 && this.MulBarsRequestDepart != null) {
            this.DepartsDataRequestTotal = [];
            this.DepartsDataRequestAvg = [];
            for (var s = 0; s < this.MulBarsRequestDepart.length; s++) {
                var _d = [
                    this.MulBarsRequestDepart[s],
                    parseFloat(this.MulBarsRequestDepartTotalRows[s]),
                    "color: " + this.colors[s],
                    parseFloat(this.MulBarsRequestDepartTotalRows[s]),
                ];
                var _s = [
                    this.MulBarsRequestDepart[s],
                    parseFloat(this.MulBarsRequestDepartAvgTime[s]),
                    "color: " + this.colors[s],
                    parseFloat(this.MulBarsRequestDepartAvgTime[s]),
                ];
                // ////debugger
                this.DepartsDataRequestTotal.push(_d);
                this.DepartsDataRequestAvg.push(_s);
            }
            if(this.MulBarsRequestDepart.length == 0){
                this.DepartsDataRequestTotal = [["", 0, "", 0]];
                this.DepartsDataRequestAvg = [["", 0, "", 0]];
            }
        }
        if (clickedIndex == 1 && this.MulBarsRequestDepartAll != null) {
            this.DepartsDataRequestTotalAll = [];
            this.DepartsDataRequestAvgAll = [];
            for (var s = 0; s < this.MulBarsRequestDepartAll.length; s++) {
                var _d = [
                    this.MulBarsRequestDepartAll[s],
                    parseFloat(this.MulBarsRequestDepartTotalRowsAll[s]),
                    "color: " + this.colors[s],
                    parseFloat(this.MulBarsRequestDepartTotalRowsAll[s]),
                ];
                var _s = [
                    this.MulBarsRequestDepartAll[s],
                    parseFloat(this.MulBarsRequestDepartAvgTimeAll[s]),
                    "color: " + this.colors[s],
                    parseFloat(this.MulBarsRequestDepartAvgTimeAll[s]),
                ];
                // ////debugger
                this.DepartsDataRequestTotalAll.push(_d);
                this.DepartsDataRequestAvgAll.push(_s);
            }
            if(this.MulBarsRequestDepartAll.length == 0){
                this.DepartsDataRequestTotalAll = [["", 0, "", 0]];
                this.DepartsDataRequestAvgAll = [["", 0, "", 0]];
            }
        }
        ////debugger
        if (clickedIndex == 1 && this.MulBarsDoingDepart != null) {
            this.DepartsDataDoingTotal = [];
            this.DepartsDataDoingAvg = [];
            for (var s = 0; s < this.MulBarsDoingDepart.length; s++) {
                var _d = [
                    this.MulBarsDoingDepart[s],
                    parseFloat(this.MulBarsDoingDepartTotalRows[s]),
                    "color: " + this.colors[s],
                    parseFloat(this.MulBarsDoingDepartTotalRows[s]),
                ];
                var _s = [
                    this.MulBarsDoingDepart[s],
                    parseFloat(this.MulBarsDoingDepartAvgTime[s]),
                    "color: " + this.colors[s],
                    parseFloat(this.MulBarsDoingDepartAvgTime[s]),
                ];
                //////debugger
                this.DepartsDataDoingTotal.push(_d);
                this.DepartsDataDoingAvg.push(_s);
            }
            if(this.MulBarsDoingDepart.length == 0){
                this.DepartsDataDoingTotal = [["", 0, "", 0]];
                this.DepartsDataDoingAvg = [["", 0, "", 0]];
            }
        }
        //debugger;
        if (clickedIndex == 1 && this.MulBarsDoingDepartAll != null) {
            this.DepartsDataDoingTotalAll = [];
            this.DepartsDataDoingAvgAll = [];
            for (var s = 0; s < this.MulBarsDoingDepartAll.length; s++) {
                var _d = [
                    this.MulBarsDoingDepartAll[s],
                    parseFloat(this.MulBarsDoingDepartTotalRowsAll[s]),
                    "color: " + this.colors[s],
                    parseFloat(this.MulBarsDoingDepartTotalRowsAll[s]),
                ];
                var _s = [
                    this.MulBarsDoingDepartAll[s],
                    parseFloat(this.MulBarsDoingDepartAvgTimeAll[s]),
                    "color: " + this.colors[s],
                    parseFloat(this.MulBarsDoingDepartAvgTimeAll[s]),
                ];
                //////debugger
                this.DepartsDataDoingTotalAll.push(_d);
                this.DepartsDataDoingAvgAll.push(_s);
            }
            
            if(this.MulBarsDoingDepartAll.length == 0){
                this.DepartsDataDoingTotalAll = [["", 0, "", 0]];
                this.DepartsDataDoingAvgAll = [["", 0, "", 0]];
            }
        }
        if (clickedIndex == 1 && this.MulBarsRequestDepartAllNotPara != null) {
            this.DepartsDataRequestTotalAllNotPara = [];
            this.DepartsDataRequestAvgAllNotPara = [];
            for (var s = 0; s < this.MulBarsRequestDepartAllNotPara.length; s++) {
                var _d = [
                    this.MulBarsRequestDepartAllNotPara[s],
                    parseFloat(this.MulBarsRequestDepartTotalRowsAllNotPara[s]),
                    "color: " + this.colors[s],
                    parseFloat(this.MulBarsRequestDepartTotalRowsAllNotPara[s]),
                ];
                var _s = [
                    this.MulBarsRequestDepartAllNotPara[s],
                    parseFloat(this.MulBarsRequestDepartAvgTimeAllNotPara[s]),
                    "color: " + this.colors[s],
                    parseFloat(this.MulBarsRequestDepartAvgTimeAllNotPara[s]),
                ];
                //////debugger
                this.DepartsDataRequestTotalAllNotPara.push(_d);
                this.DepartsDataRequestAvgAllNotPara.push(_s);
            }
            
            if(this.MulBarsRequestDepartAllNotPara.length == 0){
                this.DepartsDataRequestTotalAllNotPara = [["", 0, "", 0]];
                this.DepartsDataRequestAvgAllNotPara = [["", 0, "", 0]];
            }
        }
        if (clickedIndex == 1 && this.MulBarsRequestDepartNotPara != null) {
            this.DepartsDataRequestTotalNotPara = [];
            this.DepartsDataRequestAvgNotPara = [];
            for (var s = 0; s < this.MulBarsRequestDepartNotPara.length; s++) {
                var _d = [
                    this.MulBarsRequestDepartNotPara[s],
                    parseFloat(this.MulBarsRequestDepartTotalRowsNotPara[s]),
                    "color: " + this.colors[s],
                    parseFloat(this.MulBarsRequestDepartTotalRowsNotPara[s]),
                ];
                var _s = [
                    this.MulBarsRequestDepartNotPara[s],
                    parseFloat(this.MulBarsRequestDepartAvgTimeNotPara[s]),
                    "color: " + this.colors[s],
                    parseFloat(this.MulBarsRequestDepartAvgTimeNotPara[s]),
                ];
                //////debugger
                this.DepartsDataRequestTotalNotPara.push(_d);
                this.DepartsDataRequestAvgNotPara.push(_s);
            }
            
            if(this.MulBarsRequestDepartNotPara.length == 0){
                this.DepartsDataRequestTotalNotPara = [["", 0, "", 0]];
                this.DepartsDataRequestAvgNotPara = [["", 0, "", 0]];
            }
        }
        if (clickedIndex == 1 && this.Departs != null) {
            this.DepartsDataChart = [];
            // ////debugger;
            var s = 0;
            for (const [key, value] of Object.entries(this.Departs)) {
                if (value != "") {
                    var _d = [
                        this.Departs[key],
                        parseFloat(this.DepartsDoingTotal[key]),
                        "color: " + this.colors[s],
                        parseFloat(this.DepartsDoingTotal[key]),
                    ];
                    this.DepartsDataChart.push(_d);
                    s++;
                }
            }
            if(this.Departs.length == 0){
                this.DepartsDataChart = [["", 0, "", 0]];
            }
        }
        if (clickedIndex == 1 && this.Workers != null) {
            this.WorkersDataChart = [];
            var s = 0;
            for (const [key, value] of Object.entries(this.Workers)) {
                if (value != "") {
                    var _d = [
                        this.Workers[key],
                        parseFloat(this.WorkersDoingTotal[key]),
                        "color: " + this.colors[s],
                        parseFloat(this.WorkersDoingTotal[key]),
                    ];
                    this.WorkersDataChart.push(_d);
                    s++;
                }
            }
            if(this.Workers.length == 0){
                this.WorkersDataChart = [["", 0, "", 0]];
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
            //// ////////debugger;
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
        //// ////////debugger;
        if (_dataType == "multiBar") {
            $("#" + _wrapperId).empty();
            $("#" + _wrapperId).append(
                '<canvas id="' + _chartId + '"></canvas>'
            );
            //  // ////////debugger
            var canvas: HTMLCanvasElement = <HTMLCanvasElement>(
                document.getElementById(_chartId)
            );
            var ctxIn: CanvasRenderingContext2D = canvas.getContext("2d");
            ////////debugger
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
            // ////////debugger
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
                            // // ////////debugger;
                            var total = 0;
                            for (var t = 0; t < dataset.data.length; t++) {
                                total += parseFloat(dataset.data[t]);
                            }

                            //get the current items value
                            var currentValue = parseFloat(
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
        //  // ////////debugger
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
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetNamerDeparts", {})
            .subscribe((Response) => {
                //// ////////debugger
                this.departsList = [];

                var json = JSON.parse(Response["d"]);
                // // ////////debugger
                var _d = JSON.parse(json["departsList"]);

                for (const [key, value] of Object.entries(_d)) {
                    //////debugger
                    var _sD: Departs = { id: key, name: value.toString() };

                    this.departsList.push(_sD);
                }

                $("#loader").addClass("d-none");
                /*
                  $(_d).each(function(i,k){
                      // ////////debugger
                      //var _sD: Depart = {id: i, name: k};

                      //this.departs.push(_sD);
                  })*/
                //// ////////debugger
            });
    }
    getWorkers(valDepart) {
        $("#loader").removeClass("d-none");
        this.http
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetWorkers", {
                _Depart: valDepart,
            })
            .subscribe((Response) => {
                ////debugger;
                this.workersList = [];
                var json = JSON.parse(Response["d"]);
                // // ////////debugger
                var _w = JSON.parse(json["WorkersList"]);

                for (const [key, value] of Object.entries(_w)) {
                    //////debugger
                    var _sD: Departs = { id: key, name: value.toString() };

                    this.workersList.push(_sD);
                }
                $("#loader").addClass("d-none");
                /*
                  $(_d).each(function(i,k){
                      // ////////debugger
                      //var _sD: Depart = {id: i, name: k};

                      //this.departs.push(_sD);
                  })*/
                //// ////////debugger
            });
    }
    getRequest() {
        $("#loader").removeClass("d-none");
        this.http
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetRequestDeparts", {})
            .subscribe((Response) => {
                //// ////////debugger
                this.requestdepartsList = [];

                var json = JSON.parse(Response["d"]);
                // // ////////debugger

                var _r = JSON.parse(json["seodedepartsList"]);

                for (const [key, value] of Object.entries(_r)) {
                    //////debugger
                    var _sD: Departs = { id: key, name: value.toString() };

                    this.requestdepartsList.push(_sD);
                }

                $("#loader").addClass("d-none");
                /*
                  $(_d).each(function(i,k){
                      // ////////debugger
                      //var _sD: Depart = {id: i, name: k};

                      //this.departs.push(_sD);
                  })*/
                //// ////////debugger
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
        //////debugger;
        $("#loader").removeClass("d-none");
        this.http
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetAllConsultations", {
                _fromDate: _startDate,
                _toDate: _endDate,
                _pageIndex: _pageIndex,
                _pageSize: _pageSize,
                _freeText: _filterVal,
                _Depart: _Depart,
                _Workers: _Workers,
                _Request: _Request,
                _typeOf: this.typeOf,
            })
            .subscribe(
                (Response) => {
                    this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                    var json = JSON.parse(Response["d"]);
                    ////debugger;
                    this.Departs = JSON.parse(json["Departs"]);
                    this.MulBarsRequestDepart = JSON.parse(
                        json["MulBarsRequestDepart"]
                    );
                    this.MulBarsRequestDepartTotalRows = JSON.parse(
                        json["MulBarsRequestDepartTotalRows"]
                    );
                    this.MulBarsRequestDepartAvgTime = JSON.parse(
                        json["MulBarsRequestDepartAvgTime"]
                    );
                    this.MulBarsRequestDepartAll = JSON.parse(
                        json["MulBarsRequestDepartAll"]
                    );
                    this.MulBarsRequestDepartTotalRowsAll = JSON.parse(
                        json["MulBarsRequestDepartTotalRowsAll"]
                    );
                    this.MulBarsRequestDepartAvgTimeAll = JSON.parse(
                        json["MulBarsRequestDepartAvgTimeAll"]
                    );
                    this.MulBarsDoingDepart = JSON.parse(
                        json["MulBarsDoingDepart"]
                    );
                    this.MulBarsDoingDepartAvgTime = JSON.parse(
                        json["MulBarsDoingDepartAvgTime"]
                    );
                    this.MulBarsRequestDepartNotPara = JSON.parse(
                        json["MulBarsRequestDepartNotPara"]
                    );
                    this.MulBarsRequestDepartTotalRowsNotPara = JSON.parse(
                        json["MulBarsRequestDepartTotalRowsNotPara"]
                    );
                    this.MulBarsRequestDepartAvgTimeNotPara = JSON.parse(
                        json["MulBarsRequestDepartAvgTimeNotPara"]
                    );
                    this.MulBarsRequestDepartAvgTimeAllNotPara = JSON.parse(
                        json["MulBarsRequestDepartAvgTimeAllNotPara"]
                    );
                    this.MulBarsRequestDepartTotalRowsAllNotPara = JSON.parse(
                        json["MulBarsRequestDepartTotalRowsAllNotPara"]
                    );
                    this.MulBarsRequestDepartAllNotPara = JSON.parse(
                        json["MulBarsRequestDepartAllNotPara"]
                    );
                    this.MulBarsDoingDepartTotalRows = JSON.parse(
                        json["MulBarsDoingDepartTotalRows"]
                    );
                    this.MulBarsDoingDepartAll = JSON.parse(
                        json["MulBarsDoingDepartAll"]
                    );
                    this.MulBarsDoingDepartAvgTimeAll = JSON.parse(
                        json["MulBarsDoingDepartAvgTimeAll"]
                    );
                    this.MulBarsDoingDepartTotalRowsAll = JSON.parse(
                        json["MulBarsDoingDepartTotalRowsAll"]
                    );

                    this.DepartsDoingTotal = JSON.parse(
                        json["DepartsDoingTotal"]
                    );
                    this.WorkersDoingTotal = JSON.parse(
                        json["WorkersDoingTotal"]
                    );
                    this.Workers = JSON.parse(json["Workers"]);
                    ////debugger;
                    //////debugger
                    let Consultations = JSON.parse(json["aaData"]);
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
                    this.resultsLength = parseFloat(json["iTotalRecords"]);
                    //;
                    /* */
                    //this.paginator. = parseFloat(json["iTotalRecords"]);
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
