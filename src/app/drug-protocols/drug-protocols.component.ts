import {
    Component,
    OnInit,
    ViewChild,
    AfterViewInit,
    Input,
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
    FormArray,
} from "@angular/forms";
import { MenuPerm } from "../menu-perm";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

export interface Protocol {
    ProtocolId: number;
    ProtocolName: string;
    Status: string;
    TotalRows: number;
    DrugsProtocolDetailsRows: DrugsProtocolDetails[];
}
export interface DrugsProtocolDetails {
    ProtocolId: string;
    RowId: string;
    DrugName: string;
    ProtocolDay: string;
    MedAdministrationType: string;
    Dosage: string;
    DosingUnit: string;
    Solution: string;
    SolutionVol: string;
    Duration: string;
}
export interface Drug {
    DrugName: string;
}
export interface DropOption {
    value: string;
    name: string;
    viewValue: string;
    groupID: string;
}
@Component({
    selector: "app-drug-protocols",
    templateUrl: "./drug-protocols.component.html",
    styleUrls: ["./drug-protocols.component.css"],
})
export class DrugProtocolsComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    displayedColumns: string[] = ["ProtocolName", "D_CLICK"];
    Calc_Type: DropOption[];
    Dosage_Unit: DropOption[];
    Notes: DropOption[];
    Dosage_Unit_2_Val: DropOption[];
    Duration_Of_Delivery: DropOption[];
    Solution: DropOption[];
    Solution_Volume: DropOption[];
    Way_Of_Providing: DropOption[];
    MedList: DropOption[];
    Days_Protocol: DropOption[];
    MedListConst: DropOption[];
    filteredOptionsIn: Observable<Drug[]>[] = [];
    filteredOptions:Observable<Drug[]>;
    DrugList: Drug[] = [];
    MedID: string;
    MedName: string;
    MedGroup: string;
    modalOptions: NgbModalOptions;
    closeResult: string;
    TABLE_DATA: Protocol[] = [];
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    tableLoader: Boolean;
    resultsLength = 0;
    RoleStatus = 0;
    fliterVal = "";
    emptyElement: any = {
      DrugName: "",
      ProtocolDay: "",
      MedAdministrationType: "",
      Dosage: "",
      DosingUnit: "",
      Solution: "",
      SolutionVol: "",
      Duration: ""
    }
    GroupID: string;
    MedGroupID: string;
    MedStatus: string;
    ProtocolForm: FormGroup;
    submitted = false;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private mMenuPerm: MenuPerm
    ) {
        mMenuPerm.setRoutName("drugprotocols");
        setTimeout(() => {
            if (!mMenuPerm.getHasPerm()) {
                localStorage.clear();
                this.router.navigate(["login"]);
            }
        }, 2000);
    }
    @Input()
    foo: string = "bar";
    startdateVal: string;
    enddateVal: string;
    Sdate: FormControl;
    Edate: FormControl;
    drugnameVal: string;
    DS_drug_ROW_ID: string;
    rowIdVal: string;
    myControls: FormControl[] = [];
    myControl: FormControl;
    ngOnInit(): void {
        this.myControls.push(new FormControl(""));
        this.filteredOptionsIn.push(this.filteredOptions)
        this.MedID = "";
        this.MedName = "";
        this.MedGroup = "0";
        this.MedGroupID = "";
        this.GroupID = "-1";
        this.MedStatus = "-1";
        this.drugnameVal = "";
        this.rowIdVal = "0";
        this.loader = false;
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);

        var that = this;
        setTimeout(function () {
            that.getReport(that);
        }, 500);
        this.filteredOptionsIn[0] = this.myControls[0].valueChanges.pipe(
            startWith(""),
            map((value) =>
                typeof value === "string" ? value : value?.DrugName
            ),
            map((name) => (name ? this._filter(name) : this.DrugList.slice()))
        );
        this.GetAllDrugs();
        this.getDropDownFromServer();
    }
    private _filter(value: string): Drug[] {
        //debugger

        const filterValue = value.toLowerCase();

        return this.DrugList.filter((e: any) =>
            e.MedName.toLowerCase().includes(filterValue)
        );
    }
    updateDrugName(event, i) {
        this.Drugs.controls[i].patchValue({ DrugName: event.option.value });
        //debugger
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
        this.submitted = true;

        //return
        // stop here if form is invalid
        if (this.ProtocolForm.invalid) {
            return;
        }
       // debugger;
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/insertOrUpdateProtocol",
                //"http://srv-apps-prod/RCF_WS/WebService.asmx/insertOrUpdateProtocol",
                {
                    drugRow: this.ProtocolForm.value,
                }
            )
            .subscribe((Response) => {
                ////debugger
                this.getReport(null);
                this.openSnackBar();
            });
        // display form values on success
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.ProtocolForm.value, null, 4));
        this.modalService.dismissAll();
    }
    editRow(content, _type, _element) {
        this.myControls  = [];
        var arrElementOfDetails = [];
        for(var i = 0; i < _element.Drugs.length; i++){
          arrElementOfDetails.push(this.addDrugsGroup(_element.Drugs[i]))
        }
       // debugger
        if(arrElementOfDetails.length == 0)
          arrElementOfDetails.push(this.addDrugsGroup(this.emptyElement))
        this.ProtocolForm = this.formBuilder.group({
            ProtocolName: [_element.ProtocolName, [Validators.required]],
            Status: ["1", false],
            ProtocolId: [_element.ProtocolId, false],
            Drugs: this.formBuilder.array(arrElementOfDetails),
        });
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                //////debugger
                if ("Save" == result) {
                    // ////debugger;
                    //this.saveChad(_element.ROW_ID);
                }
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }
    getReport($event: any): void {
        //////debugger
        this.getTableFromServer(this.paginator.pageIndex, 10, this.fliterVal);
    }
    applyFilter(filterValue: string) {
        this.fliterVal = filterValue;
        // ////debugger
        this.getTableFromServer(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.fliterVal
        );

        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    private addDrugsGroup(element:any): FormGroup {
      
        this.myControls.push(new FormControl(""));
        this.myControls[this.myControls.length - 1].patchValue(element.DrugName );
       // debugger
        this.filteredOptionsIn.push(this.filteredOptions);
        this.filteredOptionsIn[this.myControls.length - 1] = this.myControls[this.myControls.length - 1].valueChanges.pipe(
            startWith(""),
            map((value) =>
                typeof value === "string" ? value : value?.DrugName
            ),
            map((name) => (name ? this._filter(name) : this.DrugList.slice()))
        );
        return this.formBuilder.group({
            DrugName: [element.DrugName, Validators.required],
            ProtocolDay: [element.ProtocolDay, Validators.required],
            MedAdministrationType: [element.MedAdministrationType, Validators.required],
            Dosage: [element.Dosage, Validators.required],
            DosingUnit: [element.DosingUnit, Validators.required],
            Solution: [element.Solution, null],
            SolutionVol: [element.SolutionVol, null],
            Duration: [element.Duration, null],
        });
    }
    public getDropDownFromServer() {
        //////////////////////////debugger

        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/GetDropDownsOptions",
                {}
            )
            .subscribe((Response) => {
                var json = JSON.parse(JSON.parse(Response["d"]));
                this.Calc_Type = JSON.parse(json["Calc_Type"]);
                this.Dosage_Unit = JSON.parse(json["Dosage_Unit"]);
                this.Duration_Of_Delivery = JSON.parse(
                    json["Duration_Of_Delivery"]
                );
                this.Solution = JSON.parse(json["Solution"]);
                this.Solution_Volume = JSON.parse(json["Solution_Volume"]);
                this.Way_Of_Providing = JSON.parse(json["Way_Of_Providing"]);
                this.MedList = this.MedListConst = JSON.parse(json["MedList"]);
                this.Days_Protocol = JSON.parse(json["Days_Protocol"]);
                //debugger
            });
    }
    GetAllDrugs() {
        this.http
            .post(
                //"http://srv-apps-prod/RCF_WS/WebService.asmx/selectNewBornUsers",
                "http://srv-apps-prod/RCF_WS/WebService.asmx/SelectAllDrugsForProtocols",
                {}
            )
            .subscribe((Response) => {
                // debugger
                var json = Response["d"];
                this.DrugList = json;
            });
    }
    displayFn(drug: any): string {
        console.log(drug);
        // if(user != ""){
        //     this.patientForm.value.UserName = user.UserName
        //     this.ShowFormNewBorn = true;
        // }

        return drug;
    }
    removeDrug(index: number): void {
        this.Drugs.removeAt(index);        
        this.myControls.splice(index,1);
        this.filteredOptionsIn.splice(index,1);
    }
    //Add Fields
    addDrug(): void {
        this.Drugs.push(this.addDrugsGroup(this.emptyElement));
    }
    get Drugs(): FormArray {
        return <FormArray>this.ProtocolForm.get("Drugs");
    }
    open(content, _type, _element) {
      
        this.myControls  = [];
        this.myControl = new FormControl("");
        this.ProtocolForm = this.formBuilder.group({
            ProtocolName: ["", Validators.required],
            Status: ["1", false],
            ProtocolId: ["0", false],
            Drugs: this.formBuilder.array([this.addDrugsGroup(this.emptyElement)]),
        });
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                //////debugger
                if ("Save" == result) {
                    // ////debugger;
                    //this.saveChad(_element.ROW_ID);
                }
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
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
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.fliterVal
        );
    }

    public getTableFromServer(
        _pageIndex: number,
        _pageSize: number,
        _FreeText: string
    ) {
        // ////debugger
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // ////debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        this.http
            //.post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetAllProtocols", {
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetAllProtocols", {
                _pageIndex: _pageIndex,
                _pageSize: _pageSize,
                _FreeText: _FreeText
            })
            .subscribe((Response) => {
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                this.TABLE_DATA = Response["d"];

                //debugger
                this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                if (Response["d"].length)
                    this.resultsLength = Response["d"][0]["TotalRows"];
                else this.resultsLength = 0;
                setTimeout(function () {
                    //////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }
}
