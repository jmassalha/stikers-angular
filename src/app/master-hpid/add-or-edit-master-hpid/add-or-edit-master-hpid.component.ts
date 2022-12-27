import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
export interface MasterHPID {
  RowId: string;
  HPID: string;
  CurrentRoom: string;
  CurrentCabinet: string;
  CurrentU: string;
  CurrentHeightU: string;
  PhysicalName: string;
  DeviceType: string;
  Serial: string;
  CustomerID: string;
  PowerCabels: string;
  ShelfRailsEars: string;
  MovePhase: string;
  FutureRoom: string;
  FutureCab: string;
  FutureU: string;
  Owner: string;
  DeviceCategory: string;
  F1st: string;
  F2nd: string;
  F3rd: string;
  OldRoom: string;
  UpdateDateTime: string;
  InsertDateTime: string;
  UserUpdate: string;
  UserInsert: string;
  FutureIndex: string;
  CurrentIndex: string;
  LogicalName: string;
}
export interface DialogData {
  element: MasterHPID;
  dialog: MatDialog;
}
@Component({
  selector: 'app-add-or-edit-master-hpid',
  templateUrl: './add-or-edit-master-hpid.component.html',
  styleUrls: ['./add-or-edit-master-hpid.component.css']
})
export class AddOrEditMasterHpidComponent implements OnInit {

  serverForm: FormGroup;
    loading: boolean = false;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private formBuilder: FormBuilder,
        private http: HttpClient
    ) {
        this.serverForm = this.formBuilder.group({
            RowId: [this.data.element.RowId, null],
            HPID: [this.data.element.HPID, Validators.required],
            CurrentRoom: [this.data.element.CurrentRoom, null],
            CurrentCabinet: [this.data.element.CurrentCabinet, null],
            CurrentU: [this.data.element.CurrentU, null],
            CurrentHeightU: [this.data.element.CurrentHeightU, null],
            PhysicalName: [this.data.element.PhysicalName, null],
            DeviceType: [this.data.element.DeviceType, null],
            Serial: [this.data.element.Serial, null],
            CustomerID: [this.data.element.CustomerID,  null],
            PowerCabels: [this.data.element.PowerCabels, null],
            ShelfRailsEars: [this.data.element.ShelfRailsEars, null],
            MovePhase: [this.data.element.MovePhase, null],
            FutureRoom: [this.data.element.FutureRoom, null],
            FutureCab: [this.data.element.FutureCab, null],
            FutureU: [this.data.element.FutureU, null],
            Owner: [this.data.element.Owner, null],
            DeviceCategory: [this.data.element.DeviceCategory, null],
            F1st: [this.data.element.F1st,  null],
            F2nd: [this.data.element.F2nd,  null],
            F3rd: [this.data.element.F3rd,  null],
            OldRoom: [this.data.element.OldRoom,  null],
            FutureIndex: [this.data.element.FutureIndex,  null],
            CurrentIndex: [this.data.element.CurrentIndex,  null],
            LogicalName: [this.data.element.LogicalName,  null],
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
                //"http://localhost:64964/WebService.asmx/insertOrUpdateMasterHPID",
                "http://srv-apps-prod/RCF_WS/WebService.asmx/insertOrUpdateMasterHPID",
                {
                  mRowMasterHPID: this.serverForm.value,
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