import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Input,
  ElementRef,
} from "@angular/core";

import * as XLSX from "xlsx";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import * as fileSaver from "file-saver";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatRadioChange } from "@angular/material/radio";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";

import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
  NgbActiveModal,
} from "@ng-bootstrap/ng-bootstrap";
import * as $ from "jquery";
import * as Fun from "../public.functions";
import { formatDate, Time } from "@angular/common";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";
export interface SurgeryDetails {
  CaseNumber: number;
  RequestDepart: string;
  DepartDoing: string;
  SurgeryRoom: string;
  SurgeryDate: string;
  SurgeryType: string;
  SurgeryCode: string;
  SurgeryName: string;
  Primary: string;
  PatientNumber: string;
  SurgenName: string;
  Role: string;
  PatientDOB: string;
  PatientFirstName: string;
  PatientLastName: string;

}
export interface SurgeryStaff {
  FullName: string;
}
@Component({
  selector: 'app-surgery-reports',
  templateUrl: './surgery-reports.component.html',
  styleUrls: ['./surgery-reports.component.css']
})
export class SurgeryReportsComponent implements OnInit {

  @ViewChild("newBornBtn") newBornBtn: ElementRef;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  horizontalPosition: MatSnackBarHorizontalPosition = "center";
  verticalPosition: MatSnackBarVerticalPosition = "top";
  UserNameList: string[] = [];
  displayedColumns: string[] = [
    "CaseNumber",
    "RequestDepart",
    "DepartDoing",
    "SurgeryDate",
    "SurgeryCode",
    "SurgeryName",
    "Primary",
    "SurgenName",
    "Role",
    "PatientNumber",
  ];

  modalOptions: NgbModalOptions = {
    windowClass: "marg-t-60",
    backdrop: "static",
    keyboard: false,
  };
  ShowSubmit: Boolean = true;
  loading: Boolean = true;
  closeResult: string;
  TABLE_DATA: SurgeryDetails[] = [];
  SurgeryStaffList: SurgeryStaff[] = [];
  rowFormData = {} as SurgeryDetails;
  dataSource = new MatTableDataSource(this.TABLE_DATA);
  loader: Boolean;
  tableLoader: Boolean;
  UserSmsStatus: Boolean;
  UserEmailStatus: Boolean;
  resultsLength = 0;
  fliterValPatient = "";
  StatusPatient = "-1";
  patientForm: FormGroup;

  ReseachRowId = localStorage.getItem("ReseachRowId");
  submitted = false;
  ShowFormNewBorn = false;
  activeModal: NgbActiveModal;
  constructor(
    private _snackBar: MatSnackBar,
    private router: Router,
    private http: HttpClient,
    private modalServiceSurgeries: NgbModal,
    private formBuilder: FormBuilder,
    activeModal: NgbActiveModal,
    private _Activatedroute: ActivatedRoute
  ) {
    this.activeModal = activeModal;
  }
  filteredOptions: Observable<SurgeryStaff[]>;
  startdateVal: string;
  Staff: string = "";
  enddateVal: string;
  NewBornDOB: string;
  NewBornTime: string;
  Sdate: FormControl;
  Edate: FormControl;
  fullnameVal: string;
  rowIdVal: string;
  UserFrom: string;
  myControl = new FormControl("");
  casenumber = "";
  opendCounter = 0;
  ngOnInit(): void {
    //debugger

    this.GetSurgeryStaff();
    this.fullnameVal = "";
    this.rowIdVal = "0";
    this.loader = false;
    this.dataSource = new MatTableDataSource(this.TABLE_DATA);
    this.Sdate = new FormControl(new Date());
    this.Edate = new FormControl(new Date());
    this.startdateVal = this.Sdate.value;
    this.enddateVal = this.Edate.value;

    //this.getGetSurgeries(this);
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => (typeof value === "string" ? value : value?.name)),
      map((name) =>
        name ? this._filter(name) : this.SurgeryStaffList.slice()
      )
    );
  }
  private _filter(value: string): SurgeryStaff[] {
    //debugger

    const filterValue = value.toLowerCase();

    return this.SurgeryStaffList.filter((e) =>
      e.FullName.toLowerCase().includes(filterValue)
    );
  }
  GetSurgeryStaff() {
    this.http
      .post(
        "http://srv-apps-prod/RCF_WS/WebService.asmx/GetSurgeryStaff",
        //"http://localhost:64964/WebService.asmx/GetSurgeryStaff",
        {}
      )
      .subscribe((Response) => {
        var json = Response["d"];
        this.SurgeryStaffList = json;
        //debugger
      });
  }


  getGetSurgeries($event: any): void {
    //////debugger
    this.getTableFromServer(
      this.paginator.pageIndex,
      10,
      this.fliterValPatient
    );
  }
  applyFilterSurgeries(filterValue: string) {
    this.fliterValPatient = filterValue;

    this.getTableFromServer(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.fliterValPatient
    );

    //this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit(): void { }
  getPaginatorData(event: PageEvent) {
    //console.log(this.paginator.pageIndex);

    this.getTableFromServer(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.fliterValPatient
    );
  }
  updateUser(option) {
    console.log(option);
    this.Staff = option.option.value;


  }
  public getReportExcel(_event) {
    
    var fileName = new Date();
    this.exportAsExcelFile(
      this.TABLE_DATA,
      fileName.getTime().toString()
    );
  }
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      compression: true,
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    this.loading = false;
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    fileSaver.saveAs(
      data,
      fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
    );
  }
  public getTableFromServer(
    _pageIndex: number,
    _pageSize: number,
    _FreeText: string
  ) {
    let tableLoader = false;

    if ($("#loader").hasClass("d-none")) {
      // ////debugger
      tableLoader = true;
      $("#loader").removeClass("d-none");
    }
    this.http
      .post(
         "http://srv-apps-prod/RCF_WS/WebService.asmx/GetStaffSurgeries",
        //"http://localhost:64964/WebService.asmx/GetStaffSurgeries",
        {
          _staff: this.Staff,
          _fromDate: this.startdateVal,
          _toDate: this.enddateVal,
        }
      )
      .subscribe((Response) => {
        this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
        // debugger;
        var json = Response["d"];
        this.TABLE_DATA = json;
        this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
        if (json.length > 0) {
          this.resultsLength = parseInt(json.length);
        } else {
          this.resultsLength = 0;
        }
        this.dataSource.paginator = this.paginator;
        setTimeout(function () {
          //////debugger
          if (tableLoader) {
            $("#loader").addClass("d-none");
          }
        });
      });
  }
}
