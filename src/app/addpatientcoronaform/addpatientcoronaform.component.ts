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
import { formatDate, Time } from "@angular/common";
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
} from "@angular/forms";
import { MenuPerm } from "../menu-perm";
@Component({
    selector: "app-addpatientcoronaform",
    templateUrl: "./addpatientcoronaform.component.html",
    styleUrls: ["./addpatientcoronaform.component.css"],
})
export class AddpatientcoronaformComponent implements OnInit {
    addPatientCoronaForm: FormGroup;
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private mMenuPerm: MenuPerm
    ) {
        mMenuPerm.setRoutName("addpatientcoronaform");
        setTimeout(() => {
            if(!mMenuPerm.getHasPerm()){
                localStorage.clear();
                this.router.navigate(["login"]);
            }
        }, 2000);
    }

    ngOnInit(): void {
        
        this.addPatientCoronaForm = this.formBuilder.group({
            L_CASE_NUMBER: ["", Validators.required],
            L_REQUEST_DATE: ["", Validators.required],
            L_RESULT_DATE: ["", Validators.required],
            L_RESULT_TIME: ["", Validators.required],
            L_PATIENT_ID: ["", Validators.required],
            L_F_NAME: ["", Validators.required],
            L_L_NAME: ["", Validators.required],
            L_GENDER: ["", Validators.required],
            L_CITY: ["", Validators.required],
            L_REQUEST_DEPART: ["פנימית א - מרפאות", Validators.required],
            L_SERVICE_NUMBER: ["806125800", Validators.required],
            L_SERVICE_NAME: ["שפעת ונגיפי נשימה", Validators.required],
            L_PORIA_REQUEST: ["TRUE", Validators.required],
            L_LABEL: ["", Validators.required],
            L_RESULTS: ["", Validators.required],
            L_F_E_NAME: ["", Validators.required],
            L_L_E_NAME: ["", Validators.required],
            L_DOB: ["", Validators.required],
            L_PASSPORT: ["", Validators.required],
            L_MOBILE: ["", Validators.required],
            L_EMAIL: ["", Validators.required],
            L_PATIENT_NUMBER: ["", Validators.required],
            USERNAME: [
                localStorage.getItem("loginUserName").toLowerCase(),
                Validators.required,
            ],
        });
    }
    openSnackBar(msg: string, type: string) {
        this._snackBar.open(
            msg, //"נשלח בהצלחה",
            "",
            {
                duration: 2500,
                direction: "rtl",
                panelClass: type, //success',
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
            }
        );
    }
    onSubmit() {
        this.addPatientCoronaForm.value.L_REQUEST_DATE = formatDate(
            this.addPatientCoronaForm.value.L_REQUEST_DATE,
            "yyyy-MM-dd",
            "en-US"
        );
        this.addPatientCoronaForm.value.L_RESULT_DATE = formatDate(
            this.addPatientCoronaForm.value.L_RESULT_DATE,
            "yyyy-MM-dd",
            "en-US"
        );
        this.addPatientCoronaForm.value.L_DOB = formatDate(
            this.addPatientCoronaForm.value.L_DOB,
            "yyyy-MM-dd",
            "en-US"
        );
        //debugger;
        // stop here if form is invalid
        if (this.addPatientCoronaForm.invalid) {
            return;
        }
        //debugger;
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/addPatientCoronaForm",
                {
                    PatientCoronaForm: this.addPatientCoronaForm.value,
                }
            )
            .subscribe((Response) => {
                //debugger;
                var json = Response["d"];
                if (Response["d"] == "1") {
                    this.openSnackBar("נשמר בהצלחה", "success");
                    this.addPatientCoronaForm = this.formBuilder.group({
                        L_CASE_NUMBER: ["", Validators.required],
                        L_REQUEST_DATE: ["", Validators.required],
                        L_RESULT_DATE: ["", Validators.required],
                        L_RESULT_TIME: ["", Validators.required],
                        L_PATIENT_ID: ["", Validators.required],
                        L_F_NAME: ["", Validators.required],
                        L_L_NAME: ["", Validators.required],
                        L_GENDER: ["", Validators.required],
                        L_CITY: ["", Validators.required],
                        L_REQUEST_DEPART: [
                            "פנימית א - מרפאות",
                            Validators.required,
                        ],
                        L_SERVICE_NUMBER: ["806125800", Validators.required],
                        L_SERVICE_NAME: [
                            "שפעת ונגיפי נשימה",
                            Validators.required,
                        ],
                        L_PORIA_REQUEST: ["TRUE", Validators.required],
                        L_LABEL: ["", Validators.required],
                        L_RESULTS: ["", Validators.required],
                        L_F_E_NAME: ["", Validators.required],
                        L_L_E_NAME: ["", Validators.required],
                        L_DOB: ["", Validators.required],
                        L_PASSPORT: ["", Validators.required],
                        L_MOBILE: ["", Validators.required],
                        L_EMAIL: ["", Validators.required],
                        L_PATIENT_NUMBER: ["", Validators.required],
                        USERNAME: [
                            localStorage.getItem("loginUserName").toLowerCase(),
                            Validators.required,
                        ],
                    });
                } else {
                    this.openSnackBar("מס' דגימה נמצאת", "error");
                }
            });
    }
}
