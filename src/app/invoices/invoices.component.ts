import {
  Component,
  OnInit,
  ViewChild
} from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatRadioChange } from "@angular/material/radio";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import {
  NgbModal,
  NgbModalOptions
} from "@ng-bootstrap/ng-bootstrap";
import * as $ from "jquery";
import { Time } from "@angular/common";
import { FormControl } from '@angular/forms';
import * as Fun from "../public.functions";

export interface Invoices {
  I_ROW_ID: number;
  I_CASE_NUMBER: string;
  I_INVOICE_NUMBER: string;
  I_TOTAL: string;
  I_PAYS: string;
  I_REFERENCE: string;
  I_CASE_TYPE: string;
  I_PATIENT_ID: Date;
  I_INVOICE_DATE: Date;
  I_HOSP_DATE: Date;
  I_PATIENT_TYPE: string;
  I_PATIENT_NUMBER: string;
  I_DEATH_DATE: Date;
  I_DOB_DATE: Date;
  I_PATIENT_FNAME: string;
  I_PATIENT_LNAME: string;
  I_PATIENT_MEKOD: string;
  I_PATIENT_3ER: string;
  I_PATIENT_R7OV: string;
  I_ROW_TYPE: string;
  I_ROW_STATUS: string;
}

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  modalOptions: NgbModalOptions;
  closeResult: string;
  PatientType: string;

  displayedColumns: string[] = [
      "I_ID",
      "I_CASE_NUMBER",
      "I_INVOICE_NUMBER",
      "I_TOTAL",
      "I_PAYS",
      "I_REFERENCE",
      "I_CASE_TYPE",
      "I_PATIENT_ID",
      "I_INVOICE_DATE",
      "I_HOSP_DATE",
      "I_PATIENT_TYPE",
      "I_PATIENT_NUMBER",
      "I_DEATH_DATE",
      "I_DOB_DATE",
      "I_PATIENT_FNAME",
      "I_PATIENT_LNAME",
      "I_PATIENT_MEKOD",
      "I_PATIENT_3ER",
      "I_PATIENT_R7OV",
      "I_ROW_TYPE",
      "I_ROW_STATUS"
  ];
  TABLE_DATA: Invoices[] = [];
  dataSource = new MatTableDataSource(this.TABLE_DATA);

  resultsLength = 0;
  fliterVal = "";

  chart = null;
  isShow = false;
  _selectedYear = 0;
  constructor(
      private router: Router,
      private http: HttpClient,
  ) {}
  startdateVal: string;
  enddateVal: string;
  yearsToSelect : {list:{}};
  _fun = new Fun.Functions();
  _yearToSearch = 0;
  Sdate: FormControl;
  Edate: FormControl;
  ngOnInit() {
      this._fun.RunFunction();
      this.yearsToSelect = this._fun.yearsToSelect;
     if(this.yearsToSelect.list[0]["checked"]){
         this._selectedYear = parseInt(this.yearsToSelect.list[0]["ID"]);
         this.Sdate = new FormControl(new Date(parseInt(this.yearsToSelect.list[0]["ID"]), 0, 1));
         this.Edate = new FormControl(new Date(parseInt(this.yearsToSelect.list[0]["ID"]), 11, 31));
         this.startdateVal = this.Sdate.value;
         this.enddateVal = this.Edate.value;
      }   
      //this.SurgeryType[0] = true;
      this.PatientType = "-1";
      this.dataSource = new MatTableDataSource(this.TABLE_DATA);

      if (
          localStorage.getItem("loginState") != "true" ||
          localStorage.getItem("loginUserName") == ""
      ) {
          this.router.navigate(["login"]);
      } else {
          ///$("#chadTable").DataTable();
      }
      //console.log(this.paginator.pageIndex);
  }
  applyFilter(filterValue: string) {
      this.fliterVal = filterValue;
      if (this.startdateVal && this.enddateVal) {
          this.getDataFormServer(
              this.startdateVal,
              this.enddateVal,
              this.paginator.pageIndex,
              10,
              filterValue,
              this.PatientType
          );
      }
      //this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ngAfterViewInit(): void {}
  getPaginatorData(event: PageEvent) {
      //console.log(this.paginator.pageIndex);
      if (this.startdateVal && this.enddateVal) {
          this.getDataFormServer(
              this.startdateVal,
              this.enddateVal,
              this.paginator.pageIndex,
              10,
              this.fliterVal,
              this.PatientType
          );
      }
  }
  getReport($event: any): void {
      if (this.startdateVal && this.enddateVal)
          this.getDataFormServer(
              this.startdateVal,
              this.enddateVal,
              0,
              10,
              this.fliterVal,
              this.PatientType
          );
  }
  

  getReportExcel($event: any): void {
      if (this.startdateVal && this.enddateVal)
          this.getDataFormServer(
              this.startdateVal,
              this.enddateVal,
              0,
              10,
              this.fliterVal,
              this.PatientType
          );
  }
  public getDataFormServer(
      _startDate: string,
      _endDate: string,
      _pageIndex: number,
      _pageSize: number,
      _filterVal: string,
      _PatientType: string
  ) {

      let _yearStart = new Date(_startDate).getFullYear();
      let _yearEnd = new Date(_endDate).getFullYear();

      ////////debugger
      $("#loader").removeClass("d-none");
      this.http
          .post(
              "http://srv-apps-prod/RCF_WS/WebService.asmx/GetInvoicesApp",
              {
                  _fromDate: _startDate,
                  _toDate: _endDate,
                  _pageIndex: _pageIndex,
                  _pageSize: _pageSize,
                  _freeText: _filterVal,
                  _PatientType: _PatientType
              }
          )
          .subscribe(
              Response => {
                  
                  setTimeout(() => {
                      //this.dataSource.paginator = this.paginator
                      $("#loader").addClass("d-none");
                  });
                  //this.dataSource.paginator = this.paginator;
              },
              error => {
                  // //////debugger;
                  $("#loader").addClass("d-none");
              }
          );
  }

}
