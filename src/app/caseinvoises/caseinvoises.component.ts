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

export interface InvoiceDetails
{
    PrintDate: string;
    CaseType: string;
    InvoiceNumber: string;
    InvoiceDate: string;
    Currency: string;
    PayerName: string;
    RoadNumber: string;
    CityMekod: string;
    Tel: string;
    PatientName: string;
    PatientRoadNumber: string;
    PatientCityMekod: string;
    PatientTel: string;
    CaseNumber: string;
    HosDate: string;
    Depart: string;
    SeodeDepart: string;
    Hafnia: string;
    NetoTotal: string;
    InvoiceRow: InvoiceRow[]

}
export interface InvoiceRow {
    Date: string;
    ServiceCode: string;
    ServiceDes: string;
    Amount: number;
    Price: number;
    Cover: string;
    Discount: number;
    Total: number;
    DepartDoing: string;
    SeodeDepart: string;
}

@Component({
    selector: "app-caseinvoises",
    templateUrl: "./caseinvoises.component.html",
    styleUrls: ["./caseinvoises.component.css"],
})
export class CaseinvoisesComponent implements OnInit {
    

    
    invoicesForm: FormGroup;
    InvoiceDetailsArray: InvoiceDetails[];
    submitted = false;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private formBuilder: FormBuilder
    ) {}    
    ngOnInit(): void {
        
        this.invoicesForm = this.formBuilder.group({
          caseNumbers: ["", Validators.required],
          hfnia: ["3", Validators.required],
          
        });

        if (
            localStorage.getItem("loginState") != "true" ||
            localStorage.getItem("loginUserName") == ""
        ) {
            this.router.navigate(["login"]);
        } else if (
            localStorage.getItem("loginUserName").toLowerCase() ==
                "jmassalha" ||
        
            localStorage.getItem("loginUserName").toLowerCase() == "samer" ||
            localStorage.getItem("loginUserName").toLowerCase() ==
                "owertheim" ||
            localStorage.getItem("loginUserName").toLowerCase() == "ocohen"
        ) {
        } else {
            this.router.navigate(["login"]);
            ///$("#chadTable").DataTable();
        }        
    }

    getInvoicesByCases() {
      if ($("#loader").hasClass("d-none")) {
        // //debugger
        
          $("#loader").removeClass("d-none");
      }
        this.http
            .post("http://srv-apps/wsrfc/WebService.asmx/GetInvoicesByCases", {
              CaseNumbers: this.invoicesForm.value.caseNumbers,
              hfnia:  this.invoicesForm.value.hfnia
            })
            .subscribe((Response) => {
                //debugger
                this.InvoiceDetailsArray = Response["d"];
                
                setTimeout(() => {
                  $("#loader").addClass("d-none");
                  window.print();  
                }, 3500);
                
            });
    }
    
}
