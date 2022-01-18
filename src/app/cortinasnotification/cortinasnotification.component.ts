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

export interface Alert {
    B_ID: number;
    B_D_ID: string;
    B_R_ID: string;
    D_NAME: string;
    B_ROOM_NUMBER: string;
    B_NUMBER: string;
    B_NEXT_REPLACE_DATE: string;
    DateDiff: string;
    type: string;
}
@Component({
    selector: "app-cortinasnotification",
    templateUrl: "./cortinasnotification.component.html",
    styleUrls: ["./cortinasnotification.component.css"],
})
export class CortinasnotificationComponent implements OnInit {
    AlertWarn: Alert[] = [];
    AlertYellow: Alert[] = [];
    AlertGreen: Alert[] = [];

    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit(): void {
      this.AlertWarn = [];
      this.AlertYellow = [];
      this.AlertGreen = [];
        this.getReport(this);
    }
    getReport($event: any): void {
        ////debugger
        this.getTableFromServer();
    }
    ChangeCortinasDate(alert){
        if(alert.type == null || alert.type == "cancel" )
            alert.type = "insert";
        else
            alert.type = "cancel";
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/ChangeCortinasDate",
                {
                    alert: alert
                }
            )
            .subscribe((Response) => {
                //debugger
                this.openSnackBar();
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
    public getTableFromServer() {
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // //debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/GetCortinasAlerts",
                {}
            )
            .subscribe((Response) => {
                ////debugger
                var json = JSON.parse(Response["d"]);
                this.AlertWarn = JSON.parse(json["AlertWarn"]);
                this.AlertYellow = JSON.parse(json["AlertYellow"]);
                this.AlertGreen = JSON.parse(json["AlertGreen"]);
                setTimeout(function () {
                    ////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }
}
