import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
export interface Server {
    RowId: string;
    ServerName: string;
    ServerType: string;
    HardWare: string;
    VSerialNumber: string;
    ServerRemarks: string;
    ServerLocation: string;
    ServerOS: string;
    ServerFunctions: string;
    ServerIPAddress: string;
    InsertDateTime: string;
    UpdateDateTime: string;
    UserInsert: string;
    UserUpdate: string;
}
export interface DialogData {
    element: Server;
    dialog: MatDialog;
}
@Component({
    selector: "app-add-or-edit-server",
    templateUrl: "./add-or-edit-server.component.html",
    styleUrls: ["./add-or-edit-server.component.css"],
})
export class AddOrEditServerComponent implements OnInit {
   
    serverForm: FormGroup;
    loading: boolean = false;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private formBuilder: FormBuilder,
        private http: HttpClient
    ) {
        this.serverForm = this.formBuilder.group({
            RowId: [this.data.element.RowId, null],
            ServerName: [this.data.element.ServerName, Validators.required],
            ServerType: [this.data.element.ServerType, null],
            HardWare: [this.data.element.HardWare, null],
            VSerialNumber: [this.data.element.VSerialNumber, null],
            ServerRemarks: [this.data.element.ServerRemarks, null],
            ServerLocation: [this.data.element.ServerLocation, null],
            ServerOS: [this.data.element.ServerOS, null],
            ServerFunctions: [this.data.element.ServerFunctions, null],
            ServerIPAddress: [this.data.element.ServerIPAddress, null],
            UserInsert: [localStorage.getItem("loginUserName"), null],
            UserUpdate: [localStorage.getItem("loginUserName"), null],
        });
    }

    ngOnInit(): void {}
    onSubmit(): void {
        this.loading = true;
        console.log(this.serverForm.value);
        this.http
            .post(
                //"http://srv-apps-prod/RCF_WS/WebService.asmx/insertOrUpdateServers4Onnline",
                "http://localhost:64964/WebService.asmx/insertOrUpdateServers4Onnline",
                {
                    mRowServers4Onnline: this.serverForm.value,
                }
            )
            .subscribe((Response) => {
                this.data.dialog.closeAll();
                this.loading = false;
                setTimeout(function () {
                    //////debugger

                    $("#loader").addClass("d-none");
                });
            });
    }
}
