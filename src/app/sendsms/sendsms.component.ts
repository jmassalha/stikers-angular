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


@Component({
  selector: 'app-sendsms',
  templateUrl: './sendsms.component.html',
  styleUrls: ['./sendsms.component.css']
})
export class SendsmsComponent implements OnInit {



    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    

    sendSmsForm: FormGroup;
    loader: Boolean;
    submitted = false;
    smsText: string;
    smsNumbers: string;
    surveyNumber: string;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private formBuilder: FormBuilder
    ) {}
    @Input()
    ngOnInit(): void {
        this.smsText = "";
        this.smsNumbers = "";
        this.surveyNumber = "";
        this.loader = false;
        this.sendSmsForm = this.formBuilder.group({
          smsText: ["", Validators.required],
          smsNumbers: ["", Validators.required],
          surveyNumber: ["1", Validators.required],
      });
        if (
            localStorage.getItem("loginState") != "true" ||
            localStorage.getItem("loginUserName") == ""
        ) {
            this.router.navigate(["login"]);
        } else if (
            localStorage.getItem("loginUserName").toLowerCase() ==
                "jmassalha"||
                localStorage.getItem("loginUserName").toLowerCase() ==
                    "eonn"||
            localStorage.getItem("loginUserName").toLowerCase() == "dporat"    ||
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
       // //debugger
        this.http
            .post(
                "http://srv-apps/wsrfc/WebService.asmx/SendSMSOnLine",
                {
                    smsText: this.sendSmsForm.value.smsText,
                    smsNumbers: this.sendSmsForm.value.smsNumbers,
                    surveyNumber: this.sendSmsForm.value.surveyNumber,
                }
            )
            .subscribe((Response) => {
                this.openSnackBar();
                this.sendSmsForm = this.formBuilder.group({
                  smsText: ["", Validators.required],
                  smsNumbers: ["", Validators.required],
                  surveyNumber: ["1", Validators.required],
              });
                setTimeout(function () {
                    ////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }

}
