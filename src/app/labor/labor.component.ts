import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {} from "googlemaps";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatRadioChange } from "@angular/material/radio";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import * as $ from "jquery";
import * as Fun from "../public.functions";
import { Time } from "@angular/common";
import { FormControl } from "@angular/forms";
import { MouseEvent, MapsAPILoader, Geocoder } from "@agm/core";
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import {
    NgbModal,
    ModalDismissReasons,
    NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
export interface DataTableInterface {
    L_ROW_ID: String;
    L_ORDER_CODE: String;
    L_CASE_NUMBER: String;
    L_REQUEST_DATE: String;
    L_RESULT_DATE: String;
    L_PATIENT_ID: String;
    L_F_NAME: String;
    L_L_NAME: String;
    L_GENDER: String;
    L_PHONE_NUMBER: String;
    L_ADDRESS_1: String;
    L_ADDRESS_2: String;
    L_ZIP: String;
    L_SATET: String;
    L_CITY: String;
    L_REQUEST_DEPART: String;
    L_SERVICE_NUMBER: String;
    L_SERVICE_NAME: String;
    L_RESULTS: String;
    L_LAT: String;
    L_LON: String;
    L_HOSPITALIZED: String;
    L_DOB: String;
    L_EMAIL: String;
    L_PASSPORT: String;
    L_PASSWORD: String;
    L_SEND_DATE: String;
}
export interface DataTableInterfacePatient {
    ICD_CASE_NUMBER: String;
    ICD_PATIENT_NUMBER: String;
    ICD_PATIENT_ID: String;
    ICD_DATE_IN: String;
    ICD_TIME_IN: String;
    ICD_DEPART: String;
    ICD_SEODE_DEPART: String;
    ICD_L_NAME: String;
    ICD_F_NAME: String;
    ICD_PATIENT_STATUS: String;
    ICD_REQUEST_DATE_R_1: Date;
    ICD_RESULT_DATE_R_1: Date;
    ICD_RESULT_R_1: String;
    ICD_COLOR_R_1: String;
    ICD_REQUEST_DATE_R_2: Date;
    ICD_RESULT_DATE_R_2: Date;
    ICD_RESULT_R_2: String;
    ICD_COLOR_R_2: String;
    ICD_REQUEST_DATE_R_3: Date;
    ICD_RESULT_DATE_R_3: Date;
    ICD_RESULT_R_3: String;
    ICD_COLOR_R_3: String;
    ICD_REQUEST_DATE_R_4: Date;
    ICD_RESULT_DATE_R_4: Date;
    ICD_RESULT_R_4: String;
    ICD_COLOR_R_4: String;
    ICD_REQUEST_DATE_R_5: Date;
    ICD_RESULT_DATE_R_5: Date;
    ICD_RESULT_R_5: String;
    ICD_COLOR_R_5: String;
}
// just an interface for type safety.
interface marker {
    lat: number;
    lng: number;
    icon: string;
    label?: string;
    address: string;
    draggable: boolean;
}
@Component({
    selector: "app-labor",
    templateUrl: "./labor.component.html",
    styleUrls: ["./labor.component.css"],
})
/*
200669695
*/
export class LaborComponent implements OnInit, AfterViewInit {
    zoom: number = 7;
    private geoCoder;
    // initial center position for the map
    lat: number = 31.0461;
    lng: number = 34.8516;

    modalOptions: NgbModalOptions /*= {
        size: 'lg',
        windowClass: 'animated bounceInUp',
        beforeDismiss: () => {
          setTimeout(()=>{
            alert ('Hello!');
          },2000);
          return false;
        }
    }*/;
    closeResult: string;
    @ViewChild("TableTowPaginator", { static: true })
    TableTowPaginator: MatPaginator;
    @ViewChild("TableOnePaginator", { static: true })
    TableOnePaginator: MatPaginator;
    // @ViewChild(MatSort, { static: true }) sort: MatSort;
    displayedColumns: string[] = [
        "L_ORDER_CODE",
        "L_REQUEST_DEPART",
        "L_REQUEST_DATE",
        "L_RESULT_DATE",
        "L_PATIENT_ID",
        "L_F_NAME",
        "L_ADDRESS_1",
        "L_RESULTS",
        "L_PASSWORD",
        "L_SEND_DATE",
        "action",
    ];

    displayedColumnsPatient: string[] = [
        "ICD_CASE_NUMBER",
        "ICD_PATIENT_NUMBER",
        "ICD_PATIENT_ID",
        "ICD_DEPART",
        "ICD_SEODE_DEPART",
        "ICD_ROOM_NUMBER",
        "ICD_L_NAME",
        //"ICD_PATIENT_STATUS",
        "ICD_NAMER_STATUS",
        "ICD_DATE_IN",
        "ICD_RESULT_DATE_R_1",
        "ICD_RESULT_DATE_R_2",
        "ICD_RESULT_DATE_R_3",
        "ICD_RESULT_DATE_R_4",
        "ICD_RESULT_DATE_R_5",
    ];
    dataSource: MatTableDataSource<DataTableInterface>;
    dataSourcePatient: MatTableDataSource<DataTableInterfacePatient>;

    dataTable: DataTableInterface[] = [];
    dataTablePatient: DataTableInterfacePatient[] = [];

    mobile: string;
    email: string;
    passprot: string;
    dob: Date;
    geocoder: Geocoder;
    loader: Boolean;
    tableLoader: Boolean;
    _selectedYear = 0;
    resultsLength = 0;
    resultsLengthPatient = 0;
    fliterVal = "";
    _yearToSearch = 0;
    chart = null;
    isShow = false;
    position: { lat: any; lng: any };
    userLat: any;
    userLng: any;
    CheckTypeStatus: string;
    public _Element = "";
    public _Type = "";
    public _Content = "";

    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    constructor(
        public maps: MapsAPILoader,
        public router: Router,
        public http: HttpClient,
        public modalService: NgbModal,
        public _snackBar: MatSnackBar
    ) {
        this.dataSource = new MatTableDataSource(this.dataTable);
        this.dataSourcePatient = new MatTableDataSource(this.dataTablePatient);
        // ////debugger;
    }
    startdateVal: string;
    enddateVal: string;
    Sdate: FormControl;
    Edate: FormControl;
    Depart: string;
    Shift: string;
    CheckResult: string;
    CheckType: string;
    RequestType: string;
    yearsToSelect: { list: {} };
    _fun = new Fun.Functions();
    markers: marker[] = [];
    ngOnInit() {
        // this.maps.load().then(() => {
        //     //////debugger
        //     this.geoCoder = new google.maps.Geocoder();
        //     //this.getAddress("haifa");
        // });
        //this.dataSource.paginator = this.paginator;
        //this.dataSource.sort = this.sort;
        this._fun.RunFunction();
        this.yearsToSelect = this._fun.yearsToSelect;
        this.loader = false;
        this.Depart = "-1";
        this.CheckResult = "-1";
        this.RequestType = "-1";
        this.CheckType = "-1";
        this.CheckTypeStatus = "1";
        /* if (this.yearsToSelect.list[0]["checked"]) {
            this._selectedYear = parseInt(this.yearsToSelect.list[0]["ID"]);
            this.Sdate = new FormControl(
                new Date(parseInt(this.yearsToSelect.list[0]["ID"]), 0, 1)
            );
            this.Edate = new FormControl(
                new Date(parseInt(this.yearsToSelect.list[0]["ID"]), 11, 31)
            );*/
        /* }*/

        this.Sdate = new FormControl(new Date());
        this.Edate = new FormControl(new Date());
        this.startdateVal = this.Sdate.value;
        this.enddateVal = this.Edate.value;

        //////debugger
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
            localStorage.getItem("loginUserName").toLowerCase() ==
                "habuzayyad" ||
            localStorage.getItem("loginUserName").toLowerCase() == "hmizrahi" ||
            localStorage.getItem("loginUserName").toLowerCase() == "mruach" ||
            localStorage.getItem("loginUserName").toLowerCase() ==
                "yarosenfel" ||
            localStorage.getItem("loginUserName").toLowerCase() == "mmatan" ||
            localStorage.getItem("loginUserName").toLowerCase() == "etalor" ||
            localStorage.getItem("loginUserName").toLowerCase() == "batzadok" ||
            localStorage.getItem("loginUserName").toLowerCase() == "mmadmon" ||
            localStorage.getItem("loginUserName").toLowerCase() == "mlehrer" ||
            localStorage.getItem("loginUserName").toLowerCase() == "nsela" ||
            localStorage.getItem("loginUserName").toLowerCase() == "ssabach" ||
            localStorage.getItem("loginUserName").toLowerCase() == "dsalameh" ||
            localStorage.getItem("loginUserName").toLowerCase() ==
                "bmonastirsky" ||
            localStorage.getItem("loginUserName").toLowerCase() ==
                "mgershovich" ||
            localStorage.getItem("loginUserName").toLowerCase() == "klibai" ||
            localStorage.getItem("loginUserName").toLowerCase() == "aasheri" ||
            localStorage.getItem("loginUserName").toLowerCase() == "obenor" ||
            localStorage.getItem("loginUserName").toLowerCase() == "ohaccoun" ||
            localStorage.getItem("loginUserName").toLowerCase() == "iaharon" ||
            localStorage.getItem("loginUserName").toLowerCase() == "jubartal" ||
            localStorage.getItem("loginUserName").toLowerCase() == "hseffada" ||
            localStorage.getItem("loginUserName").toLowerCase() == "waraidy" ||
            localStorage.getItem("loginUserName").toLowerCase() == "cmagen" ||
            localStorage.getItem("loginUserName").toLowerCase() == "tlivnat" ||
            localStorage.getItem("loginUserName").toLowerCase() == "mjourno" ||
            localStorage.getItem("loginUserName").toLowerCase() == "nali" ||
            localStorage.getItem("loginUserName").toLowerCase() == "emansour" ||
            localStorage.getItem("loginUserName").toLowerCase() == "kmandel" ||
            localStorage.getItem("loginUserName").toLowerCase() == "smatta" ||
            localStorage.getItem("loginUserName").toLowerCase() ==
                "sabuhanna" ||
                localStorage.getItem("loginUserName").toLowerCase() == "rnakhle"||
                localStorage.getItem("loginUserName").toLowerCase() == "aibrahim"||
                localStorage.getItem("loginUserName").toLowerCase() == "mkheer"||
                localStorage.getItem("loginUserName").toLowerCase() == "ssarusi"||
            localStorage.getItem("loginUserName").toLowerCase() == "samos" ||
            localStorage.getItem("loginUserName").toLowerCase() == "tklinger"||
            localStorage.getItem("loginUserName").toLowerCase() == "relmalem"||
            localStorage.getItem("loginUserName").toLowerCase() == "aamara"
        ) {
        } else {
            this.router.navigate(["login"]);
            ///$("#chadTable").DataTable();
        }
        this.dataSource = new MatTableDataSource(this.dataTable);
        this.dataSourcePatient = new MatTableDataSource(this.dataTablePatient);
        //console.log(this.paginator.pageIndex);
        
        /*$(document).on("click", "#CheckBefore", function (e) {
           ////debugger
            if ($(document).find('[name="mobile"]').val() == "" ||
            $(document).find('[name="email"]').val() == "" ||
            $(document).find('[name="passprot"]').val() == "") {
                var d = new LaborComponent(null, null, null, null, null);
                d.open( d._Content, d._Type, d._Element)
            }
        });*/
    }
    markerDragEnd(m: marker, $event: MouseEvent) {
        console.log("dragEnd", m, $event);
    }
    clickedMarker(label: string, index: number) {
        console.log(`clicked the marker: ${label || index}`);
    }
    getAddress(_address: string) {
        //////debugger
        const address = _address;

        this.geoCoder.geocode({ address: address }, (results, status) => {
            //////debugger
            if (status === "OK") {
                // ////debugger
                /* this.markers.push({
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng(),
                    label: "" +(this.markers.filter((obj) => obj.address === results[0].formatted_address).length + 1),
                    address: results[0].formatted_address,
                    draggable: false
                });*/
                //////debugger
            } else {
                // alert(
                //     "Geocode was not successful for the following reason: " +
                //         status
                // );
            }
        });
    }
    /**
     * name
     */
    public open(content, _type, _element) {
        //$('#free_text').text(_element.FreeText);
        this._Element = _element;
        this._Type = _type;
        this._Content = content;
        //debugger
        this.mobile = _element.L_MOBILE;
        this.email = _element.L_EMAIL;
        this.passprot = _element.L_PASSPORT;
        if(_element.L_DOB != '' && typeof(_element.L_DOB) != 'object'){
            var dArr = (_element.L_DOB).split('-');
            //this.dob = (_element.L_DOB).replace('-', '/');
           // this.dob = (this.dob).replace('-', '/');
            this.dob = new FormControl(new Date(parseInt(dArr[2]), parseInt(dArr[1]) - 1 , parseInt(dArr[0]))).value;
        }
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                ////debugger;
                this.closeResult = `Closed with: ${result}`;
                if (
                    this.mobile == "" ||
                    this.email == "" ||
                    this.passprot == ""
                ) {
                    this.open(this._Content, this._Type, this._Element);
                    this.openSnackBar("כל השדות חובה", "error");
                    return;
                }
                if ("Save" == result && this.mobile != "" &&
                this.email != "" &&
                this.passprot != "") {
                    // ////debugger;
                    _element.L_PASSWORD = this.sendAttach(_element.L_ROW_ID);
                    _element.L_MOBILE = this.mobile;
                    _element.L_EMAIL = this.email;
                    _element.L_PASSPORT = this.passprot;
                    var date = this.dob;
                    var m = "";
                    var d = "";
                    var hh = "";
                    var mm = "";
                    if (date.getMonth() + 1 < 10) {
                        m = "0" + (date.getMonth() + 1);
                    } else {
                        m = (date.getMonth() + 1).toString();
                    }

                    if (date.getDate() < 10) {
                        d = "0" + date.getDate();
                    } else {
                        d = date.getDate().toString();
                    }

                    if (date.getHours() < 10) {
                        hh = "0" + date.getHours();
                    } else {
                        hh = date.getHours().toString();
                    }

                    if (date.getMinutes() < 10) {
                        mm = "0" + date.getMinutes();
                    } else {
                        mm = date.getMinutes().toString();
                    }
                    var str =
                        d +
                        "-" +
                        m +
                        "-" +
                        date.getFullYear() 
                    _element.L_DOB = str;
                    //debugger
                    var date = new Date();
                    var m = "";
                    var d = "";
                    var hh = "";
                    var mm = "";
                    if (date.getMonth() + 1 < 10) {
                        m = "0" + (date.getMonth() + 1);
                    } else {
                        m = (date.getMonth() + 1).toString();
                    }

                    if (date.getDate() < 10) {
                        d = "0" + date.getDate();
                    } else {
                        d = date.getDate().toString();
                    }

                    if (date.getHours() < 10) {
                        hh = "0" + date.getHours();
                    } else {
                        hh = date.getHours().toString();
                    }

                    if (date.getMinutes() < 10) {
                        mm = "0" + date.getMinutes();
                    } else {
                        mm = date.getMinutes().toString();
                    }
                    var str =
                        d +
                        "-" +
                        m +
                        "-" +
                        date.getFullYear() +
                        " " +
                        hh +
                        ":" +
                        mm;

                    _element.L_SEND_DATE = str;
                }
            },
            (reason) => {
                //debugger
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
        setTimeout(function () {
            $(document).find("#row_id").text(_element.L_CASE_NUMBER);
        }, 100);
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
    openSnackBar(txt, type) {
        this._snackBar.open(txt, "", {
            duration: 2500,
            direction: "rtl",
            panelClass: type,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
    private sendAttach(_rowID) {
        $("#loader").removeClass("d-none");
        var date = this.dob;
        var m = "";
        var d = "";
        var hh = "";
        var mm = "";
        if (date.getMonth() + 1 < 10) {
            m = "0" + (date.getMonth() + 1);
        } else {
            m = (date.getMonth() + 1).toString();
        }

        if (date.getDate() < 10) {
            d = "0" + date.getDate();
        } else {
            d = date.getDate().toString();
        }

        if (date.getHours() < 10) {
            hh = "0" + date.getHours();
        } else {
            hh = date.getHours().toString();
        }

        if (date.getMinutes() < 10) {
            mm = "0" + date.getMinutes();
        } else {
            mm = date.getMinutes().toString();
        }
        var str =
            date.getFullYear()  +
            "-" +
            m +
            "-" +
            d
           
           //debugger
        this.http
            .post(
                "http://srv-ipracticom:8080/WebService.asmx/UpdateMobileOrEmailOrPassportOrDOB",
                {
                    _mobile: this.mobile,
                    _email: this.email,
                    _passport: this.passprot,
                    _dob: str,
                    _rowId: _rowID,
                }
            )
            .subscribe(
                (Response) => {
                    ////debugger;
                    setTimeout(() => {
                        //this.dataSource.paginator = this.paginator
                        this.openSnackBar("נשלח בהצלחה", "success");
                        $("#loader").addClass("d-none");
                    });
                    //this.dataSource.paginator = this.paginator;
                    return this._Element['L_PASSWORD'] = Response['d'].toString();
                   
                },
                (error) => {
                    // ////debugger;
                    $("#loader").addClass("d-none");
                }
            );
    }
    mapClicked($event: MouseEvent) {}

    radioChange(event: MatRadioChange) {
        //////debugger
        this._fun.radioChange(event);
        this.startdateVal = this._fun.Sdate.value;
        this.enddateVal = this._fun.Edate.value;
    }
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    applyFilterPatient(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSourcePatient.filter = filterValue.trim().toLowerCase();

        if (this.dataSourcePatient.paginator) {
            this.dataSourcePatient.paginator.firstPage();
        }
    }
    quart_change(event: MatRadioChange) {
        ////////debugger;
        //this._fun.quart_change(event);
        //this.startdateVal = this._fun.Sdate.value;
        //this.enddateVal = this._fun.Edate.value;

        this.CheckResult = event.value;
    }
    check_change(event: MatRadioChange) {
        ////////debugger;
        //this._fun.quart_change(event);
        //this.startdateVal = this._fun.Sdate.value;
        //this.enddateVal = this._fun.Edate.value;

        this.CheckType = event.value;
    }
    check_change_status(event: MatRadioChange) {
        ////////debugger;
        //this._fun.quart_change(event);
        //this.startdateVal = this._fun.Sdate.value;
        //this.enddateVal = this._fun.Edate.value;

        this.CheckTypeStatus = event.value;
    }
    ngAfterViewInit(): void {}
    getReport($event: any): void {
        if (this.startdateVal && this.enddateVal)
            this.getDataFormServer(
                this.startdateVal,
                this.enddateVal,
                this.CheckResult,
                this.CheckType,
                this.CheckTypeStatus
            );
    }

    getReportExcel($event: any): void {
        if (this.startdateVal && this.enddateVal)
            this.getDataFormServer(
                this.startdateVal,
                this.enddateVal,
                this.CheckResult,
                this.CheckType,
                this.CheckTypeStatus
            );
    }

    getPaginatorData(event: PageEvent) {
        console.log(this.TableTowPaginator.pageIndex);
        if (this.startdateVal && this.enddateVal) {
            ////debugger;
        }
    }
    public getDataFormServer(
        _startDate: string,
        _endDate: string,
        _CheckResult: string,
        _CheckType: string,
        _CheckTypeStatus: string
    ) {
        // ////debugger
        let _counter = 0;
        let _yearStart = new Date(_startDate).getFullYear();
        let _yearEnd = new Date(_endDate).getFullYear();
        $("#loader").removeClass("d-none");
        this.loader = true;
        // ////debugger
        this.http
            .post("http://srv-apps/wsrfc/WebService.asmx/RunLaborAppNew", {
                _fromDate: _startDate,
                _toDate: _endDate,
                _CheckResult: _CheckResult,
                _CheckType: _CheckType,
                _CheckTypeStatus: _CheckTypeStatus,
            })
            .subscribe(
                (Response) => {
                    // ////debugger;
                    var json = JSON.parse(Response["d"]);
                    var itemsIn = JSON.parse(json.ITEMS);
                    var itemsInMap = JSON.parse(json.ITEMSMAP);
                    var itemsInPatient = JSON.parse(json.ITEMSPATIENT);
                    ////debugger;
                    var counterM = JSON.parse(json.counterM);
                    var counterB = JSON.parse(json.counterB);
                    var counterW = JSON.parse(json.counterW);
                    var MonthDayM = JSON.parse(json.MonthDayM);
                    var MonthDayValM = JSON.parse(json.MonthDayValM);
                    var MonthDayB = JSON.parse(json.MonthDayB);
                    var MonthDayValB = JSON.parse(json.MonthDayValB);
                    var k = 0;
                    this.markers = itemsInMap.items;
                    this._fun.drawCharToDom(
                        "bar",
                        ["שלילי", "חיובי", "פסול"],
                        [counterM, counterB, counterW],
                        "totalChart",
                        "canvtotalChart",
                        "סיכום",
                        ""
                    );
                    this._fun.drawCharToDom(
                        "line",
                        MonthDayB,
                        [MonthDayValB, MonthDayValM],
                        "LineChart",
                        "canvsLineChart",
                        "חיובי",
                        "שלילי"
                    );
                    if (itemsIn.items.length > 0)
                        this.dataSource = new MatTableDataSource<any>(
                            itemsIn.items
                        );
                    else this.dataSource = new MatTableDataSource<any>();

                    if (itemsInPatient.items.length > 0)
                        this.dataSourcePatient = new MatTableDataSource<any>(
                            itemsInPatient.items
                        );
                    else this.dataSourcePatient = new MatTableDataSource<any>();

                    this.resultsLength = parseInt(itemsIn.items.length);
                    this.resultsLengthPatient = parseInt(
                        itemsInPatient.items.length
                    );
                    setTimeout(() => {
                        //this.dataSource.paginator = this.paginator
                        $("#loader").addClass("d-none");
                        $("#table-section").removeClass("d-none");
                        this.loader = false;
                        if (_CheckTypeStatus == "1") {
                            $("#table-section-patient").removeClass("d-none");
                        } else {
                            $("#table-section-patient").addClass("d-none");
                        }
                        this.dataSource.paginator = this.TableTowPaginator;

                        this.dataSourcePatient.paginator = this.TableOnePaginator;
                    });
                },
                (error) => {
                    // //////debugger;
                    $("#loader").addClass("d-none");
                    this.loader = false;
                }
            );
    }
}
