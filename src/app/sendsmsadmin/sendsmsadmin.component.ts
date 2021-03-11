import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";

import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as $ from "jquery";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-sendsmsadmin",
    templateUrl: "./sendsmsadmin.component.html",
    styleUrls: ["./sendsmsadmin.component.css"],
})
export class SendsmsadminComponent implements OnInit {
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";

    @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();
    sendSmsForm: FormGroup;
    loader: Boolean;
    submitted = false;
    smsText: string;
    smsNumbers: string;
    surveyNumber: string;
    toShow: string = "true";
    smsType: string = "SMSOnLineAdmin";
    textAreaVal: string = localStorage.getItem("textAreaVal");
    activeModal: NgbActiveModal;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalServicematernitypatients: NgbModal,
        private formBuilder: FormBuilder,
        activeModal: NgbActiveModal
    ) {
        this.activeModal = activeModal;
        if(this.textAreaVal != "" && this.textAreaVal !== null){
            this.smsType = localStorage.getItem("smsType") ;//"SMSMaternity"
        }else{
            this.smsType = "SMSOnLineAdmin";
        }
        this.sendSmsForm = this.formBuilder.group({
            smsText: ["", Validators.required],
            smsNumbers: [this.textAreaVal, Validators.required],
            surveyNumber: ["0", Validators.required],
        });
    }
    @Input()
    ngOnInit(): void {
        this.toShow = localStorage.getItem("toShow");
        this.smsText = "";
        this.smsNumbers = "";
        this.surveyNumber = "";
        this.loader = false;

        if (
            localStorage.getItem("loginState") != "true" ||
            localStorage.getItem("loginUserName") == ""
        ) {
            this.router.navigate(["login"]);
        } else if (
            localStorage.getItem("loginUserName").toLowerCase() ==
                "jmassalha" ||
            localStorage.getItem("loginUserName").toLowerCase() == "eonn" ||
            localStorage.getItem("loginUserName").toLowerCase() == "dporat" ||
            localStorage.getItem("loginUserName").toLowerCase() ==
                "sabuhanna" ||
            localStorage.getItem("loginUserName").toLowerCase() == "samer" ||
            localStorage.getItem("loginUserName").toLowerCase() == "owertheim"
        ) {
        } else {
            this.router.navigate(["login"]);
            ///$("#chadTable").DataTable();
        }
    }
    openSnackBar() {
        this._snackBar.open("נשלח בהצלחה", "", {
            duration: 2500,
            direction: "rtl",
            panelClass: "success",
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
    ngAfterViewInit(): void {}

    public sendSms() {
        ////debugger
        // stop here if form is invalid
        if (this.sendSmsForm.invalid) {
            return;
        }
        this.submitted = true;

        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // //debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        var lines = [];
        $.each(this.sendSmsForm.value.smsNumbers.split(/\n/), function(i, line){
            if(line){
                lines.push(line.split(" ")[0]);
            }
        });
    //console.log(lines);
    //return;
        debugger
        this.http
            .post("http://srv-apps/wsrfc/WebService.asmx/SendSMSOnLineAdmin", {
                smsText: this.sendSmsForm.value.smsText,
                smsNumbers: this.sendSmsForm.value.smsNumbers,
                surveyNumber: 0,
                smsType: this.smsType
            })
            .subscribe((Response) => {
                this.openSnackBar();
                this.sendSmsForm = this.formBuilder.group({
                    smsText: ["", Validators.required],
                    smsNumbers: ["", Validators.required],
                    surveyNumber: ["0", Validators.required],
                });
                localStorage.setItem("textAreaVal", "");
                
                 this.parentFun.emit();
                setTimeout(function () {
                    ////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }
}
