import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogData } from "src/app/medigate-servers/data-row-table/data-row-table.component";

@Component({
  selector: 'app-graphs-modal',
  templateUrl: './graphs-modal.component.html',
  styleUrls: ['./graphs-modal.component.css']
})
export class GraphsModalComponent implements OnInit {

  graphSource: string;
  constructor(
    public dialogRef: MatDialogRef<GraphsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
    this.graphSource = this.data["graphSource"];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
