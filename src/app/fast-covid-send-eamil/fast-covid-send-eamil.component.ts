import { Component, Output, EventEmitter, Inject, OnInit } from "@angular/core";
import {
    FormGroup,
    FormControl,
    FormArray,
    Validators,
    FormBuilder,
} from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ConfirmationDialogService } from "../confirmation-dialog/confirmation-dialog.service";
import { map, startWith } from "rxjs/operators";
import { Observable } from "rxjs";
import { DatePipe } from "@angular/common";

@Component({
    selector: "app-fast-covid-send-eamil",
    templateUrl: "./fast-covid-send-eamil.component.html",
    styleUrls: ["./fast-covid-send-eamil.component.css"],
})
export class FastCovidSendEamilComponent implements OnInit {
    resendEmailForm: FormGroup;
    send: boolean = false
    horizontalPosition: MatSnackBarHorizontalPosition = "start";
    verticalPosition: MatSnackBarVerticalPosition = "bottom";
    constructor(
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private datePipe: DatePipe,
        private http: HttpClient,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private confirmationDialogService: ConfirmationDialogService,
        private dialogRef: MatDialogRef<FastCovidSendEamilComponent >
    ) {
        debugger;
        this.resendEmailForm = this.formBuilder.group({
            FName: [data.FullName, false],
            RowId: [data.RowId, false],
            Tel1: [data.Tell, Validators.required],
            EMail: [data.Email, Validators.required],
        });
    }

    ngOnInit(): void {}
    onSubmit() {
        //debugger
        this.send = true;
        this.http
            .post(
                //"http://localhost:64964/WebService.asmx/ResendPdfFastCovid",
                "http://srv-ipracticom:8080/WebService.asmx/ResendPdfFastCovid",
                {
                    data: this.resendEmailForm.value,
                }
            )
            .subscribe((Response) => {
                this._snackBar.open("נשלח בהצלחה", "X", {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                });
                this.send = false;
                this.dialogRef.close();
            });
    }
}
