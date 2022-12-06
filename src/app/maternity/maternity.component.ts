import {
    Component,
    OnInit,
    ViewChild,
    AfterViewInit,
    Input,
    ChangeDetectorRef,
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
import { DatePipe, formatDate } from "@angular/common";
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
import * as moment from 'moment';

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
    StartProjectTime: string;
    EndProjectTime: string;
    ModeratorName: string;
    ProjectDate: string;
    Location: string;
    additionalProjectDate: string;
    ActivityRelated: string;
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
        "RowID", //"D_PERIOD_TO_REPLACE",
        // "MaternityNumber",
        "MaternityName",
        "ProjectDate",
        "ProjectLocation",
        "ProjectCost",
        "MaternityStatus",
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
    FilteredChildrenProjectsList = [];
    NewPatientsAlertList = [];
    MaternityActivityList = [];
    TABLE_DATA: Poria_Maternity[] = [];
    rowFormData = {} as Poria_Maternity;
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    userName = localStorage.getItem("loginUserName");
    resultsLength = 0;
    departStatus = 0;
    fliterVal = "";
    activeOrNot = "";
    maternityForm: FormGroup;
    parentCheckBox: any = true;
    submitted = false;
    perm: Boolean = false;
    activityID = "";
    url = "http://srv-apps-prod/RCF_WS/WebService.asmx/";
    constructor(
        public datePipe: DatePipe,
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        activeModal: NgbActiveModal,
        private mMenuPerm: MenuPerm,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {
        mMenuPerm.setRoutName("maternity");
        setTimeout(() => {
            if (!mMenuPerm.getHasPerm()) {
                localStorage.clear();
                this.router.navigate(["login"]);
            }
        }, 2000);
        this.activeModal = activeModal;
    }
    @Input()
    MaternityName: string;
    MaternityNumber: string;

    ngOnInit(): void {
        this.MaternityName = "";
        this.MaternityNumber = "";
        this.activeOrNot = "-1";
        this.loader = false;
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);
        this.maternityForm = this.formBuilder.group({
            MaternityNumber: ["", Validators.required],
            MaternityName: ["", Validators.required],
            MaternityStatus: ["", Validators.required],
            ParentProject: ["1", null],
            ProjectCost: ["", Validators.required],
            StartProjectTime: ["", null],
            EndProjectTime: ["", null],
            ModeratorName: ["", null],
            ProjectDate: ["", null],
            Location: ["", null],
            additionalProjectDate: ["", null],
            ActivityRelated: ["", null],
            MaternityInsertUser: [
                localStorage.getItem("loginUserName"),
                Validators.required,
            ],
            RowID: ["0", false],
        });
        this.getMaternityNewPatientsAlert();
        this.getMaternityActivtiesList()
    }

    applyFilter(event: Event) {
        let filterValue;
        if (event.isTrusted == undefined) {
            filterValue = event;
        } else if ((event.target as HTMLInputElement).value == "") {
            filterValue = "";
            this.FilteredChildrenProjectsList = this.ChildrenProjectsList;
        }
        else {
            filterValue = (event.target as HTMLInputElement).value;
        }
        this.FilteredChildrenProjectsList = this.FilteredChildrenProjectsList.filter(x => x.MaternityName.includes(filterValue.trim().toLowerCase()));
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


    getMaternityActivtiesList() {
        this.http
            .post(this.url + "GetMaternityActivtiesList", {
            })
            .subscribe((Response) => {
                this.MaternityActivityList = Response["d"];
            });
    }

    getMaternityNewPatientsAlert() {
        this.http
            .post(this.url + "GetMaternityNewPatientsAlert", {
            })
            .subscribe((Response) => {
                this.NewPatientsAlertList = Response["d"];
            });
    }

    setAlertToRead(row) {
        this.http
            .post(this.url + "SetMaternityAlertToRead", {
                Row_ID: row
            }).subscribe((Response) => {
                this.getMaternityNewPatientsAlert();
            });
    }

    onSubmit() {
        this.submitted = true;

        setTimeout(function () {
            $("#loader").removeClass("d-none");
        });
        let pipe = new DatePipe('en-US');
        this.maternityForm.controls['ProjectDate'].setValue(pipe.transform(this.maternityForm.controls['ProjectDate'].value, 'yyyy-MM-dd'));
        this.maternityForm.controls['additionalProjectDate'].setValue(pipe.transform(this.maternityForm.controls['additionalProjectDate'].value, 'yyyy-MM-dd'));
        this.maternityForm.controls['ActivityRelated'].setValue(this.activityID);
        let relatedProj = this.maternityForm.controls['ActivityRelated'].value;
        if (!this.maternityForm.invalid) {
            this.http
                .post(
                    this.url + "InsertOrUpdateMaternity",
                    {
                        _maternityForm: this.maternityForm.value,
                    }
                )
                .subscribe((Response) => {
                    this.getTableFromServer("", "1", relatedProj);
                    this.openSnackBar("נשמר בהצלחה");
                    setTimeout(function () {
                        $("#loader").addClass("d-none");
                    });
                });
        } else {
            this.openSnackBar("תקלה, לא נשמר!");
        }

        this.modalService.dismissAll();
    }

    showPatient(content, _type, _element) {
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
        this.MaternityName = _element.MaternityNumber;
        this.MaternityNumber = _element.MaternityName;
        this.http
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetMaternityPatientMobiles", {
                RowID: _element.RowID,
            })
            .subscribe((Response) => {

                var json = JSON.parse(Response["d"]);
                let Poria_Maternity = JSON.parse(json["MaternityPatients"]);
                var textAreaVal = "";
                for (var i = 0; i < Poria_Maternity.length; i++) {
                    textAreaVal += Poria_Maternity[i]["PatientMobile"] + " - ";
                    textAreaVal += Poria_Maternity[i]["PatientFirstName"] + " ";
                    textAreaVal += Poria_Maternity[i]["PatientLastName"] + "\r\n";
                }
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
        } else if (_type == "maternity") {
            this.parentCheckBox = true;
        }
        this.MaternityName = _element.MaternityName;
        this.MaternityNumber = _element.MaternityNumber;
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
            StartProjectTime: [_element.StartProjectTime, null],
            EndProjectTime: [_element.EndProjectTime, null],
            ModeratorName: [_element.ModeratorName, null],
            ProjectDate: [_element.ProjectDate, null],
            Location: [_element.Location, null],
            additionalProjectDate: [_element.additionalProjectDate, null],
            ActivityRelated: [_element.ActivityRelated, null],
            MaternityUpdateUser: [
                localStorage.getItem("loginUserName"),
                Validators.required,
            ],
            RowID: [_element.RowID, false],
        });
        this.parentCheckFunc(_element.ParentProject);
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                if ("Save" == result) {
                }
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }
    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
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
                this.FilteredChildrenProjectsList = Response["d"];
            });
    }

    open(content, _type, _element) {
        this.MaternityNumber = "";
        this.MaternityName = "חדש";
        this.ParentProjectName = _element;
        this.maternityForm = this.formBuilder.group({
            MaternityNumber: ["", Validators.required],
            MaternityName: ["", Validators.required],
            MaternityStatus: ["1", Validators.required],
            ParentProject: ["1", null],
            ProjectCost: ["", Validators.required],
            StartProjectTime: ["", null],
            EndProjectTime: ["", null],
            ModeratorName: ["", null],
            ProjectDate: ["", null],
            Location: ["", null],
            additionalProjectDate: ["", null],
            ActivityRelated: ["", null],
            MaternityInsertUser: [
                localStorage.getItem("loginUserName"),
                Validators.required,
            ],
            RowID: ["0", false],
        });
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                if ("Save" == result) {
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

    returnToCards() {
        this.fliterVal = "";
        this.activeOrNot = "";
        this.activityID = "";
        this.dataSource = new MatTableDataSource();
    }

    public getTableFromServer(
        _FreeText: string,
        _activeOrNot: string,
        ActivityID: string,
    ) {
        this.activityID = ActivityID;
        this.http
            .post(this.url + "GetMaternityTable", {
                _freeText: this.fliterVal,
                _activeOrNot: this.activeOrNot,
                _activityID: ActivityID,
            })
            .subscribe((Response) => {
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                var json = JSON.parse(Response["d"]);
                let Poria_Maternity = JSON.parse(json["Maternity"]);
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
                        StartProjectTime: Poria_Maternity[i].StartProjectTime,
                        EndProjectTime: Poria_Maternity[i].EndProjectTime,
                        ModeratorName: Poria_Maternity[i].ModeratorName,
                        ProjectDate: Poria_Maternity[i].ProjectDate,
                        Location: Poria_Maternity[i].Location,
                        additionalProjectDate: Poria_Maternity[i].additionalProjectDate,
                        ActivityRelated: Poria_Maternity[i].ActivityRelated,
                    });
                }

                this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                this.resultsLength = parseInt(json["totalRows"]);
            });
    }
}
