import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
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
export interface PatientData {
    Childe_Case_Number: string;
    Childe_ID: string;
    Childe_First_Name: string;
    Childe_Last_Name: string;
    Mother_Case_Number: string;
    Mother_ID: string;
    Mother_First_name: string;
    Mother_Last_Name: string;
    Chiled_DOB: string;
}
@Component({
  selector: 'app-mother-childe-link',
  templateUrl: './mother-childe-link.component.html',
  styleUrls: ['./mother-childe-link.component.css']
})
export class MotherChildeLinkComponent implements OnInit { 

  @ViewChild("patientModal") private patientModal;
    fliterVal = "";
    mPatientData: PatientData[];
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private formBuilder: FormBuilder
    ) {}
    modalOptions: NgbModalOptions;
    ngOnInit(): void {}
    getReport($event: any): void {
        if (this.fliterVal) this.getTableFromServer(this.fliterVal);
    }
    public getTableFromServer(_freeSearch: string) {
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // //debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/GetMotherChildeLink",
                {
                    freeSearch: _freeSearch,
                }
            )
            .subscribe((Response) => {
                //debugger
                this.mPatientData = Response["d"];
                this.modalService
                    .open(this.patientModal, this.modalOptions)
                    .result.then(
                        (result) => {},
                        (reason) => {}
                    );
                setTimeout(function () {
                    $("#loader").addClass("d-none");
                }, 400);
            });
    }

}
