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
} from "@ng-bootstrap/ng-bootstrap";
import * as $ from "jquery";
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
} from "@angular/forms";

export interface Depart {
    D_ID: number;
    D_PERIOD_TO_REPLACE: string;
    D_NAME: string;
    D_STATUS: string;
    D_ROOMS_NUMBER: string;
}

export interface Room {
    R_ID: number;
    R_D_ID: string;
    R_NUMBER: string;
    R_NUMBER_OF_BEDS: string;
    R_STATUS: string;
}

export interface Bed {
    B_ID: number;
    B_D_ID: string;
    B_R_ID: string;
    B_ROOM_NUMBER: string;
    B_NUMBER: string;
    B_STATUS: string;
    B_LAST_REPLACE_DATE: string;
    B_NEXT_REPLACE_DATE: string;
    GROUP_CLASS: string;
}
@Component({
    selector: "app-cortinasdeparts",
    templateUrl: "./cortinasdeparts.component.html",
    styleUrls: ["./cortinasdeparts.component.css"],
})
export class CortinasdepartsComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    displayedColumns: string[] = [
        "D_NAME", //"D_PERIOD_TO_REPLACE",
        "D_PERIOD_TO_REPLACE",
        "D_ROOMS_NUMBER",
        "D_CLICK",
        "D_CLICK_ROOMS",
        "D_CLICK_BEDS",
    ];
    modalOptions: NgbModalOptions;
    closeResult: string;
    TABLE_DATA: Depart[] = [];
    rooms: Room[] = [];
    beds: Bed[] = [];
    rowFormData = {} as Depart;
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    tableLoader: Boolean;
    resultsLength = 0;
    departStatus = 0;
    fliterVal = "";
    departsForm: FormGroup;
    roomsForm: FormGroup;
    roomsBedsForm: FormGroup;
    submitted = false;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private formBuilder: FormBuilder
    ) {
        this.roomsForm = this.formBuilder.group({
            roomsDetails: this.formBuilder.array([]),
        });
        this.roomsBedsForm = this.formBuilder.group({
            roomsBedsDetails: this.formBuilder.array([]),
        });
    }
    @Input()
    D_NAME: string;
    D_ID: string;
    ngOnInit(): void {
        this.D_NAME = "";
        this.D_ID = "";
        this.loader = false;
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);
        this.departsForm = this.formBuilder.group({
            D_NAME: ["", Validators.required],
            D_PERIOD_TO_REPLACE: ["", Validators.required],
            D_ROOMS_NUMBER: ["", Validators.required],
            D_STATUS: ["1", false],
            D_ID: ["0", false],
        });

        if (
            localStorage.getItem("loginState") != "true" ||
            localStorage.getItem("loginUserName") == ""
        ) {
            this.router.navigate(["login"]);
        } else if (
            localStorage.getItem("loginUserName").toLowerCase() ==
                "jmassalha" ||
            localStorage.getItem("loginUserName").toLowerCase() == "eonn" ||
            localStorage.getItem("loginUserName").toLowerCase() == "samer" ||
            localStorage.getItem("loginUserName").toLowerCase() == "sharush" ||
            localStorage.getItem("loginUserName").toLowerCase() ==
                "owertheim" 
                ||
            localStorage.getItem("loginUserName").toLowerCase() == "tklinger"
                ||
            localStorage.getItem("loginUserName").toLowerCase() == "lyizhak" ||
            localStorage.getItem("loginUserName").toLowerCase() == ("MESHEK").toLowerCase()
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
        ////debugger
        // stop here if form is invalid
        if (this.departsForm.invalid) {
            return;
        }
        setTimeout(function () {
            $("#loader").removeClass("d-none");
        });
        this.http
            .post(
                "http://srv-apps/wsrfc/WebService.asmx/SubmitCortinasDepart",
                {
                    DepartRow: this.departsForm.value,
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
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.departsForm.value, null, 4));
        this.modalService.dismissAll();
    }
    onSubmitRooms() {
        this.submitted = true;
        //debugger;
        // stop here if form is invalid
        if (this.roomsForm.invalid) {
            return;
        }
        //return;
        setTimeout(function () {
            $("#loader").removeClass("d-none");
        });
        this.http
            .post(
                "http://srv-apps/wsrfc/WebService.asmx/SubmitCortinasDepartRooms",
                {
                    DepartRoomRows: this.roomsForm.value.roomsDetails,
                }
            )
            .subscribe((Response) => {
                this.openSnackBar();
                this.modalService.dismissAll();
                setTimeout(function () {
                    $("#loader").addClass("d-none");
                });
            });
        // display form values on success
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.departsForm.value, null, 4));
    }

    onSubmitBeds() {
        this.submitted = true;
        //debugger;

        //debugger
        // return;
        // stop here if form is invalid
        if (this.roomsBedsForm.invalid) {
            return;
        }
        setTimeout(function () {
            $("#loader").removeClass("d-none");
        });
        this.http
            .post(
                "http://srv-apps/wsrfc/WebService.asmx/SubmitCortinasDepartRoomsBeds",
                {
                    DepartRoomBedsRows: this.roomsBedsForm.value
                        .roomsBedsDetails,
                }
            )
            .subscribe((Response) => {
                this.openSnackBar();
                this.modalService.dismissAll();
                setTimeout(function () {
                    $("#loader").addClass("d-none");
                });
            });
        // display form values on success
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.departsForm.value, null, 4));
        //this.modalService.dismissAll();
    }

    showBeds(content, _type, _element) {
        //debugger
        this.beds = null;
        this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
        setTimeout(function () {
            ////debugger

            $("#loader").removeClass("d-none");
        });
        this.D_NAME = _element.D_NAME;
        this.D_ID = _element.D_ID;
        this.http
            .post(
                "http://srv-apps/wsrfc/WebService.asmx/GetCortinasDepartRoomsBeds",
                {
                    _DepartID: _element.D_ID,
                }
            )
            .subscribe((Response) => {
                //  //debugger

                var json = $.parseJSON(Response["d"]);
                let DepartsRoomsBedsData = $.parseJSON(json["Beds"]);
                this.beds = DepartsRoomsBedsData;
                /*
                
                *****
                
                */
                var now = "0",
                    last = "0";

                for (var t = 0; t < DepartsRoomsBedsData.length; t++) {
                    now = DepartsRoomsBedsData[t].B_R_ID;
                    //debugger
                    if( parseInt(now)  != parseInt(last) ){

                        this.beds[t].GROUP_CLASS = "group-border";
                        last = DepartsRoomsBedsData[t].B_R_ID;
                    }
                }
                ////debugger
                this.roomsBedsForm = this.formBuilder.group({
                    roomsBedsDetails: this.formBuilder.array(
                        DepartsRoomsBedsData.map((x) =>
                            this.formBuilder.group({
                                B_ID: [x.B_ID, Validators.required],
                                B_D_ID: [x.B_D_ID, Validators.required],
                                B_R_ID: [x.B_R_ID, Validators.required],
                                B_NUMBER: [x.B_NUMBER, Validators.required],
                                B_STATUS: [x.B_STATUS, Validators.required],
                                B_LAST_REPLACE_DATE: [
                                    x.B_LAST_REPLACE_DATE == ""
                                        ? ""
                                        : new FormControl(
                                              new Date(x.B_LAST_REPLACE_DATE)
                                          ).value,
                                    false,
                                ],
                                B_NEXT_REPLACE_DATE: ["", false],
                                B_ROOM_NUMBER: [x.B_ROOM_NUMBER, false],
                            })
                        )
                    ),
                });

                // //debugger

                setTimeout(function () {
                    ////debugger

                    $("#loader").addClass("d-none");
                });
            });
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                ////debugger
                if ("Save" == result) {
                    // //debugger;
                    //this.saveChad(_element.ROW_ID);
                }
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }
    showRooms(content, _type, _element) {
        this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
        this.rooms = null;
        setTimeout(function () {
            ////debugger

            $("#loader").removeClass("d-none");
        });
        this.D_NAME = _element.D_NAME;
        this.D_ID = _element.D_ID;
        this.http
            .post(
                "http://srv-apps/wsrfc/WebService.asmx/GetCortinasDepartRooms",
                {
                    _DepartID: _element.D_ID,
                }
            )
            .subscribe((Response) => {
                //  //debugger

                var json = $.parseJSON(Response["d"]);
                let DepartsRoomsData = $.parseJSON(json["Rooms"]);
                ////debugger
                this.rooms = DepartsRoomsData;
                this.roomsForm = this.formBuilder.group({
                    roomsDetails: this.formBuilder.array(
                        DepartsRoomsData.map((x) =>
                            this.formBuilder.group({
                                R_ID: [x.R_ID, Validators.required],
                                R_D_ID: [x.R_D_ID, Validators.required],
                                R_NUMBER: [x.R_NUMBER, Validators.required],
                                R_NUMBER_OF_BEDS: [
                                    x.R_NUMBER_OF_BEDS,
                                    Validators.required,
                                ],
                                R_STATUS: [x.R_STATUS, Validators.required],
                            })
                        )
                    ),
                });

                // //debugger

                setTimeout(function () {
                    ////debugger

                    $("#loader").addClass("d-none");
                });
            });
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                ////debugger
                if ("Save" == result) {
                    // //debugger;
                    //this.saveChad(_element.ROW_ID);
                }
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }
    editRow(content, _type, _element) {
        this.D_NAME = _element.D_NAME;
        this.D_ID = _element.D_ID;
        this.departsForm = this.formBuilder.group({
            D_NAME: [_element.D_NAME, Validators.required],
            D_PERIOD_TO_REPLACE: [
                _element.D_PERIOD_TO_REPLACE,
                Validators.required,
            ],
            D_ROOMS_NUMBER: [_element.D_ROOMS_NUMBER, Validators.required],
            D_STATUS: [_element.D_STATUS, false],
            D_ID: [_element.D_ID, false],
        });
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                ////debugger
                if ("Save" == result) {
                    // //debugger;
                    //this.saveChad(_element.ROW_ID);
                }
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }
    getReport($event: any): void {
        ////debugger
        this.getTableFromServer(this.paginator.pageIndex, 10, this.fliterVal);
    }
    applyFilter(filterValue: string) {
        this.fliterVal = filterValue;

        this.getTableFromServer(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.fliterVal
        );

        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    open(content, _type, _element) {
        this.D_NAME = "";
        this.D_ID = "חדשה";
        //debugger;
        this.departsForm = this.formBuilder.group({
            D_NAME: ["", Validators.required],
            D_PERIOD_TO_REPLACE: ["", Validators.required],
            D_ROOMS_NUMBER: ["", Validators.required],
            D_STATUS: ["1", false],
            D_ID: ["0", false],
        });
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                ////debugger
                if ("Save" == result) {
                    // //debugger;
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

        this.getTableFromServer(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.fliterVal
        );
    }

    public getTableFromServer(
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
            .post("http://srv-apps/wsrfc/WebService.asmx/GetCortinasDepart", {
                _pageIndex: _pageIndex,
                _pageSize: _pageSize,
                _FreeText: _FreeText,
            })
            .subscribe((Response) => {
                ////debugger
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                var json = $.parseJSON(Response["d"]);
                let DepartsData = $.parseJSON(json["aaData"]);
                ////debugger
                for (var i = 0; i < DepartsData.length; i++) {
                    this.TABLE_DATA.push({
                        D_ID: DepartsData[i].D_ID,
                        D_PERIOD_TO_REPLACE: DepartsData[i].D_PERIOD_TO_REPLACE,
                        D_NAME: DepartsData[i].D_NAME,
                        D_STATUS: DepartsData[i].D_STATUS,
                        D_ROOMS_NUMBER: DepartsData[i].D_ROOMS_NUMBER,
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
