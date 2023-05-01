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
import { MenuPerm } from "../menu-perm";

export interface Depart {
    D_ROW_ID: number;
    D_SHEET_ID: string;
    D_NAME: string;
    D_ROW_STATUS: string;
    D_SEND_SMS: string;
    SEODE_NAME: string;
    D_SMS_TEXT: string;
}

@Component({
    selector: "app-poriadeparts",
    templateUrl: "./poriadeparts.component.html",
    styleUrls: ["./poriadeparts.component.css"],
})
export class PoriadepartsComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    displayedColumns: string[] = [
        "D_NAME", //"D_SHEET_ID",
        "D_SEND_SMS",
        "D_SMS_TEXT",
        "D_LINK",
        "D_CLICK",
    ];

    modalOptions: NgbModalOptions;
    closeResult: string;
    TABLE_DATA: Depart[] = [];
    rowFormData = {} as Depart;
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    tableLoader: Boolean;
    resultsLength = 0;
    departStatus = 0;
    fliterVal = "";
    departsForm: FormGroup;
    submitted = false;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private formBuilder: FormBuilder
        ,
        private mMenuPerm: MenuPerm
    ) {
        mMenuPerm.setRoutName("poriadeparts");
        setTimeout(() => {
            if(!mMenuPerm.getHasPerm()){
                localStorage.clear();
                this.router.navigate(["login"]);
            }
        }, 2000);}
    @Input()
    foo: string = "bar";
    startdateVal: string;
    enddateVal: string;
    Sdate: FormControl;
    Edate: FormControl;
    fullnameVal: string;
    active_sheet: string;
    active_sheet_bool: Boolean;
    sms_text: string;
    idSheet: string;
    rowIdVal: string;
    rowElement: Depart = {
        D_ROW_ID: 0,
        D_SHEET_ID: '',
        D_NAME: '',
        D_ROW_STATUS: '',
        D_SEND_SMS: '',
        SEODE_NAME: '',
        D_SMS_TEXT: ''
    };
    ngOnInit(): void {
        this.fullnameVal = "";
        this.active_sheet = "0";
        if(this.active_sheet == "0"){
            this.active_sheet_bool = false;
        }else{
            this.active_sheet_bool = true;
        }
        this.sms_text = "";
        this.idSheet = "-1";
        this.rowIdVal = "0";
        this.loader = false;
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);
        this.departsForm = this.formBuilder.group({
            fullnameVal: ["", Validators.required],
            SEODE_NAME: ["", Validators.required],
            active_sheet: ["", false],
            sms_text: ["", Validators.required],
            idSheet: ["", false],
            rowIdVal: ["", false],
        });

       
        this.getReport(this);
    }
    openLink(element: any){
      //  //debugger
        window.open("https://poria.is-great.org/clicktothank/?id="+element.D_SHEET_ID, "_blank");
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
        // stop here if form is invalid
        if (this.departsForm.invalid) {
            return;
        }
       
        this.rowElement.D_NAME = this.departsForm.value.fullnameVal;
        this.rowElement.D_ROW_ID = this.departsForm.value.rowIdVal;
        this.rowElement.D_SHEET_ID = this.departsForm.value.idSheet;
        if( this.active_sheet == "0"){
            this.active_sheet = "לא";
        }else{
            this.active_sheet = "כן";
        }
        this.rowElement.D_SEND_SMS = this.active_sheet;
        if( this.active_sheet == "לא"){
            this.active_sheet = "0";
        }else{
            this.active_sheet = "1";
        }
        this.rowElement.D_SMS_TEXT = this.departsForm.value.sms_text;
        ////debugger
        this.http
            .post("http://srv-ipracticom:8080/WebService.asmx/PoriaDeparts", {
                _departName: this.departsForm.value.fullnameVal,
                _departStatus: 1,
                _sheetId: this.departsForm.value.idSheet,
                _rowId: this.departsForm.value.rowIdVal,
                _sendSms:  this.active_sheet,
                _smsText: this.departsForm.value.sms_text,
                SEODE_NAME: this.departsForm.value.SEODE_NAME,
            })
            .subscribe((Response) => {
                var json = Response["d"].split(", ");;
                ////debugger       
                if(" UPDATE" != json[3]){
                    this.rowElement.D_NAME = json[0];
                    this.rowElement.D_SHEET_ID = json[1];
                    this.rowElement.D_ROW_ID = json[2];
                    if( json[4] == "0"){
                        json[4] = "לא";
                    }else{
                        json[4] = "כן";
                    }
                    this.rowElement.D_SEND_SMS = json[3];
                    this.rowElement.D_SMS_TEXT = json[4];
                    this.TABLE_DATA.push(this.rowElement);
                    this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                    this.resultsLength = this.resultsLength + 1;
                }
              
                 
                //var vars = json.split
               // ////debugger;
                // ////debugger 888888
                this.openSnackBar();
            });
        // display form values on success
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.departsForm.value, null, 4));
        this.modalService.dismissAll();
    }
    changeActive($event){
        if($event.checked){
            this.active_sheet = "1";
        }else{
            this.active_sheet = "0";
        }
    }
    editRow(content, _type, _element) {
        //////debugger
        this.rowElement = _element;
        this.fullnameVal = _element.D_NAME;
        this.rowIdVal = _element.D_ROW_ID;
        this.idSheet = _element.D_SHEET_ID;
        this.active_sheet = _element.D_SEND_SMS;
        ////debugger
        if(this.active_sheet == "0" || this.active_sheet == null || this.active_sheet == "לא" || this.active_sheet == "" ){
            this.active_sheet_bool = false;
        }else{
            this.active_sheet_bool = true;
        }
        this.sms_text = _element.D_SMS_TEXT;
        this.departsForm = this.formBuilder.group({
            fullnameVal: [this.fullnameVal, Validators.required],
            SEODE_NAME: [_element.SEODE_NAME, Validators.required],
            active_sheet: [ this.active_sheet_bool, false],
            sms_text: [this.sms_text, Validators.required],
            idSheet: [this.idSheet, false],
            rowIdVal: [this.rowIdVal, false],
        });
        if( this.active_sheet == "0"){
            this.active_sheet = "לא";
        }else{
            this.active_sheet = "כן";
        }
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
        //$('#free_text').text(_element.FreeText);
        //////debugger
        
        this.rowElement = {
            D_ROW_ID: 0,
            D_SHEET_ID: '-1',
            D_NAME: '',
            SEODE_NAME: '',
            D_ROW_STATUS: '',
            D_SEND_SMS: '',
            D_SMS_TEXT: ''
        };
         
        this.fullnameVal = "";
        this.idSheet = "-1";
        this.rowIdVal = "0";

        this.departsForm = this.formBuilder.group({
            fullnameVal: ["", Validators.required],
            SEODE_NAME: ["", Validators.required],
            active_sheet: ["", false],
            sms_text: ["", Validators.required],
            idSheet: ["", false],
            rowIdVal: ["", false],
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
            // ////debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        this.http
            .post(
                "http://srv-ipracticom:8080/WebService.asmx/GetPoriaDeparts",
                {
                    _pageIndex: _pageIndex,
                    _pageSize: _pageSize,
                    _FreeText: _FreeText,
                }
            )
            .subscribe((Response) => {
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                var json = JSON.parse(Response["d"]);
                let DepartsData = JSON.parse(json["aaData"]);
                //////debugger
                for (var i = 0; i < DepartsData.length; i++) {
                    //////debugger
                    if( DepartsData[i].D_SEND_SMS == "0"){
                        DepartsData[i].D_SEND_SMS = "לא";
                    }else{
                        DepartsData[i].D_SEND_SMS = "כן";
                    }
                    this.TABLE_DATA.push({
                        D_ROW_ID: DepartsData[i].D_ROW_ID,
                        D_SHEET_ID: DepartsData[i].D_SHEET_ID,
                        D_NAME: DepartsData[i].D_NAME,
                        D_ROW_STATUS: DepartsData[i].D_ROW_STATUS,
                        D_SEND_SMS: DepartsData[i].D_SEND_SMS,
                        D_SMS_TEXT: DepartsData[i].D_SMS_TEXT,
                        SEODE_NAME: DepartsData[i].SEODE_NAME,
                    });
                }

                // ////debugger
                this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                this.resultsLength = parseInt(json["iTotalRecords"]);
                setTimeout(function () {
                    //////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }
}
