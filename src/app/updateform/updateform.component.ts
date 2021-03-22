import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { FormsansweredComponent } from '../formsanswered/formsanswered.component';
import { UpdatesingleformComponent } from '../updatesingleform/updatesingleform.component';

export interface Form {
  FormID: string;
  FormName: number;
  FormDate: number;
  FormDepartment: string;
}


@Component({
  selector: 'app-updateform',
  templateUrl: './updateform.component.html',
  styleUrls: ['./updateform.component.css']
})
export class UpdateformComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  all_forms_filter = [];
  all_departs_filter = [];
  department = [];

  formSearch: FormGroup;
  
  TABLE_DATA: Form[] = [];
  displayedColumns: string[] = [
    'FormID', 'FormName','formDepartment', 'FormDate', 'update', 'showAll'
  ];
  dataSource = new MatTableDataSource(this.TABLE_DATA);

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient) { }
    

  ngOnInit(): void {

    this.formSearch = new FormGroup({
      'searchWord': new FormControl('',null),
      'departmentControl': new FormControl('',null)
    });

    this.searchForm();
    
  }

  openDialogToUpdate(id) {
    let dialogRef = this.dialog.open(UpdatesingleformComponent);
    dialogRef.componentInstance.urlID = id;
  }

  openDialogToAnsweredForms(id) {
    let dialogRef = this.dialog.open(FormsansweredComponent);
    dialogRef.componentInstance.urlID = id;
  }


searchForm(){
  let searchWord =  this.formSearch.controls['searchWord'].value;
  let departmentControl =  this.formSearch.controls['departmentControl'].value;
  if(departmentControl == undefined){
    departmentControl = "";
  }
  let UserName = localStorage.getItem("loginUserName").toLowerCase();
  
  this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetAllUsersForms", {
        _userName: UserName,
        _searchWord: searchWord,
        _departmentControl: departmentControl
      })
      .subscribe((Response) => {
        this.all_forms_filter = Response["d"];
        this.TABLE_DATA = [];
        for (var i = 0; i < this.all_forms_filter.length; i++) {
          this.TABLE_DATA.push({
            FormID: this.all_forms_filter[i].FormID,
            FormName: this.all_forms_filter[i].FormName,
            FormDate: this.all_forms_filter[i].FormDate,
            FormDepartment: this.all_forms_filter[i].FormDepartment,
          });
        }
        this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
        this.dataSource.paginator = this.paginator;
      });
      this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetFormsDeparts", {
      })
      .subscribe((Response) => {
        this.all_departs_filter = Response["d"];
        this.all_departs_filter.forEach(element => {
          this.department.push(element.Depart_Name);
        })
      });
}

}

