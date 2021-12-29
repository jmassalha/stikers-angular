import {
    Component,
    OnInit,
    ViewChild,
    AfterViewInit,
    Input,
    ElementRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
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
} from "@ng-bootstrap/ng-bootstrap";
import * as $ from "jquery";
import * as Fun from "../public.functions";
import { Time } from "@angular/common";
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
} from "@angular/forms";

export interface LinkToCatalogTableRowData {
    Row_ID: string;
    Depart_Name: string;
    SeuditNamerDepart: string;
    CaseNumber: string;
    PatientFirstName: string;
    PatientLastName: string;
    DrugDate: string;
    DrugTime: string;
    DrFirstName: string;
    DrLastName: string;
    UserDepart: string;
    CellNumber: string;
    Email: string;
    DrugName: string;
    DrugNote: string;
    FullDrugDesc: string;
    DrugaCtalog: string;
    UpdateRemarks: string;
    UpdateUserName: string;
    UpdateDateTime: string;
    NamerDrugName: string;
    NamerDrugID: string;
    TotalRows: string;
    AddDrugsOrInstructions: string;
}
export interface Drug {
    Row_ID: string;
    DRUG_ID: string;
    DRUG_Name: string;
}

@Component({
    selector: "app-drugsnic",
    templateUrl: "./drugsnic.component.html",
    styleUrls: ["./drugsnic.component.css"],
})
export class DrugsnicComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatPaginator, { static: true }) paginatorDrug: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    displayedColumns: string[] = [
        "Depart_Name",
        "CaseNumber",
        "PatientName",
        "DrName",
        "CellNumber",
        "DrugaCtalog",
        "DrugName",
        "DrugNote",
        "NamerDrugName",
        "AddDrugsOrInstructions",
        "UpdateRemarks",
        "D_CLICK",
    ];
    displayedColumnsDrug: string[] = ["DRUG_Name", "Drug_CLICK"];

    MedID: string;
    MedName: string;
    MedGroup: string;
    modalOptions: NgbModalOptions;
    closeResult: string;
    TABLE_DATA: LinkToCatalogTableRowData[] = [];
    TABLE_DATA_Drugs: Drug[] = [];
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    dataSourceDrug = new MatTableDataSource(this.TABLE_DATA_Drugs);
    loader: Boolean;
    tableLoader: Boolean;
    resultsLength = 0;
    resultsLengthDrug = 0;
    RoleStatus = 0;
    fliterVal = "";
    currenrRowToConnect;
    drugForm: FormGroup;
    submitted = false;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private modalService_2: NgbModal,
        private formBuilder: FormBuilder
    ) {}
    @Input()
    foo: string = "bar";
    startdateVal: string;
    enddateVal: string;
    DoctorDrugName: string;
    Sdate: FormControl;
    Edate: FormControl;
    searchDrugVal: string;
    linked: string;
    ngOnInit(): void {
        this.linked = "1";
        this.searchDrugVal = "";
        this.fliterVal = "";
        var date = new Date();
        date.setDate(date.getDate() - 7);
        this.Sdate = new FormControl(date);
        this.Edate = new FormControl(new Date());
        this.startdateVal = this.Sdate.value;
        this.enddateVal = this.Edate.value;

        this.loader = false;
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);
        this.dataSourceDrug = new MatTableDataSource(this.TABLE_DATA_Drugs);
        this.drugForm = this.formBuilder.group({
            UpdateRemarks: ["", false],
            RowId: ["0", false],
            User: [localStorage.getItem("loginUserName"), false],
            NamerDrugName: ["", Validators.required],
            NamerDrugID: ["", Validators.required],
            AddDrugsOrInstructions: ["", Validators.required],
        });

        if (
            localStorage.getItem("loginState") != "true" ||
            localStorage.getItem("loginUserName") == ""
        ) {
            this.router.navigate(["login"]);
        } else if (
            localStorage.getItem("loginUserName").toLowerCase() ==
                "jmassalha" || 
            localStorage.getItem("loginUserName").toLowerCase() == "emassalha" ||
            localStorage.getItem("loginUserName").toLowerCase() == "samer" ||
            localStorage.getItem("loginUserName").toLowerCase() ==
                "owertheim" ||
            localStorage.getItem("loginUserName").toLowerCase() == "jubartal"
        ) {
        } else {
            this.router.navigate(["login"]);
            ///$("#chadTable").DataTable();
        }
        this.getNamerDrugs("", 0, 10);
        var that = this;
        setTimeout(function () {
            that.getReport(that);
        }, 500);
    }
    searchDrug() {
        this.getNamerDrugs(this.searchDrugVal, 0, 10);
    }
    getNamerDrugs(freeSearch, pageIndex, pageSize) {
        ////debugger
        this.http
            .post("https://srv-apps:4433/WebService.asmx/GetNamerDrugs", {
                freeSearch: freeSearch,
                pageIndex: pageIndex,
                pageSize: pageSize,
            })
            .subscribe((Response) => {
                //////debugger;
                this.TABLE_DATA_Drugs.splice(0, this.TABLE_DATA_Drugs.length);
                var json = Response["d"];
                this.TABLE_DATA_Drugs = json;

                // ////////debugger
                this.dataSourceDrug = new MatTableDataSource<any>(
                    this.TABLE_DATA_Drugs
                );
                this.resultsLengthDrug = parseInt(json[0]["TotalRows"]);
                ////debugger
            });
    }
    search(nameKey, myArray) {
        for (var i = 0; i < myArray.length; i++) {
            if (myArray[i].id === nameKey) {
                return myArray[i];
            }
        }
    }

    openSnackBar() {
        this._snackBar.open("נשמר בהצלחה", "", {
            duration: 2500,
            direction: "rtl",
            panelClass: "success",
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
    onSubmit() {
      //debugger
        this.submitted = true;
        if (this.drugForm.invalid) {
            return;
        }
        // ////////debugger
        this.http
            .post("https://srv-apps:4433/WebService.asmx/submitConnectDrug", {
                drugRow: this.drugForm.value,
            })
            .subscribe((Response) => {
                ////////debugger
                this.getReport(null);
                this.openSnackBar();
            });
        // display form values on success
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.drugForm.value, null, 4));
        this.modalService.dismissAll();
    }
    chossenDrug(_element) {
      //debugger
        this.drugForm = this.formBuilder.group({
            UpdateRemarks: [this.currenrRowToConnect.UpdateRemarks, false],
            RowId: [this.currenrRowToConnect.Row_ID, false],
            User: [localStorage.getItem("loginUserName"), false],
            NamerDrugName: [_element.DRUG_Name, Validators.required],
            NamerDrugID: [_element.DRUG_ID, Validators.required],
            AddDrugsOrInstructions: [_element.AddDrugsOrInstructions,false],
        });
        $(document).find("#closeDrugs").click();
        
        //this.modalService_2.dismissAll();
    }
    opendrugsTable(content, _type, _element) {
        this.modalService_2.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                //////////debugger
                if ("Save" == result) {
                    // ////////debugger;
                    //this.saveChad(_element.ROW_ID);
                }
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }
    editRow(content, _type, _element) {
        this.DoctorDrugName = _element.DrugNote
        this.currenrRowToConnect = _element;
        this.drugForm = this.formBuilder.group({
            UpdateRemarks: [_element.UpdateRemarks, false],
            RowId: [_element.Row_ID, false],
            User: [localStorage.getItem("loginUserName"), false],
            NamerDrugName: [_element.NamerDrugName, Validators.required],
            NamerDrugID: [_element.NamerDrugID, Validators.required],
            AddDrugsOrInstructions: [_element.AddDrugsOrInstructions, false],
        });
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                //////////debugger
                if ("Save" == result) {
                    // ////////debugger;
                    //this.saveChad(_element.ROW_ID);
                }
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }
    getReport($event: any): void {
        //////////debugger
        this.getTableFromServer(
            this.paginator.pageIndex,
            10,
            this.fliterVal,
            this.startdateVal,
            this.enddateVal
        );
    }
    applyFilter(filterValue: string) {
        this.fliterVal = filterValue;
        // ////////debugger
        this.getTableFromServer(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.fliterVal,
            this.startdateVal,
            this.enddateVal
        );

        //this.dataSource.filter = filterValue.trim().toLowerCase();
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

    ngAfterViewInit(): void {}
    getPaginatorData(event: PageEvent) {
        //console.log(this.paginator.pageIndex);

        this.getTableFromServer(
            event.pageIndex,
            event.pageSize,
            this.fliterVal,
            this.startdateVal,
            this.enddateVal
        );
    }
    getPaginatorDataDrug(event: PageEvent) {
        ////debugger
        //console.log(this.paginator.pageIndex);

        this.getNamerDrugs(this.searchDrugVal, event.pageIndex, event.pageSize);
    }

    public getTableFromServer(
        pageIndex: number,
        pageSize: number,
        freeSearch: string,
        startdateVal: string,
        enddateVal: string
    ) {
        // ////////debugger

        //////debugger;
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // ////////debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
       // debugger
        this.http
            .post("https://srv-apps:4433/WebService.asmx/GetNICDrugs", {
                freeSearch: freeSearch,
                pageSize: pageSize,
                pageIndex: pageIndex,
                FromDate: this.startdateVal,
                ToDate: this.enddateVal,
                Linked: this.linked,
            })
            .subscribe((Response) => {
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
               // debugger
                var json = Response["d"];
                if (json[0]["TotalRows"] != null) {
                    this.TABLE_DATA = json;

                    // ////////debugger
                    this.dataSource = new MatTableDataSource<any>(
                        this.TABLE_DATA
                    );
                    this.resultsLength = parseInt(json[0]["TotalRows"]);
                }else{
                    this.TABLE_DATA = [];

                    // ////////debugger
                    this.dataSource = new MatTableDataSource<any>(
                        this.TABLE_DATA
                    );
                    this.resultsLength = 0;
                }

                setTimeout(function () {
                    //////////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }
}
