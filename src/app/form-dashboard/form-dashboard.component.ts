import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
  all_person_arr = [];
  formSearch: FormGroup;
  chooseForm: FormGroup;
  @ViewChild('modalAlert', { static: true }) modalAlert: TemplateRef<any>;
  UserName = localStorage.getItem("loginUserName").toLowerCase();

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    if (localStorage.loginState == "true") {
      this.formSearch = new FormGroup({
        'formNameControl': new FormControl('', null)
      });
      this.chooseForm = new FormGroup({
        'SwitchForms': new FormControl('1', null)
      });
      this.getAllForms();
      if (this.UserName == "adahabre" || this.UserName == "sshawahdy" || this.UserName == "arozenwalt" || this.UserName == "kelubenfel" || this.UserName == "gmagril") {
        this.AlertToFill();
      }
    }
  }

  openDialogToFill(id, ifcontinue, NurseID) {
    let dialogRef = this.dialog.open(FillSurveyComponent, { disableClose: true });
    dialogRef.componentInstance.urlID = id;
    dialogRef.componentInstance.ifContinueForm = ifcontinue;
    dialogRef.componentInstance.NurseID = NurseID;
  }

  getAllForms() {
    let formNameControl = this.formSearch.controls['formNameControl'].value;
    let nurseUser = localStorage.getItem('loginUserName');
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetAllForms", {
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

  AlertToFill() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/AlertToFill", {
        _formID: "122"
      })
      .subscribe((Response) => {
        this.all_person_arr = Response["d"];
        if (this.all_person_arr.length > 0) {
          this.dialog.open(this.modalAlert, { width: '60%' });
        }
      });
  }

}
