import {
    Component,
    OnInit,
    ViewChild,
    AfterViewInit,
    Input,
} from "@angular/core";
import { DatePipe } from "@angular/common";
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
import { ConfirmationDialogService } from "../confirmation-dialog/confirmation-dialog.service";
import { MenuPerm } from "../menu-perm";
export interface EventsDropDownData {
    RowID: string;
    DropDownValue: string;
}
export interface EventsDropDownData {
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
    totalRows: string;
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
    displayedColumns: string[] = ["Details", "CLICK"];
    pemAdmin = 2;
    private activeModal: NgbActiveModal;
    modalOptions: NgbModalOptions;
    closeResult: string;
    TABLE_DATA: EventsDropDownData[] = [];
    desks: EventsDropDownData[];
    catss: EventsDropDownData[];
    eventprioritys: EventsDropDownData[];
    eventStatuss: EventsDropDownData[];
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    tableLoader: Boolean;
    DeskVal: string = "";
    CatVal: string = "";
    EventPriorityVal: string = "";
    EventStatusVal: string = "";
    resultsLength = 0;
    departStatus = 0;
    fliterVal = "";
    DeskID = "";
    CatID = "";
    EventPriorityID = "-1";
    EventStatusID = "";
    startdateVal = "";
    enddateVal = "";
    EventsForm: FormGroup;
    submitted = false;
    pageSize;
    pageIndex;
    EventCatID;
    EventDeskID;
    Sdate: FormControl;
    Edate: FormControl;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        public datepipe: DatePipe,
        private confirmationDialogService: ConfirmationDialogService,
        activeModal: NgbActiveModal,
        private mMenuPerm: MenuPerm
    ) {
        mMenuPerm.setRoutName("eventsschedule");
        setTimeout(() => {
            if(!mMenuPerm.getHasPerm()){
                localStorage.clear();
                this.router.navigate(["login"]);
            }
        }, 2000);
        // //////debugger
        this.activeModal = activeModal;
    }
    @Input()
    EventsName: string;
    EventsNumber: string;

    ifMobile: Boolean;
    ngOnInit(): void {
        this.pageIndex = 0;
        this.pageSize = 50;
        this.EventCatID = "-1";
        this.EventDeskID = "-1";
        this.Sdate = new FormControl(new Date());
        this.Edate = new FormControl(new Date());
        this.startdateVal = this.Sdate.value;
        this.enddateVal = this.Edate.value;
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

        console.log("sleep");
       
        
        //$("#loader").addClass("d-none");
        this.desks = this.getDropDownLists("DeskDrop");
        this.catss = this.getDropDownLists("CatDrop");
        this.eventprioritys = this.getDropDownLists("PriorityDrop");
        this.eventStatuss = this.getDropDownLists("StatusDrop");
        let that = this;
        setTimeout(function(){
            that.getReport(that);
            $("#loader").addClass("d-none");
        }, 1500)
        setInterval(function(){
            that.getReport(that);
            console.log("Re-Load Data...!");
        }, 60 * 1000)
        //////debugger;
    }
    getDropDownLists(mType): EventsDropDownData[] {
        let mEventsDropDownData: EventsDropDownData[] = [];
        $("#loader").removeClass("d-none");
        this.http
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetDropDownsSelects", {
            //.post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetDropDownsSelects", {
                mDropDownType: mType,
                mUser: localStorage.getItem("loginUserName").toLowerCase()
            })
            .subscribe((Response: EventsDropDownData[]) => {
                // ////debugger;
                mEventsDropDownData = Response;
                switch (mType) {
                    case "DeskDrop":

                        this.desks = mEventsDropDownData["d"];
                        //////debugger
                        break;
                    case "CatDrop":
                        this.catss = mEventsDropDownData["d"];
                        // ////debugger
                        break;
                    case "PriorityDrop":
                        this.eventprioritys = mEventsDropDownData["d"];
                        //  ////debugger
                        break;
                    case "StatusDrop":
                        this.eventStatuss = mEventsDropDownData["d"];
                        //  ////debugger
                        break;
                }
            });
        return mEventsDropDownData;
    }
    search(nameKey, myArray) {
        for (var i = 0; i < myArray.length; i++) {
            if (myArray[i].RowID === nameKey) {
                return myArray[i].DropDownValue;
            }
        }
    }
    print() {
        /*DeskID
        desks
        CatID
        catss
        EventPriorityID
        eventprioritys
        EventStatusID
        eventStatuss */
        this.DeskVal = this.search(this.DeskID, this.desks);
        this.CatVal = this.search(this.CatID, this.catss);
        this.EventPriorityVal = this.search(
            this.EventPriorityID,
            this.eventprioritys
        );
        this.EventStatusVal = this.search(
            this.EventStatusID,
            this.eventStatuss
        );
       window.print();
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
        this.EventsForm.value.EventDateTime = this.EventsForm.value.EventDateTime.setMinutes(
            this.EventsForm.value.EventDateTime.getMinutes() -
                this.EventsForm.value.EventDateTime.getTimezoneOffset()
        );
        this.EventsForm.value.EventDateTime = new Date(this.EventsForm.value.EventDateTime);
       // //debugger;
        if (this.EventsForm.invalid) {
            return;
        }
        ////////debugger
        setTimeout(function () {
            $("#loader").removeClass("d-none");
        });
        //////debugger;
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/InsertOrUpdateEvent",
                //"http://srv-apps-prod/RCF_WS/WebService.asmx/InsertOrUpdateEvent",
                {
                    mEventsScheduleRow: this.EventsForm.value,
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

    CloseModalSendSms() {
        this.modalService.dismissAll();
    }
    deleteFunction() {
        ////debugger
        this.confirmationDialogService
            .confirm("נא לאשר..", "האם אתה בטוח ...? ")
            .then((confirmed) => {
                console.log("User confirmed:", confirmed);
                if (confirmed) {
                    this.EventsForm.value.RowStatus = 0;
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
    editRow(content, _type, _element) {
        this.EventsName = _element.EventsName;
        //////debugger;
        var dateString = _element.EventDateTime;
        var reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
        var dateArray = reggie.exec(dateString);
        var dateObject = new Date(
            +dateArray[1],
            +dateArray[2] - 1, // Careful, month starts at 0!
            +dateArray[3],
            +dateArray[4],
            +dateArray[5],
            +dateArray[6]
        );
        // ////debugger
        this.EventsForm = this.formBuilder.group({
            EventName: [_element.EventName, null],
            EventDeskID: [_element.EventDeskID, Validators.required],
            EventCatID: [_element.EventCatID, Validators.required],
            EventPriorityID: [_element.EventPriorityID, Validators.required],
            EventStatusID: [_element.EventStatusID, Validators.required],
            EventDateTime: [dateObject, Validators.required],
            EventNote: [_element.EventNote, null],
            EventInsertUser: [
                localStorage.getItem("loginUserName"),
                Validators.required,
            ],
            RowID: [_element.RowID, false],
            RowStatus: ["1", false],
        });
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                //////////debugger
                if ("Save" == result) {
                    // ////////debugger;
                    //this.saveChad(_element.ROW_ID);
                }
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }
    getReport($event: any): void {
        //////////debugger
        this.getTableFromServer(
            this.pageIndex,
            this.pageSize,
            this.fliterVal,
            this.EventStatusID,
            this.EventPriorityID,
            this.CatID,
            this.DeskID,
            this.startdateVal,
            this.enddateVal
        );
    }
    applyFilter(filterValue: string) {
        this.fliterVal = filterValue;

        this.getTableFromServer(
            this.pageIndex,
            this.pageSize,
            this.fliterVal,
            this.EventStatusID,
            this.EventPriorityID,
            this.CatID,
            this.DeskID,
            this.startdateVal,
            this.enddateVal
        );

        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    open(content, _type, _element) {
        this.EventsNumber = "";
        this.EventsName = "חדש";
        ////////debugger;
        this.EventsForm = this.formBuilder.group({
            EventName: ["", null],
            EventDeskID: ["", Validators.required],
            EventCatID: ["", Validators.required],
            EventPriorityID: ["", Validators.required],
            EventStatusID: ["", Validators.required],
            EventDateTime: [new Date(), Validators.required],
            EventNote: ["", null],
            EventInsertUser: [
                localStorage.getItem("loginUserName"),
                Validators.required,
            ],
            RowID: ["0", false],
            RowStatus: ["1", false],
        });
        //debugger;
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                //////////debugger
                if ("Save" == result) {
                    // ////////debugger;
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
        //////debugger

        this.getTableFromServer(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.fliterVal,
            this.EventStatusID,
            this.EventPriorityID,
            this.CatID,
            this.DeskID,
            this.startdateVal,
            this.enddateVal
        );
    }

    public getTableFromServer(
        pageIndex,
        pageSize,
        serachTxt,
        EventStatusID,
        EventPriorityID,
        EventCatID,
        EventDeskID,
        startdateVal,
        enddateVal
    ) {
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // ////////debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        //http://srv-apps-prod/RCF_WS/WebService.asmx/
        //http://srv-apps-prod/RCF_WS/WebService.asmx/
        ////debugger
        this.http
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetEventsSchedule", {
            //.post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetEventsSchedule", {
                pageIndex: pageIndex,
                pageSize: pageSize,
                serachTxt: serachTxt,
                EventStatusID: EventStatusID,
                EventPriorityID: EventPriorityID,
                EventCatID: EventCatID,
                EventDeskID: EventDeskID,
                EventDateFrom: startdateVal,
                EventDateTo: enddateVal,
                mUser: localStorage.getItem("loginUserName").toLowerCase()
            })
            .subscribe((Response) => {
                ////debugger
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                this.TABLE_DATA = Response["d"];

                // ////////debugger
                this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                this.resultsLength = this.TABLE_DATA.length;
                setTimeout(function () {
                    //////////debugger
                    //if (tableLoader) {
                    $("#loader").addClass("d-none");
                    // }
                });
            });
    }
}
