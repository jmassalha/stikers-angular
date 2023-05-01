import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
export interface Wagons {
  RowId: string;
  WagonName: string;
  SerialNumber: string;
  Degem: string;
  Type: string;
  Location: string;
  ConnectionType: string;
  Status: string;
  AddedByUser: string;
  AddedDate: string;
  UpdatedByUser: string;
  UpdatedDate: string;
}
export interface DialogData {
  element: Wagons;
  dialog: MatDialog;
}
@Component({
  selector: 'app-add-or-edit-wagons',
  templateUrl: './add-or-edit-wagons.component.html',
  styleUrls: ['./add-or-edit-wagons.component.css']
})
export class AddOrEditWagonsComponent implements OnInit {
  Degems: string[] = [
    "AIO מיטווך",
    "AIO  דנגוט",
    "מחשב ישן דנגוט"
  ];
  Types: string[] = [
    "רופא",
    "תרופות"
  ]
  ConnectionTypes: string[] = [
    "Domain",
    "Rdp",
    "Horizen"
  ]
  Status: string[] = [
    "תקין",
    "תקול"
  ]
  serverForm: FormGroup;
  loading: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    this.serverForm = this.formBuilder.group({
      RowId: [this.data.element.RowId, null],
      WagonName: [this.data.element.WagonName, null],
      SerialNumber: [this.data.element.SerialNumber, Validators.required],
      Degem: [this.data.element.Degem, null],
      Type: [this.data.element.Type, null],
      Location: [this.data.element.Location, null],
      ConnectionType: [this.data.element.ConnectionType, null],
      Status: [this.data.element.Status, null],
      AddedByUser: [localStorage.getItem("loginUserName"), null],
      AddedDate: [this.data.element.AddedDate, null],
      UpdatedByUser: [localStorage.getItem("loginUserName"), null],
      UpdatedDate: [this.data.element.UpdatedDate, null]
    });
  }

  ngOnInit(): void { }
  onSubmit(): void {
    this.loading = true;
    console.log(this.serverForm.value);
    this.http
      .post(
         "http://srv-apps-prod/RCF_WS/WebService.asmx/insertOrUpdateWagons",
        //"http://localhost:64964/WebService.asmx/insertOrUpdateWagons",
        {
          mRowWagons: this.serverForm.value,
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