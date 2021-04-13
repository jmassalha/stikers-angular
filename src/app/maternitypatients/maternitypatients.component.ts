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

export interface MaternityPatients {
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
  PatientDOB: string;
  PatientPregnancyDOB: string;
  PatientMobile: string;
  PatientEmail: string;
  PatientAddress: string;
  PatientPregnancyWeekAtInsert: string;
  PatientNote: string;
}

@Component({
  selector: 'app-maternitypatients',
  templateUrl: './maternitypatients.component.html',
  styleUrls: ['./maternitypatients.component.css']
})
export class MaternitypatientsComponent implements OnInit {

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
        "PatientPregnancyDOB",
        "PatientPregnancyWeekAtInsert",
        "PatientStatus",
        "Click",
    ];

    modalOptions: NgbModalOptions = {
        windowClass: "marg-t-60",
    };
    closeResult: string;
    TABLE_DATA: MaternityPatients[] = [];
    rowFormData = {} as MaternityPatients;
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    tableLoader: Boolean;
    UserSmsStatus: Boolean;
    UserEmailStatus: Boolean;
    resultsLength = 0;
    fliterValPatient = "";
    StatusPatient = "-1";
    patientForm: FormGroup;

    MaternityRowId = localStorage.getItem("MaternityRowId");
    submitted = false;
    activeModal: NgbActiveModal;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalServicematernitypatients: NgbModal,
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
       // debugger
        this.UserSmsStatus = false;
        this.UserEmailStatus = false;
        this.fullnameVal = "";
        this.rowIdVal = "0";
        this.loader = false;
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);

        if (
            localStorage.getItem("loginState") != "true" ||
            localStorage.getItem("loginUserName") == ""
        ) {
            this.router.navigate(["login"]);
        } else if (
            localStorage.getItem("loginUserName").toLowerCase() ==
                "jmassalha" ||
            this.MaternityRowId != "0"
        ) {
        } else {
            this.router.navigate(["login"]);
            ///$("#chadTable").DataTable();
        }
        this.getReportmaternitypatients(this);
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
        ////debugger

        // stop here if form is invalid
        if (this.patientForm.invalid) {
            // console.log(this.patientForm.controls.errors);
            return;
        }
        this.patientForm.value.PatientDOB = formatDate(
            this.patientForm.value.PatientDOB,
            "yyyy-MM-dd",
            "en-US"
        );
        this.patientForm.value.PatientPregnancyDOB = formatDate(
            this.patientForm.value.PatientPregnancyDOB,
            "yyyy-MM-dd",
            "en-US"
        );
        //debugger;
        this.http
            .post(
                "http://srv-apps/wsrfc/WebService.asmx/InsertOrUpdateMaternityPatients",
                {
                    _patientForm: this.patientForm.value,
                }
            )
            .subscribe((Response) => {
                this.applyFiltermaternitypatients(this.fliterValPatient);
                this.openSnackBar();
            });
        // display form values on success
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.patientForm.value, null, 4));
        // this.modalServicematernitypatients.dismissAll();
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
        //debugger
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
            PatientPregnancyDOB: [_element.PatientPregnancyDOB, Validators.required],
            PatientDOB: [_element.PatientDOB, Validators.required],
            RowID: [_element.RowID, Validators.required],
            MaternityRowId: [this.MaternityRowId, Validators.required],
            PatientNote: [_element.PatientNote, Validators.required],
            PatientPregnancyWeekAtInsert: [_element.PatientPregnancyWeekAtInsert, Validators.required],
            PatientAddress: [_element.PatientAddress, Validators.required],
            PatientMobile: [_element.PatientMobile, Validators.required],
            PatientEmail: [_element.PatientEmail, Validators.required],
        });
        this.activeModal = this.modalServicematernitypatients.open(
            content,
            this.modalOptions
        );
    }
    getReportmaternitypatients($event: any): void {
        ////debugger
        this.getTableFromServer(
            this.paginator.pageIndex,
            10,
            this.fliterValPatient,
            this.StatusPatient
        );
    }
    applyFiltermaternitypatients(filterValue: string) {
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
            PatientPregnancyDOB: ["", Validators.required],
            PatientDOB: ["", Validators.required],
            RowID: [0, Validators.required],
            MaternityRowId: [this.MaternityRowId, Validators.required],
            PatientNote: ["", Validators.required],
            PatientPregnancyWeekAtInsert: ["", Validators.required],
            PatientAddress: ["", Validators.required],
            PatientMobile: ["", Validators.required],
            PatientEmail: ["", Validators.required],
        });
        this.activeModal = this.modalServicematernitypatients.open(
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
    computeEGA( iDueDateYear, iDueDateMonth, iDueDateDay ) {
        var dToday   = new Date();
        var dDueDate = new Date( iDueDateYear, iDueDateMonth-1, iDueDateDay );
      //  debugger
        var iDaysUntilDueDate = (dDueDate.getTime() - dToday.getTime()) / (1000 * 60 * 60 * 24 );
        var iTotalDaysInPregnancy = 40*7;
        var iGestationalAgeInDays = iTotalDaysInPregnancy - iDaysUntilDueDate;
        var fGestationalAgeInWeeks = iGestationalAgeInDays / 7;
        var iEGAWeeks = Math.floor( fGestationalAgeInWeeks );
        var iEGADays = ((fGestationalAgeInWeeks % 1)*7).toFixed(0)
    
        console.log( iEGAWeeks + " weeks" );
        console.log( iEGADays + " days" );
        return iEGAWeeks+"."+iEGADays
    }
    public getTableFromServer(
        _pageIndex: number,
        _pageSize: number,
        _FreeText: string,
        _Status: string
    ) {
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // //debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        //debugger
        this.http
            .post(
                "http://srv-apps/wsrfc/WebService.asmx/getMaternityPatientsTable",
                {
                    _pageIndex: _pageIndex,
                    _pageSize: _pageSize,
                    _FreeText: _FreeText,
                    _Status: _Status,
                    _MaternityID: this.MaternityRowId,
                }
            )
            .subscribe((Response) => {
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                //debugger
                var json = $.parseJSON(Response["d"]);
                let patientData = $.parseJSON(json["Patients"]);
                for (var i = 0; i < patientData.length; i++) {
                    ////debugger
                    var date = patientData[i].PatientPregnancyDOB.split("-");
                    var PatientPregnancyWeekAtInsert = this.computeEGA(date[0], date[1], date[2])
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
                        PatientDOB: patientData[i].PatientDOB,
                        PatientPregnancyDOB: patientData[i].PatientPregnancyDOB,
                        PatientMobile: patientData[i].PatientMobile,
                        PatientEmail: patientData[i].PatientEmail,
                        PatientAddress: patientData[i].PatientAddress,
                        PatientPregnancyWeekAtInsert: PatientPregnancyWeekAtInsert,
                        PatientNote: patientData[i].PatientNote,
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
