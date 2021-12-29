import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
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
import * as Fun from "../public.functions";
import { DatePipe, Time } from "@angular/common";
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
} from "@angular/forms";
export interface TableRow {
    SurgeryID?: string;
    PatientId?: string;
    PatientNumber?: string;
    PatientFirstName?: string;
    PatientLastName?: string;
    SurgeryScheduledDate?: string;
    SurgeryScheduledTime?: string;
    SurgeryDoneDate?: string;
    SurgeryDoneTime?: string;
    CaseNumber?: string;
    Depart?: string;
    Note?: string;
    UserAdded?: string;
    UpdatedUser?: string;
    SurgeryName?: string;
    SurgeryCode?: string;
    SurgeryRoom?: string;
}
export interface rowListToHolde{
    SurgeryIdToHolde?: string;
    PatientNumberToHolde?: string;
    SurgeryCodeToHolde?: string;
    SurgeryNameToHolde?: string;
    SurgeryDepartToHolde?: string;
    SurgeryDateToHolde?: string;
    SurgeryTimeToHolde?: string;
    Depart?: string;
    Room?: string;
}
@Component({
    selector: "app-urgent-surgeries",
    templateUrl: "./urgent-surgeries.component.html",
    styleUrls: ["./urgent-surgeries.component.css"],
})
export class UrgentSurgeriesComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    displayedColumnsList: string[] = [
        "SurgeryID",
        "PatientNumber",
        "SurgeryCode",
        "SurgeryName",
        "Depart",
        "Room",
        "SurgeryScheduledDate",
        "SurgeryScheduledTime",
        "CLICK",
    ];
    displayedColumns: string[] = [
        "CaseNumber",
        "Depart",
        "SurgeryName",
        "SurgeryCode",
        "PatientId",
        "PatientFirstName",
        "PatientLastName",
        "SurgeryScheduledDate",
        "SurgeryScheduledTime",
        "SurgeryDoneDate",
        "SurgeryDoneTime",
        "Note",
        "CLICK",
    ];
    CaseNumber: string = "";
    SurgeryID: string = "";
    modalOptions: NgbModalOptions;
    closeResult: string;
    TABLE_DATA_FOR_TODY: TableRow[] = [];
    TABLE_DATA: TableRow[] = [];
    ListToHolde: rowListToHolde[] = [];
    rowFormData = {} as TableRow;
    dataSourceForToday = new MatTableDataSource(this.TABLE_DATA_FOR_TODY);
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    tableLoader: Boolean;
    resultsLength = 0;
    fliterVal = "";
    noteForm: FormGroup;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        public fb: FormBuilder,
        private formBuilder: FormBuilder,
        private datePipe: DatePipe
    ) {
        this.noteForm = this.fb.group({
            SurgeryID: ["", null],
            CaseNumber: ["", null],
            Note: ["", null],
            Type: ["new", null],
            User: [localStorage.getItem("loginUserName"), null],
        });
    }
    startdateVal: string;
    enddateVal: string;
    Sdate;
    Edate;
    ngOnInit() {
        this.loader = false;
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);
        this.dataSourceForToday = new MatTableDataSource(this.TABLE_DATA_FOR_TODY);
        let dateIn = new Date();
        dateIn.setDate(dateIn.getDate() - 1);
        this.Sdate = new FormControl(dateIn);
        this.Edate = new FormControl(new Date());
        this.startdateVal = this.Sdate.value;
        this.enddateVal = this.Edate.value;
        if (
            localStorage.getItem("loginState") != "true" ||
            localStorage.getItem("loginUserName") == ""
        ) {
            this.router.navigate(["login"]);
        } else if (
            localStorage.getItem("loginUserName").toLowerCase() == "jmassalha" ||
            localStorage.getItem("loginUserName").toLowerCase() == "samer" ||
            localStorage.getItem("loginUserName").toLowerCase() == "owertheim"
        ) {
        } else {
            //this.router.navigate(["login"]);
            ///$("#chadTable").DataTable();
        }
        //this.dataSource = new MatTableDataSource(this.TABLE_DATA);
        //console.log(this.paginator.pageIndex);
        // $(document).on('submit', '#sendForm', function(e){
        //     ////debugger
        // })
        this.getTableFromServer(
            this.startdateVal,
            this.enddateVal,
            this.paginator.pageIndex,
            50,
            this.fliterVal
        );
    }
    openSnackBar() {
        this._snackBar.open("נשלח בהצלחה", "", {
            duration: 2500,
            direction: "rtl",
            panelClass: "success",
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

    openSnackBarError() {
        this._snackBar.open("לא נבח ניתוח לדחות...!", "", {
            duration: 2500,
            direction: "rtl",
            panelClass: "error",
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
    getReport($event: any): void {
        if (this.startdateVal && this.enddateVal)
            this.getTableFromServer(
                this.startdateVal,
                this.enddateVal,
                this.paginator.pageIndex,
                this.paginator.pageSize,
                this.fliterVal
            );
    }
    add(element:TableRow){
        var index = this.ListToHolde.findIndex(x => x.SurgeryIdToHolde == element.SurgeryID); 
        // here you can check specific property for an object whether it exist in your array or not
        var mrowListToHolde = {} as rowListToHolde;
        //debugger
        mrowListToHolde.SurgeryIdToHolde =  element.SurgeryID;
        mrowListToHolde.PatientNumberToHolde = element.PatientNumber ;
        mrowListToHolde.SurgeryCodeToHolde = element.SurgeryCode ;
        mrowListToHolde.SurgeryNameToHolde = element.SurgeryName ;
        mrowListToHolde.SurgeryDepartToHolde = element.Depart ;
        mrowListToHolde.SurgeryDateToHolde = element.SurgeryScheduledDate ;
        mrowListToHolde.SurgeryTimeToHolde = element.SurgeryScheduledTime ;
        mrowListToHolde.Depart = element.Depart ;
        mrowListToHolde.Room = element.SurgeryRoom ;
        index === -1 ? this.ListToHolde.push(mrowListToHolde) : console.log("object already exists");
    }
    applyFilter(filterValue: string) {
        // filterValue = filterValue.trim(); // Remove whitespace
        // filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSourceForToday.filter = filterValue;
    }

    open(content, _type, _element) {
        this.ListToHolde = [];
        $("#loader").removeClass("d-none");
        this.GetSurgeriesListForToday(_element.SurgeryScheduledDate) ;
        this.CaseNumber = _element.CaseNumber;
        this.SurgeryID = _element.SurgeryID;
        var type = "update";
        if (_element.UserAdded == null || _element.UserAdded == "") {
            type = "new";
        }
        ////debugger
        this.noteForm = this.fb.group({
            SurgeryID: [_element.SurgeryID, null],
            CaseNumber: [_element.CaseNumber, null],
            Note: [_element.Note, Validators.required],
            Type: [type, null],
            User: [localStorage.getItem("loginUserName"), null],
        });
        this.http
            .post(
                "https://srv-apps:4433/WebService.asmx/GetUrgentSurgeriesToHold",
                //"https://srv-apps:4433/WebService.asmx/GetUrgentSurgeriesToHold",
                {
                    SurgeryID: this.SurgeryID,
                }
            )
            .subscribe((Response) => {
                this.ListToHolde = Response["d"];
                this.modalService.open(content, this.modalOptions).result.then(
                    (result) => {
                        this.closeResult = `Closed with: ${result}`;
                        //////debugger
                        if ("Save" == result) {
                            // ////debugger;
                            //this.saveChad(_element.ROW_ID);
                        }
                    },
                    (reason) => {
                        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                    }
                );
                setTimeout(function () {
                    $("#loader").addClass("d-none");
                });
            });
        
    }
    openSurgeriesList(content, _type, _element) {
        //this.ListToHolde
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                //////debugger
                if ("Save" == result) {
                    // ////debugger;
                    //this.saveChad(_element.ROW_ID);
                }
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }
    onSubmit() {
        if (this.noteForm.invalid || this.ListToHolde.length == 0) {
            if(this.ListToHolde.length == 0)
                this.openSnackBarError();
            return;
        }
        //////debugger
        setTimeout(function () {
            $("#loader").removeClass("d-none");
        });
        this.http
            .post(
                "https://srv-apps:4433/WebService.asmx/UrgentSurgeriesSubmitNote",
                //"https://srv-apps:4433/WebService.asmx/UrgentSurgeriesSubmitNote",
                {
                    _noteForm: this.noteForm.value,
                    ListToHolde: this.ListToHolde,
                }
            )
            .subscribe((Response) => {
                this.getTableFromServer(
                    this.startdateVal,
                    this.enddateVal,
                    this.paginator.pageIndex,
                    this.paginator.pageSize,
                    this.fliterVal
                );
                this.openSnackBar();
                setTimeout(function () {
                    $("#loader").addClass("d-none");
                });
            });
        // display form values on success
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.maternityForm.value, null, 4));
        this.modalService.dismissAll();
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

    ngAfterViewInit(): void {}
    getPaginatorData(event: PageEvent) {
        //console.log(this.paginator.pageIndex);
        if (this.startdateVal && this.enddateVal) {
            this.getTableFromServer(
                this.startdateVal,
                this.enddateVal,
                this.paginator.pageIndex,
                this.paginator.pageSize,
                this.fliterVal
            );
        }
    }

    public getTableFromServer(
        _startDate: string,
        _endDate: string,
        _pageIndex: number,
        _pageSize: number,
        _FreeText: string
    ) {
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // ////debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        this.http
            .post("https://srv-apps:4433/WebService.asmx/GetAllEmergencySurgeriesApp", {
            //.post("https://srv-apps:4433/WebService.asmx/GetAllEmergencySurgeriesApp",{
                    _fromDate: _startDate,
                    _toDate: _endDate,
                    _pageIndex: _pageIndex,
                    _pageSize: _pageSize,
                    _FreeText: _FreeText,
                }
            )
            .subscribe((Response) => {
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                var json = JSON.parse(Response["d"]);
                let json_2 = JSON.parse(json);
                let SarsData = JSON.parse(json_2["aaData"]);
                // //debugger;
                for (var i = 0; i < SarsData.length; i++) {
                    this.TABLE_DATA.push({
                        SurgeryID: SarsData[i].SurgeryID,
                        PatientId: SarsData[i].PatientId,
                        PatientNumber: SarsData[i].PatientNumber,
                        PatientFirstName: SarsData[i].PatientFirstName,
                        PatientLastName: SarsData[i].PatientLastName,
                        SurgeryScheduledDate: SarsData[i].SurgeryScheduledDate,
                        SurgeryScheduledTime: SarsData[i].SurgeryScheduledTime,
                        SurgeryDoneDate: SarsData[i].SurgeryDoneDate,
                        SurgeryDoneTime: SarsData[i].SurgeryDoneTime,
                        CaseNumber: SarsData[i].CaseNumber,
                        Depart: SarsData[i].Depart,
                        Note: SarsData[i].Note,
                        UserAdded: SarsData[i].UserAdded,
                        UpdatedUser: SarsData[i].UpdatedUser,
                        SurgeryName: SarsData[i].SurgeryName,
                        SurgeryCode: SarsData[i].SurgeryCode,
                    });
                }

                // ////debugger
                this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                this.resultsLength = parseInt(
                    JSON.parse(json_2["iTotalRecords"])
                );
                setTimeout(function () {
                    //////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }
    public deleteFromList(index: any){
       // //debugger
         this.ListToHolde.splice(index, index+1);
         
    }
    public GetSurgeriesListForToday(date: any) {
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // ////debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        var d = date.split("-");
        date = d[2]+"-"+d[1]+"-"+d[0];
        this.http
            .post("https://srv-apps:4433/WebService.asmx/GetSurgeriesListForToday", {
            //.post("https://srv-apps:4433/WebService.asmx/GetSurgeriesListForToday",{
                    date: date
                }
            )
            .subscribe((Response) => {
                this.TABLE_DATA_FOR_TODY.splice(0, this.TABLE_DATA_FOR_TODY.length);
                var json = JSON.parse(Response["d"]);
               // let json_2 = JSON.parse(json);
                let SarsData = JSON.parse(json["aaData"]);
                // //debugger;
                for (var i = 0; i < SarsData.length; i++) {
                    this.TABLE_DATA_FOR_TODY.push({
                        SurgeryID: SarsData[i].SurgeryID,
                        PatientNumber: SarsData[i].PatientNumber,
                        SurgeryScheduledDate: SarsData[i].SurgeryScheduledDate,                        
                        SurgeryScheduledTime: SarsData[i].SurgeryScheduledTime,
                        Depart: SarsData[i].Depart,
                        SurgeryRoom: SarsData[i].SurgeryRoom,
                        SurgeryName: SarsData[i].SurgeryName,
                        SurgeryCode: SarsData[i].SurgeryCode,
                    });
                }
                this.dataSourceForToday = new MatTableDataSource<any>(this.TABLE_DATA_FOR_TODY);               
                setTimeout(function () {
                    //////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }
}
