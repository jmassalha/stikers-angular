import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { FillSurveyComponent } from '../fill-survey/fill-survey.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-form-dashboard',
  templateUrl: './form-dashboard.component.html',
  styleUrls: ['./form-dashboard.component.css']
})
export class FormDashboardComponent implements OnInit {

  all_forms_filter = [];
  formSearch: FormGroup;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formSearch = new FormGroup({
      'searchWord': new FormControl('', null),
      'departmentControl': new FormControl('', null)
    });
    this.getAllForms();
  }

  openDialogToFill(id) {
    let dialogRef = this.dialog.open(FillSurveyComponent);
    dialogRef.componentInstance.urlID = id;
  }

  getAllForms() {
    let searchWord = "";
    let departmentControl = this.formSearch.controls['searchWord'].value;
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetAllForms", {
        _searchWord: searchWord,
        _departmentControl: departmentControl
      })
      .subscribe((Response) => {

        this.all_forms_filter = Response["d"];

      });
  }

}
