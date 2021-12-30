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
    RowId: string;
    CaseNumber: string;
    PatientNumber: string;
    PatientID: string;
    PatientFirstName: string;
    PatientLastName: string;
    InsertDate: string;
    InsertTime: string;
    HospitalDate: string;
    HospitalTime: string;
}
@Component({
    selector: "app-checkpatientinsmartcloset",
    templateUrl: "./checkpatientinsmartcloset.component.html",
    styleUrls: ["./checkpatientinsmartcloset.component.css"],
})
export class CheckpatientinsmartclosetComponent implements OnInit {
    @ViewChild("patientModal") private patientModal;
    fliterVal = "";
    mPatientData: PatientData;
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
                "http://srv-apps/wsrfc/WebService.asmx/CheckIfPatientExist",
                {
                    freeSearch: _freeSearch,
                }
            )
            .subscribe((Response) => {
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
