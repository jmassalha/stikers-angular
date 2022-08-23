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
import { formatDate } from "@angular/common";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";

import {
    NgbModal,
    ModalDismissReasons,
    NgbModalOptions,
    NgbActiveModal,
} from "@ng-bootstrap/ng-bootstrap";
import * as $ from "jquery";
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
} from "@angular/forms";
import { MenuPerm } from "../menu-perm";
import { MaternityPatients, MaternitypatientsComponent } from '../maternitypatients/maternitypatients.component';

export interface Poria_Maternity {
    RowID: number;
    MaternityNumber: string;
    MaternityName: string;
    MaternityInsertDate: string;
    MaternityUpdateDate: string;
    MaternityInsertUser: string;
    MaternityUpdateUser: string;
    MaternityStatus: string;
    ParentProject: string;
    ProjectCost: string;
}
export interface Poria_MaternityPatients {
    RowID: number;
    PatientId: string;
    PatientFirstName: string;
    PatientLastName: string;
    DateInsert: string;
    UserIdInsert: string;
    DateUpdate: string;
    UserIdUpdate: string;
    PatientStatus: string;
    PatientNumber: string;
    PatientMobile: string;
    PatientEmail: string;
    PatientAddress: string;
    PatientDOB: string;
    PatientPregnancyWeekAtInsert: string;
    PatientPregnancyDOB: string;
    PatientNote: string;
}
export const getDate = function (date: any): string {
    const _date = new Date(date);
    return `${_date.getFullYear()}-${_date.getMonth()}-${_date.getDate()}`;
};
@Component({
    selector: "app-maternity",
    templateUrl: "./maternity.component.html",
    styleUrls: ["./maternity.component.css"],
})
export class MaternityComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    displayedColumns: string[] = [
        //"RowID", //"D_PERIOD_TO_REPLACE",
        "MaternityNumber",
        "MaternityName",
        "MaternityStatus",
        "ProjectCost",
        "CLICK_PROJ_CHILD",
        "CLICK",
        "CLICK_PATIENT",
        "SEND_SMS_PATIENT",
    ];
    ProjectNumber;
    ProjectName;
    ParentProjectName: string;
    pemAdmin = 2;
    private activeModal: NgbActiveModal;
    modalOptions: NgbModalOptions;
    closeResult: string;
    ParentProjectsList = [];
    ChildrenProjectsList = [];
    TABLE_DATA: Poria_Maternity[] = [];
    rowFormData = {} as Poria_Maternity;
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    tableLoader: Boolean;
    resultsLength = 0;
    departStatus = 0;
    fliterVal = "";
    activeOrNot = "";
    maternityForm: FormGroup;
    parentCheckBox: any = true;
    submitted = false;
    perm: Boolean = false;
    url = "http://srv-apps-prod/RCF_WS/WebService.asmx/";
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        activeModal: NgbActiveModal,
        private mMenuPerm: MenuPerm
    ) {
        mMenuPerm.setRoutName("maternity");
        setTimeout(() => {
            if (!mMenuPerm.getHasPerm()) {
                localStorage.clear();
                this.router.navigate(["login"]);
            }
        }, 2000);
        /*maternity*/
        // ////debugger
        this.activeModal = activeModal;
    }
    @Input()
    MaternityName: string;
    MaternityNumber: string;

    ngOnInit(): void {
        $("#loader").removeClass("d-none");
        this.MaternityName = "";
        this.MaternityNumber = "";
        this.activeOrNot = "-1";
        this.loader = false;
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);
        this.maternityForm = this.formBuilder.group({
            MaternityNumber: ["", Validators.required],
            MaternityName: ["", Validators.required],
            MaternityStatus: ["", Validators.required],
            ParentProject: ["", null],
            ProjectCost: ["", Validators.required],
            MaternityInsertUser: [
                localStorage.getItem("loginUserName"),
                Validators.required,
            ],
            RowID: ["0", false],
        });
        console.log("sleep");

        this.getReport(this);
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
        ////////debugger

        if (this.maternityForm.invalid) {
            return;
        }
        //////debugger
        setTimeout(function () {
            $("#loader").removeClass("d-none");
        });
        //debugger;
        this.http
            .post(
                this.url + "InsertOrUpdateMaternity",
                {
                    _maternityForm: this.maternityForm.value,
                }
            )
            .subscribe((Response) => {
                this.getReport(null);
                this.openSnackBar();
                setTimeout(function () {
                    $("#loader").addClass("d-none");
                });
            });
        // display form values on success
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.maternityForm.value, null, 4));
        this.modalService.dismissAll();
    }

    showPatient(content, _type, _element) {
        // localStorage.setItem("MaternityRowId", _element.RowID);
        let dialog = this.modalService.open(MaternitypatientsComponent, this.modalOptions);
        dialog.componentInstance.MaternityRowId = _element.RowID;
        dialog.componentInstance.MaternityName = 'בפרויקט ' + _element.MaternityName;
    }

    parentCheckFunc(event) {
        if (event) {
            this.maternityForm.controls['ParentProject'].clearValidators();
        } else {
            this.maternityForm.controls['ParentProject'].setValidators([Validators.required]);
        }
    }

    SendSmsToPatient(content, _type, _element) {
        // //debugger;
        this.MaternityName = _element.MaternityNumber;
        this.MaternityNumber = _element.MaternityName;
        this.http
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetMaternityPatientMobiles", {
                RowID: _element.RowID,
            })
            .subscribe((Response) => {
                //localStorage.setItem("MaternityRowId", _element.RowID);

                var json = JSON.parse(Response["d"]);
                let Poria_Maternity = JSON.parse(json["MaternityPatients"]);
                var textAreaVal = "";
                for (var i = 0; i < Poria_Maternity.length; i++) {
                    textAreaVal += Poria_Maternity[i]["PatientMobile"] + " - ";
                    textAreaVal += Poria_Maternity[i]["PatientFirstName"] + " ";
                    textAreaVal += Poria_Maternity[i]["PatientLastName"] + "\r\n";
                }
                // //debugger
                localStorage.setItem("smsType", "SMSMaternity");
                localStorage.setItem("textAreaVal", textAreaVal);
                this.modalService.open(content, this.modalOptions);
            });


    }
    CloseModalSendSms() {
        this.modalService.dismissAll();
    }
    editRow(content, _type, _element) {
        if (_type == "subProjEdit") {
            this.parentCheckBox = false;
        }
        this.MaternityName = _element.MaternityName;
        this.MaternityNumber = _element.MaternityNumber;
        ////debugger;
        this.maternityForm = this.formBuilder.group({
            MaternityNumber: [_element.MaternityNumber, Validators.required],
            MaternityName: [_element.MaternityName, Validators.required],
            MaternityStatus: [
                _element.MaternityStatus + "",
                Validators.required,
            ],
            ParentProject: [
                _element.ParentProject,
                null,
            ],
            ProjectCost: [_element.ProjectCost, Validators.required],
            MaternityUpdateUser: [
                localStorage.getItem("loginUserName"),
                Validators.required,
            ],
            RowID: [_element.RowID, false],
        });
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                ////////debugger
                if ("Save" == result) {
                    // //////debugger;
                    //this.saveChad(_element.ROW_ID);
                }
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }
    getReport($event: any): void {
        ////////debugger
        this.getTableFromServer(
            this.paginator.pageIndex,
            10,
            this.fliterVal,
            this.activeOrNot
        );
    }
    applyFilter(filterValue: string) {
        this.fliterVal = filterValue;

        this.getTableFromServer(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.fliterVal,
            this.activeOrNot
        );

        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    getParentProjects() {
        this.http
            .post(this.url + "GetParentMaternityProjects", {
            })
            .subscribe((Response) => {
                this.ParentProjectsList = Response["d"];
            });
    }

    getChildrenProjects(rowID) {
        this.http
            .post(this.url + "GetChildrenMaternityProjects", {
                ParentID: rowID
            })
            .subscribe((Response) => {
                this.ChildrenProjectsList = Response["d"];
            });
    }

    open(content, _type, _element) {
        this.MaternityNumber = "";
        this.MaternityName = "חדש";
        this.ParentProjectName = _element;
        //////debugger;
        this.maternityForm = this.formBuilder.group({
            MaternityNumber: ["", Validators.required],
            MaternityName: ["", Validators.required],
            MaternityStatus: ["1", Validators.required],
            ParentProject: ["", null],
            ProjectCost: ["", Validators.required],
            MaternityInsertUser: [
                localStorage.getItem("loginUserName"),
                Validators.required,
            ],
            RowID: ["0", false],
        });
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                ////////debugger
                if ("Save" == result) {
                    // //////debugger;
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

    ngAfterViewInit(): void { }
    getPaginatorData(event: PageEvent) {
        //console.log(this.paginator.pageIndex);

        this.getTableFromServer(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.fliterVal,
            this.activeOrNot
        );
    }

    public getTableFromServer(
        _pageIndex: number,
        _pageSize: number,
        _FreeText: string,
        _activeOrNot: string
    ) {
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // //////debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        //http://srv-apps-prod/RCF_WS/WebService.asmx/
        //http://srv-apps-prod/RCF_WS/WebService.asmx/
        this.http
            //.post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetMaternityTable", {
            .post(this.url + "GetMaternityTable", {
                _pageIndex: _pageIndex,
                _pageSize: _pageSize,
                _freeText: _FreeText,
                _activeOrNot: _activeOrNot,
            })
            .subscribe((Response) => {
                //debugger
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                var json = JSON.parse(Response["d"]);
                let Poria_Maternity = JSON.parse(json["Maternity"]);
                //  ////debugger
                for (var i = 0; i < Poria_Maternity.length; i++) {
                    this.TABLE_DATA.push({
                        RowID: Poria_Maternity[i].RowID,
                        MaternityNumber: Poria_Maternity[i].MaternityNumber,
                        MaternityName: Poria_Maternity[i].MaternityName,
                        MaternityInsertDate:
                            Poria_Maternity[i].MaternityInsertDate,
                        MaternityUpdateDate:
                            Poria_Maternity[i].MaternityUpdateDate,
                        MaternityInsertUser:
                            Poria_Maternity[i].MaternityInsertUser,
                        MaternityUpdateUser:
                            Poria_Maternity[i].MaternityUpdateUser,
                        MaternityStatus: Poria_Maternity[i].MaternityStatus,
                        ParentProject: Poria_Maternity[i].ParentProject,
                        ProjectCost: Poria_Maternity[i].ProjectCost,
                    });
                }

                // //////debugger
                this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                this.resultsLength = parseInt(json["totalRows"]);
                setTimeout(function () {
                    ////////debugger
                    //if (tableLoader) {
                    $("#loader").addClass("d-none");
                    // }
                });
            });
    }
}
