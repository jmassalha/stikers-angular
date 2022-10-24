import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface Surgeries {
  RoomGroup: string;
  Department: string;
  QuarterYear: string;
  DepartWorkDays: number;
  DiffWorkDaysLastQ: number;
  DiffWorkDaysPreviousYearQ: number;
  DiffTotalMinutesLastQ: number;
  DiffMinutesPreviousYearQ: number;
  DiffTotalQuantityLastQ: number;
  DiffQuantityPreviousYearQ: number;
  DepartWorkDaysLastQ: number;
  DepartTotalQuantityLastQ: number;
  DepartTotalQuantity: number;
  Blank_1: string;
  Blank_2: string;
}
export interface DialogData {
  element: Surgeries;
  dialog: MatDialog;
}
@Component({
  selector: 'app-add-new-note',
  templateUrl: './add-new-note.component.html',
  styleUrls: ['./add-new-note.component.css']
})
export class AddNewNoteComponent implements OnInit {
  addNoteForm:FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.addNoteForm = this.formBuilder.group({
      NoteValue: ["", Validators.required],
    });
  }
  onSubmit(){}
}
