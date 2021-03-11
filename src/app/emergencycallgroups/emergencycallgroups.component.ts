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
export interface Poria_Group {
    RowID: number;
    GroupNumber: string;
    GroupName: string;
    GroupInsertDate: string;
    GroupUpdateDate: string;
    GroupInsertUser: string;
    GroupUpdateUser: string;
    GroupStatus: string;
    ProjectCost: string;
}
export interface Poria_GroupPatients {
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
@Component({
    selector: "app-emergencycallgroups",
    templateUrl: "./emergencycallgroups.component.html",
    styleUrls: ["./emergencycallgroups.component.css"],
})
export class EmergencycallgroupsComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    displayedColumns: string[] = [
        "GroupName",
        "GroupStatus",
        "CLICK",
        "CLICK_emergencymembers",
        "SEND_SMS_emergencymembers",
    ];
    pemAdmin = 2;
    private activeModal: NgbActiveModal;
    modalOptions: NgbModalOptions;
    closeResult: string;
    TABLE_DATA: Poria_Group[] = [];
    rowFormData = {} as Poria_Group;
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    tableLoader: Boolean;
    resultsLength = 0;
    departStatus = 0;
    fliterVal = "";
    activeOrNot = "";
    GroupForm: FormGroup;
    submitted = false;
    perm: Boolean = false;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        activeModal: NgbActiveModal
    ) {
        // //debugger
        this.activeModal = activeModal;
    }
    @Input()
    GroupName: string;
    GroupNumber: string;

    ngOnInit(): void {
        $("#loader").removeClass("d-none");
        this.GroupName = "";
        this.GroupNumber = "";
        this.activeOrNot = "-1";
        this.loader = false;
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);
        this.GroupForm = this.formBuilder.group({
            GroupName: ["", Validators.required],
            GroupStatus: ["", Validators.required],
            GroupInsertUser: [
                localStorage.getItem("loginUserName"),
                Validators.required,
            ],
            RowID: ["0", false],
        });
        console.log("sleep");
        if (
            localStorage.getItem("loginUserName").toLowerCase() ==
                "jmassalha" ||
            localStorage.getItem("loginUserName").toLowerCase() == "samer" ||
            localStorage.getItem("loginUserName").toLowerCase() == "owertheim"
            || localStorage.getItem("loginUserName").toLowerCase() == "waraidy"
        ) {
        } else {
            this.router.navigate(["login"]);
            ///$("#chadTable").DataTable();
        }
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
        //////debugger

        if (this.GroupForm.invalid) {
            return;
        }
        ////debugger
        setTimeout(function () {
            $("#loader").removeClass("d-none");
        });
        //debugger;
        this.http
            .post(
                "http://srv-apps/wsrfc/WebService.asmx/InsertOrUpdateGroup",
                {
                    _GroupForm: this.GroupForm.value,
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
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.GroupForm.value, null, 4));
        this.modalService.dismissAll();
    }

    showemergencymembers(content, _type, _element) {
        // debugger;
        localStorage.setItem("GroupID", _element.RowID);
        this.modalService.open(content, this.modalOptions);
    }

    SendSmsToemergencymembers(content, _type, _element) {
        // debugger;
        this.GroupName = _element.GroupName;
        this.http
            .post(
                "http://srv-apps/wsrfc/WebService.asmx/GetGroupMembersMobiles",
                {
                    RowID: _element.RowID,
                }
            )
            .subscribe((Response) => {
                //localStorage.setItem("GroupRowId", _element.RowID);

                var Poria_Group = Response["d"];
                var textAreaVal = "";
                for (var i = 0; i < Poria_Group.length; i++) {
                    textAreaVal += Poria_Group[i]["CellNumber"] + " - ";
                    textAreaVal += Poria_Group[i]["FirstName"] + " ";
                    textAreaVal += Poria_Group[i]["LastName"] + "\r\n";
                }
                // debugger

                localStorage.setItem("smsType", "SMSEmergencyCall");
                localStorage.setItem("textAreaVal", textAreaVal);
                this.modalService.open(content, this.modalOptions);
            });
    }
    CloseModalSendSms(){
        this.modalService.dismissAll();
    }
    editRow(content, _type, _element) {
        this.GroupName = _element.GroupName;
        //debugger;
        this.GroupForm = this.formBuilder.group({
            GroupName: [_element.GroupName, Validators.required],
            GroupStatus: [_element.GroupStatus + "", Validators.required],
            GroupUpdateUser: [
                localStorage.getItem("loginUserName"),
                Validators.required,
            ],
            RowID: [_element.RowID, false],
        });
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
    getReport($event: any): void {
        //////debugger
        this.getTableFromServer(this.fliterVal);
    }
    applyFilter(filterValue: string) {
        this.fliterVal = filterValue;

        this.getTableFromServer(this.fliterVal);

        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    open(content, _type, _element) {
        this.GroupNumber = "";
        this.GroupName = "חדש";
        ////debugger;
        this.GroupForm = this.formBuilder.group({
            GroupName: ["", Validators.required],
            GroupStatus: ["1", Validators.required],
            GroupInsertUser: [
                localStorage.getItem("loginUserName"),
                Validators.required,
            ],
            RowID: ["0", false],
        });
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

    ngAfterViewInit(): void {}
    getPaginatorData(event: PageEvent) {
        //console.log(this.paginator.pageIndex);

        this.getTableFromServer(this.fliterVal);
    }

    public getTableFromServer(_FreeText: string) {
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // ////debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        //http://srv-apps/wsrfc/WebService.asmx
        //http://srv-apps/wsrfc/WebService.asmx
        this.http
            .post("http://srv-apps/wsrfc/WebService.asmx/GetGroups", {
                serachTxt: _FreeText,
            })
            .subscribe((Response) => {
                //////debugger
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                this.TABLE_DATA = Response["d"];

                // ////debugger
                this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                this.resultsLength = this.TABLE_DATA.length;
                setTimeout(function () {
                    //////debugger
                    //if (tableLoader) {
                    $("#loader").addClass("d-none");
                    // }
                });
            });
    }
}
