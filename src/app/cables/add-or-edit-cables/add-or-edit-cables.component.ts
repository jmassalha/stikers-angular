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
export interface Cables {
  RowId: string;
  SourceRoom: string;
  SourceCab: string;
  SourceU: string;
  HeightU: string;
  HPID: string;
  Name: string;
  DeviceType: string;
  Owner: string;
  CableType: string;
  CurrentConnectionSlotPort: string;
  CurrentConnectionVlan: string;
  CurrentConnectionCable: string;
  PP1NamePort: string;
  PP1Cable: string;
  PP2NamePort: string;
  PP2Cable: string;
  TargetCab: string;
  TargetHPID: string;
  TargetName: string;
  TargetSlotPort: string;
  FuturePhaseMoveNumber: string;
  FutureRoom: string;
  FutureCab: string;
  FutureU: string;
  FutureCableColor: string;
  FutureCable: string;
  FuturePP1NamePort: string;
  FuturePP2Cable: string;
  FuturePP2NamePort: string;
  TargetU: string;
  UpdateDateTime: string;
  InsertDateTime: string;
  UserUpdate: string;
  UserInsert: string;
}
export interface DialogData {
  element: Cables;
  dialog: MatDialog;
}
@Component({
  selector: 'app-add-or-edit-cables',
  templateUrl: './add-or-edit-cables.component.html',
  styleUrls: ['./add-or-edit-cables.component.css']
})
export class AddOrEditCablesComponent implements OnInit {

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
            SourceRoom: [this.data.element.SourceRoom, null],
            SourceCab: [this.data.element.SourceCab, null],
            SourceU: [this.data.element.SourceU, null],
            HeightU: [this.data.element.HeightU, null],
            Name:  [this.data.element.Name, null],
            DeviceType:  [this.data.element.DeviceType, null],
            Owner:  [this.data.element.Owner, null],
            CableType:  [this.data.element.CableType, null],
            CurrentConnectionSlotPort:  [this.data.element.CurrentConnectionSlotPort, null],
            CurrentConnectionVlan:  [this.data.element.CurrentConnectionVlan, null],
            CurrentConnectionCable:  [this.data.element.CurrentConnectionCable, null],
            PP1NamePort:  [this.data.element.PP1NamePort, null],
            PP1Cable:  [this.data.element.PP1Cable, null],
            PP2NamePort:  [this.data.element.PP2NamePort, null],
            PP2Cable:  [this.data.element.PP2Cable, null],
            TargetCab:  [this.data.element.TargetCab, null],
            TargetHPID:  [this.data.element.TargetHPID, null],
            TargetName:  [this.data.element.TargetName, null],
            TargetSlotPort:  [this.data.element.TargetSlotPort, null],
            FuturePhaseMoveNumber:  [this.data.element.FuturePhaseMoveNumber, null],
            FutureRoom:  [this.data.element.FutureRoom, null],
            FutureCab:  [this.data.element.FutureCab, null],
            FutureU:  [this.data.element.FutureU, null],
            FutureCableColor:  [this.data.element.FutureCableColor, null],
            FutureCable:  [this.data.element.FutureCable, null],
            FuturePP1NamePort:  [this.data.element.FuturePP1NamePort, null],
            FuturePP2Cable:  [this.data.element.FuturePP2Cable, null],
            FuturePP2NamePort:  [this.data.element.FuturePP2NamePort, null],
            TargetU:  [this.data.element.RowId, null],
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
               // "http://localhost:64964/WebService.asmx/insertOrUpdateCables",
                "http://srv-apps-prod/RCF_WS/WebService.asmx/insertOrUpdateCables",
                {
                  mRowCables: this.serverForm.value,
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
