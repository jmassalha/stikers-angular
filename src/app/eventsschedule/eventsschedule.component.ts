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
export interface EventsDropDownData {
        RowID: string;
        DropDownValue: string;
}
export interface EventsScheduleRow {
        RowID: string;
        EventDeskID: string;
        EventDesk: string;
        EventCatID: string;
        EventCat: string;
        EventName: string;
        EventNote: string;
        EventPriorityID: string;
        EventPriority: string;
        EventStatusID: string;
        EventStatus: string;
        EventInsertDate: string;
        EventUpdateDate: string;
        EventInsertUser: string;
        EventUpdateUser: string;
        EventDateTime: string;
}
@Component({
        selector: "app-eventsschedule",
        templateUrl: "./eventsschedule.component.html",
        styleUrls: ["./eventsschedule.component.css"],
})
export class EventsscheduleComponent implements OnInit {
        @ViewChild(MatTable, { static: true }) table: MatTable<any>;
        @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
        @ViewChild(MatSort, { static: true }) sort: MatSort;
        horizontalPosition: MatSnackBarHorizontalPosition = "center";
        verticalPosition: MatSnackBarVerticalPosition = "top";
        displayedColumns: string[] = [
                "EventDateTime",
                "EventDesk",
                "EventCat",
                "EventName",
                "EventPriority",
                "EventStatus",
                "CLICK"
        ];
        pemAdmin = 2;
        private activeModal: NgbActiveModal;
        modalOptions: NgbModalOptions;
        closeResult: string;
        TABLE_DATA: EventsScheduleRow[] = [];
        desks: EventsDropDownData[];
        catss: EventsDropDownData[];
        eventprioritys: EventsDropDownData[];
        eventStatuss: EventsDropDownData[];
        dataSource = new MatTableDataSource(this.TABLE_DATA);
        loader: Boolean;
        tableLoader: Boolean;
        resultsLength = 0;
        departStatus = 0;
        fliterVal = "";
        DeskID = "";
        CatID = "";
        EventPriorityID = "";
        EventStatusID = "";
        startdateVal = "";
        enddateVal = "";
        EventsForm: FormGroup;
        submitted = false;
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
        EventsName: string;
        EventsNumber: string;

        ifMobile: Boolean;
        ngOnInit(): void {
                if (window.screen.width <= 798) {
                        // 768px portrait
                        this.ifMobile = true;
                } else {
                        this.ifMobile = false;
                }
                $("#loader").removeClass("d-none");
                this.DeskID = "-1";
                this.loader = false;
                this.dataSource = new MatTableDataSource(this.TABLE_DATA);
                this.EventsForm = this.formBuilder.group({
                        EventsName: ["", Validators.required],
                        EventsStatus: ["", Validators.required],
                        EventsInsertUser: [
                                localStorage.getItem("loginUserName"),
                                Validators.required,
                        ],
                        RowID: ["0", false],
                });
                console.log("sleep");
                if (
                        localStorage.getItem("loginUserName").toLowerCase() ==
                                "jmassalha" ||
                        localStorage.getItem("loginUserName").toLowerCase() ==
                                "samer" ||
                        localStorage.getItem("loginUserName").toLowerCase() ==
                                "owertheim" ||
                        localStorage.getItem("loginUserName").toLowerCase() ==
                                "waraidy"
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

                if (this.EventsForm.invalid) {
                        return;
                }
                ////debugger
                setTimeout(function () {
                        $("#loader").removeClass("d-none");
                });
                //debugger;
                this.http
                        .post(
                                "http://srv-apps/wsrfc/WebService.asmx/InsertOrUpdateEvents",
                                {
                                        _EventsForm: this.EventsForm.value,
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
                //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.EventsForm.value, null, 4));
                this.modalService.dismissAll();
        }

        showemergencymembers(content, _type, _element) {
                // debugger;
                localStorage.setItem("EventsID", _element.RowID);
                this.modalService.open(content, this.modalOptions);
        }

        SendSmsToemergencymembers(content, _type, _element) {
                // debugger;
                this.EventsName = _element.EventsName;
                this.http
                        .post(
                                "http://srv-apps/wsrfc/WebService.asmx/GetEventsMembersMobiles",
                                {
                                        RowID: _element.RowID,
                                }
                        )
                        .subscribe((Response) => {
                                //localStorage.setItem("EventsRowId", _element.RowID);

                                var Poria_Events = Response["d"];
                                var textAreaVal = "";
                                for (var i = 0; i < Poria_Events.length; i++) {
                                        textAreaVal +=
                                                Poria_Events[i]["CellNumber"] +
                                                " - ";
                                        textAreaVal +=
                                                Poria_Events[i]["FirstName"] +
                                                " ";
                                        textAreaVal +=
                                                Poria_Events[i]["LastName"] +
                                                "\r\n";
                                }
                                // debugger

                                localStorage.setItem(
                                        "smsType",
                                        "SMSEmergencyCall"
                                );
                                localStorage.setItem(
                                        "textAreaVal",
                                        textAreaVal
                                );
                                this.modalService.open(
                                        content,
                                        this.modalOptions
                                );
                        });
        }
        CloseModalSendSms() {
                this.modalService.dismissAll();
        }
        editRow(content, _type, _element) {
                this.EventsName = _element.EventsName;
                //debugger;
                this.EventsForm = this.formBuilder.group({
                        EventsName: [_element.EventsName, Validators.required],
                        EventsStatus: [
                                _element.EventsStatus + "",
                                Validators.required,
                        ],
                        EventsUpdateUser: [
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
                                this.closeResult = `Dismissed ${this.getDismissReason(
                                        reason
                                )}`;
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
                this.EventsNumber = "";
                this.EventsName = "חדש";
                ////debugger;
                this.EventsForm = this.formBuilder.group({
                        EventsName: ["", Validators.required],
                        EventsStatus: ["1", Validators.required],
                        EventsInsertUser: [
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
                                this.closeResult = `Dismissed ${this.getDismissReason(
                                        reason
                                )}`;
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
                        .post(
                                "http://srv-apps/wsrfc/WebService.asmx/GetEventss",
                                {
                                        serachTxt: _FreeText,
                                }
                        )
                        .subscribe((Response) => {
                                //////debugger
                                this.TABLE_DATA.splice(
                                        0,
                                        this.TABLE_DATA.length
                                );
                                this.TABLE_DATA = Response["d"];

                                // ////debugger
                                this.dataSource = new MatTableDataSource<any>(
                                        this.TABLE_DATA
                                );
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
