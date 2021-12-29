import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { FillSurveyComponent } from '../fill-survey/fill-survey.component';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-form-dashboard',
  templateUrl: './form-dashboard.component.html',
  styleUrls: ['./form-dashboard.component.css']
})
export class FormDashboardComponent implements OnInit {

 
  all_forms_filter = [];
  all_forms_filter_general = [];
  all_forms_filter_not_general = [];
  all_forms_filter_Continues = [];
  formSearch: FormGroup;
  chooseForm: FormGroup;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formSearch = new FormGroup({
      'formNameControl': new FormControl('', null)
    });
    this.chooseForm = new FormGroup({
      'SwitchForms': new FormControl('1', null)
    });
    this.getAllForms();
  }

  openDialogToFill(id,ifcontinue,NurseID) {
    let dialogRef = this.dialog.open(FillSurveyComponent, { disableClose: true });
    dialogRef.componentInstance.urlID = id;
    dialogRef.componentInstance.ifContinueForm = ifcontinue;
    dialogRef.componentInstance.NurseID = NurseID;
  }

  getAllForms() {
    let formNameControl = this.formSearch.controls['formNameControl'].value;
    let nurseUser = localStorage.getItem('loginUserName');
    this.http
      .post("https://srv-apps:4433/WebService.asmx/GetAllForms", {
        _formNameControl: formNameControl,
        _nurseUser: nurseUser,
      })
      .subscribe((Response) => {
        this.all_forms_filter = [];
        this.all_forms_filter_general = [];
        this.all_forms_filter_not_general = [];
        this.all_forms_filter_Continues = [];
        this.all_forms_filter = Response["d"];
        this.all_forms_filter.forEach(element => {
          if (element.GeneralForm == "0") {
            this.all_forms_filter_not_general.push(element);
          } else {
            this.all_forms_filter_general.push(element);
          }
          element.ContinuesForms.forEach(conForm => {
            this.all_forms_filter_Continues.push(conForm);
          });
        });
      });

  }

}
