import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormsansweredComponent } from '../formsanswered/formsanswered.component';
import { UpdatesingleformComponent } from '../updatesingleform/updatesingleform.component';

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


  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient) { }

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
    Tables: this.surveyTables,
  });


  ngOnInit(): void {

    this.formSearch = new FormGroup({
      'searchWord': new FormControl('', null),
      'departmentControl': new FormControl('', null)
    });

    this.searchForm();

  }

  openDialogToUpdate(id) {
    let dialogRef = this.dialog.open(UpdatesingleformComponent);
    dialogRef.componentInstance.urlID = id;
  }

  openDialogToAnsweredForms(id) {
    let dialogRef = this.dialog.open(FormsansweredComponent);
    dialogRef.updateSize('1000px', '100%');
    dialogRef.componentInstance.urlID = id;
    dialogRef.afterClosed()
      .subscribe((data) => {
        this.rowFormData = data;
        this.onlyColumns = this.formBuilder.array([]);
        this.TablesColsRows = this.formBuilder.array([]);
        this.surveyTables = this.formBuilder.array([]);
        var surveyTablesItem;
        var tableControl;
        var columnControlItem;
        this._tableArr = [];
        this.rowFormData.NursesTable.forEach(element => {
          this._tableArr.push(element);
        });
        for (var i = 0; i < this._tableArr.length; i++) {
          this.TablesColsRows = this.formBuilder.array([]);

          let index = 0;
          for (var r = 0; r < this._tableArr[i].rowsGroup.length; r++) {
            this.onlyColumns = this.formBuilder.array([]);
            for (var k = 0; k < this._tableArr[i].colsGroup.length; k++) {

              if (this._tableArr[i].TableAnsweredGroup[index].AnswerValue == "False") {
                this._tableArr[i].TableAnsweredGroup[index].AnswerValue = false;
              } else if (this._tableArr[i].TableAnsweredGroup[index].AnswerValue == "True") {
                this._tableArr[i].TableAnsweredGroup[index].AnswerValue = true;
              }
              surveyTablesItem = this.formBuilder.group({
                Row_ID: [this._tableArr[i].TableAnsweredGroup[index].Row_ID, null],
                tableAnswerContent: [this._tableArr[i].TableAnsweredGroup[index].AnswerValue, null],
                ColumnsValue: [this._tableArr[i].TableAnsweredGroup[index].ColValue, null],
                checkBoxV: [this._tableArr[i].TableAnsweredGroup[index].checkBoxV, null],
                ColType: [this._tableArr[i].TableAnsweredGroup[index].AnswerType, null],
                ColIDFK: [this._tableArr[i].TableAnsweredGroup[index].ColIDFK, null]
              });

              index++;
              this.onlyColumns.push(surveyTablesItem);
            }
            columnControlItem = this.formBuilder.group({
              Columns: this.onlyColumns,
              RowValue: [this._tableArr[i].rowsGroup[r].rowsText, null],
              RowIDFK: [this._tableArr[i].rowsGroup[r].Row_ID, null]
            });
            this.TablesColsRows.push(columnControlItem);
          }
          tableControl = this.formBuilder.group({
            ColumnRows: this.TablesColsRows,
            TableID: [this._tableArr[i].Row_ID, null],
          });
          this.surveyTables.push(tableControl);
        }
        this.formPrint = this.formBuilder.group({
          rowFormData: this.rowFormData,
          Tables: this.surveyTables
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

