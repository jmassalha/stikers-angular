import {
    Component,
    OnInit,
    ViewChild,
    AfterViewInit,
    Input,
} from "@angular/core";
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
    NgbActiveModal,
} from "@ng-bootstrap/ng-bootstrap";
import * as $ from "jquery";
import * as Fun from "../public.functions";
import { formatDate, Time } from "@angular/common";
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
} from "@angular/forms";

export interface ResearchesPatients {
    RowID: number;
    PatientId: string;
    PatientFirstName: string;
    PatientLastName: string;
    UserIdInsert: string;
    DateInsert: string;
    DateUpdate: string;
    UserIdUpdate: string;
    PatientStatus: string;
    PatientNumber: string;
    StartDate: string;
    EndDate: string;
}

@Component({
    selector: "app-researchespatients",
    templateUrl: "./researchespatients.component.html",
    styleUrls: ["./researchespatients.component.css"],
})
export class ResearchespatientsComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    displayedColumns: string[] = [
        "PatientId",
        "PatientNumber",
        "PatientFirstName",
        "PatientLastName",
        "StartDate",
        "EndDate",
        "PatientStatus",
        "Click",
    ];

    modalOptions: NgbModalOptions = {
        windowClass: "marg-t-60",
    };
    closeResult: string;
    TABLE_DATA: ResearchesPatients[] = [];
    rowFormData = {} as ResearchesPatients;
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    tableLoader: Boolean;
    UserSmsStatus: Boolean;
    UserEmailStatus: Boolean;
    resultsLength = 0;
    fliterValPatient = "";
    StatusPatient = "-1";
    patientForm: FormGroup;

    ReseachRowId = localStorage.getItem("ReseachRowId");
    submitted = false;
    activeModal: NgbActiveModal;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalServiceresearchespatients: NgbModal,
        private formBuilder: FormBuilder,
        activeModal: NgbActiveModal
    ) {
        this.activeModal = activeModal;
    }
    @Input()
    foo: string = "bar";
    startdateVal: string;
    enddateVal: string;
    Sdate: FormControl;
    Edate: FormControl;
    fullnameVal: string;
    rowIdVal: string;
    ngOnInit(): void {
        this.UserSmsStatus = false;
        this.UserEmailStatus = false;
        this.fullnameVal = "";
        this.rowIdVal = "0";
        this.loader = false;
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);

        
        this.getReportresearchespatients(this);
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
        //////debugger
        this.patientForm.value.StartDate = formatDate(
            this.patientForm.value.StartDate,
            "yyyy-MM-dd",
            "en-US"
        );
        this.patientForm.value.EndDate = formatDate(
            this.patientForm.value.EndDate,
            "yyyy-MM-dd",
            "en-US"
        );
        // stop here if form is invalid
        if (this.patientForm.invalid) {
            // console.log(this.patientForm.controls.errors);
            return;
        }
        //debugger;
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/InsertOrUpdateResearchesPatients",
                {
                    _patientForm: this.patientForm.value,
                }
            )
            .subscribe((Response) => {
                this.applyFilterresearchespatients(this.fliterValPatient);
                this.openSnackBar();
            });
        // display form values on success
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.patientForm.value, null, 4));
        // this.modalServiceresearchespatients.dismissAll();
        this.activeModal.close();
    }
    editRow(content, _type, _element) {
        if (_element.UserSmsStatus == "1") {
            this.UserSmsStatus = true;
        } else {
            this.UserSmsStatus = false;
        }
        if (_element.UserEmailStatus == "1") {
            this.UserEmailStatus = true;
        } else {
            this.UserEmailStatus = false;
        }
        ////debugger
        this.patientForm = this.formBuilder.group({
            PatientNumber: [
                _element.PatientNumber,
                [Validators.required, Validators.pattern("[0-9].{2,}")],
            ],
            PatientId: [
                _element.PatientId,
                [Validators.required, Validators.pattern("[0-9].{7,}")],
            ],
            PatientFirstName: [_element.PatientFirstName, Validators.required],
            PatientLastName: [_element.PatientLastName, Validators.required],
            PatientStatus: [_element.PatientStatus + "", Validators.required],
            UserIdUpdate: [
                localStorage.getItem("loginUserName"),
                Validators.required,
            ],
            EndDate: [_element.EndDate, Validators.required],
            StartDate: [_element.StartDate, Validators.required],
            RowID: [_element.RowID, Validators.required],
            ReseachRowId: [this.ReseachRowId, Validators.required],
        });
        this.activeModal = this.modalServiceresearchespatients.open(
            content,
            this.modalOptions
        );
    }
    getReportresearchespatients($event: any): void {
        //////debugger
        this.getTableFromServer(
            this.paginator.pageIndex,
            10,
            this.fliterValPatient,
            this.StatusPatient
        );
    }
    applyFilterresearchespatients(filterValue: string) {
        this.fliterValPatient = filterValue;

        this.getTableFromServer(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.fliterValPatient,
            this.StatusPatient
        );

        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    open(content, _type, _element) {
        //$('#free_text').text(_element.FreeText);
        //////debugger
        this.UserSmsStatus = false;
        this.UserEmailStatus = false;
        this.patientForm = this.formBuilder.group({
            PatientNumber: [
                "",
                [Validators.required, Validators.pattern("[0-9].{2,}")],
            ],
            PatientId: [
                "",
                [Validators.required, Validators.pattern("[0-9].{7,}")],
            ],
            PatientFirstName: ["", Validators.required],
            PatientLastName: ["", Validators.required],
            PatientStatus: [1 + "", Validators.required],
            UserIdInsert: [
                localStorage.getItem("loginUserName"),
                Validators.required,
            ],
            EndDate: ["", Validators.required],
            StartDate: ["", Validators.required],
            RowID: [0, Validators.required],
            ReseachRowId: [this.ReseachRowId, Validators.required],
        });
        this.activeModal = this.modalServiceresearchespatients.open(
            content,
            this.modalOptions
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

        this.getTableFromServer(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.fliterValPatient,
            this.StatusPatient
        );
    }

    public getTableFromServer(
        _pageIndex: number,
        _pageSize: number,
        _FreeText: string,
        _Status: string
    ) {
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // ////debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/getResearchesPatientsTable",
                {
                    _pageIndex: _pageIndex,
                    _pageSize: _pageSize,
                    _FreeText: _FreeText,
                    _Status: _Status,
                    _ResearchID: this.ReseachRowId,
                }
            )
            .subscribe((Response) => {
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                ////debugger
                var json = JSON.parse(Response["d"]);
                let patientData = JSON.parse(json["Patients"]);
                for (var i = 0; i < patientData.length; i++) {
                    //////debugger
                    this.TABLE_DATA.push({
                        RowID: patientData[i].RowID,
                        PatientId: patientData[i].PatientId,
                        PatientNumber: patientData[i].PatientNumber,
                        PatientFirstName: patientData[i].PatientFirstName,
                        PatientLastName: patientData[i].PatientLastName,
                        DateUpdate: patientData[i].DateUpdate,
                        DateInsert: patientData[i].DateInsert,
                        UserIdInsert: patientData[i].UserIdInsert,
                        UserIdUpdate: patientData[i].UserIdUpdate,
                        PatientStatus: patientData[i].PatientStatus,
                        StartDate: patientData[i].StartDate,
                        EndDate: patientData[i].EndDate,
                    });
                }

                // ////debugger
                this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                this.resultsLength = parseInt(json["totalRows"].toString().replaceAll('"',''));
                setTimeout(function () {
                    //////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }
}
