
import {
    Component,
    OnInit,
    ViewChild,
    AfterViewInit,
    Input,
    ElementRef,
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
import { IDetect } from "ngx-barcodeput";
import { tr } from "date-fns/locale";

export interface CaseNumbers {
    RowID: string;
    CaseNumber: string;
    PatientID: string;
    FirstName: string;
    LastName: string;
    DOB: string;
    HospitalDate: string;
    PatientNumber: string;
    Dose: string;
}

@Component({
    selector: "app-casenumbers",
    templateUrl: "./casenumbers.component.html",
    styleUrls: ["./casenumbers.component.css"],
})
export class CasenumbersComponent implements OnInit, AfterViewInit  {
    @ViewChild("scannerInput")
    Element;
    set scannerInput(element: ElementRef<HTMLInputElement>) {
        setTimeout(() => {
            if (element) {
                element.nativeElement.focus();
                this.Element = element;
            }
        }, 100);
    }
    @ViewChild('formTable1Div') formTable1Div: ElementRef;
    @Input() activeModal: NgbActiveModal;;
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    displayedColumns: string[] = [
        "Dose",
        "HospitalDate",
        "CaseNumber",
        "PatientNumber",
        "PatientID",
        "FirstName",
        "LastName",
        "DOB",
        "Click",
    ];

    modalOptions: NgbModalOptions = {
        windowClass: "marg-t-60",
    };
    closeResult: string;
    TABLE_DATA: CaseNumbers[] = [];
    rowFormData = {} as CaseNumbers;
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    tableLoader: Boolean;
    UserSmsStatus: Boolean;
    UserEmailStatus: Boolean;
    resultsLength = 0;
    fliterValCaseNumbers = "";
    StatusCaseNumbers = "-1";
    removeCaseForm: FormGroup;

    CartoonID = localStorage.getItem("CartoonID");
    CartoonUNID = localStorage.getItem("CartoonUNID");
    TotalCases = localStorage.getItem("TotalCases");
    submitted = false;
    
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalServiceBoxCase: NgbModal,
        private formBuilder: FormBuilder,
        activeModal: NgbActiveModal
    ) {
        debugger
        this.activeModal = activeModal;
    }
    myModal;
    ngAfterViewInit(): void {
        this.myModal = this.activeModal;
    }
    @Input()
    foo: string = "bar";
    startdateVal: string;
    enddateVal: string;
    Sdate: FormControl;
    Edate: FormControl;
    fullnameVal: string;
    rowIdVal: string;
    hide: boolean = true;
    printOn: boolean = false;
    ngOnInit(): void {
        //var macaddress = require('macaddress');
        debugger
        this.hide = true;
        let that = this;
        window.onafterprint = function(){
            that.myModal.dismiss();
            console.log("Printing completed...");
         }
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
            this.CartoonID != "0"
        ) {
        } else {
            this.router.navigate(["login"]);
            ///$("#chadTable").DataTable();
        }
        if(localStorage.getItem("Print") == "true"){
            this.printOn = true;
            this.displayedColumns = [
                "Dose",
                "HospitalDate",
                "CaseNumber",
                "PatientNumber",
                "PatientID",
                "FirstName",
                "LastName",
                "DOB",
            ];
            this.hide = true;
        }
        this.getTableFromServer("");
        
    }
    
    editRow(content, _type, _element) {
        // debugger
        this.removeCaseForm = this.formBuilder.group({
            CaseNumber: [_element.CaseNumber, Validators.required],
            CartoonID: [_element.BoxID, Validators.required],
        });
        this.activeModal = this.modalServiceBoxCase.open(
            content,
            this.modalOptions
        );
    }

    onDetected(event: IDetect) {
        //debugger
        console.log(event);
        //debugger
        this.http
            .post(
                //"http://srv-apps/wsrfc/WebService.asmx/InsertCaseNumberToBox",
                "http://srv-apps/wsrfc/WebService.asmx/InsertCaseNumberToBox",
                {
                    CaseNumber: event.value,
                    CartoonID: this.CartoonID,
                }
            )
            .subscribe((Response) => {
                if(!Response["d"]){
                    this.getTableFromServer("");
                    this.openSnackBar("נשמר בהצלחה", "success");
                }else{
                    this.openSnackBar("מס' מקרה נמצא בקרטון", "error");    
                }
                
            });
        this.Element.nativeElement.value = "";
    }
    openSnackBar(message, type) {
        this._snackBar.open(message, "", {
            duration: 2500,
            direction: "rtl",
            panelClass: type,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

    onRemoveSubmit() {
        // debugger

        // stop here if form is invalid
        if (this.removeCaseForm.invalid) {
            // console.log(this.removeCaseForm.controls.errors);
            return;
        }
        //debugger;
        this.http
            .post("http://srv-apps/wsrfc/WebService.asmx/RemoveCaseFromBox", {
                CaseNumber: this.removeCaseForm.value.CaseNumber,
                CartoonID: this.removeCaseForm.value.CartoonID,
            })
            .subscribe((Response) => {
                this.getTableFromServer("");
                this.openSnackBar("נמחק ההצלחה", "success");
            });
        // display form values on success
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.removeCaseForm.value, null, 4));
        // this.modalServiceGroupMember.dismissAll();
        this.activeModal.close();
    }

    public getTableFromServer(_FreeText: string) {
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // ////debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        ////debugger
        //http://srv-apps/wsrfc/WebService.asmx/
        this.http
            .post("http://srv-apps/wsrfc/WebService.asmx/GetBoxCases", {
                _freeText: _FreeText,
                BoxID: this.CartoonID,
            })
            .subscribe((Response) => {
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                ////debugger
                this.TABLE_DATA = Response["d"];

                //debugger
                if (this.TABLE_DATA[0]["BoxID"] == null) {
                    this.TABLE_DATA = [];
                    this.dataSource = new MatTableDataSource<any>(
                        this.TABLE_DATA
                    );
                    this.resultsLength = 0;
                } else {
                    this.dataSource = new MatTableDataSource<any>(
                        this.TABLE_DATA
                    );
                    this.resultsLength = this.TABLE_DATA.length;
                }
                this.TotalCases  = this.resultsLength.toString();
                setTimeout(function () {
                    //////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
                if(localStorage.getItem("Print") == "true"){
                    let that = this;
                    setTimeout(function(){
                        var printContents = that.formTable1Div.nativeElement.innerHTML;   
                        //debugger                 
                        var w=window.open();
                        w.document.write(printContents);
                        w.print();
                        w.close();
                    }, 1000)
                    
                    
                }
            });
    }
}