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

export interface Select {
    code: string;
    name: string;
}
export interface Report {
    RowId: string;
    Reporting_Date_Time: string;
    HMO_Code: string;
    Site_Code: string;
    Site_Desc: string;
    Catalog_Number: string;
    Reporting_Type_Code: string;
    Reporting_Type_Desc: string;
    Reason_Code: string;
    Reason_Desc: string;
    Amount: string;
    Reporting_Date_Time_Insert: string;
    Reporting_Date_Time_Update: string;
    Reporting_User_Insert: string;
    Reporting_User_Update: string;
    RowStatus: string;
    Edit: Boolean;
}
@Component({
    selector: "app-covid19report",
    templateUrl: "./covid19report.component.html",
    styleUrls: ["./covid19report.component.css"],
})
export class Covid19reportComponent implements OnInit {
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    displayedColumns: string[] = [
        "Reporting_Date_Time",
        "Catalog_Number",
        "Reporting_Type_Desc",
        "Reason_Desc",
        "Amount",
        "RowStatus",
        "CLICK",
    ];

    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    modalOptions: NgbModalOptions;
    TABLE_DATA: Report[] = [];
    TypeCodes: Select[] = [
        {
            name: "מלאי שנוצל",
            code: "1",
        },
        {
            name: "בלאי",
            code: "2",
        },
        {
            name: "מלאי סגור שנשאר בסוף יום",
            code: "3",
        },
    ];
    TypeDescs: Select[] = [
        {
            name: "מלאי שנוצל",
            code: "1",
        },
        {
            name: "בלאי",
            code: "2",
        },
        {
            name: "מלאי סגור שנשאר בסוף יום",
            code: "3",
        },
    ];
    Data1Select: Select[] = [
        {
            name: "חיסון אנשי צוות",
            code: "1",
        },
        {
            name: "חיסון מבוטחים",
            code: "2",
        },
    ];
    Data2Select: Select[] = [
        {
            name: "מנות שנשארו ללא שימוש",
            code: "1",
        },
        {
            name: "חיסון פג תוקף",
            code: "2",
        },
        {
            name: "פלקון פג תוקף",
            code: "3",
        },
        {
            name: "אצווה פגת תוקף",
            code: "4",
        },
        {
            name: "אחסון לא תקין",
            code: "5",
        },
        {
            name: "פער מנות בפלקון",
            code: "6",
        },
        {
            name: "פלקון מבוטל בשל שבר או פגם",
            code: "7",
        },
        {
            name: "אצווה שדווחה לזריקה",
            code: "8",
        },
        {
            name: "מהילה לא נכונה",
            code: "9",
        },
        {
            name: "חיסון הזדהם",
            code: "10",
        },
        {
            name: "מטופל סרב לאחר הכנת המנה",
            code: "11",
        },
    ];

    Data3Select: Select[] = [
        {
            name: "מלאי סגור שנשאר בסוף יום",
            code: "1",
        },
    ];
    ReasonCodes: Select[] = [];
    ReasonDescs: Select[] = [];
    rowFormData = {} as Report;
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    tableLoader: Boolean;
    resultsLength = 0;
    fliterVal = "";
    addOrEditReportForm: FormGroup;
    submitted = false;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private formBuilder: FormBuilder
    ) {}
    startdateVal: string;
    enddateVal: string;
    Sdate: FormControl;
    Edate: FormControl;
    ifMobile: Boolean;
    ngOnInit(): void {
        if (window.screen.width <= 798) { // 768px portrait
            this.ifMobile = true;
          }else{
            this.ifMobile = false;
          }
          
        this.loader = false;
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);
        let dateIn = new Date();
        dateIn.setDate(dateIn.getDate());
        this.Sdate = new FormControl(dateIn);
        this.Edate = new FormControl(new Date());
        this.startdateVal = this.Sdate.value;
        this.enddateVal = this.Edate.value;
        this.addOrEditReportForm = this.formBuilder.group({
            RowId: ["0", Validators.required],
            Reporting_Date_Time: ["", Validators.required],
            Catalog_Number: ["", Validators.required],
            Reporting_Type_Code: ["", Validators.required],
            Reporting_Type_Desc: ["", null],
            Reason_Code: ["", Validators.required],
            Reason_Desc: ["", null],
            Amount: ["", Validators.required],
            RowStatus: ["1", Validators.required],
            Reporting_User_Insert: [localStorage.getItem("loginUserName").toLowerCase(), Validators.required],
            HMO_Code: ['1109', Validators.required],
            Site_Code: ['469', Validators.required],
            Site_Desc: ['PORIA', Validators.required],
        });
        if (
            localStorage.getItem("loginState") != "true" ||
            localStorage.getItem("loginUserName") == ""
        ) {
            this.router.navigate(["login"]);
        } else if (
            localStorage.getItem("loginUserName").toLowerCase() ==
                "jmassalha" ||
            localStorage.getItem("loginUserName").toLowerCase() == "samer" ||
            localStorage.getItem("loginUserName").toLowerCase() ==
                "owertheim" 
                ||             localStorage.getItem("loginUserName").toLowerCase() == "edinisman"
                ||             localStorage.getItem("loginUserName").toLowerCase() == "whanout"
                ||             localStorage.getItem("loginUserName").toLowerCase() == "dsalameh"
        ) {
        } else {
            this.router.navigate(["login"]);
            ///$("#chadTable").DataTable();
        }
        this.getReport("");
    }

    getReport($event: any): void {
        //debugger
        if (this.startdateVal && this.enddateVal)
            this.getTableFromServer(
                this.startdateVal,
                this.enddateVal,
                this.paginator.pageIndex,
                10,
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
    checkSelectedValue($event) {
        let taht = this;
        switch ($event.value) {
            case "1":
              
              this.ReasonDescs = this.Data1Select;
                break;
            case "2":
              this.ReasonDescs = this.Data2Select;
                break;
            case "3":
              this.ReasonDescs = this.Data3Select;
                break;
        }
        
        
    }
    checkSelectedValueReason($event) {
        let taht = this;
        
  
        
    }
    open(content, _type, _element) {
        this.addOrEditReportForm = this.formBuilder.group({
            RowId: ["0", Validators.required],
            Reporting_Date_Time: [new Date(), Validators.required],
            Catalog_Number: ["", Validators.required],
            Reporting_Type_Code: ["", Validators.required],
            Reporting_Type_Desc: ["", null],
            Reason_Code: ["", Validators.required],
            Reason_Desc: ["", null],
            Amount: ["", Validators.required],
            RowStatus: ["1", Validators.required],
            Reporting_User_Insert: [localStorage.getItem("loginUserName").toLowerCase(), Validators.required],
            HMO_Code: ['1109', Validators.required],
            Site_Code: ['469', Validators.required],
            Site_Desc: ['PORIA', Validators.required],
        });
        //$('#free_text').text(_element.FreeText);
        // //debugger
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                ////debugger
                if ("Save" == result) {
                    // //debugger;
                    //this.saveChad(_element.ROW_ID);
                }
            },
            (reason) => {}
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
    public editRowForm(content, _type, row): void {
        //debugger
        var cRow = row;
        switch (cRow.Reporting_Type_Code) {
            case "1":
              
              this.ReasonDescs = this.Data1Select;
                break;
            case "2":
              this.ReasonDescs = this.Data2Select;
                break;
            case "3":
              this.ReasonDescs = this.Data3Select;
                break;
        }
        var dateString = cRow.Reporting_Date_Time;
        var reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
        var dateArray = reggie.exec(dateString); 
        var dateObject = new Date(
            (+dateArray[1]),
            (+dateArray[2])-1, // Careful, month starts at 0!
            (+dateArray[3]),
            (+dateArray[4]),
            (+dateArray[5]),
            (+dateArray[6])
        );
        debugger
        this.addOrEditReportForm = this.formBuilder.group({
            RowId: [cRow.RowId, Validators.required],
            Reporting_Date_Time: [
                dateObject,
                Validators.required,
            ],
            Catalog_Number: [cRow.Catalog_Number, Validators.required],
            Reporting_Type_Code: [
                cRow.Reporting_Type_Code,
                Validators.required,
            ],
            Reporting_Type_Desc: [
                cRow.Reporting_Type_Desc,
                null,
            ],
            Reason_Code: [cRow.Reason_Code, Validators.required],
            Reason_Desc: [cRow.Reason_Desc,null],
            Amount: [cRow.Amount, Validators.required],
            RowStatus: ["1", Validators.required],
            Reporting_User_Insert: [localStorage.getItem("loginUserName").toLowerCase(), Validators.required],
            HMO_Code: ['1109', Validators.required],
            Site_Code: ['469', Validators.required],
            Site_Desc: ['PORIA', Validators.required],
        });
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                ////debugger
                if ("Save" == result) {
                    // //debugger;
                    //this.saveChad(_element.ROW_ID);
                }
            },
            (reason) => {}
        );
    }

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
        this.submitted = true;

        // stop here if form is invalid
        if (this.addOrEditReportForm.invalid) {
            return;
        }
        let taht = this;
        taht.addOrEditReportForm.value.Catalog_Number = taht.addOrEditReportForm.value.Catalog_Number.toUpperCase();
        Object.getOwnPropertyNames(this.ReasonDescs).forEach(
          function (val, id) {
            if(id == parseInt(taht.addOrEditReportForm.value.Reason_Code)){              
              taht.addOrEditReportForm.value.Reason_Desc = taht.ReasonDescs[id - 1].name;              
            }
          }
        );
        Object.getOwnPropertyNames(this.TypeDescs).forEach(
          function (val, id) {
            if(id == parseInt(taht.addOrEditReportForm.value.Reporting_Type_Code)){              
              taht.addOrEditReportForm.value.Reporting_Type_Desc = taht.TypeDescs[id - 1].name;              
            }
          }
        );
        // adjust 0 before single digit date
        let date = ("0" + taht.addOrEditReportForm.value.Reporting_Date_Time.getDate()).slice(-2);

        // current month
        let month = ("0" + (taht.addOrEditReportForm.value.Reporting_Date_Time.getMonth() + 1)).slice(-2);

        // current year
        let year = taht.addOrEditReportForm.value.Reporting_Date_Time.getFullYear();

        // current hours
        let hours = taht.addOrEditReportForm.value.Reporting_Date_Time.getHours();

        // current minutes
        let minutes = taht.addOrEditReportForm.value.Reporting_Date_Time.getMinutes();

        // current seconds
        let seconds = taht.addOrEditReportForm.value.Reporting_Date_Time.getSeconds();
        taht.addOrEditReportForm.value.Reporting_Date_Time = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        debugger
        this.http
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/SubmitCovid19Report", {
                mCovid19Report: taht.addOrEditReportForm.value,
            })
            .subscribe((Response) => {
                //debugger
                // //debugger 888888
                this.openSnackBar();
                this.getReport("");
            });
        // display form values on success
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
        this.modalService.dismissAll();
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
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetAllReporting", {
                _fromDate: _startDate,
                _toDate: _endDate,
                _pageIndex: _pageIndex,
                _pageSize: _pageSize,
            })
            .subscribe((Response) => {
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                var json = JSON.parse(JSON.parse(Response["d"]));
                let CoronaData = JSON.parse(json["aaData"]);
                ////debugger
                for (var i = 0; i < CoronaData.length; i++) {
                    ////debugger
                    let Edit = false;
                    if(CoronaData[i].RowStatus == "פעיל"){
                        Edit = true;
                    }
                    this.TABLE_DATA.push({
                        RowId: CoronaData[i].RowId,
                        Reporting_Date_Time: CoronaData[i].Reporting_Date_Time,
                        HMO_Code: CoronaData[i].HMO_Code,
                        Site_Code: CoronaData[i].Site_Code,
                        Site_Desc: CoronaData[i].Site_Desc,
                        Catalog_Number: CoronaData[i].Catalog_Number,
                        Reporting_Type_Code: CoronaData[i].Reporting_Type_Code,
                        Reporting_Type_Desc: CoronaData[i].Reporting_Type_Desc,
                        Reason_Code: CoronaData[i].Reason_Code,
                        Reason_Desc: CoronaData[i].Reason_Desc,
                        Amount: CoronaData[i].Amount,
                        Reporting_Date_Time_Insert:
                            CoronaData[i].Reporting_Date_Time_Insert,
                        Reporting_Date_Time_Update:
                            CoronaData[i].Reporting_Date_Time_Update,
                        Reporting_User_Insert:
                            CoronaData[i].Reporting_User_Insert,
                        Reporting_User_Update:
                            CoronaData[i].Reporting_User_Update,
                        RowStatus: CoronaData[i].RowStatus,
                        Edit: Edit,
                    });
                }

                // //debugger
                this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                this.resultsLength = parseInt(json["iTotalRecords"]);
                setTimeout(function () {
                    ////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }
}
