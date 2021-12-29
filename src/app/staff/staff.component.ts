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
import * as Fun from "../public.functions";
import { Time } from "@angular/common";
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
} from "@angular/forms";

export interface Staff {
    DS_ROW_ID: number;
    DS_DEPART_ID: number;
    DS_DEPART_NAME: string;
    DS_STAFF_ROLE: number;
    DS_ROLE_NAME: string;
    DS_STAFF_NAME: string;
    DS_ROW_STATUS: string;
    DS_STAFF_IMAGE: string;
    DS_STAFF_ROW_ID: string;
    DS_STAFF_STATUS?: string;
}
export interface Depart {
    id: string;
    name: string;
}
export interface Role {
    id: string;
    name: string;
}
export interface Status {
    id: string;
    name: string;
}
@Component({
    selector: "app-staff",
    templateUrl: "./staff.component.html",
    styleUrls: ["./staff.component.css"],
})
export class StaffComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    displayedColumns: string[] = [
        "DS_DEPART_ID",
        "DS_STAFF_ROLE",
        "DS_STAFF_NAME",
        "DS_STAFF_IMAGE",
        "DS_ROW_STATUS",
        "D_CLICK",
    ];
    STAFF_STATUS: Status[] = [
        {id: "0", name: "לא פעיל"},
        {id: "1", name: "פעיל"},
        ]
    DS_DEPART_ID: string;
    DS_STAFF_ROLE: string;
    DS_STAFF_IMAGE: string;
    modalOptions: NgbModalOptions;
    closeResult: string;
    TABLE_DATA: Staff[] = [];
    departs: Depart[] = [];
    roles: Role[] = [];
    departs_submit: Depart[] = [];
    roles_submit: Role[] = [];
    rowFormData = {} as Staff;
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    tableLoader: Boolean;
    resultsLength = 0;
    RoleStatus = 0;
    fliterVal = "";

    DepartmentID: string;
    RoleID: string;
    staffForm: FormGroup;
    submitted = false;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private formBuilder: FormBuilder
    ) {}
    @Input()
    foo: string = "bar";
    startdateVal: string;
    enddateVal: string;
    Sdate: FormControl;
    Edate: FormControl;
    fullnameVal: string;
    DS_STAFF_ROW_ID: string;
    DS_STAFF_STATUS: string;
    rowIdVal: string;
    rowElement: Staff = {
        DS_ROW_ID: 0,
        DS_DEPART_ID: 0,
        DS_DEPART_NAME: "",
        DS_STAFF_ROLE: 0,
        DS_ROLE_NAME: "",
        DS_STAFF_NAME: "",
        DS_ROW_STATUS: "1",
        DS_STAFF_IMAGE: "",
        DS_STAFF_ROW_ID: "",
        DS_STAFF_STATUS: "1",
    };
    ngOnInit(): void {
        this.DS_DEPART_ID = "";
        this.DS_STAFF_ROLE = "";
        this.DS_STAFF_ROW_ID = "0";
        this.DS_STAFF_IMAGE = "";
        this.DS_STAFF_STATUS = "1";
        this.DepartmentID = "-1";
        this.RoleID = "-1";
        this.fullnameVal = "";
        this.rowIdVal = "0";
        this.loader = false;
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);
        this.staffForm = this.formBuilder.group({
            fullnameVal: ["", Validators.required],
            DS_DEPART_ID: ["", Validators.required],
            DS_STAFF_ROLE: ["", Validators.required],
            DS_STAFF_IMAGE: ["", Validators.required],
            DS_STAFF_STATUS: ["1", Validators.required],
            DS_STAFF_ROW_ID: ["", false],
            rowIdVal: ["0", false],
        });

        if (
            localStorage.getItem("loginState") != "true" ||
            localStorage.getItem("loginUserName") == ""
        ) {
            this.router.navigate(["login"]);
        } else if (
            localStorage.getItem("loginUserName").toLowerCase() ==
                "jmassalha" ||
                localStorage.getItem("loginUserName").toLowerCase() ==
                    "eonn" ||
            localStorage.getItem("loginUserName").toLowerCase() == "samer" ||
            localStorage.getItem("loginUserName").toLowerCase() == "mbilya" ||
            localStorage.getItem("loginUserName").toLowerCase() == "owertheim"
        ) {
        } else {
            this.router.navigate(["login"]);
            ///$("#chadTable").DataTable();
        }
        this.getDeparts();
        this.getRoles();
        var that = this;
        setTimeout(function(){
            that.getReport(that);
        }, 500)
        
    }

    getRoles() {
        this.http
            .post("http://srv-ipracticom:8080/WebService.asmx/GetRoles", {})
            .subscribe((Response) => {
                //// //debugger
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                var json = JSON.parse(Response["d"]);
                // // //debugger
                var _d = JSON.parse(json["Roles"]);
                var i = 0;
                for (var role in _d) {
                    //// //debugger
                    var _sD: Role = { id: role, name: _d[role] };

                    this.roles.push(_sD);

                    if (i == 0) {
                        var _sDSub: Role = { id: "0", name: "בחר תפקיד" };
                        this.roles_submit.push(_sDSub);
                    } else {
                        this.roles_submit.push(_sD);
                    }
                    i++;
                }
            });
    }
    search(nameKey, myArray){
        for (var i=0; i < myArray.length; i++) {
            if (myArray[i].id === nameKey) {
                return myArray[i];
            }
        }
    }
    
    getDeparts() {
        this.http
            .post("http://srv-ipracticom:8080/WebService.asmx/GetDeparts", {})
            .subscribe((Response) => {
                //// //debugger
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                var json = JSON.parse(Response["d"]);
                // // //debugger
                var _d = JSON.parse(json["Departs"]);
                var i = 0;
                for (var depart in _d) {
                    //// //debugger
                    var _sD: Depart = { id: depart, name: _d[depart] };

                    this.departs.push(_sD);

                    if (i == 0) {
                        var _sDSub: Depart = { id: "0", name: "בחר מחלקה" };
                        this.departs_submit.push(_sDSub);
                    } else {
                        this.departs_submit.push(_sD);
                    }
                    i++;
                } /*
                $(_d).each(function(i,k){
                    // //debugger
                    //var _sD: Depart = {id: i, name: k};

                    //this.departs.push(_sD);
                })*/
                //// //debugger
            });
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
        if (this.staffForm.invalid) {
            return;
        }
        this.rowElement.DS_STAFF_NAME = this.staffForm.value.fullnameVal;
        this.rowElement.DS_DEPART_ID = this.staffForm.value.DS_DEPART_ID;
        this.rowElement.DS_STAFF_ROLE = this.staffForm.value.DS_STAFF_ROLE;
        this.rowElement.DS_STAFF_IMAGE = this.staffForm.value.DS_STAFF_IMAGE;
        this.rowElement.DS_ROW_STATUS = this.staffForm.value.DS_STAFF_STATUS;
        this.rowElement.DS_STAFF_ROW_ID = this.staffForm.value.DS_STAFF_ROW_ID;
        this.rowElement.DS_ROW_ID = this.staffForm.value.rowIdVal;
        var resultDeparts= this.search(this.staffForm.value.DS_DEPART_ID, this.departs);
        var resultRoles = this.search(this.staffForm.value.DS_STAFF_ROLE, this.roles);
        this.rowElement.DS_DEPART_NAME = resultDeparts['name'];
        this.rowElement.DS_ROLE_NAME = resultRoles['name'];
        debugger
        this.http
            .post("http://srv-ipracticom:8080/WebService.asmx/PoriaStaff", {
           // .post("https://srv-apps:4433/WebService.asmx/PoriaStaff", {
                _staffName: this.staffForm.value.fullnameVal,
                _DEPART_ID: this.staffForm.value.DS_DEPART_ID,
                _STAFF_ROLE: this.staffForm.value.DS_STAFF_ROLE, 
                _STAFF_IMAGE: this.staffForm.value.DS_STAFF_IMAGE,
                _STAFF_ROW_ID: this.staffForm.value.DS_STAFF_ROW_ID,
                _Status: this.staffForm.value.DS_STAFF_STATUS,
                _rowId: this.staffForm.value.rowIdVal,
            })
            .subscribe((Response) => {
                var json = Response["d"].split(", ");

                if (" UPDATE" != json[7]) {
                    //debugger;
                    this.departs
                    this.rowElement.DS_STAFF_NAME = json[0];
                    this.rowElement.DS_STAFF_ROLE = json[2];
                    this.rowElement.DS_STAFF_IMAGE = json[3];
                    this.rowElement.DS_ROW_STATUS = json[4];
                    this.rowElement.DS_DEPART_ID = json[5];
                    this.rowElement.DS_STAFF_ROW_ID = json[6];
                    this.rowElement.DS_ROW_ID = json[1];
                    this.TABLE_DATA.push(this.rowElement);
                    var resultDeparts= this.search(json[5], this.departs);
                    var resultRoles = this.search(json[2], this.roles);  
                    this.rowElement.DS_DEPART_NAME = resultDeparts['name'];
                    this.rowElement.DS_ROLE_NAME = resultRoles['name'];
                    this.dataSource = new MatTableDataSource<any>(
                        this.TABLE_DATA
                    );
                    this.resultsLength = this.resultsLength + 1;
                }

                //var vars = json.split
                // //debugger;
                // //debugger 888888
                this.openSnackBar();
            });
        // display form values on success
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.staffForm.value, null, 4));
        this.modalService.dismissAll();
    }
    editRow(content, _type, _element) {
       //debugger
        this.rowElement = _element;
        this.fullnameVal = _element.DS_STAFF_NAME;
        this.rowIdVal = _element.DS_ROW_ID;
        this.DS_STAFF_STATUS = _element.DS_ROW_STATUS;
        console.log(_element.DS_ROW_STATUS)
        console.log( this.DS_STAFF_STATUS)
      //  console.log(_element.DS_STAFF_ROLE)
        this.staffForm = this.formBuilder.group({
            fullnameVal: [_element.DS_STAFF_NAME, Validators.required],
            DS_DEPART_ID: [_element.DS_DEPART_ID, Validators.required],
            DS_STAFF_ROLE: [_element.DS_STAFF_ROLE, Validators.required],
            DS_STAFF_IMAGE: [_element.DS_STAFF_IMAGE, Validators.required],
            DS_STAFF_STATUS: [_element.DS_ROW_STATUS, Validators.required],
            DS_STAFF_ROW_ID: [_element.DS_STAFF_ROW_ID, false],
            rowIdVal: [_element.DS_ROW_ID, false],
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
        this.getTableFromServer(
            this.paginator.pageIndex,
            10,
            this.fliterVal,
            this.DepartmentID,
            this.RoleID
        );
    }
    applyFilter(filterValue: string) {
        this.fliterVal = filterValue;
        //debugger
        this.getTableFromServer(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.fliterVal,
            this.DepartmentID,
            this.RoleID
        );

        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    open(content, _type, _element) {
        //$('#free_text').text(_element.FreeText);
        ////debugger
        this.rowElement = {
            DS_ROW_ID: 0,
            DS_DEPART_ID: 0,
            DS_DEPART_NAME: "",
            DS_STAFF_ROLE: 0,
            DS_ROLE_NAME: "",
            DS_STAFF_NAME: "",
            DS_ROW_STATUS: "1",
            DS_STAFF_IMAGE: "",
            DS_STAFF_ROW_ID: "",
        };

        this.fullnameVal = "";
        this.rowIdVal = "0";

        this.staffForm = this.formBuilder.group({
            fullnameVal: ["", Validators.required],
            DS_DEPART_ID: ["", Validators.required],
            DS_STAFF_ROLE: ["", Validators.required],
            DS_STAFF_IMAGE: ["", Validators.required],
            DS_STAFF_STATUS: ["1", Validators.required],
            DS_STAFF_ROW_ID: ["", false],
            rowIdVal: ["0", false],
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
            this.fliterVal,
            this.DepartmentID,
            this.RoleID
        );
    }

    public getTableFromServer(
        _pageIndex: number,
        _pageSize: number,
        _FreeText: string,
        _Depart: string,
        _Role: string
    ) {
        //debugger
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // //debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        this.http
            .post("http://srv-ipracticom:8080/WebService.asmx/GetPoriaStaff", { 
                _pageIndex: _pageIndex,
                _pageSize: _pageSize,
                _FreeText: _FreeText,
                _Depart: this.DepartmentID,
                _Role: this.RoleID,
            })
            .subscribe((Response) => {
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                var json = JSON.parse(Response["d"]);
                let StaffData = JSON.parse(json["aaData"]);
                ////debugger
                for (var i = 0; i < StaffData.length; i++) {
                    ////debugger
                    var  resultDeparts= this.search(StaffData[i].DS_DEPART_ID, this.departs);
                    var resultRoles = this.search(StaffData[i].DS_STAFF_ROLE, this.roles);
                 
                    this.TABLE_DATA.push({
                        DS_ROW_ID: StaffData[i].DS_ROW_ID,
                        DS_DEPART_ID: StaffData[i].DS_DEPART_ID,
                        DS_DEPART_NAME: resultDeparts['name'],
                        DS_STAFF_ROLE: StaffData[i].DS_STAFF_ROLE,   
                        DS_ROLE_NAME: resultRoles['name'],
                        DS_STAFF_NAME: StaffData[i].DS_STAFF_NAME,
                        DS_ROW_STATUS: StaffData[i].DS_ROW_STATUS,
                        DS_STAFF_STATUS: StaffData[i].DS_ROW_STATUS,
                        DS_STAFF_IMAGE: StaffData[i].DS_STAFF_IMAGE,
                        DS_STAFF_ROW_ID: StaffData[i].DS_STAFF_ROW_ID,
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
