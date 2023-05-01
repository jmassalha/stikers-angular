import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatRadioChange } from "@angular/material/radio";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
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
import { MenuPerm } from "../menu-perm";

export interface Covid {
    CS_ROW_ID: number;
    CS_SMS_ID: string;
    CS_PATIENT_NUMBER: string;
    CS_PATIENT_NAME: string;
    CS_PATIENT_ID: string;
    CS_PATIENT_GENDER: string;
    CS_SURVEY_DATE: Date;
    CS_SURVEY_Q1_1: string;
    CS_SURVEY_Q1_2: string;
    CS_SURVEY_Q1_3: string;
    CS_SURVEY_Q1_4: string;
    CS_SURVEY_Q1_5: string;
    CS_SURVEY_Q1_6: string;
    CS_SURVEY_Q1_7: string;
    CS_SURVEY_Q1_8: string;
    CS_SURVEY_Q1_9: string;
    CS_SURVEY_Q1_10: string;
    CS_SURVEY_Q1_11: string;
    CS_SURVEY_Q1_12: string;
    CS_SURVEY_Q2_1: string;
    CS_SURVEY_Q2_2: Date;
    CS_SURVEY_Q3: string;
    CS_SURVEY_Q4_1: string;
    CS_SURVEY_Q4_2: string;
    CS_SURVEY_Q4_3: string;
    CS_SURVEY_Q4_4: Date;
    CS_ROW_STATUS: string;
    CS_ROW_COLOR: string;
    CS_LANG: string;
    CS_TIME: string;
    CS_DATE: string;
    CS_DATETIME: string;
    //D_DOC_ANSWER: string;
}
@Component({
    selector: "app-coronaform",
    templateUrl: "./coronaform.component.html",
    styleUrls: ["./coronaform.component.css"],
})
export class CoronaformComponent implements OnInit, AfterViewInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    displayedColumns: string[] = [
        // 'ROW_ID',
        "CS_DATETIME",
        "CS_PATIENT_ID",
        "CS_PATIENT_NAME",
        "CS_ROW_STATUS",
        "CS_CLICK",
    ];
    Checked_Yes_CS_SURVEY_Q2_1: Boolean;
    Checked_No_CS_SURVEY_Q2_1: Boolean;
    Checked_Yes_CS_SURVEY_Q3: Boolean;
    Checked_No_CS_SURVEY_Q3: Boolean;
    Checked_Yes_CS_SURVEY_Q4_1: Boolean;
    Checked_No_CS_SURVEY_Q4_1: Boolean;
    Checked_Yes_CS_SURVEY_Q4_2: Boolean;
    Checked_No_CS_SURVEY_Q4_2: Boolean;
    Checked_Yes_CS_SURVEY_Q4_3: Boolean;
    Checked_No_CS_SURVEY_Q4_3: Boolean;
    modalOptions: NgbModalOptions;
    closeResult: string;
    TABLE_DATA: Covid[] = [];
    rowFormData = {} as Covid;
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    tableLoader: Boolean;
    resultsLength = 0;
    fliterVal = "";
    registerForm: FormGroup;
    submitted = false;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private mMenuPerm: MenuPerm
    ) {
        mMenuPerm.setRoutName("coronaform");
        setTimeout(() => {
            if(!mMenuPerm.getHasPerm()){
                localStorage.clear();
                this.router.navigate(["login"]);
            }
        }, 2000);}
    startdateVal: string;
    enddateVal: string;
    Sdate: FormControl;
    Edate: FormControl;
    fullnameVal: string;
    idPatient: string;
    phoneNumber: string;
    ngOnInit() {
        this.fullnameVal = "";
        this.idPatient = "";
        this.phoneNumber = "";
        this.loader = false;
        this.Checked_Yes_CS_SURVEY_Q2_1 = false;
        this.Checked_No_CS_SURVEY_Q2_1 = false;
        this.Checked_No_CS_SURVEY_Q3 = false;
        this.Checked_Yes_CS_SURVEY_Q3 = false;
        this.Checked_No_CS_SURVEY_Q4_1 = false;
        this.Checked_Yes_CS_SURVEY_Q4_1 = false;
        this.Checked_No_CS_SURVEY_Q4_2 = false;
        this.Checked_Yes_CS_SURVEY_Q4_2 = false;
        this.Checked_No_CS_SURVEY_Q4_3 = false;
        this.Checked_Yes_CS_SURVEY_Q4_3 = false;
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);
        let dateIn = new Date();
        dateIn.setDate(dateIn.getDate() - 1);
        this.Sdate = new FormControl(dateIn);
        this.Edate = new FormControl(new Date());
        this.startdateVal = this.Sdate.value;
        this.enddateVal = this.Edate.value;
        this.registerForm = this.formBuilder.group({
            fullnameVal: ["", Validators.required],
            idPatient: ["", Validators.required],
            phoneNumber: ["", Validators.required],
        });

        //this.dataSource = new MatTableDataSource(this.TABLE_DATA);
        //console.log(this.paginator.pageIndex);
        // $(document).on('submit', '#sendForm', function(e){
        //     ////debugger
        // })
    }
    openSnackBar() {
        this._snackBar.open("נשלח בהצלחה", "", {
            duration: 2500,
            direction: 'rtl',
            panelClass: 'success',
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/SendSmsToCoronaSurvey",
                {
                    _FullName: this.fullnameVal,
                    _id: this.idPatient,
                    _phoneNumber: this.phoneNumber,
                }
            )
            .subscribe((Response) => {
                // ////debugger 888888
                this.openSnackBar()
            });
        // display form values on success
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
        this.modalService.dismissAll();
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
        //$('#free_text').text(_element.FreeText);
        // ////debugger
        this.fullnameVal = "";
        this.idPatient = "";
        this.phoneNumber = "";
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
        //////debugger;
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
        //////debugger
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
    public printRowForm(row): void {
        // ////debugger
        var cRow = row;
        var dateB = cRow.CS_SURVEY_DATE;
        var dateC = cRow.CS_SURVEY_Q2_2;
        var dateE = cRow.CS_SURVEY_Q4_4;
        $("#loader").removeClass("d-none");
        /*if (row.CS_SURVEY_Q2_2 == "Invalid Date") {
            row.CS_SURVEY_Q2_2 = "";
            ////debugger
        }*/
        if (
            cRow.CS_SURVEY_Q2_2 != "" &&
            cRow.CS_SURVEY_Q2_2 != "Invalid Date"
        ) {
            cRow.CS_SURVEY_Q2_2 = this.toShortFormat(
                new Date(cRow.CS_SURVEY_Q2_2)
            );
            //////debugger
        }
        /*  if (row.CS_SURVEY_Q4_4 == "Invalid Date") {
            row.CS_SURVEY_Q4_4 = "";
            ////debugger
        }*/
        if (cRow.CS_SURVEY_Q4_4 != "") {
            cRow.CS_SURVEY_Q4_4 = this.toShortFormat(
                new Date(cRow.CS_SURVEY_Q4_4)
            );
        }

        //   row.CS_SURVEY_Q2_2 = this.toShortFormat(dateCovid);

        //////debugger

        var f = cRow.CS_SURVEY_DATE.split("T");
        cRow.CS_TIME = f[1].substring(0, 5);
        cRow.CS_SURVEY_DATE = this.toShortFormat(new Date(f[0]));

        console.log(cRow);
        if (cRow.CS_SURVEY_Q2_2 != "") {
            var CS_SURVEY_Q2_2 = new Date(cRow.CS_SURVEY_Q2_2);
            cRow.CS_SURVEY_Q2_2 = CS_SURVEY_Q2_2.toLocaleDateString();
        }
        if (cRow.CS_SURVEY_Q4_4 != "") {
            var CS_SURVEY_Q4_4 = new Date(cRow.CS_SURVEY_Q4_4);

            cRow.CS_SURVEY_Q4_4 = CS_SURVEY_Q4_4.toLocaleDateString();
        }

        this.rowFormData = cRow;
        if (
            cRow.CS_SURVEY_Q2_1 == "Yes" ||
            cRow.CS_SURVEY_Q2_1 == "Да" ||
            cRow.CS_SURVEY_Q2_1 == "כן" ||
            cRow.CS_SURVEY_Q2_1 == "نعم"
        ) {
            this.Checked_Yes_CS_SURVEY_Q2_1 = true;
            this.Checked_No_CS_SURVEY_Q2_1 = false;
            //  ////debugger
        } else {
            this.Checked_No_CS_SURVEY_Q2_1 = true;
            this.Checked_Yes_CS_SURVEY_Q2_1 = false;
        }
        if (
            cRow.CS_SURVEY_Q3 == "Yes" ||
            cRow.CS_SURVEY_Q3 == "Да" ||
            cRow.CS_SURVEY_Q3 == "כן" ||
            cRow.CS_SURVEY_Q3 == "نعم"
        ) {
            this.Checked_Yes_CS_SURVEY_Q3 = true;
            this.Checked_No_CS_SURVEY_Q3 = false;
        } else {
            this.Checked_No_CS_SURVEY_Q3 = true;
            this.Checked_Yes_CS_SURVEY_Q3 = false;
        }
        if (
            cRow.CS_SURVEY_Q4_1 == "Yes" ||
            cRow.CS_SURVEY_Q4_1 == "Да" ||
            cRow.CS_SURVEY_Q4_1 == "כן" ||
            cRow.CS_SURVEY_Q4_1 == "نعم"
        ) {
            this.Checked_Yes_CS_SURVEY_Q4_1 = true;
            this.Checked_No_CS_SURVEY_Q4_1 = false;
        } else {
            this.Checked_No_CS_SURVEY_Q4_1 = true;
            this.Checked_Yes_CS_SURVEY_Q4_1 = false;
        }
        if (
            cRow.CS_SURVEY_Q4_2 == "Yes" ||
            cRow.CS_SURVEY_Q4_2 == "Да" ||
            cRow.CS_SURVEY_Q4_2 == "כן" ||
            cRow.CS_SURVEY_Q4_2 == "نعم"
        ) {
            this.Checked_Yes_CS_SURVEY_Q4_2 = true;
            this.Checked_No_CS_SURVEY_Q4_2 = false;
        } else {
            this.Checked_No_CS_SURVEY_Q4_2 = true;
            this.Checked_Yes_CS_SURVEY_Q4_2 = false;
        }
        //////debugger
        if (
            cRow.CS_SURVEY_Q4_3 == "Yes" ||
            cRow.CS_SURVEY_Q4_3 == "Да" ||
            cRow.CS_SURVEY_Q4_3 == "כן" ||
            cRow.CS_SURVEY_Q4_3 == "نعم"
        ) {
            this.Checked_Yes_CS_SURVEY_Q4_3 = true;
            this.Checked_No_CS_SURVEY_Q4_3 = false;
        } else {
            this.Checked_No_CS_SURVEY_Q4_3 = true;
            this.Checked_Yes_CS_SURVEY_Q4_3 = false;
        }
        setTimeout(function () {
            $("#loader").addClass("d-none");
            window.print();
            cRow.CS_SURVEY_DATE = dateB;
            cRow.CS_SURVEY_Q2_2 = dateC;
            cRow.CS_SURVEY_Q4_4 = dateE;
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
            // ////debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/Covid_19_SheetApp",
                {
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
                let CoronaData = JSON.parse(json["aaData"]);
                //////debugger
                for (var i = 0; i < CoronaData.length; i++) {
                    var t = CoronaData[i].CS_SURVEY_DATE.split("T");
                    var d = CoronaData[i].CS_SURVEY_Q2_2.split(" ");
                    var s = CoronaData[i].CS_SURVEY_Q4_4.split(" ");
                    //////debugger
                    this.TABLE_DATA.push({
                        CS_ROW_ID: CoronaData[i].CS_ROW_ID,
                        CS_SMS_ID: CoronaData[i].CS_SMS_ID,
                        CS_PATIENT_NUMBER: CoronaData[i].CS_PATIENT_NUMBER,
                        CS_PATIENT_NAME: CoronaData[i].CS_PATIENT_NAME,
                        CS_PATIENT_ID: CoronaData[i].CS_PATIENT_ID,
                        CS_PATIENT_GENDER: CoronaData[i].CS_PATIENT_GENDER,
                        CS_SURVEY_DATE: CoronaData[i].CS_SURVEY_DATE,
                        CS_SURVEY_Q1_1: CoronaData[i].CS_SURVEY_Q1_1,
                        CS_SURVEY_Q1_2: CoronaData[i].CS_SURVEY_Q1_2,
                        CS_SURVEY_Q1_3: CoronaData[i].CS_SURVEY_Q1_3,
                        CS_SURVEY_Q1_4: CoronaData[i].CS_SURVEY_Q1_4,
                        CS_SURVEY_Q1_5: CoronaData[i].CS_SURVEY_Q1_5,
                        CS_SURVEY_Q1_6: CoronaData[i].CS_SURVEY_Q1_6,
                        CS_SURVEY_Q1_7: CoronaData[i].CS_SURVEY_Q1_7,
                        CS_SURVEY_Q1_8: CoronaData[i].CS_SURVEY_Q1_8,
                        CS_SURVEY_Q1_9: CoronaData[i].CS_SURVEY_Q1_9,
                        CS_SURVEY_Q1_10: CoronaData[i].CS_SURVEY_Q1_10,
                        CS_SURVEY_Q1_11: CoronaData[i].CS_SURVEY_Q1_11,
                        CS_SURVEY_Q1_12: CoronaData[i].CS_SURVEY_Q1_12,
                        CS_SURVEY_Q2_1: CoronaData[i].CS_SURVEY_Q2_1,
                        CS_SURVEY_Q2_2: d[0],
                        CS_SURVEY_Q3: CoronaData[i].CS_SURVEY_Q3,
                        CS_SURVEY_Q4_1: CoronaData[i].CS_SURVEY_Q4_1,
                        CS_SURVEY_Q4_2: CoronaData[i].CS_SURVEY_Q4_2,
                        CS_SURVEY_Q4_3: CoronaData[i].CS_SURVEY_Q4_3,
                        CS_SURVEY_Q4_4: s[0],
                        CS_ROW_STATUS: CoronaData[i].CS_ROW_STATUS,
                        CS_ROW_COLOR: CoronaData[i].CS_ROW_COLOR,
                        CS_LANG: CoronaData[i].CS_LANG,
                        CS_TIME: t[1],
                        CS_DATE: t[0],
                        CS_DATETIME: t[1],
                    });
                }

                // ////debugger
                this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                this.resultsLength = parseInt(json["iTotalRecords"]);
                setTimeout(function () {
                    //////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }
}
