import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { int } from "@zxing/library/esm/customTypings";

@Component({
  selector: 'app-graphs-modal',
  templateUrl: './graphs-modal.component.html',
  styleUrls: ['./graphs-modal.component.css']
})
export class GraphsModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<GraphsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    public dialog: MatDialog) { }

  ngOnInit(): void {
  }

}
