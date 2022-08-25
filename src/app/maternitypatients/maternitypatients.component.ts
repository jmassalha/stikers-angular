import {
    Component,
    OnInit,
    ViewChild,
    Input,
    TemplateRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
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
import { formatDate } from "@angular/common";
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
} from "@angular/forms";
import { ConfirmationDialogService } from "../confirmation-dialog/confirmation-dialog.service";
import { MatDialog } from "@angular/material/dialog";
import * as XLSX from 'xlsx';

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
    @ViewChild('modalProjects', { static: true }) modalProjects: TemplateRef<any>;
    displayedColumns: string[] = [
        "PatientId",
        "PatientNumber",
        "PatientFirstName",
        "PatientLastName",
        "PatientPregnancyDOB",
        "PatientPregnancyWeekAtInsert",
        // "PatientStatus",
        "Click",
        "Delete",
        "Display",
    ];

    modalOptions: NgbModalOptions = {
        windowClass: "marg-t-60",
    };
    closeResult: string;
    projectToAttach: any;
    projects: any;
    ParticipantProjectsList = [];
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
    Api = "http://srv-apps-prod/RCF_WS/WebService.asmx/";
    patientForm: FormGroup;

    MaternityRowId: string;
    MaternityName: string;
    submitted = false;
    activeModal: NgbActiveModal;
    constructor(
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalServicematernitypatients: NgbModal,
        private confirmationDialogService: ConfirmationDialogService,
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
    AllParticipantProjectsCost: number = 0;
    ngOnInit(): void {
        // //debugger
        this.UserSmsStatus = false;
        this.UserEmailStatus = false;
        this.fullnameVal = "";
        this.rowIdVal = "0";
        this.loader = false;
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);

        this.getMaternityNewPatientsAlert();
        this.getReportmaternitypatients(this);
    }

    getMaternityNewPatientsAlert() {
        this.http
            .post(this.Api + "GetMaternityNewPatientsAlert", {
            })
            .subscribe((Response) => {
                console.log(Response["d"]);
            });
    }

    openSnackBar(message) {
        this._snackBar.open(message, "", {
            duration: 2500,
            direction: "rtl",
            panelClass: "success",
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
    deletePatient(_element) {
        this.patientForm = this.formBuilder.group({
            PatientNumber: [
                _element.PatientNumber,
                Validators.nullValidator,
            ],
            PatientId: [
                _element.PatientId,
                Validators.nullValidator
            ],
            PatientFirstName: [_element.PatientFirstName, Validators.nullValidator],
            PatientLastName: [_element.PatientLastName, Validators.nullValidator],
            PatientStatus: [-1 + "", Validators.nullValidator],
            UserIdUpdate: [
                localStorage.getItem("loginUserName"),
                Validators.nullValidator,
            ],
            PatientPregnancyDOB: [_element.PatientPregnancyDOB, Validators.nullValidator],
            PatientDOB: [_element.PatientDOB, Validators.nullValidator],
            RowID: [_element.RowID, Validators.nullValidator],
            MaternityRowId: [this.MaternityRowId, Validators.nullValidator],
            PatientNote: [_element.PatientNote, Validators.nullValidator],
            PatientPregnancyWeekAtInsert: [_element.PatientPregnancyWeekAtInsert, Validators.nullValidator],
            PatientAddress: [_element.PatientAddress, Validators.nullValidator],
            PatientMobile: [_element.PatientMobile, Validators.nullValidator],
            PatientEmail: [_element.PatientEmail, Validators.nullValidator],
        });
        this.confirmationDialogService
            .confirm("נא לאשר..", "האם אתה בטוח ...? ")
            .then((confirmed) => {
                console.log("User confirmed:", confirmed);
                if (confirmed) {
                    this.onSubmit();
                } else {
                }
            })
            .catch(() =>
                console.log(
                    "User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)"
                )
            );
    }
    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.patientForm.invalid) {
            // console.log(this.patientForm.controls.errors);
            return;
        }
        if (this.patientForm.value.PatientDOB != '')
            this.patientForm.value.PatientDOB = formatDate(
                this.patientForm.value.PatientDOB,
                "yyyy-MM-dd",
                "en-US"
            );
        if (this.patientForm.value.PatientPregnancyDOB != '')
            this.patientForm.value.PatientPregnancyDOB = formatDate(
                this.patientForm.value.PatientPregnancyDOB,
                "yyyy-MM-dd",
                "en-US"
            );
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/InsertOrUpdateMaternityPatients",
                // "http://srv-apps-prod/RCF_WS/WebService.asmx/InsertOrUpdateMaternityPatients",
                {
                    _patientForm: this.patientForm.value,
                }
            )
            .subscribe((Response) => {
                if (Response["d"]) {
                    this.applyFiltermaternitypatients(this.fliterValPatient);
                    this.openSnackBar("נשמר בהצלחה");
                } else {
                    this.openSnackBar('לא נשמר');
                }

            });
        this.activeModal.close();
    }

    displayProjects(patientDetials) {
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/DisplayParticipantProjects",
                {
                    Id: patientDetials.RowID
                }
            )
            .subscribe((Response) => {
                this.ParticipantProjectsList = Response["d"][0];
                this.AllParticipantProjectsCost = 0;
                for (let i = 0; i < this.ParticipantProjectsList.length; i++) {
                    this.AllParticipantProjectsCost += parseInt(this.ParticipantProjectsList[i].ProjectCost);
                }
                this.projects = Response["d"][1];
                this.dialog.open(this.modalProjects, { width: '60%', disableClose: false });
            });
    }

    attachToOtherProject() {
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/AttachPatientToMaternity",
                {
                    _patientId: this.ParticipantProjectsList[0].PatientID,
                    _maternityId: this.projectToAttach
                }
            )
            .subscribe((Response) => {
                if (Response["d"]) {
                    this.dialog.closeAll();
                    this.openSnackBar("שויך בהצלחה");
                } else {
                    this.openSnackBar("תקלה בשיוך");
                }

            });
    }

    closeModal() {
        this.dialog.closeAll();
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
        this.patientForm = this.formBuilder.group({
            PatientNumber: [
                _element.PatientNumber,
                [Validators.nullValidator, Validators.pattern("[0-9].{2,}")],
            ],
            PatientId: [
                _element.PatientId,
                [Validators.nullValidator, Validators.pattern("[0-9].{7,}")],
            ],
            PatientFirstName: [_element.PatientFirstName, Validators.nullValidator],
            PatientLastName: [_element.PatientLastName, Validators.nullValidator],
            PatientStatus: [_element.PatientStatus + "", Validators.nullValidator],
            UserIdUpdate: [
                localStorage.getItem("loginUserName"),
                Validators.nullValidator,
            ],
            PatientPregnancyDOB: [_element.PatientPregnancyDOB, Validators.nullValidator],
            PatientDOB: [_element.PatientDOB, Validators.nullValidator],
            RowID: [_element.RowID, Validators.nullValidator],
            MaternityRowId: [this.MaternityRowId, Validators.nullValidator],
            PatientNote: [_element.PatientNote, Validators.nullValidator],
            PatientPregnancyWeekAtInsert: [_element.PatientPregnancyWeekAtInsert, Validators.nullValidator],
            PatientAddress: [_element.PatientAddress, Validators.nullValidator],
            PatientMobile: [_element.PatientMobile, Validators.nullValidator],
            PatientEmail: [_element.PatientEmail, Validators.nullValidator],
        });
        this.activeModal = this.modalServicematernitypatients.open(
            content,
            this.modalOptions
        );
    }
    getReportmaternitypatients($event: any): void {
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
    }

    fileName = 'Maternity_Participants.xlsx';
    exportexcel(): void {
        /* table id is passed over here */
        let element = document.getElementById('excel-table');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.fileName);

    }
    exportToExcel() {
        this.getTableFromServer(0, 100, "", "-1");
        setTimeout(() => {
            this.exportexcel();
        }, 1000);
    }

    open(content, _type, _element) {
        this.patientForm = this.formBuilder.group({
            PatientNumber: [
                "",
                [Validators.nullValidator, Validators.pattern("[0-9].{2,}")],
            ],
            PatientId: [
                "",
                [Validators.nullValidator, Validators.pattern("[0-9].{7,}")],
            ],
            PatientFirstName: ["", Validators.nullValidator],
            PatientLastName: ["", Validators.nullValidator],
            PatientStatus: [1 + "", Validators.nullValidator],
            UserIdInsert: [
                localStorage.getItem("loginUserName"),
                Validators.nullValidator,
            ],
            PatientPregnancyDOB: ["", Validators.nullValidator],
            PatientDOB: ["", Validators.nullValidator],
            RowID: [0, Validators.nullValidator],
            MaternityRowId: [this.MaternityRowId, Validators.nullValidator],
            PatientNote: ["", Validators.nullValidator],
            PatientPregnancyWeekAtInsert: ["", Validators.nullValidator],
            PatientAddress: ["", Validators.nullValidator],
            PatientMobile: ["", Validators.nullValidator],
            PatientEmail: ["", Validators.nullValidator],
        });
        this.activeModal = this.modalServicematernitypatients.open(
            content,
            this.modalOptions
        );
    }

    checkIfExists() {
        let id = this.patientForm.controls['PatientId'].value;
        this.http
            .post(this.Api + "CheckIfMaternityPatientExists", {
                _EmployeeID: id
            })
            .subscribe((Response) => {
                let patientDetails = Response["d"];
                if (patientDetails.PatientId != null) {
                    this.patientForm = this.formBuilder.group({
                        PatientNumber: [
                            patientDetails.PatientNumber,
                            [Validators.nullValidator, Validators.pattern("[0-9].{2,}")],
                        ],
                        PatientId: [
                            patientDetails.PatientId,
                            [Validators.nullValidator, Validators.pattern("[0-9].{7,}")],
                        ],
                        PatientFirstName: [patientDetails.PatientFirstName, Validators.nullValidator],
                        PatientLastName: [patientDetails.PatientLastName, Validators.nullValidator],
                        PatientStatus: [1 + "", Validators.nullValidator],
                        UserIdInsert: [
                            localStorage.getItem("loginUserName"),
                            Validators.nullValidator,
                        ],
                        PatientPregnancyDOB: [patientDetails.PatientPregnancyDOB, Validators.nullValidator],
                        PatientDOB: [patientDetails.PatientDOB, Validators.nullValidator],
                        RowID: [0, Validators.nullValidator],
                        MaternityRowId: [this.MaternityRowId, Validators.nullValidator],
                        PatientNote: [patientDetails.PatientNote, Validators.nullValidator],
                        PatientPregnancyWeekAtInsert: [patientDetails.PatientPregnancyWeekAtInsert, Validators.nullValidator],
                        PatientAddress: [patientDetails.PatientAddress, Validators.nullValidator],
                        PatientMobile: [patientDetails.PatientMobile, Validators.nullValidator],
                        PatientEmail: [patientDetails.PatientEmail, Validators.nullValidator],
                    });
                }
            });
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

    ngAfterViewInit(): void { }
    getPaginatorData(event: PageEvent) {
        //console.log(this.paginator.pageIndex);

        this.getTableFromServer(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.fliterValPatient,
            this.StatusPatient
        );
    }
    computeEGA(iDueDateYear, iDueDateMonth, iDueDateDay) {
        var dToday = new Date();
        var dDueDate = new Date(iDueDateYear, iDueDateMonth - 1, iDueDateDay);
        var iDaysUntilDueDate = (dDueDate.getTime() - dToday.getTime()) / (1000 * 60 * 60 * 24);
        var iTotalDaysInPregnancy = 40 * 7;
        var iGestationalAgeInDays = iTotalDaysInPregnancy - iDaysUntilDueDate;
        var fGestationalAgeInWeeks = iGestationalAgeInDays / 7;
        var iEGAWeeks = Math.floor(fGestationalAgeInWeeks);
        var iEGADays = ((fGestationalAgeInWeeks % 1) * 7).toFixed(0)

        // console.log( iEGAWeeks + " weeks" );
        // console.log( iEGADays + " days" );
        return iEGAWeeks + "." + iEGADays
    }
    public getTableFromServer(
        _pageIndex: number,
        _pageSize: number,
        _FreeText: string,
        _Status: string
    ) {
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        if (this.MaternityRowId == null) {
            this.MaternityRowId = "";
        }
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/getMaternityPatientsTable",
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
                var json = JSON.parse(Response["d"]);
                let patientData = JSON.parse(json["Patients"]);
                for (var i = 0; i < patientData.length; i++) {
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

                this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                this.resultsLength = parseInt(json["totalRows"]);
                setTimeout(function () {
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }

}
