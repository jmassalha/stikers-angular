import {
    Component,
    OnInit,
    ViewChild,
    AfterViewInit,
    Input,
    ElementRef,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
export interface PersonalDetails {
    PatientNumber: string;
    DateIn: string;
    TimeIn: string;
    FirstName: string;
    FatherName: string;
    LastName: string;
    PersonID: string;
    DOB: string;
    Gender: string;
    PhoneNumber: string;
    Email: string;
    Address: string;
    CaseNumber: string;
    Depart: string;
    DepartDescription: string;
    SeodeDepart: string;
    SeodeDepartDescription: string;
    DischargeDate: string;
    InDate: string;
    DischargeTime: string;
    InTime: string;
    Age: string;
    PASSNR: string;
    ZNE_FNAMEZZ: string;
    ZNE_LNAMEZZ: string;
    DOTIM: string;
    DODAT: string;
}
@Component({
    selector: "app-stikers",
    templateUrl: "./stikers.component.html",
    styleUrls: ["./stikers.component.css"],
})
export class StikersComponent implements OnInit {
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalServiceresearchespatients: NgbModal,
        private formBuilder: FormBuilder,
        activeModal: NgbActiveModal,
        private _Activatedroute: ActivatedRoute
    ) {}
    @ViewChild("stickers") stickers: ElementRef;
    casenumber = "";
    number = 6;
    mPersonalDetails: PersonalDetails = {
        PatientNumber: "",
        DateIn: "",
        TimeIn: "",
        FirstName: "",
        FatherName: "",
        LastName: "",
        PersonID: "",
        DOB: "",
        Gender: "",
        PhoneNumber: "",
        Email: "",
        Address: "",
        CaseNumber: "",
        Depart: "",
        DepartDescription: "",
        SeodeDepart: "",
        SeodeDepartDescription: "",
        DischargeDate: "",
        InDate: "",
        DischargeTime: "",
        InTime: "",
        Age: "",
        PASSNR: "",
        ZNE_FNAMEZZ: "",
        ZNE_LNAMEZZ: "",
        DOTIM: "",
        DODAT: "",
    };
    ngOnInit(): void {
        this._Activatedroute.queryParams.subscribe((params) => {
            console.log(params);
            if (params["casenumber"] == "") {
                this.casenumber = "0010866281";
            } else {
                this.casenumber = params["casenumber"];
            }
            this.GetPersonalDetails(this.casenumber);
        });
    }
    ngAfterViewInit() {
        // console.log(this.stickers.nativeElement.innerHTML);
    }
    openPrintWindow() {
        var mywindow = window.open("", "PRINT");

        mywindow.document.write(
            "<html><head><style>.col-8{width:66%;float:right;}pl-20{padding-left: 20px;}p-20{padding: 0 20px;}.pos-1{position: relative;height: 124px;}.pos-1-1{padding-right: 10px;position: absolute;top: 25px;}.pos-1-2{position: absolute;top: 42px;z-index: 111;padding-right: 10px;}.pos-1-3{position: absolute;    right: -6px;top: 52px;height: 35px;overflow: hidden; }.pos-1-4{position: absolute;top: 87px;}.pos-1-5{padding-right: 16px;padding-left: 25px;position: absolute;top: 102px;}.ngx-barcode{width:100%;float:right;text-align: center}.fz-b{font-size:20px;    padding-top: 30px;}*, ::after, ::before {box-sizing: border-box;}.d-block{width:100%;float:right;}.col{width:100%;float:right;}.col-4{width:33%;float:right;}.col-6{width:50%;float:right;} .col-3{width:25%;float:right;}.text-center {text-align: center!important;}.text-right{text-align: right!important;}.text-left{text-align: left!important;}table {page-break-after: always;}.row{width:100%;float:right;}.col-6{width:50%; float:right;}</style><title>מדביקות</title>"
        );
        mywindow.document.write(
            '</head><body>'
        );
        mywindow.document.write(
            this.stickers.nativeElement.innerHTML
        );
        mywindow.document.write("</body></html>");

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/

       // mywindow.print();
       // mywindow.close();
    }
    GetPersonalDetails(casenumber) {
        //event.target.value
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/GetPersonalDetailsFromDB",
                //"http://srv-ipracticom:8080/WebService.asmx/GetPersonalDetails",
                {
                    CaseNumber: casenumber,
                }
            )
            .subscribe((Response) => {
                var json = Response["d"];
                this.mPersonalDetails = json;
                //debugger;
            });
    }
}
