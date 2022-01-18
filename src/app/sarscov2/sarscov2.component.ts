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
import { Time } from "@angular/common";
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
} from "@angular/forms";
export interface TableRow {
    PatientID: string;
    EmployeePhone: string;
    EmployeeFirstName: string;
    EmployeeLastName: string;
    EmployeeGender: string;
    EmployeeDob: string;
    EmployeeWorkPlace: string;
    EmployeeKupatHolem: string;
    RowID: string;
    TestSampleDate: string;
    ForWhatPurposeQuestion: string;
    HaveYouCheckedQuestion: string;
    TestDateCorona_1: string;
    TestDateCorona_2: string;
    TestDateCorona_3: string;
    HaveAnySymptomsQuestion: string;
    HaveAnySymptomsNoteQuestion: string;
    HaveBeenVaccinatedQuestion: string;
    DoseDate_1: string;
    DoseDate_2: string;
    DoseCompany: string;
    DateTimeInsert: string;
    RowStatus: string;
    TestResultCorona_1: string;
    TestResultCorona_2: string;
    TestResultCorona_3: string;
    DoseAnotherCompany: string;
    AreYouDealingWithAnyStateOfImmunosuppression: string;
}

@Component({
    selector: "app-sarscov2",
    templateUrl: "./sarscov2.component.html",
    styleUrls: ["./sarscov2.component.css"],
})
export class Sarscov2Component implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    displayedColumns: string[] = [
        // 'ROW_ID',
        "PatientID",
        "EmployeeFirstName",
        "EmployeeLastName",
        "EmployeeGender",
        "EmployeeDob",
        "EmployeeWorkPlace",
        "EmployeeKupatHolem",
        "CLICK",
        // "CLICK_TO_RELEASE",
    ];
    HaveYouChecked: Boolean;
    coronaToShowResults: Boolean;
    HaveAnySymptomsQuestionYes: Boolean;
    HaveBeenVaccinatedQuestionYes: Boolean;
    DoseCompany: Boolean;
    modalOptions: NgbModalOptions;
    closeResult: string;
    TABLE_DATA: TableRow[] = [];
    rowFormData = {} as TableRow;
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    tableLoader: Boolean;
    resultsLength = 0;
    fliterVal = "";
    sarsForm: FormGroup;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        public fb: FormBuilder,
        private formBuilder: FormBuilder
    ) {
        this.sarsForm = this.fb.group({
            PatientID: ["", null],
            TestSampleDate: ["", null],
            ForWhatPurposeQuestion: ["", null],
            HaveYouCheckedQuestion: ["", null],
            TestDateCorona_1: ["", null],
            TestDateCorona_2: ["", null],
            HaveAnySymptomsQuestion: ["", null],
            HaveAnySymptomsNoteQuestion: ["", null],
            HaveBeenVaccinatedQuestion: ["", null],
            DoseDate_1: ["", null],
            DoseDate_2: ["", null],
            DoseCompany: ["", null],
            DateTimeInsert: ["", null],
            RowStatus: ["", null],
            TestResultCorona_1: ["", null],
            TestResultCorona_2: ["", null],
            DoseAnotherCompany: ["", null],
            AreYouDealingWithAnyStateOfImmunosuppression: ["", null],
        });
    }
    startdateVal: string;
    enddateVal: string;
    Sdate;
    Edate;
    ngOnInit() {
        this.HaveYouChecked = false;
        this.coronaToShowResults = false;
        this.HaveAnySymptomsQuestionYes = false;
        this.HaveBeenVaccinatedQuestionYes = false;
        this.DoseCompany = false;
        this.loader = false;
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);
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
            localStorage.getItem("loginUserName").toLowerCase() ==
                "jmassalha" ||
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
        //     //debugger
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
    applyFilter(filterValue: string) {
        this.fliterVal = filterValue;
        if (this.startdateVal && this.enddateVal) {
            this.getTableFromServer(
                this.startdateVal,
                this.enddateVal,
                this.paginator.pageIndex,
                this.paginator.pageSize,
                this.fliterVal
            );
        }
        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    open(content, _type, _element) {
        this.rowFormData = _element;
        if (this.rowFormData.HaveYouCheckedQuestion == "1") {
            this.HaveYouChecked = true;
        }else{
            this.HaveYouChecked = false;
        }

        if (
            this.rowFormData.TestResultCorona_1 == "1" ||
            this.rowFormData.TestResultCorona_2 == "1"
        ) {
            this.coronaToShowResults = true;
        }else{
            this.coronaToShowResults = false;
        }
        if (this.rowFormData.HaveAnySymptomsQuestion == "1") {
            this.HaveAnySymptomsQuestionYes = true;
        }else{
            this.HaveAnySymptomsQuestionYes = false;
        }
        if (this.rowFormData.HaveBeenVaccinatedQuestion == "1") {
            this.HaveBeenVaccinatedQuestionYes = true;
        }else{
            this.HaveBeenVaccinatedQuestionYes = false;
        }
        if (this.rowFormData.DoseCompany == "אחר") {
            this.DoseCompany = true;
        }else{
            this.DoseCompany = false;
        }
        debugger
        this.sarsForm = this.fb.group({
            PatientID: [
                { value: this.rowFormData.PatientID, disabled: true },
                null,
            ],
            TestSampleDate: [
                { value: this.rowFormData.TestSampleDate, disabled: true },
                null,
            ],
            ForWhatPurposeQuestion: [
                {
                    value: this.rowFormData.ForWhatPurposeQuestion,
                    disabled: true,
                },
                null,
            ],
            HaveYouCheckedQuestion: [
                {
                    value: this.rowFormData.HaveYouCheckedQuestion,
                    disabled: true,
                },
                null,
            ],
            TestDateCorona_1: [
                { value: this.rowFormData.TestDateCorona_1, disabled: true },
                null,
            ],
            TestDateCorona_2: [
                { value: this.rowFormData.TestDateCorona_2, disabled: true },
                null,
            ],
            TestDateCorona_3: [
                { value: this.rowFormData.TestDateCorona_3, disabled: true },
                null,
            ],
            HaveAnySymptomsQuestion: [
                {
                    value: this.rowFormData.HaveAnySymptomsQuestion,
                    disabled: true,
                },
                null,
            ],
            HaveAnySymptomsNoteQuestion: [
                {
                    value: this.rowFormData.HaveAnySymptomsNoteQuestion,
                    disabled: true,
                },
                null,
            ],
            HaveBeenVaccinatedQuestion: [
                {
                    value: this.rowFormData.HaveBeenVaccinatedQuestion,
                    disabled: true,
                },
                null,
            ],
            DoseDate_1: [
                { value: this.rowFormData.DoseDate_1, disabled: true },
                null,
            ],
            DoseDate_2: [
                { value: this.rowFormData.DoseDate_2, disabled: true },
                null,
            ],
            DoseCompany: [
                { value: this.rowFormData.DoseCompany, disabled: true },
                null,
            ],
            DateTimeInsert: [
                { value: this.rowFormData.DateTimeInsert, disabled: true },
                null,
            ],
            RowStatus: [
                { value: this.rowFormData.RowStatus, disabled: true },
                null,
            ],
            TestResultCorona_1: [
                { value: this.rowFormData.TestResultCorona_1, disabled: true },
                null,
            ],
            TestResultCorona_2: [
                { value: this.rowFormData.TestResultCorona_2, disabled: true },
                null,
            ],
            TestResultCorona_3: [
                { value: this.rowFormData.TestResultCorona_3, disabled: true },
                null,
            ],
            DoseAnotherCompany: [
                { value: this.rowFormData.DoseAnotherCompany, disabled: true },
                null,
            ],
            AreYouDealingWithAnyStateOfImmunosuppression: [
                { value: this.rowFormData.AreYouDealingWithAnyStateOfImmunosuppression, disabled: true },
                null,
            ],
        });
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                ////debugger
                if ("Save" == result) {
                    // //debugger;
                    //this.saveChad(_element.ROW_ID);
                }
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
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
    toShortFormat(d: Date) {
        ////debugger;
        let monthNames = [
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
        ];

        let day = d.getDate();

        let monthIndex = d.getMonth();
        let monthName = monthNames[monthIndex];

        let year = d.getFullYear();
        ////debugger
        return `${day}/${monthName}/${year}`;
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
    releaseRow(row) {}
    public printRowForm(): void {
        // debugger

        //debugger

        $("#loader").removeClass("d-none");
        /*if (row.CS_SURVEY_Q2_2 == "Invalid Date") {
            row.CS_SURVEY_Q2_2 = "";
            //debugger
        }*/

        setTimeout(function () {
            $("#loader").addClass("d-none");
            window.print();
        }, 1500);
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
            // //debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        this.http
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetAllSarscov2", {
                _fromDate: _startDate,
                _toDate: _endDate,
                _pageIndex: _pageIndex,
                _pageSize: _pageSize,
                _FreeText: _FreeText,
            })
            .subscribe((Response) => {
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                var json = JSON.parse(Response["d"]);
                let json_2 = JSON.parse(json);
                let SarsData = JSON.parse(json_2["aaData"]);
                // debugger;
                for (var i = 0; i < SarsData.length; i++) {
                    debugger
                    this.TABLE_DATA.push({
                        PatientID: SarsData[i].PatientID,
                        EmployeePhone: SarsData[i].EmployeePhone,
                        EmployeeFirstName: SarsData[i].EmployeeFirstName,
                        EmployeeLastName: SarsData[i].EmployeeLastName,
                        EmployeeGender: SarsData[i].EmployeeGender,
                        EmployeeDob: SarsData[i].EmployeeDob,
                        EmployeeWorkPlace: SarsData[i].EmployeeWorkPlace,
                        EmployeeKupatHolem: SarsData[i].EmployeeKupatHolem,
                        RowID: SarsData[i].RowID,
                        TestSampleDate: SarsData[i].TestSampleDate,
                        ForWhatPurposeQuestion:
                            SarsData[i].ForWhatPurposeQuestion,
                        HaveYouCheckedQuestion:
                            SarsData[i].HaveYouCheckedQuestion,
                        TestDateCorona_1: SarsData[i].TestDateCorona_1,
                        TestDateCorona_2: SarsData[i].TestDateCorona_2,
                        TestDateCorona_3: SarsData[i].TestDateCorona_3,
                        HaveAnySymptomsQuestion:
                            SarsData[i].HaveAnySymptomsQuestion,
                        HaveAnySymptomsNoteQuestion:
                            SarsData[i].HaveAnySymptomsNoteQuestion,
                        HaveBeenVaccinatedQuestion:
                            SarsData[i].HaveBeenVaccinatedQuestion,
                        DoseDate_1: SarsData[i].DoseDate_1,
                        DoseDate_2: SarsData[i].DoseDate_2,
                        DoseCompany: SarsData[i].DoseCompany,
                        DateTimeInsert: SarsData[i].DateTimeInsert,
                        RowStatus: SarsData[i].RowStatus,
                        TestResultCorona_1: SarsData[i].TestResultCorona_1,
                        TestResultCorona_2: SarsData[i].TestResultCorona_2,
                        TestResultCorona_3: SarsData[i].TestResultCorona_3,
                        DoseAnotherCompany: SarsData[i].DoseAnotherCompany,
                        AreYouDealingWithAnyStateOfImmunosuppression: SarsData[i].AreYouDealingWithAnyStateOfImmunosuppression,
                    });
                }

                // //debugger
                this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                this.resultsLength = parseInt(
                    JSON.parse(json_2["iTotalRecords"])
                );
                setTimeout(function () {
                    ////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }
}
