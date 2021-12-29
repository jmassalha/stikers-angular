import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormsansweredComponent } from '../formsanswered/formsanswered.component';
import { UpdatesingleformComponent } from '../updatesingleform/updatesingleform.component';
import { DatePipe } from '@angular/common';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Form {
  FormID: string;
  FormName: number;
  FormDate: number;
  FormDepartment: string;
}

export interface Patient {
  FormID: string;
  PatientID: string;
  PatientName: string;
  PatientPassport: string;
  PatientPhone: string;
  PatientEmail: string;
  NurseInCharge: string;
  PatientGender: string;
  PatientBirthday: string;
  PatientAddress: string;
  FormName: string;
  DateOfFillForm: string;
  Signature: any;
  Questions: string[];
  NursesTable: string[];
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
  _tableArr = [];
  formSearch: FormGroup;

  TABLE_DATA: Form[] = [];
  displayedColumns: string[] = [
    'FormID', 'FormName', 'formDepartment', 'FormDate', 'update', 'showAll'
  ];
  dataSource = new MatTableDataSource(this.TABLE_DATA);
  rowFormData = {} as Patient;
  departmentControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    public datepipe: DatePipe) { }

  onlyColumns: FormArray = this.formBuilder.array([]);
  TablesColsRows: FormArray = this.formBuilder.array([{
    Columns: this.onlyColumns,
    RowValue: ['', null],
    RowIDFK: ['', null],
  }]);
  surveyTables: FormArray = this.formBuilder.array([{
    ColumnRows: this.TablesColsRows,
    TableID: new FormControl('', null)
  }]);
  formPrint: FormGroup = this.formBuilder.group({
    rowFormData: new FormControl('', null),
    Tables: this.surveyTables
  });

  ngOnInit(): void {

    this.formSearch = new FormGroup({
      'searchWord': new FormControl('', null),
      'departmentControl': new FormControl('', null)
    });
    this.searchForm();
    this.filteredOptions = this.departmentControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  private _filter(value: any): string[] {
    var filterValue = value.toLowerCase();

    return this.department.filter(option => option.toLowerCase().includes(filterValue));
  }

  openDialogToUpdate(id) {
    let dialogRef = this.dialog.open(UpdatesingleformComponent, { disableClose: true });
    dialogRef.componentInstance.urlID = id;
  }

  openDialogToAnsweredForms(id) {
    let dialogRef = this.dialog.open(FormsansweredComponent, { disableClose: true });
    dialogRef.updateSize('1000px', '100%');
    dialogRef.componentInstance.urlID = id;
    dialogRef.afterClosed()
      .subscribe((data) => {
        if (!data) {
          return;
        }
        this.rowFormData = data;
        this._tableArr = [];
        this.rowFormData.NursesTable.forEach(element => {
          this._tableArr.push(element);
        });

        $("#loader").removeClass("d-none");
        setTimeout(function () {
          $("#loader").addClass("d-none");
          window.print();
        }, 1500);
      })
  }


  searchForm() {
    let searchWord = this.formSearch.controls['searchWord'].value;
    let departmentControl = this.formSearch.controls['departmentControl'].value;
    if (departmentControl == undefined) {
      departmentControl = "";
    }
    let UserName = localStorage.getItem("loginUserName").toLowerCase();

    this.http
      .post("https://srv-apps:4433/WebService.asmx/GetAllUsersForms", {
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
      .post("https://srv-apps:4433/WebService.asmx/GetFormsDeparts", {
      })
      .subscribe((Response) => {
        this.all_departs_filter = Response["d"];
        this.all_departs_filter.forEach(element => {
          this.department.push(element.Depart_Name);
        })
      });
  }

}

