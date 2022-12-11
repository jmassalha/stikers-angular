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
    CenterName: string;
    IPLocation: string;
    PointNumber: string;
    Screen: string;
    IP: string;
    GetWay: string;
    SubNet: string;
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
  selector: 'app-add-or-edit-ip-point',
  templateUrl: './add-or-edit-ip-point.component.html',
  styleUrls: ['./add-or-edit-ip-point.component.css']
})
export class AddOrEditIpPointComponent implements OnInit {

  serverForm: FormGroup;
    loading: boolean = false;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private formBuilder: FormBuilder,
        private http: HttpClient
    ) {
        this.serverForm = this.formBuilder.group({
            RowId: [this.data.element.RowId, null],
            CenterName: [this.data.element.CenterName, null],
            IPLocation: [this.data.element.IPLocation, null],
            PointNumber: [this.data.element.PointNumber, null],
            Screen: [this.data.element.Screen, null],
            IP: [this.data.element.IP, Validators.required],
            GetWay: [this.data.element.GetWay, null],
            SubNet: [this.data.element.SubNet, null],
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
              "http://srv-apps-prod/RCF_WS/WebService.asmx/insertOrUpdateIPPoints",
              // "http://localhost:64964/WebService.asmx/insertOrUpdateIPPoints",
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
