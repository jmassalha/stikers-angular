import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-manage-single-surgery',
  templateUrl: './manage-single-surgery.component.html',
  styleUrls: ['./manage-single-surgery.component.css']
})
export class ManageSingleSurgeryComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<ManageSingleSurgeryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  SurgeryFormGroup: FormGroup;

  ngOnInit(): void {
    console.log(this.data)
    this.buildFormGroup(this.data.action);
  }

  buildFormGroup(action) {
    if (action == "New") {
      this.SurgeryFormGroup = this.fb.group({
        ArrivalDate: new FormControl('', null),
        ArrivalTime: new FormControl('', null),
        EndTime: new FormControl('', null),
      });
    } else {
      this.SurgeryFormGroup = this.fb.group({
        ArrivalDate: new FormControl(this.data.event.start, null),
        ArrivalTime: new FormControl(this.data.event.ArrivalTime, null),
        EndTime: new FormControl(this.data.event.EndTime, null),
      });
    }

  }

  saveSurgeyDetails() {
    console.log(this.SurgeryFormGroup.value);
  }

}
