import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatRadioChange } from "@angular/material/radio";
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import {
    NgbModal,
    ModalDismissReasons,
    NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import * as $ from "jquery";
import { Chart } from "chart.js";
import { formatDate, Time } from "@angular/common";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import * as Fun from "../public.functions";
import { environment } from "src/environments/environment";
export interface OrdersToAppointment {
    RowId: string;
    OrderdUser: string;
    OrderdUserPhone: string;
    OrderDateTime: string;
    AcceptedUser: string;
    AcceptedUserCellNumber: string;
    AcceptedDateTime: string;
    OrderStatus: string;
    OrderedFromDepart: string;
    OrderToDate: string;
    OrderRangeType: string;
    OrderRangeQuantity: string;
    OrderedToDepart: string;
    PatientId: string;
    PatientName: string;
    OrderRealDateTime: string;
    Notes: string;
    ClinicName: string;
    Permission: string;
    totalRows: number;
    OrderdUserName: number;
    AcceptedUserNotes: string;
    AlertPatient: string;
}
export interface OutpatientClinic {
    RoomNumber: string;
    ClinicName: string;
}
export interface UserDetails {
    FirstName: string;
    LastName: string;
    CellNumber: string;
    Depart: string;
}
@Component({
    selector: "app-orders-to-appointments",
    templateUrl: "./orders-to-appointments.component.html",
    styleUrls: ["./orders-to-appointments.component.css"],
})
export class OrdersToAppointmentsComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild('OrdersToAppointmentsFormID', { static: true }) OrdersToAppointmentsFormID: ElementRef;
    Permission: string = "";
    OutpatientClinics: OutpatientClinic[] = [];
    selectedClinics = this.OutpatientClinics;
    UserDetails: UserDetails = {
        FirstName: "",
        LastName: "",
        CellNumber: "",
        Depart: "",
    };
    DateNowR: Date = new Date();
    DateNow: string;
    RowId = "0";
    OrderdUser = "";
    OrderdUserPhone = "";
    OrderdUserName = "";
    OrderDateTime = "";
    AcceptedUser = "";
    AcceptedDateTime = "";
    OrderStatus = "";
    OrderedFromDepart = "";
    AcceptedUserCellNumber = "";
    OrderToDate = "";
    OrderRangeType = "";
    saveBtn = true;
    OrderRangeQuantity = "";
    OrderedToDepart = "";
    PatientId = "";
    PatientName = "";
    OrderRealDateTime = "";
    Notes = "";
    ClinicName = "";
    AcceptedUserNotes = "";
    AlertPatient = "";
    UserName = localStorage.getItem("loginUserName").toLowerCase();
    TABLE_DATA: OrdersToAppointment[] = [];
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    modalOptions: NgbModalOptions;
    resultsLength = 0;
    startdateVal: string;
    enddateVal: string;
    calendarNumber: string = "";
    requestingName: string = "";
    todayDate = new Date();
    Sdate: FormControl;
    Edate: FormControl;
    pageSize = 10;
    statusOrder = "0";
    displayedColumns: string[] = [
        "OrderDateTime",
        "AcceptedDateTime",
        "PatientId",
        "PatientName",
        "OrderedToDepart",
        "OrderToDate",
        "OrderRealDateTime",
        "OrderStatus",
        "D_CLICK",
    ];

    OrdersToAppointmentsForm: FormGroup;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private modalService_2: NgbModal,
        private formBuilder: FormBuilder
    ) {}

    ifMobile: Boolean;
    ngOnInit(): void {
        if (window.screen.width <= 798) {
            // 768px portrait
            this.ifMobile = true;
        } else {
            this.ifMobile = false;
        }
        this.getOutpatientClinics();
        this.getUserDetails();
        this.dataSource.paginator = this.paginator;
        if (this.paginator.pageSize == undefined) {
            this.paginator.pageSize = this.pageSize;
        }
        var date = new Date();
        //date.setDate(date.getDate() - 7);
        this.Sdate = new FormControl(date);
        this.Edate = new FormControl(new Date());
        this.startdateVal = this.Sdate.value;
        this.enddateVal = this.Edate.value;
        this.OrdersToAppointmentsForm = this.formBuilder.group({
            Notes: ["", Validators.required],
            OrderRealDateTime: ["", Validators.required],
            PatientName: ["", Validators.required],
            PatientId: ["", Validators.required],
            OrderedToDepart: ["", Validators.required],
            OrderRangeQuantity: ["", null],
            AcceptedUserNotes: ["", null],
            AlertPatient: ["", null],
            OrderRangeType: ["1", null],
            OrderToDate: ["", Validators.required],
            OrderedFromDepart: ["", Validators.required],
            OrderStatus: ["0", Validators.required],
            AcceptedDateTime: ["", Validators.required],
            AcceptedUser: ["", Validators.required],
            OrderDateTime: [new Date(), Validators.required],
            OrderdUserPhone: ["", Validators.required],
            OrderdUser: [
                localStorage.getItem("loginUserName").toLowerCase(),
                Validators.required,
            ],
            RowId: ["0", false],
        });
        
        this.getOrdersToAppointments();
        let that = this;
        setInterval(function(){
            that.getOrdersToAppointments();
        }, 60 * 1000 * 5)
    }
    changeStatus(event) {
        //////debugger
        this.statusOrder = event.value;
    }
    onKey(value) {
        if (value == "") {
            this.selectedClinics = this.OutpatientClinics;
        } else {
            this.selectedClinics = this.search(value);
        }
        if (this.selectedClinics.length == 0) {
            this.selectedClinics = this.OutpatientClinics;
        }
    }
    search(value: string) {
        let filter = value.toLowerCase();
        return this.OutpatientClinics.filter(
            (option) =>
                (option.ClinicName + " " + option.RoomNumber)
                    .toLowerCase()
                    .indexOf(filter) != -1
        );
    }
    getPaginatorData(event: PageEvent) {

        this.getOrdersToAppointments();
    }
    editRow(content, _type, _element) {
        this.DateNowR = new Date();
        this.DateNow = formatDate(
            this.DateNowR ,
            "yyyy-MM-dd HH:mm",
            "en-US"
        );
        this.saveBtn = true;
        if(_element.OrderStatus != "0"){
            this.saveBtn = false;
        }else{
            this.saveBtn = true;
        }
        if (_element.OrderRangeQuantity == "0") {
            _element.OrderRangeQuantity = "";
        }
        if (this.Permission == "3") {
            if (_element.OrderStatus == "0") _element.OrderStatus = "1";
            _element.AcceptedUser = localStorage
                .getItem("loginUserName")
                .toLowerCase();
        }
        this.RowId = _element.RowId;
        this.OrderdUser = _element.OrderdUser;
        this.OrderdUserName = _element.OrderdUserName;
        this.OrderdUserPhone = _element.OrderdUserPhone;
        this.OrderDateTime = _element.OrderDateTime;
        this.AcceptedUser = _element.AcceptedUser;
        this.AcceptedUserCellNumber = _element.AcceptedUserCellNumber;
        this.AcceptedDateTime = _element.AcceptedDateTime;
        this.OrderStatus = _element.OrderStatus;
        this.OrderedFromDepart = _element.OrderedFromDepart;
        this.OrderToDate = _element.OrderToDate;
        this.OrderRangeType = _element.OrderRangeType;
        this.OrderRangeQuantity = _element.OrderRangeQuantity;
        this.OrderedToDepart = _element.OrderedToDepart;
        this.PatientId = _element.PatientId;
        this.PatientName = _element.PatientName;
        this.OrderRealDateTime = _element.OrderRealDateTime;
        this.Notes = _element.Notes;
        this.AcceptedUserNotes = _element.AcceptedUserNotes;
        this.AlertPatient = _element.AlertPatient;
        this.ClinicName = _element.ClinicName;
        var dateObject = null;
        if (
            _element.OrderRealDateTime != null &&
            _element.OrderRealDateTime != ""
        ) {
            var dateString = _element.OrderRealDateTime;
            var reggie = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/;
            var dateArray = reggie.exec(dateString);
            dateObject = new Date(
                +dateArray[3],
                +dateArray[2] - 1, // Careful, month starts at 0!
                +dateArray[1],
                +dateArray[4],
                +dateArray[5]
            );
        }
        let bol = false
        if(_element.AlertPatient == 'true'){
            bol = true;
        }       // //debugger
        if(_element.OrderRangeType != '' && _element.OrderRangeType != '0'){
            this.OrdersToAppointmentsForm = this.formBuilder.group({
                Notes: [_element.Notes, false],
                OrderRealDateTime: [dateObject, null],
                PatientName: [_element.PatientName, Validators.required],
                PatientId: [_element.PatientId, Validators.required],
                OrderedToDepart: [_element.OrderedToDepart, Validators.required],
                OrderRangeQuantity: [_element.OrderRangeQuantity, null],
                OrderRangeType: [_element.OrderRangeType, Validators.required],
                OrderToDate: [_element.OrderToDate, null],
                AcceptedUserNotes: [_element.AcceptedUserNotes, null],
                AlertPatient: [bol, null],
                OrderedFromDepart: [
                    _element.OrderedFromDepart,
                    Validators.required,
                ],
                OrderStatus: [_element.OrderStatus, Validators.required],
                AcceptedDateTime: [_element.AcceptedDateTime, null],
                AcceptedUser: [_element.AcceptedUser, null],
                OrderDateTime: [_element.OrderDateTime, Validators.required],
                OrderdUserPhone: [_element.OrderdUserPhone, Validators.required],
                OrderdUser: [_element.OrderdUser, Validators.required],
                RowId: [_element.RowId, false],
            });
        }else{
            this.OrdersToAppointmentsForm = this.formBuilder.group({
                Notes: [_element.Notes, false],
                OrderRealDateTime: [dateObject, null],
                PatientName: [_element.PatientName, Validators.required],
                PatientId: [_element.PatientId, Validators.required],
                OrderedToDepart: [_element.OrderedToDepart, Validators.required],
                OrderRangeQuantity: [_element.OrderRangeQuantity, null],
                OrderRangeType: [_element.OrderRangeType, null],
                AcceptedUserNotes: [_element.AcceptedUserNotes, null],
                AlertPatient: [bol, null],
                OrderToDate: [_element.OrderToDate, Validators.required],
                OrderedFromDepart: [
                    _element.OrderedFromDepart,
                    Validators.required,
                ],
                OrderStatus: [_element.OrderStatus, Validators.required],
                AcceptedDateTime: [_element.AcceptedDateTime, null],
                AcceptedUser: [_element.AcceptedUser, null],
                OrderDateTime: [_element.OrderDateTime, Validators.required],
                OrderdUserPhone: [_element.OrderdUserPhone, Validators.required],
                OrderdUser: [_element.OrderdUser, Validators.required],
                RowId: [_element.RowId, false],
            });
        } 
        
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                //////////////debugger
                if ("Save" == result) {
                    // ////////////debugger;
                    //this.saveChad(_element.ROW_ID);
                }
                this.OrderStatus = _element.OrderStatus = "0";
            },
            (reason) => {
                this.OrderStatus = _element.OrderStatus = "0";

            }
        );
    }
    applayRequerd(event) {
        // ////debugger
        if (event.value == "1" || event.value == 1) {
            this.OrdersToAppointmentsForm.get("OrderDateTime").setValidators(
                Validators.required
            );
            this.OrdersToAppointmentsForm.get(
                "OrderDateTime"
            ).updateValueAndValidity();
            //////debugger
        } else {
            this.OrdersToAppointmentsForm.get(
                "OrderDateTime"
            ).clearValidators();
            this.OrdersToAppointmentsForm.get(
                "OrderDateTime"
            ).updateValueAndValidity();
        }
    }
    open(content, _type, _element) {
        this.saveBtn = true;
        this.OrderStatus = "0";
        this.RowId = "0";
        this.OrderedFromDepart = this.UserDetails.Depart
        this.OrderdUserName = this.UserDetails.FirstName + " "+this.UserDetails.LastName 
        this.OrderdUserPhone = this.UserDetails.CellNumber
        this.OrdersToAppointmentsForm = this.formBuilder.group({
            Notes: ["", null],
            OrderRealDateTime: ["", null],
            PatientName: ["", Validators.required],
            PatientId: ["", Validators.required],
            OrderedToDepart: ["", Validators.required],
            OrderRangeQuantity: ["", null],
            OrderRangeType: ["", null],
            AcceptedUserNotes: ["", null],
            AlertPatient: ["", null],
            OrderToDate: ["", Validators.required],
            OrderedFromDepart: [this.UserDetails.Depart, Validators.required],
            OrderStatus: ["0", Validators.required],
            AcceptedDateTime: ["", null],
            AcceptedUser: ["", null],
            OrderDateTime: [new Date(), Validators.required],
            OrderdUserPhone: [this.UserDetails.CellNumber, Validators.required],
            OrderdUser: [
                localStorage.getItem("loginUserName").toLowerCase(),
                Validators.required,
            ],
            RowId: ["0", false],
        });
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                if ("Save" == result) {
                    // //////debugger;
                    //this.saveChad(_element.ROW_ID);
                }
            },
            (reason) => {}
        );
    }

    getOrdersToAppointments() {
        //////debugger
        this.startdateVal = formatDate(
            this.startdateVal,
            "yyyy-MM-dd",
            "en-US"
        );
        this.enddateVal = formatDate(
            this.enddateVal,
            "yyyy-MM-dd",
            "en-US"
        );
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // ////////////debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        // ////debugger
        this.http
            .post(
                environment.url + "GetOrdersToAppointments",
                //"http://srv-apps-prod/RCF_WS/WebService.asmx/GetOrdersToAppointments",
                {
                    user: localStorage.getItem("loginUserName"),
                    pageSize: this.paginator.pageSize,
                    pageIndex: this.paginator.pageIndex,
                    FromDate: this.startdateVal,
                    Status: this.statusOrder,
                    ToDate: this.enddateVal,
                    calendarNumber: this.calendarNumber,
                    requestingName: this.requestingName,
                }
            )
            .subscribe((Response) => {
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                //////debugger
                var json = Response["d"];
                if (json.length == 0) {
                    this.dataSource = new MatTableDataSource<any>(
                        this.TABLE_DATA
                    );
                    this.resultsLength = 0;
                } else if (json[0].OrderStatus == null) {
                    this.dataSource = new MatTableDataSource<any>(
                        this.TABLE_DATA
                    );
                    this.resultsLength = 0;
                    this.Permission = json[0].Permission;
                } else {
                    this.TABLE_DATA = json;
                    this.Permission = json[0].Permission;
                    this.dataSource = new MatTableDataSource<any>(
                        this.TABLE_DATA
                    );
                    this.resultsLength = this.TABLE_DATA[0]["totalRows"];
                }
                if (this.Permission == "" || this.Permission == null) {
                    this.router.navigate(["login"]);
                }
                
                setTimeout(function () {
                    //////////////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }
    getOutpatientClinics() {
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // ////////////debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        // ////debugger
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/selectOutpatientClinic",
                {
                    user: localStorage.getItem("loginUserName"),
                }
            )
            .subscribe((Response) => {
                var json = Response["d"];
                this.OutpatientClinics = this.selectedClinics = json;
                //////debugger
                setTimeout(function () {
                    //////////////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }
    findPatient(event) {
        if (event.srcElement.value == "") {
            return;
        }
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // ////////////debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        // ////debugger
        this.http
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/findPatientByID", {
                PatientId: event.srcElement.value,
            })
            .subscribe((Response) => {
                var json = Response["d"];
                // ////debugger
                // this.OrdersToAppointmentsForm.value.PatientName  = json;
                this.OrdersToAppointmentsForm.patchValue({
                    PatientName: json,
                });
                this.OrdersToAppointmentsForm.value.PatientName = json;

                this.OrdersToAppointmentsForm.get(
                    "PatientName"
                ).updateValueAndValidity();
                //////debugger
                setTimeout(function () {
                    //////////////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }
    changeReq(event){
        if (
            event.srcElement.value != "" 
        ) {
            this.OrdersToAppointmentsForm.get("OrderToDate").setValidators(
                Validators.required
            );
            this.OrdersToAppointmentsForm.get(
                "OrderToDate"
            ).updateValueAndValidity();

            this.OrdersToAppointmentsForm.get(
                "OrderRangeType"
            ).clearValidators();
            this.OrdersToAppointmentsForm.get(
                "OrderRangeType"
            ).updateValueAndValidity();
            //////debugger
        } else {
            this.OrdersToAppointmentsForm.get(
                "OrderToDate"
            ).clearValidators();
            this.OrdersToAppointmentsForm.get(
                "OrderToDate"
            ).updateValueAndValidity();

            this.OrdersToAppointmentsForm.get("OrderRangeType").setValidators(
                Validators.required
            );
            this.OrdersToAppointmentsForm.get(
                "OrderRangeType"
            ).updateValueAndValidity();
        }
    }
    printModal(){
        this.modalService.dismissAll();
        window.print();
    }
    checkValue(event) {
        //////debugger;
        if (
            event.srcElement.value != "" &&
            event.srcElement.value != "0" &&
            event.srcElement.value != 0
        ) {
            this.OrdersToAppointmentsForm.get("OrderRangeType").setValidators(
                Validators.required
            );
            this.OrdersToAppointmentsForm.get(
                "OrderRangeType"
            ).updateValueAndValidity();

            this.OrdersToAppointmentsForm.get(
                "OrderToDate"
            ).clearValidators();
            this.OrdersToAppointmentsForm.get(
                "OrderToDate"
            ).updateValueAndValidity();
            //////debugger
        } else {
            this.OrdersToAppointmentsForm.get(
                "OrderRangeType"
            ).clearValidators();
            this.OrdersToAppointmentsForm.get(
                "OrderRangeType"
            ).updateValueAndValidity();

            this.OrdersToAppointmentsForm.get("OrderToDate").setValidators(
                Validators.required
            );
            this.OrdersToAppointmentsForm.get(
                "OrderToDate"
            ).updateValueAndValidity();
        }
    }
    getUserDetails() {
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // ////////////debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        // ////debugger
        this.http
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/selectUserDetails", {
                user: localStorage.getItem("loginUserName"),
            })
            .subscribe((Response) => {
                var json = Response["d"];
                this.UserDetails = json;
              //  //debugger
                setTimeout(function () {
                    //////////////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    openSnackBar() {
        this._snackBar.open("נשמר בהצלחה", "", {
            duration: 2500,
            direction: "rtl",
            panelClass: "success",
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
    onSubmit() {
        //debugger
        if(this.OrdersToAppointmentsForm.value.OrderStatus == '1' && (this.OrdersToAppointmentsForm.value.OrderRealDateTime == "" || this.OrdersToAppointmentsForm.value.OrderRealDateTime == null)){
            this._snackBar.open("תאריך ושעת תור בפועל שדה חובה!!", "", {
                duration: 2500,
                direction: "rtl",
                panelClass: "error",
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
            });
            return;
        }
        if (this.OrdersToAppointmentsForm.invalid) {
            return;
        }
        if (
            this.OrdersToAppointmentsForm.value.OrderToDate != "" &&
            this.OrdersToAppointmentsForm.value.OrderToDate != null &&
            typeof this.OrdersToAppointmentsForm.value.OrderToDate != "string"
        ) {
            this.OrdersToAppointmentsForm.value.OrderToDate = formatDate(
                this.OrdersToAppointmentsForm.value.OrderToDate,
                "yyyy-MM-dd",
                "en-US"
            );
        }
        ////debugger
        if (
            this.OrdersToAppointmentsForm.value.OrderRealDateTime != "" &&
            this.OrdersToAppointmentsForm.value.OrderRealDateTime != null &&
            typeof this.OrdersToAppointmentsForm.value.OrderRealDateTime != "string"
        ) {
            this.OrdersToAppointmentsForm.value.OrderRealDateTime = formatDate(
                this.OrdersToAppointmentsForm.value.OrderRealDateTime.getTime(),
                "yyyy-MM-dd HH:mm",
                "en-US"
            );
        }
        if (
            this.OrdersToAppointmentsForm.value.OrderDateTime != "" &&
            this.OrdersToAppointmentsForm.value.OrderDateTime != null &&
            typeof this.OrdersToAppointmentsForm.value.OrderDateTime != "string"
        ) {
            this.OrdersToAppointmentsForm.value.OrderDateTime = formatDate(
                this.OrdersToAppointmentsForm.value.OrderDateTime.getTime(),
                "yyyy-MM-dd HH:mm:ss",
                "en-US"
            );
        }else if (typeof this.OrdersToAppointmentsForm.value.OrderDateTime == "string"){
            var dateString = this.OrdersToAppointmentsForm.value.OrderDateTime;
            var reggie = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/;
            var dateArray = reggie.exec(dateString);
            this.OrdersToAppointmentsForm.value.OrderDateTime = new Date(
                +dateArray[3],
                +dateArray[2] - 1, // Careful, month starts at 0!
                +dateArray[1],
                +dateArray[4],
                +dateArray[5]
            );
            this.OrdersToAppointmentsForm.value.OrderDateTime = formatDate(
                this.OrdersToAppointmentsForm.value.OrderDateTime.getTime(),
                "yyyy-MM-dd HH:mm:ss",
                "en-US"
            );
        }
        this.OrdersToAppointmentsForm.value.AlertPatient = (this.OrdersToAppointmentsForm.value.AlertPatient).toString()
        //debugger
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // ////////////debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        ////debugger
        this.http
            .post(
                //"http://srv-apps-prod/RCF_WS/WebService.asmx/insertOrUpdateRowDataOrdersToAppointments",
                "http://srv-apps-prod/RCF_WS/WebService.asmx/insertOrUpdateRowDataOrdersToAppointments",
                {
                    dataToSubmit: this.OrdersToAppointmentsForm.value,
                }
            )
            .subscribe((Response) => {
                this.getOrdersToAppointments();

                this.modalService.dismissAll();
                //////////////debugger
                let that = this;
                setTimeout(function () {
                    that.openSnackBar();
                    $("#loader").addClass("d-none");
                });
            });
    }
}
