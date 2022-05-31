import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatRadioChange } from "@angular/material/radio";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import {
    NgbModal,
    ModalDismissReasons,
    NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import * as $ from "jquery";
import { Chart } from "chart.js";
import { Time } from "@angular/common";
import { FormControl } from "@angular/forms";
import * as Fun from "../public.functions";
import { MenuPerm } from "../menu-perm";
export interface InfectionsRow {
    CaseNumber: string;
    PatientNumber: string;
    PatientID: string;
    PatientName: string;
    DrugDate: string;
    DrugTime: string;
    PrescribedDrugDose: string;
    DrugNumberPerCaseNumber: Date;
    DrugRoute: Time;
    DrugManner: string;
    PrescribedDrugDoseUnit: Date;
    Depart: Time;
    SeodeDepart: string;
    DrugName: string;
    RoutInj: string;
    Weight: string;
    Height: string;
    BMI: string;
    DiagnostCode: string;
    DocNumber: string;
}
export interface GlucoseConsole {
    ConsoleDate: string;
    ConsoleDateTime: string;
    ConsoleUserName: string;
}
export interface ReciveDocHos {
    Content: string;
}
@Component({
  selector: 'app-infection-report',
  templateUrl: './infection-report.component.html',
  styleUrls: ['./infection-report.component.css']
})
export class InfectionReportComponent implements OnInit {

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    // @ViewChild(MatSort, { static: true }) sort: MatSort;
    displayedColumns: string[] = [
        "CaseNumber",
        "PatientNumber",
        "PatientID",
        "PatientName",
        "Depart",
        "DrugName",
        "Height",
        "Weight",
        "BMI",
        "DocNumber",
    ];
    
    modalOptions: NgbModalOptions;
    Content: ReciveDocHos[] = [];
    TABLE_DATA: InfectionsRow[] = [];
    TABLE_DATA_ALL: InfectionsRow[] = [];
    TABLE_DATA_REL_TO_CASENUMBER: InfectionsRow[] = [];
    dataSource = new MatTableDataSource(this.TABLE_DATA_ALL);
    dataSourceByCase = new MatTableDataSource(
        this.TABLE_DATA_REL_TO_CASENUMBER
    );

    resultsLength = 0;
    chart = null;
    isShow = false;
    startdateVal: string;
    selectedCaseNumber: string = "";
    enddateVal: string;
    _fun = new Fun.Functions();
    Sdate: FormControl;
    Edate: FormControl;
    _yearToSearch = 0;

    closeResult: string;
    fliterVal = "";
    constructor(
        private router: Router,
        private modalService: NgbModal,
        private http: HttpClient,
        private mMenuPerm: MenuPerm
    ) {
        mMenuPerm.setRoutName("glucose");
        setTimeout(() => {
            if(!mMenuPerm.getHasPerm()){
                localStorage.clear();
                this.router.navigate(["login"]);
            }
        }, 2000);}

    ngOnInit(): void {
        $("#loader").removeClass("d-none");
        this._fun.RunFunction();
        this.Sdate = new FormControl(new Date());
        this.Edate = new FormControl(new Date());
        this.startdateVal = this.Sdate.value;
        this.enddateVal = this.Edate.value;
        //this.dataSource = new MatTableDataSource(this.TABLE_DATA);
        this.dataSource = new MatTableDataSource(this.TABLE_DATA_ALL);

        
        this.getReport(null);
    }
    getPaginatorData(event: PageEvent) {
        //console.log(this.paginator.pageIndex);
        if (this.startdateVal && this.enddateVal) {
            this.getDataFormServer(this.startdateVal, this.enddateVal);
        }
    }
    getReport($event: any): void {
        if (this.startdateVal && this.enddateVal)
            this.getDataFormServer(this.startdateVal, this.enddateVal);
    }
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return "by pressing ESC";
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return "by clicking on a backdrop";
        } else {
            return `with: ${reason}`;
        }
    }
    openConsText(content, _type, _element) {
        //$('#free_text').text(_element.FreeText);
        //////debugger
        $("#loader").removeClass("d-none");
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                ////////debugger
                if ("Save" == result) {
                    // //////debugger;
                    //this.saveChad(_element.ROW_ID);
                }
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
        this.http
            .post(
                //"http://srv-apps-prod/RCF_WS/WebService.asmx/GetInfectionCons",
                 "http://srv-apps-prod/RCF_WS/WebService.asmx/GetInfectionCons",
                {
                    DocNumber: _element.DocNumber,
                }
            )
            .subscribe((Response) => {
                //debugger
                //debugger;
                this.selectedCaseNumber = _element.CaseNumber;
                this.Content = [];
                this.Content = Response["d"];
                $("#loader").addClass("d-none");
            });
    }
    filterArray($event) {
        /*this.dataSource = new MatTableDataSource<any>(
            this.TABLE_DATA_ALL
        );*/

        
        switch (parseInt($event.value)) {
            case 2:
                this.TABLE_DATA =  this.TABLE_DATA_ALL.filter(function(data) {
                    return data.DocNumber == "";
                });
                break;
            case 1:
                this.TABLE_DATA =  this.TABLE_DATA_ALL.filter(function(data) {
                    return data.DocNumber != "";
                });
                break;
            default:
                this.TABLE_DATA =  this.TABLE_DATA_ALL
                break;
        }
        this.dataSource = new MatTableDataSource<any>(
            this.TABLE_DATA
        );
        ////debugger;
    }
   
    public getDataFormServer(_startDate: string, _endDate: string) {
        $("#loader").removeClass("d-none");
        this.http
            //.post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetInfectionPatiantApp", {
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetInfectionPatiantApp", {
                _fromDate: _startDate,
                _toDate: _endDate,
            })
            .subscribe(
                (Response) => {
                    $("#_departments").empty();
                   // debugger
                     this.TABLE_DATA_ALL.splice(0, this.TABLE_DATA_ALL.length);
                     this.TABLE_DATA_ALL = Response["d"];
                     //debugger;

                    this.dataSource = new MatTableDataSource<any>(
                        this.TABLE_DATA_ALL
                    );
                    
                    

                    // //////debugger
                    this.dataSource = new MatTableDataSource<any>(
                        this.TABLE_DATA_ALL
                    );
                    this.resultsLength = this.TABLE_DATA_ALL.length;
                    setTimeout(() => {
                        //this.dataSource.paginator = this.paginator
                        $("#loader").addClass("d-none");
                    });
                    //this.dataSource.paginator = this.paginator;
                },
                (error) => {
                    // //////debugger;
                    $("#loader").addClass("d-none");
                }
            );
    }

}
