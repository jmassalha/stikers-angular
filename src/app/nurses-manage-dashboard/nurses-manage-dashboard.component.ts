import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from '@angular/material/dialog';
import { NursesDepartmentManageComponent } from '../nurses-department-manage/nurses-department-manage.component';

@Component({
  selector: 'app-nurses-manage-dashboard',
  templateUrl: './nurses-manage-dashboard.component.html',
  styleUrls: ['./nurses-manage-dashboard.component.css']
})
export class NursesManageDashboardComponent implements OnInit {

  all_departments_array = [];
  searchWord: string;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.searchWord = "";
    this.getAllDeparts();
  }

  openDialogToFill(departCode,Dept_Name) {
    let dialogRef = this.dialog.open(NursesDepartmentManageComponent, { });
    dialogRef.componentInstance.departCode = departCode;
    dialogRef.componentInstance.Dept_Name = Dept_Name;
  }

  getAllDeparts() {
    this.http
      .post("http://localhost:64964/WebService.asmx/GetNursesSystemDepartments", {
        _departName: this.searchWord
      })
      .subscribe((Response) => {
        this.all_departments_array = Response["d"];
      });
  }

}
