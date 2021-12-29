import {
    Component,
    OnInit,
    ViewChild,
    Input,
    ElementRef,
    //ChangeDetectionStrategy,
    // ChangeDetectorRef
} from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
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
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
    FormArray,
    AbstractControl,
} from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { formatDate } from "@angular/common";

export interface Demograph {
    FIRST_NAME: string;
    LAST_NAME: string;
    MID_NAME: string;
    ID: string;
    KUPA: string;
    GENDER: string;
    AGE: string;
    PATIENT_NUMBER: string;
    Case_Number: string;
    Depart: string;
    Seode_Depart: string;
}
export interface DropOption {
    value: string;
    name: string;
    viewValue: string;
    groupID: string;
}
export interface Prescription {
    PerscriptionID: string;
    ID: string;
    PatientFirstName: string;
    PatientLastName: string;
    FatherName: string;
    Age: string;
    sex: string;
    Kupa: string;
    Weight: string;
    Hight: string;
    TargetAUC: string;
    CreatinineLevel: string;
    Prognosis: string;
    ProtocolTreatment: string;
    Frequency: string;
    DateAdministrationMed: string;
    MedicationSensitivity: string;
    RegistrationDate: string;
    SaveDate: string;
    ModifyDate: string;
    Status: string;
    statusNotToDo: string;
    SensitivityUnknown: string;
    CourseNum: string;
    CompletionOfDetailsCheck: string;
    DosageCalculationCheck: string;
    CalcOfBodyAreaCheck: string;
    SolutionOfDilutionCheck: string;
    UserCreate: string;
    UserUpdate: string;
    Case_Number: string;
    Depart: string;
    Seode_Depart: string;
    hideOrShow: boolean;
}
export interface PrescriptionRow {
    noteVal: string;
    Dosage_UnitVal: string;
    Dosage_Unit_2_Val: string;
    finalMenonVal: string;
    Duration_Of_DeliveryVal: string;
    Solution_VolumeVal: string;
    SolutionVal: string;
    MenonValVal: string;
    MenonCalcVal: string;
    Way_Of_ProvidingVal: string;
    Days_ProtocolVal: string[];
    MedListVal: string;
    rowIdPreVal: string;
    newRow: Boolean;
}

export interface Drug {
    DrugName: string;
}
@Component({
    //changeDetection: ChangeDetectionStrategy.OnPush,
    selector: "app-mersham",
    templateUrl: "./mersham.component.html",
    styleUrls: ["./mersham.component.css"],
})
export class MershamComponent implements OnInit {
    EDIT_ROW: Boolean;
    ROW_ID_IN_TABLE: number;
    tableColsPres: string[] = [
        "note",
        "Dosage_Unit",
        "finalMenon",
        "Duration_Of_Delivery",
        "Solution_Volume",
        "Solution",
        "Dosage_Unit_2_Val",
        "MenonCalc",
        "Menon",
        "Way_Of_Providing",
        "Days_Protocol",
        "MedList",
        "DELETE",
    ];
    tableColsPresPrint: string[] = [
        "SIN",
        "TIME",
        "note",
        "Dosage_Unit",
        "finalMenon",
        "Duration_Of_Delivery",
        "Solution_Volume",
        "Solution",
        "Dosage_Unit_2_Val",
        "MenonCalc",
        "Menon",
        "Way_Of_Providing",
        "Days_Protocol",
        "MedList",
    ];
    drugs: Drug[] = [];
    DeleteRowId: string;
    DeletePreRowId: string;
    tableDataPres: PrescriptionRow[] = [];
    tableDataPresPrint: PrescriptionRow[] = [];
    tableDataSrcPres = new BehaviorSubject<AbstractControl[]>([]); //new MatTableDataSource(this.tableDataPres);
    tableDataSrcPresPrint = new MatTableDataSource(this.tableDataPresPrint);
    rows: FormArray = this.formBuilder.array([]);
    //form: FormGroup = this.formBuilder.group({ 'SrcPresRows': this.rows });

    PrespictionFormRow: FormGroup = this.formBuilder.group({
        SrcPresRows: this.rows,
    });

    DemographData = {} as Demograph;
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    loadModalAfterCopy: Boolean;
    displayedColumns: string[] = [
        "PerscriptionID",
        "RegistrationDate",
        "DateAdministrationMed",
        "Prognosis",
        "ProtocolTreatment",
        "Status",
        "D_CLICK",
        "D_DELETE",
        //"PRINT"
    ];

    prem: Boolean;
    showDeleteBtn: Boolean;
    showCopyBtn: Boolean;
    isButtonVisible: Boolean;
    isCanceldVisible: Boolean;
    dis: Boolean;
    modalOptions: NgbModalOptions;
    closeResult: string;
    TABLE_DATA: Prescription[] = [];
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    tableLoader: Boolean;
    resultsLength = 0;
    departStatus = 0;
    fliterVal = "";
    PrespictionForm: FormGroup;
    submitted = false;
    FIRST_NAME: string;
    LAST_NAME: string;
    MID_NAME: string;
    ID: string;
    GENDER: string;
    AGE: string;
    Case_Number: string;
    Depart: string;
    Seode_Depart: string;
    KUPA: string;

    FIRST_NAME_In: string;
    LAST_NAME_In: string;
    MID_NAME_In: string;
    ID_In: string;
    GENDER_In: string;
    AGE_In: string;
    Case_Number_In: string;
    Depart_In: string;
    Seode_Depart_In: string;
    KUPA_In: string;
    ShowPerm: boolean;
    Carboplatin: Boolean;
    calcByGender: number;
    rowElementPres: Prescription = {
        PerscriptionID: "",
        ID: "",
        PatientFirstName: "",
        PatientLastName: "",
        FatherName: "",
        Age: "",
        sex: "",
        Kupa: "",
        Weight: "",
        Hight: "",
        TargetAUC: "",
        CreatinineLevel: "",
        Prognosis: "",
        ProtocolTreatment: "",
        Frequency: "",
        DateAdministrationMed: "",
        MedicationSensitivity: "",
        RegistrationDate: "",
        SaveDate: "",
        ModifyDate: "",
        Status: "",
        statusNotToDo: "",
        SensitivityUnknown: "",
        CourseNum: "",
        CompletionOfDetailsCheck: "",
        DosageCalculationCheck: "",
        CalcOfBodyAreaCheck: "",
        SolutionOfDilutionCheck: "",
        UserCreate: "",
        UserUpdate: "",
        Case_Number: "",
        Depart: "",
        Seode_Depart: "",
        hideOrShow: true,
    };
    constructor(
        private activeModal: NgbActiveModal,
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private elementRef: ElementRef,
        //private cdRef:ChangeDetectorRef,
        private formBuilder: FormBuilder
    ) {
        let that = this;
        window.onbeforeprint = function () {
            console.log("This will be called before the user prints.");
            that.editRow(null, null, that.rowElementPres, "false");
            var head =
                document.head || document.getElementsByTagName("head")[0];
            var style = document.createElement("style");
            style.type = "text/css";
            style.media = "print";
            var landscape = true;
            style.appendChild(
                document.createTextNode(
                    landscape
                        ? "@page { size: A4 landscape; margin: 0in;}"
                        : "@page { size: A4;  margin: 0in; }"
                )
            );

            head.appendChild(style);
        };
    }
    @Input()
    fullnameVal: string;
    rowElement: Prescription = {
        PerscriptionID: "",
        ID: "",
        PatientFirstName: "",
        PatientLastName: "",
        FatherName: "",
        Age: "",
        sex: "",
        Kupa: "",
        Weight: "",
        Hight: "",
        TargetAUC: "",
        CreatinineLevel: "",
        Prognosis: "",
        ProtocolTreatment: "",
        Frequency: "",
        DateAdministrationMed: "",
        MedicationSensitivity: "",
        RegistrationDate: "",
        SaveDate: "",
        ModifyDate: "",
        Status: "",
        statusNotToDo: "",
        SensitivityUnknown: "",
        CourseNum: "",
        CompletionOfDetailsCheck: "",
        DosageCalculationCheck: "",
        CalcOfBodyAreaCheck: "",
        SolutionOfDilutionCheck: "",
        UserCreate: "",
        UserUpdate: "",
        Case_Number: "",
        Depart: "",
        Seode_Depart: "",
        hideOrShow: true,
    };
    weightVal: string;
    heightVal: string;
    areaVal: string;
    noteVal: string;
    Sensitivity: string;
    SensitivityBool: boolean;
    Calc_Type: DropOption[];
    Dosage_Unit: DropOption[];
    Notes: DropOption[];
    Dosage_Unit_2_Val: DropOption[];
    ROW_ID_PRE: string;
    Duration_Of_Delivery: DropOption[];
    Solution: DropOption[];
    Solution_Volume: DropOption[];
    Way_Of_Providing: DropOption[];
    MedList: DropOption[];
    ArrayDrus: Array<Array<DropOption>> = [];
    Days_Protocol: DropOption[];
    PresRowIdVal: string;
    filterdDataArray: DropOption[];
    MedListConst: DropOption[];
    loadModalAfterClose: Boolean;
    printForm: {
        MedicationSensitivityVal: string;
        SensitivityVal: Boolean;
        regesterdateIN: string;
        weightVal: string;
        heightVal: string;
        areaVal: string;
        targetAUCVal: string;
        levelVal: string;
        diagnosisVal: string;
        protocolVal: string;
        frequencyVal: string;
        courseNumVal: string;
        takedateIN: string;
        statusRowVal: Boolean;
        statusNotToDo: Boolean;
    };
    ngOnInit(): void {
        this.ROW_ID_PRE = "";
        //this.rowElementPres =
        $("body").addClass("bg-blue-light");
        this.prem = true;
        this.ShowPerm = true;
        this.getPermission();
        this.printForm = {
            MedicationSensitivityVal: "",
            SensitivityVal: false,
            regesterdateIN: "",
            weightVal: "",
            heightVal: "",
            areaVal: "",
            targetAUCVal: "",
            levelVal: "",
            diagnosisVal: "",
            protocolVal: "",
            frequencyVal: "",
            courseNumVal: "",
            takedateIN: "",
            statusRowVal: false,
            statusNotToDo: false,
        };
        this.Carboplatin = false;
        this.showDeleteBtn = false;
        this.DeleteRowId = "";
        this.DeletePreRowId = "";
        this.PresRowIdVal = "";
        this.isButtonVisible = true;
        this.isCanceldVisible = false;
        this.EDIT_ROW = false;
        this.ROW_ID_IN_TABLE = 0;
        this.weightVal = "0";
        this.heightVal = "0";
        this.areaVal = "0";
        this.noteVal = "";
        this.loader = false;
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);
        this.loadModalAfterCopy = false;
        this.loadModalAfterClose = false;
        // if (
        //     localStorage.getItem("loginState") != "true" ||
        //     localStorage.getItem("loginUserName") == ""
        // ) {
        //     this.router.navigate(["login"]);
        // } else if (
        //     localStorage.getItem("loginUserName").toLowerCase() ==
        //         "jmassalha" ||
        //     localStorage.getItem("loginUserName").toLowerCase() == "samer" ||
        //     localStorage.getItem("loginUserName").toLowerCase() == "owertheim"
        // ) {
        // } else {
        //     this.router.navigate(["login"]);
        //     ///$("#chadTable").DataTable();
        // }
        this.getDropDownFromServer();
        //this.cdRef.detectChanges();
    }
    ClearMershmData() {
        ////////debugger
        this.rows = this.formBuilder.array([]);
        this.PrespictionFormRow = this.formBuilder.group({
            SrcPresRows: this.rows,
        });
        this.PrespictionForm = this.formBuilder.group({
            weightVal: [null, Validators.required],
            heightVal: [null, Validators.required],
            areaVal: [{ value: "0", disabled: false }, false],
            targetAUCVal: ["", false],
            levelVal: ["", false],
            diagnosisVal: ["", false],
            protocolVal: ["", false],
            frequencyVal: ["", false],
            courseNumVal: ["", false],
            takedateIN: [null, Validators.required],
            regesterdateIN: [
                new FormControl(new Date()).value,
                Validators.required,
            ],
            rowIdVal: [this.ROW_ID_PRE, false],
            SensitivityVal: [false, Validators.required],
            MedicationSensitivityVal: [
                "",
                [Validators.required, Validators.pattern("[A-Za-z0-9 ]*")],
            ],
            statusRowVal: [false, false],
            statusNotToDo: [false, false],
        });
        //////debugger
        this.updateView();
        //////debugger
    }
    checkIfCarboplatin($event) {
        // ////////debugger

        this.Carboplatin = false;
        var Boolean = false;
        for (var i = 0; i < this.rows.value.length; i++) {
            var arr = this.rows.value[i].MedListVal.split("___");
            var d = this.MedList.findIndex((obj) => {
                return obj.value === arr[0];
            });
            if (d >= 0) {
                this.rows.value[i].groupID = this.MedList[d].groupID;
            }

            if (arr[0] === "I.CARBOPLATIN") {
                Boolean = true;
            }
        }
        if (Boolean) {
            this.Carboplatin = true;
            this.PrespictionForm.controls.levelVal.setValidators([
                Validators.required,
            ]);
            this.PrespictionForm.controls.levelVal.updateValueAndValidity();
            this.PrespictionForm.controls.targetAUCVal.setValidators([
                Validators.required,
            ]);
            this.PrespictionForm.controls.targetAUCVal.updateValueAndValidity();
        } else {
            this.PrespictionForm.controls.targetAUCVal.setValidators(null);
            this.PrespictionForm.controls.targetAUCVal.updateValueAndValidity();
            this.PrespictionForm.controls.levelVal.setValidators(null);
            this.PrespictionForm.controls.levelVal.updateValueAndValidity();
            this.Carboplatin = false;
        }
        this.calcPres();
    }
    calcPres() {
        debugger;
        for (var i = 0; i < this.rows.value.length; i++) {
            ////////////////debugger
            var arr = this.rows.value[i].MedListVal.split("___");
            var d = this.MedList.findIndex((obj) => {
                return obj.value === arr[0];
            });
            if (d >= 0) {
                this.rows.value[i].groupID = this.MedList[d].groupID;
            }
            if (
                this.rows.value[i].groupID != "" &&
                this.rows.value[i].groupID != null
            ) {
                ////////////////debugger
                if (this.rows.value[i].MenonValVal == "")
                    this.rows.value[i].MenonValVal = 0;
                switch (this.rows.value[i].groupID) {
                    case "1":
                    case "2":
                        this.rows.controls[i]["controls"].MenonCalcVal.setValue(
                            (
                                parseFloat(this.PrespictionForm.value.areaVal) *
                                parseFloat(this.rows.value[i].MenonValVal)
                            ).toFixed(1)
                        );
                        break;
                    case "3":
                        this.rows.controls[i]["controls"].MenonCalcVal.setValue(
                            (
                                parseFloat(
                                    this.PrespictionForm.value.weightVal
                                ) * parseFloat(this.rows.value[i].MenonValVal)
                            ).toFixed(1)
                        );
                        break;
                    case "4":
                        switch (this.GENDER) {
                            case "זכר":
                                this.calcByGender = 1;
                                break;
                            default:
                                this.calcByGender = 0.85;
                        }
                        var AgeX =
                            (((140 - parseFloat(this.AGE)) *
                                parseFloat(
                                    this.PrespictionForm.value.weightVal
                                )) /
                            (72 *
                                parseFloat(
                                    this.PrespictionForm.value.levelVal
                                ))) * this.calcByGender;
                        //     this.PrespictionForm.value.weightVal
                        // )
                        //     ) ;
                        // (((parseFloat(
                        //     this.PrespictionForm.value.weightVal
                        // )
                        //     ) *
                        //     (140 - parseFloat(this.AGE))) /
                        //     72*parseFloat(
                        //         this.PrespictionForm.value.levelVal
                        //     )) *
                        // this.calcByGender;
                        
                        debugger;
                        this.rows.controls[i]["controls"].MenonCalcVal.setValue(
                            (
                                parseFloat(
                                    this.PrespictionForm.value.targetAUCVal
                                ) *
                                (AgeX + 25)
                            ).toFixed(1)
                        );
                        break;
                    default:
                        this.rows.controls[i]["controls"].MenonCalcVal.setValue(
                            ""
                        );
                }
            }
        }
        this.updateView();

        this.tableDataPresPrint = this.rows.value;
        this.tableDataSrcPresPrint = new MatTableDataSource(
            this.tableDataPresPrint
        );
    }
    openSnackBar(AlertTxt, Type) {
        // //////debugger
        this._snackBar.open(AlertTxt, "", {
            duration: 2500,
            direction: "rtl",
            panelClass: Type,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
    delete(c, type) {
        //  ////////////////debugger
        if (type == "true") {
            var d = this.rows.value.findIndex((obj) => {
                return obj.rowIdPreVal === this.DeleteRowId;
            });
            //////////////debugger
            if (this.rows.value[d].newRow == "false") {
                this.http
                    .post(
                        "https://srv-apps:4433/WebService.asmx/DeletePresRowInside",
                        {
                            _rowID: this.DeleteRowId,
                        }
                    )
                    .subscribe((Response) => {
                        //this.getReport("");
                        setTimeout(function () {
                            // $("#loader").addClass("d-none");
                            //this.DeleteRowId = "";
                            //this.openSnackBar("נמחק בהצלחה", "success");
                        }, 500);
                    });
            }

            this.rows.removeAt(d);
            this.updateView();
            this.tableDataPresPrint = this.rows.value;
            this.tableDataSrcPresPrint = new MatTableDataSource(
                this.tableDataPresPrint
            );
            this.DeleteRowId = "";
        } else {
            this.DeleteRowId = "";
        }
        c("close modal");
        // //////////////////debugger
        // this.modalService._modalStack._windowCmpts[1].dismiss()
    }
    getPermission() {
        this.http
            .post("https://srv-apps:4433/WebService.asmx/selectPermission", {
                _UserName: localStorage.getItem("loginUserName"),
            })
            .subscribe((Response) => {
                // //////////debugger
                var json = JSON.parse(Response["d"]);
                switch (json) {
                    case 0:
                    case "0":
                        break;
                    case 1:
                    case "1":
                        break;
                    case "2":
                    case 2:
                        this.ShowPerm = false;
                        this.prem = false;
                        this.displayedColumns = [
                            "PerscriptionID",
                            "RegistrationDate",
                            "DateAdministrationMed",
                            "Prognosis",
                            "ProtocolTreatment",
                            "Status",
                            "D_CLICK",
                        ];
                        break;
                    case "3":
                    case 3:
                        this.prem = false;
                        this.ShowPerm = false;
                        this.displayedColumns = [
                            "PerscriptionID",
                            "RegistrationDate",
                            "DateAdministrationMed",
                            "Prognosis",
                            "ProtocolTreatment",
                            "Status",
                            "D_CLICK",
                        ];
                        break;
                    default:
                        localStorage.clear();
                        this.router.navigate(["login"]);
                }
                setTimeout(function () {
                    // $("#loader").addClass("d-none");
                    //this.DeleteRowId = "";
                    //this.openSnackBar("נמחק בהצלחה", "success");
                }, 500);
            });
    }
    closrModal(c) {
        c("close modal");
    }
    deleteRow(content, _type, _element, rowIdx) {
        this.ArrayDrus.splice(rowIdx, 1);
        this.DeleteRowId = _element.value.rowIdPreVal;
        this.modalOptions = {
            windowClass: "custom-class",
        };
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                ////////////////////////////debugger
                if ("Save" == result) {
                    // //////////////////////////debugger;
                    //this.saveChad(_element.ROW_ID);
                }
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
        this.modalOptions = {};
    }

    deletePerRow(content, _type, _element) {
        //  //////////////debugger
        //////////////////debugger
        this.DeletePreRowId = _element.PerscriptionID;
        this.modalOptions = {
            windowClass: "custom-class",
        };
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                ////////////////////////////debugger
                if ("Save" == result) {
                    // //////////////////////////debugger;
                    //this.saveChad(_element.ROW_ID);
                }
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
        this.modalOptions = {};
    }
    deletePre(c, type) {
        c("close modal");
        if ($("#loader").hasClass("d-none")) {
            $("#loader").removeClass("d-none");
        }
        this.http
            .post("https://srv-apps:4433/WebService.asmx/DeletePresRow", {
                _rowID: this.DeletePreRowId,
            })
            .subscribe((Response) => {
                this.getReport("");
                setTimeout(function () {
                    $("#loader").addClass("d-none");
                    this.DeletePreRowId = null;
                }, 500);

                this.openSnackBar("נמחק בהצלחה", "success");
            });
    }

    printRowInside() {
        //////////debugger
        this.editRow(null, null, this.rowElementPres, "false");
        setTimeout(function () {
            var head =
                document.head || document.getElementsByTagName("head")[0];
            var style = document.createElement("style");
            style.type = "text/css";
            style.media = "print";
            var landscape = true;
            style.appendChild(
                document.createTextNode(
                    landscape
                        ? "@page { size: A4 landscape; margin: 0in;}"
                        : "@page { size: A4;  margin: 0in; }"
                )
            );

            head.appendChild(style);
            window.print();
            setTimeout(function () {
                head.removeChild(style);
            }, 500);
        }, 1000);
    }
    printRow(element) {
        this.editRow(null, null, element, "false");
        setTimeout(function () {
            window.print();
        }, 1000);
    }
    formatDate(date) {
        var d = date,
            month = "" + (d.getMonth() + 1),
            day = "" + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;

        return [day, month, year].join("/");
    }
    saveAndClose() {
        this.PrespictionForm.value.statusRowVal = true;
        this.loadModalAfterClose = true;
    }
    checkMyValue(ele, rowIdx) {
        // //debugger
        var MenonCalcVal = this.rows.value[rowIdx].MenonCalcVal;
        var _f5ivePre =
            (parseFloat(this.rows.value[rowIdx].MenonCalcVal) * 5) / 100;
        if (parseFloat(ele) - _f5ivePre > parseFloat(MenonCalcVal)) {
            this.rows.controls[rowIdx]["controls"]["noteVal"].setValidators([
                Validators.required,
            ]);
            this.rows.controls[rowIdx]["controls"][
                "noteVal"
            ].updateValueAndValidity();
        } else if (parseFloat(ele) + _f5ivePre < parseFloat(MenonCalcVal)) {
            this.rows.controls[rowIdx]["controls"]["noteVal"].setValidators([
                Validators.required,
            ]);
            this.rows.controls[rowIdx]["controls"][
                "noteVal"
            ].updateValueAndValidity();
        } else {
            this.rows.controls[rowIdx]["controls"]["noteVal"].setValidators(
                null
            );
            this.rows.controls[rowIdx]["controls"][
                "noteVal"
            ].updateValueAndValidity();
        }
        ////debugger
    }
    editRow(content, _type, _element, openModal) {
        debugger;
        this.FIRST_NAME_In = _element.PatientFirstName;
        this.LAST_NAME_In = _element.PatientLastName;
        this.MID_NAME_In = _element.FatherName;
        this.ID_In = _element.ID;
        this.GENDER_In = _element.sex;
        this.AGE_In = _element.Age;
        this.KUPA_In = _element.Kupa;
        this.Case_Number_In = _element.Case_Number;
        this.Depart_In = _element.Depart;
        this.Seode_Depart_In = _element.Seode_Depart;

        this.ROW_ID_PRE = _element.PerscriptionID;
        this.rowElementPres = _element;
        //////////////////debugger;
        // this.PrespictionFormRow = this.formBuilder.group({
        //     noteVal: ["", false],
        //     Dosage_UnitVal: ["", false],
        //     Dosage_Unit_2_Val: ["", false],
        //     finalMenonVal: ["", false],
        //     Duration_Of_DeliveryVal: ["", false],
        //     Solution_VolumeVal: ["", false],
        //     SolutionVal: ["", false],
        //     MenonValVal: ["", false],
        //     Way_Of_ProvidingVal: ["", false],
        //     Days_ProtocolVal: ["", false],
        //     MenonCalcVal: [{value:"", disabled: true}, false],
        //     MedListVal: ["", false],
        //     rowIdPreVal: [this.ROW_ID_IN_TABLE + 1, false],
        // });
        this.SensitivityBool = false;
        var _status = false;
        var _statusNotToDo = false;
        this.dis = false;
        $(document).find("#prespictionsDetailsBtn").removeClass("d-none");
        $(document).find("#submitAll").removeClass("d-none");
        if (_element.Status == "שמור") {
            this.dis = _status = false;
            this.isButtonVisible = true;
            this.showCopyBtn = true;
            this.isCanceldVisible = false;
            // debugger
            if (!_element.hideOrShow) {
                this.dis = _status = true;
            }
        } else if (_element.Status == "נעול") {
            this.dis = _status = true;
            this.showCopyBtn = true;
            this.isButtonVisible = false;
            this.isCanceldVisible = false;
            ////////////////////debugger
        } else {
            this.showCopyBtn = false;
            this.dis = true;
            this.isCanceldVisible = true;
            this.isButtonVisible = false;
        }
        if (_element.statusNotToDo == "1") {
            _statusNotToDo = true;
        }
        var _requerd_sen = Validators.required;
        var _requerd_drug = Validators.required;
        if (_element.SensitivityUnknown.toLowerCase().trim() == "true") {
            this.SensitivityBool = true;
            _requerd_sen = Validators.required;
            _requerd_drug = null;
        } else {
            _requerd_sen = null;
            _requerd_drug = Validators.required;
        }
        ////////////////////debugger
        /*
        DateAdministrationMed
        RegistrationDate
        */
        var dateIN = null;
        var dateT = null;
        //////debugger
        if (
            _element.DateAdministrationMed != "" &&
            typeof _element.DateAdministrationMed != "object"
        ) {
            var dArr = _element.DateAdministrationMed.split("-");
            dateT = new FormControl(
                new Date(
                    parseInt(dArr[2]),
                    parseInt(dArr[1]) - 1,
                    parseInt(dArr[0])
                )
            ).value;
        }
        if (
            _element.RegistrationDate != "" &&
            typeof _element.RegistrationDate != "object"
        ) {
            var dArr = _element.RegistrationDate.split("-");
            dateIN = new FormControl(
                new Date(
                    parseInt(dArr[2]),
                    parseInt(dArr[1]) - 1,
                    parseInt(dArr[0])
                )
            ).value;
        }
        this.printForm.weightVal = _element.Weight;
        this.printForm.heightVal = _element.Hight;
        this.printForm.areaVal = Math.sqrt(
            (parseFloat(_element.Weight) * parseFloat(_element.Hight)) / 3600
        ).toFixed(1);
        this.printForm.targetAUCVal = _element.TargetAUC;
        this.printForm.levelVal = _element.CreatinineLevel;
        this.printForm.diagnosisVal = _element.Prognosis;
        this.printForm.protocolVal = _element.ProtocolTreatment;
        this.printForm.frequencyVal = _element.Frequency;
        this.printForm.courseNumVal = _element.CourseNum;
        if (dateT != null && dateT != "") {
            this.printForm.takedateIN = this.formatDate(dateT);
        } else {
            this.printForm.takedateIN = null;
        }

        this.printForm.regesterdateIN = this.formatDate(dateIN);
        this.printForm.SensitivityVal = this.SensitivityBool;
        this.printForm.MedicationSensitivityVal =
            _element.MedicationSensitivity;
        this.printForm.statusRowVal = _status;
        // //////////debugger
        this.PrespictionForm = this.formBuilder.group({
            weightVal: [
                { value: _element.Weight, disabled: this.dis },
                Validators.required,
            ],
            heightVal: [
                { value: _element.Hight, disabled: this.dis },
                Validators.required,
            ],
            areaVal: [
                {
                    value: Math.sqrt(
                        (parseFloat(_element.Weight) *
                            parseFloat(_element.Hight)) /
                            3600
                    ).toFixed(1),
                    disabled: false,
                },
                false,
            ],
            targetAUCVal: [
                { value: _element.TargetAUC, disabled: this.dis },
                false,
            ],
            levelVal: [
                { value: _element.CreatinineLevel, disabled: this.dis },
                false,
            ],
            diagnosisVal: [
                { value: _element.Prognosis, disabled: this.dis },
                Validators.required,
            ],
            protocolVal: [
                { value: _element.ProtocolTreatment, disabled: this.dis },
                Validators.required,
            ],
            frequencyVal: [
                { value: _element.Frequency, disabled: this.dis },
                false,
            ],
            courseNumVal: [
                { value: _element.CourseNum, disabled: this.dis },
                false,
            ],
            takedateIN: [
                { value: dateT, disabled: this.dis },
                Validators.required,
            ],
            regesterdateIN: [
                { value: dateIN, disabled: this.dis },
                Validators.required,
            ],
            rowIdVal: [
                { value: _element.PerscriptionID, disabled: false },
                false,
            ],
            SensitivityVal: [
                { value: this.SensitivityBool, disabled: this.dis },
                _requerd_sen,
            ],
            MedicationSensitivityVal: [
                { value: _element.MedicationSensitivity, disabled: this.dis },
                _requerd_drug,
            ],
            statusRowVal: [{ value: _status, disabled: this.dis }, false],
            statusNotToDo: [{ value: _statusNotToDo, disabled: false }, false],
        });
        this.PresRowIdVal = _element.PerscriptionID;
        ////////////////////debugger

        this.getPresFromServer(_element.PerscriptionID);
        if (openModal == "true") {
            this.modalService
                .open(content, { windowClass: "width-1010",  backdrop : 'static',
                keyboard : false })
                .result.then(
                    (result) => {
                        this.closeResult = `Closed with: ${result}`;
                        ////////////////////////////debugger
                        if ("Save" == result) {
                            // //////////////////////////debugger;
                            //this.saveChad(_element.ROW_ID);
                        }
                    },
                    (reason) => {
                        this.closeResult = `Dismissed ${this.getDismissReason(
                            reason
                        )}`;
                    }
                );
        }
        /*
         */
        //if ($("#loader").hasClass("d-none")) {
        $("#loader").addClass("d-none");
        //}
    }
    copyRowPres(element) {
        //debugger
        if ($("#loader").hasClass("d-none")) {
            $("#loader").removeClass("d-none");
        }
        this.PrespictionForm.enable();
        this.rows.enable();
        // ////////debugger
        // return
        for (var i = 0; i < this.rows.value.length; i++) {
            this.rows.value[i]["Days_ProtocolVal"] =
                this.rows.value[i]["Days_ProtocolVal"].join(",");
        }
        //debugger
        var copyParent = this.PrespictionForm.value;
        var copyrows = this.rows.value;

        copyParent.statusRowVal = "false";
        copyParent.rowIdVal = "-100";
        var dateNow = new FormControl(new Date()).value;
        //////debugger
        copyParent.regesterdateIN = dateNow;
        copyParent.takedateIN = null;
        //////debugger
        for (var i = 0; i < copyrows.length; i++) {
            //////////debugger;
            copyrows[i].newRow = "true";
            copyrows[i].rowIdPreVal = -1 * i;
        }
        copyParent.takedateIN = formatDate(
            copyParent.takedateIN,
            "yyyy-MM-dd",
            "en-US"
        );
        copyParent.regesterdateIN = formatDate(
            copyParent.regesterdateIN,
            "yyyy-MM-dd",
            "en-US"
        );
        if (copyParent.statusNotToDo) {
            copyParent.statusNotToDo = "1";
        } else {
            copyParent.statusNotToDo = "0";
        }
        var ParentFrom = copyParent;
        var tableFrom = copyrows;
        if(this.ID == ""){
            this.ID = this.ID_In;
        }
        debugger
        //return
        //debugger
        this.http
            .post("https://srv-apps:4433/WebService.asmx/SubmitPrecpiction", {
                ParentFrom: ParentFrom,
                tableFrom: tableFrom,
                patientId: this.ID,
                loginUserName: localStorage
                    .getItem("loginUserName")
                    .toLowerCase(),
            })
            .subscribe((Response) => {
                //////debugger;
                this.openSnackBar("נשמר בהצלחה", "success");
                this.loadModalAfterCopy = true;
                this.getReport("");
                this.modalService.dismissAll();
            });
    }
    clearForm() {
        this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
        this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
        this.resultsLength = 0;
        this.fliterVal = "";
        $(document).find("#demographData").addClass("d-none");
    }
    public applyFilterSearch(value, index, element) {
        this.elementRef.nativeElement = document.getElementById(
            "singleSelect" + index
        );
        // ////debugger
        this.filterdDataArray = [];
        this.search(value, index);
    }
    search(value: string, index) {
        let filter = value.toLowerCase();
        for (let i = 0; i < this.MedListConst.length; i++) {
            let option = this.MedListConst[i];
            if (option.viewValue.toLowerCase().indexOf(filter) >= 0) {
                this.filterdDataArray.push(option);
            }
        }
        this.ArrayDrus[index] = this.filterdDataArray;
        //////////////////debugger
    }

    editRowPre(content, _type, _element) {
        debugger;
        this.EDIT_ROW = true;
        ////////////////////debugger
        // this.PrespictionFormRow = this.formBuilder.group({
        //     noteVal: [{value:_element.noteVal, disabled: this.dis}, false],
        //     Dosage_UnitVal: [{value:_element.Dosage_UnitVal, disabled: this.dis}, false],
        //     Dosage_Unit_2_Val: [{value:_element.Dosage_Unit_2_Val, disabled: this.dis}, false],
        //     finalMenonVal: [{value:_element.finalMenonVal, disabled: this.dis}, false],
        //     Duration_Of_DeliveryVal: [{value:_element.Duration_Of_DeliveryVal, disabled: this.dis}, false],
        //     Solution_VolumeVal: [{value:_element.Solution_VolumeVal, disabled: this.dis}, false],
        //     SolutionVal: [{value:_element.SolutionVal, disabled: this.dis}, false],
        //     MenonValVal: [{value:_element.MenonValVal, disabled: this.dis}, false],
        //     MenonCalcVal: [{value:_element.MenonCalcVal, disabled: this.dis}, false],
        //     Way_Of_ProvidingVal: [{value:_element.Way_Of_ProvidingVal, disabled: this.dis}, false],
        //     Days_ProtocolVal: [{value:_element.Days_ProtocolVal, disabled: this.dis}, false],
        //     MedListVal: [{value:_element.MedListVal, disabled: this.dis}, false],
        //     rowIdPreVal: [{value:_element.rowIdPreVal, disabled: this.dis}, false],
        // });
        //debugger
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                ////////////////////////////debugger
                if ("Save" == result) {
                    // //////////////////////////debugger;
                    //this.saveChad(_element.ROW_ID);
                }
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }

    changeActiveNo($event) {
        //////////////debugger;
        if ($event.checked) {
            this.Sensitivity = "1";
            this.PrespictionForm.controls.MedicationSensitivityVal.setValidators(
                null
            );
        } else {
            this.Sensitivity = "0";
            this.PrespictionForm.controls.MedicationSensitivityVal.setValidators(
                [Validators.required, Validators.pattern("[A-Za-z0-9]*")]
            );
        }
        this.PrespictionForm.controls.MedicationSensitivityVal.updateValueAndValidity();
    }
    changeActive($event) {
        if ($event.checked) {
            this.Sensitivity = "1";
        } else {
            this.Sensitivity = "0";
        }
    }
    changeActiveAndSave($event, _element) {
        // //debugger
        if ($event.checked) {
            $event = "1";
        } else {
            $event = "0";
        } ////debugger
        this.http
            .post(
                "https://srv-apps:4433/WebService.asmx/SubmitPrecpictionNotToServe",
                {
                    status: $event,
                    patientId: _element.ROW_ID_PRE,
                    loginUserName: localStorage
                        .getItem("loginUserName")
                        .toLowerCase(),
                }
            )
            .subscribe((Response) => {
                this.openSnackBar("נשמר בהצלחה", "success");
                this.getReport("");
                // if ($("#loader").hasClass("d-none")) {
                // $("#loader").addClass("d-none");
                // }
            });
    }
    onSubmit() {
        ////debugger
        ////////////////////debugger
        this.submitted = true;
        ////////////////////////////debugger
        // stop here if form is invalid
        ////debugger
        if (this.PrespictionForm.invalid || this.rows.invalid) {
            this.openSnackBar(
                "נא למלא את כל השדות המסומנים באדום",
                "error-font-gib"
            );
            return;
        }

        if ($("#loader").hasClass("d-none")) {
            $("#loader").removeClass("d-none");
        }
        if (this.PrespictionForm.value.statusRowVal) {
            this.PrespictionForm.value.statusRowVal = "true";
        } else {
            this.PrespictionForm.value.statusRowVal = "false";
        }
        if (this.PrespictionForm.value.statusNotToDo) {
            this.PrespictionForm.value.statusNotToDo = "1";
        } else {
            this.PrespictionForm.value.statusNotToDo = "0";
        }
        //this.PrespictionForm.value.regesterdateIN.setDate(this.PrespictionForm.value.regesterdateIN.getDate() + 1)
        //this.PrespictionForm.value.takedateIN.setDate(this.PrespictionForm.value.takedateIN.getDate() + 1)

        this.PrespictionForm.value.takedateIN = formatDate(
            this.PrespictionForm.value.takedateIN,
            "yyyy-MM-dd",
            "en-US"
        );
        this.PrespictionForm.value.regesterdateIN = formatDate(
            this.PrespictionForm.value.regesterdateIN,
            "yyyy-MM-dd",
            "en-US"
        );
        //this.PrespictionForm.value.statusRowVal = ;
        var ParentFrom = this.PrespictionForm.value;
        for (var i = 0; i < this.rows.value.length; i++) {
            this.rows.value[i]["Days_ProtocolVal"] =
                this.rows.value[i]["Days_ProtocolVal"].join(",");
        }
        var tableFrom = this.rows.value;
        if(this.ID == ""){
            this.ID = this.ID_In;
        }
        //return
        // //////////debugger
        this.http
            .post("https://srv-apps:4433/WebService.asmx/SubmitPrecpiction", {
                ParentFrom: ParentFrom,
                tableFrom: tableFrom,
                patientId: this.ID,
                loginUserName: localStorage
                    .getItem("loginUserName")
                    .toLowerCase(),
            })
            .subscribe((Response) => {
                this.openSnackBar("נשמר בהצלחה", "success");
                this.getReport("");
                // if ($("#loader").hasClass("d-none")) {
                // $("#loader").addClass("d-none");
                // }
            });
        // display form values on success
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.PrespictionForm.value, null, 4));
        this.modalService.dismissAll();
    }

    onSubmitRow() {
        // return "";
    }
    getReport($event: any): void {
        ////////////////////////debugger
        if (this.fliterVal.trim() != "")
            this.getTableFromServer(
                this.paginator.pageIndex,
                50,
                this.fliterVal
            );
    }
    applyFilter(filterValue: string) {
        this.fliterVal = filterValue;

        this.getTableFromServer(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.fliterVal
        );

        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    calcArea(event) {
        this.heightVal = parseFloat(
            this.PrespictionForm.value.heightVal
        ).toFixed(1);
        this.weightVal = parseFloat(
            this.PrespictionForm.value.weightVal
        ).toFixed(1);
        if (this.heightVal == "NaN") {
            this.heightVal = "0";
        }
        if (this.weightVal == "NaN") {
            this.weightVal = "0";
        }
        ////////////debugger
        this.PrespictionForm.removeControl("areaVal");
        this.PrespictionForm.addControl("areaVal", new FormControl(""));
        ////////////////////debugger
        this.areaVal = Math.sqrt(
            (parseFloat(this.heightVal) * parseFloat(this.weightVal)) / 3600
        ).toFixed(1);

        this.PrespictionForm.removeControl("areaVal");
        this.PrespictionForm.addControl(
            "areaVal",
            new FormControl({ value: this.areaVal, disabled: false })
        );
        //  //////debugger
        // if(this.areaVal)
        this.PrespictionForm.controls.areaVal.setValue(this.areaVal);
        // else
        //   this.PrespictionForm.controls.areaVal.setValue(0);
        //////////debugger
        this.calcPres();
    }
    open(content, _type, _element) {
        this.ArrayDrus = [];
        this.getDropDownFromServer();
        ////////////////////debugger
        this.ROW_ID_PRE = "";
        this.PresRowIdVal = "";
        this.rows = this.formBuilder.array([]);
        this.PrespictionFormRow = this.formBuilder.group({
            SrcPresRows: this.rows,
        });
        this.updateView();

        this.tableDataPresPrint = this.rows.value;
        this.tableDataSrcPresPrint = new MatTableDataSource(
            this.tableDataPresPrint
        );
        this.dis = false;
        this.SensitivityBool = false;
        this.isCanceldVisible = false;
        this.isButtonVisible = true;
        this.tableDataPres.splice(0, this.tableDataPres.length);
        var _status = false;
        var _statusNotToDo = false;
        if (_element.Status == "שמור") {
            _status = false;
        } else if (_element.Status == "נעול") {
            _status = true;
        }
        if (_element.statusNotToDo == "1") {
            _statusNotToDo = true;
        } else {
            _statusNotToDo = false;
        }
        //debugger
        this.SensitivityBool = false;
        this.PrespictionForm = this.formBuilder.group({
            weightVal: [null, Validators.required],
            heightVal: [null, Validators.required],
            areaVal: [{ value: "0", disabled: false }, false],
            targetAUCVal: ["", false],
            levelVal: ["", false],
            diagnosisVal: ["", false],
            protocolVal: ["", false],
            frequencyVal: ["", false],
            courseNumVal: ["", false],
            takedateIN: [null, Validators.required],
            regesterdateIN: [
                new FormControl(new Date()).value,
                Validators.required,
            ],
            rowIdVal: ["-100", false],
            SensitivityVal: [this.SensitivityBool, Validators.required],
            MedicationSensitivityVal: [
                "",
                [Validators.required, Validators.pattern("[A-Za-z0-9 ]*")],
            ],
            statusRowVal: [_status, false],
            statusNotToDo: [_statusNotToDo, false],
        });
        let ngbModalOptions: NgbModalOptions = {
                backdrop : 'static',
                keyboard : false
        };
        ////////////////////debugger
        this.modalService.open(content, ngbModalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                //////////////////////////debugger
                if ("Save" == result) {
                    // ////////////////////////debugger;
                    //this.saveChad(_element.ROW_ID);
                }
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }
    openRow(content, _type, _element) {
        this.EDIT_ROW = false;
        this.ROW_ID_IN_TABLE = this.rows.length;
        ////////////////debugger
        //this.tableDataSrcPres = new MatTableDataSource(this.tableDataPres);
        const row = this.formBuilder.group({
            noteVal: ["", false],
            Dosage_UnitVal: ["", false],
            Dosage_Unit_2_Val: ["", false],
            finalMenonVal: ["", false],
            Duration_Of_DeliveryVal: ["", false],
            Solution_VolumeVal: ["", false],
            SolutionVal: ["", false],
            MenonValVal: ["", false],
            Way_Of_ProvidingVal: ["", false],
            Days_ProtocolVal: [[], false],
            MenonCalcVal: [{ value: "", disabled: false }, false],
            MedListVal: ["", false],
            rowIdPreVal: [this.ROW_ID_IN_TABLE + 1, false],
            groupID: ["", false],
            newRow: ["true", false],
        });
        this.ArrayDrus.push(this.MedListConst);
        // this.DeleteRowId = (this.ROW_ID_IN_TABLE + 1).toString();
        this.rows.push(row);
        this.updateView();

        // this.tableDataPresPrint = this.rows.value;
        // this.tableDataSrcPresPrint = new MatTableDataSource(this.tableDataPresPrint);

        // this.modalService.open(content, this.modalOptions).result.then(
        //     (result) => {
        //         this.closeResult = `Closed with: ${result}`;
        //         //////////////////////////debugger
        //         if ("Save" == result) {
        //             // ////////////////////////debugger;
        //             //this.saveChad(_element.ROW_ID);
        //         }
        //     },
        //     (reason) => {
        //         this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        //     }
        // );
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
    getPaginatorData(event: PageEvent) {
        //console.log(this.paginator.pageIndex);
        this.getTableFromServer(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.fliterVal
        );
    }

    public getDropDownFromServer() {
        ////////////////////////debugger

        this.http
            .post(
                "https://srv-apps:4433/WebService.asmx/GetDropDownsOptions",
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
                this.Notes = JSON.parse(json["Notes"]);
                ////////////////////////debugger
            });
    }

    public getPresFromServer(_presID: string) {
        this.getDropDownFromServer();
        ////////////////////////debugger
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // ////////////////////////debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        this.http
            .post("https://srv-apps:4433/WebService.asmx/GetPresRows", {
                ID: _presID,
            })
            .subscribe((Response) => {
                ////////////debugger
                this.rows = this.formBuilder.array([]);
                this.PrespictionFormRow = this.formBuilder.group({
                    SrcPresRows: this.rows,
                });
                this.updateView();
                this.tableDataPres.splice(0, this.tableDataPres.length);
                var json = JSON.parse(JSON.parse(Response["d"]));
                var Medicine_Prescriptions = JSON.parse(
                    json["Medicine_Prescriptions"]
                );
                this.ArrayDrus = [];
                this.drugs = [];
                this.tableDataPresPrint = [];
                for (var i = 0; i < Medicine_Prescriptions.length; i++) {
                    // //////////////////debugger
                    /*
                     */
                    var clc = "";
                    if (
                        parseFloat(
                            Medicine_Prescriptions[i].DosageCalc
                        ).toFixed(1) != "NaN"
                    ) {
                        clc = parseFloat(
                            Medicine_Prescriptions[i].DosageCalc
                        ).toFixed(1);
                    }
                    var d = this.MedList.findIndex((obj) => {
                        return obj.value === Medicine_Prescriptions[i].DrugName;
                    });
                    var groupID = "";
                    if (d > -1) {
                        groupID = this.MedList[d].groupID;
                    }

                    //  //////////////////debugger
                    const row = this.formBuilder.group({
                        noteVal: [
                            {
                                value: Medicine_Prescriptions[i].ChangeNotes,
                                disabled: this.dis,
                            },
                            false,
                        ],
                        Dosage_Unit_2_Val: [
                            {
                                value: Medicine_Prescriptions[i].DosingUnit,
                                disabled: this.dis,
                            },
                            false,
                        ],
                        Dosage_UnitVal: [
                            {
                                value: Medicine_Prescriptions[i]
                                    .DosingUnitFinal,
                                disabled: this.dis,
                            },
                            false,
                        ],
                        finalMenonVal: [
                            {
                                value: Medicine_Prescriptions[i].DosageFinal,
                                disabled: this.dis,
                            },
                            false,
                        ],
                        Duration_Of_DeliveryVal: [
                            {
                                value: Medicine_Prescriptions[i].Duration,
                                disabled: this.dis,
                            },
                            false,
                        ],
                        Solution_VolumeVal: [
                            {
                                value: Medicine_Prescriptions[i].SolutionVol,
                                disabled: this.dis,
                            },
                            false,
                        ],
                        SolutionVal: [
                            {
                                value: Medicine_Prescriptions[i].Solution,
                                disabled: this.dis,
                            },
                            false,
                        ],
                        MenonValVal: [
                            {
                                value: Medicine_Prescriptions[i].Dosage,
                                disabled: this.dis,
                            },
                            false,
                        ],
                        MenonCalcVal: [{ value: clc, disabled: false }, false],
                        Way_Of_ProvidingVal: [
                            {
                                value: Medicine_Prescriptions[i]
                                    .MedAdministrationType,
                                disabled: this.dis,
                            },
                            false,
                        ],
                        Days_ProtocolVal: [
                            {
                                value: Medicine_Prescriptions[
                                    i
                                ].ProtocolDay.split(","),
                                disabled: this.dis,
                            },
                            false,
                        ],
                        MedListVal: [
                            {
                                value: Medicine_Prescriptions[i].DrugName,
                                disabled: this.dis,
                            },
                            false,
                        ],
                        rowIdPreVal: [
                            {
                                value: Medicine_Prescriptions[i].MedicinID,
                                disabled: this.dis,
                            },
                            false,
                        ],
                        groupID: [groupID, false],
                        newRow: ["false", false],
                    });

                    this.ArrayDrus.push(this.MedListConst);

                    ////debugger
                    this.tableDataPresPrint.push({
                        noteVal: Medicine_Prescriptions[i].ChangeNotes,
                        Dosage_UnitVal: Medicine_Prescriptions[i].DosingUnit,
                        Dosage_Unit_2_Val:
                            Medicine_Prescriptions[i].DosingUnitFinal,
                        finalMenonVal: Medicine_Prescriptions[i].DosageFinal,
                        Duration_Of_DeliveryVal:
                            Medicine_Prescriptions[i].Duration,
                        Solution_VolumeVal:
                            Medicine_Prescriptions[i].SolutionVol,
                        SolutionVal: Medicine_Prescriptions[i].Solution,
                        MenonValVal: Medicine_Prescriptions[i].Dosage,
                        MenonCalcVal: clc,
                        Way_Of_ProvidingVal:
                            Medicine_Prescriptions[i].MedAdministrationType,
                        Days_ProtocolVal:
                            Medicine_Prescriptions[i].ProtocolDay.split(","),
                        MedListVal: Medicine_Prescriptions[i].DrugName,
                        rowIdPreVal: Medicine_Prescriptions[i].MedicinID,
                        newRow: false,
                    });
                    //debugger
                    if (
                        clc != "" &&
                        clc != "0" &&
                        clc != "0.00" &&
                        Medicine_Prescriptions[i].DrugName != "" &&
                        (groupID == "1" || groupID == "4")
                    ) {
                        this.drugs.indexOf(
                            Medicine_Prescriptions[i].DrugName
                        ) === -1
                            ? this.drugs.push({
                                  DrugName: Medicine_Prescriptions[i].DrugName,
                              })
                            : console.log("This item already exists");
                    }

                    this.rows.push(row);
                }

                this.updateView();

                this.tableDataSrcPresPrint = new MatTableDataSource(
                    this.tableDataPresPrint
                );
                // this.tableDataSrcPres = new MatTableDataSource(this.tableDataPres);
                //////////////////debugger;
                setTimeout(function () {
                    //////////////////////////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }

    updateView() {
        this.tableDataSrcPres.next(this.rows.controls);
    }
    public getTableFromServer(
        _pageIndex: number,
        _pageSize: number,
        _FreeText: string
    ) {
        this.getDropDownFromServer();
        ////////////////////////debugger
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // ////////////////////////debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        } else {
            tableLoader = true;
        }
        this.http
            .post("https://srv-apps:4433/WebService.asmx/GetDemographData", {
                _id: _FreeText,
                _pageIndex: _pageIndex,
                _pageSize: _pageSize,
            })
            .subscribe((Response) => {
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                var json = JSON.parse(JSON.parse(Response["d"]));
                let DataPrecpiction = JSON.parse(json["Prescriptions"]);
                let Patient = JSON.parse(json["Patient"]);
                ////////////////////////debugger
                this.DemographData = Patient;
                if (this.DemographData[0]) {
                    this.FIRST_NAME_In = this.FIRST_NAME =
                        this.DemographData[0].FIRST_NAME;
                    this.LAST_NAME_In = this.LAST_NAME =
                        this.DemographData[0].LAST_NAME;
                    this.MID_NAME_In = this.MID_NAME =
                        this.DemographData[0].MID_NAME;
                    this.ID_In = this.ID = this.DemographData[0].ID;
                    this.GENDER_In = this.GENDER = this.DemographData[0].GENDER;
                    this.AGE_In = this.AGE = this.DemographData[0].AGE;
                    this.KUPA_In = this.KUPA = this.DemographData[0].KUPA;
                    this.Case_Number_In = this.Case_Number =
                        this.DemographData[0].Case_Number;
                    this.Depart_In = this.Depart = this.DemographData[0].Depart;
                    this.Seode_Depart_In = this.Seode_Depart =
                        this.DemographData[0].Seode_Depart;

                    $(document).find("#demographData").removeClass("d-none");
                    $(document)
                        .find("#prespictionsDetailsBtn")
                        .prop("disabled", false);
                } else {
                    this.openSnackBar("לא נמצא נתונים", "error");
                    $(document)
                        .find("#prespictionsDetailsBtn")
                        .prop("disabled", true);
                }

                //////////////////////////debugger
                for (var i = 0; i < DataPrecpiction.length; i++) {
                    ////debugger;
                    var ShowRow = false;
                    if (DataPrecpiction[i].Status == "נעול") {
                        ShowRow = true;
                    } else if (this.prem) {
                        // //debugger
                        ShowRow = true;
                    } else {
                        ShowRow = false;
                    }
                    this.TABLE_DATA.push({
                        PerscriptionID: DataPrecpiction[i].PerscriptionID,
                        ID: DataPrecpiction[i].ID,
                        PatientFirstName: DataPrecpiction[i].PatientFirstName,
                        PatientLastName: DataPrecpiction[i].PatientLastName,
                        FatherName: DataPrecpiction[i].FatherName,
                        Age: DataPrecpiction[i].Age,
                        sex: DataPrecpiction[i].sex,
                        Kupa: DataPrecpiction[i].Kupa,
                        Weight: DataPrecpiction[i].Weight,
                        Hight: DataPrecpiction[i].Hight,
                        TargetAUC: DataPrecpiction[i].TargetAUC,
                        CreatinineLevel: DataPrecpiction[i].CreatinineLevel,
                        Prognosis: DataPrecpiction[i].Prognosis,
                        ProtocolTreatment: DataPrecpiction[i].ProtocolTreatment,
                        Frequency: DataPrecpiction[i].Frequency,
                        DateAdministrationMed:
                            DataPrecpiction[i].DateAdministrationMed,
                        MedicationSensitivity:
                            DataPrecpiction[i].MedicationSensitivity,
                        RegistrationDate: DataPrecpiction[i].RegistrationDate,
                        SaveDate: DataPrecpiction[i].SaveDate,
                        ModifyDate: DataPrecpiction[i].ModifyDate,
                        Status: DataPrecpiction[i].Status,
                        statusNotToDo: DataPrecpiction[i].statusNotToDo,
                        SensitivityUnknown:
                            DataPrecpiction[i].SensitivityUnknown,
                        CourseNum: DataPrecpiction[i].CourseNum,
                        CompletionOfDetailsCheck:
                            DataPrecpiction[i].CompletionOfDetailsCheck,
                        DosageCalculationCheck:
                            DataPrecpiction[i].DosageCalculationCheck,
                        CalcOfBodyAreaCheck:
                            DataPrecpiction[i].CalcOfBodyAreaCheck,
                        SolutionOfDilutionCheck:
                            DataPrecpiction[i].SolutionOfDilutionCheck,
                        UserCreate: DataPrecpiction[i].UserCreate,
                        UserUpdate: DataPrecpiction[i].UserUpdate,
                        Case_Number: DataPrecpiction[i].Case_Number,
                        Depart: DataPrecpiction[i].Depart,
                        Seode_Depart: DataPrecpiction[i].Seode_Depart,
                        hideOrShow: ShowRow,
                    });
                    switch (DataPrecpiction[i].Status) {
                        case "שמור":
                            this.showDeleteBtn = true;
                            break;
                        default:
                            this.showDeleteBtn = false;
                    }
                }

                // ////////////////////////debugger
                this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                this.resultsLength = parseInt(json["iTotalRecords"]);
                var loadModalAfterCopy = this.loadModalAfterCopy;
                var that = this;
                this.loadModalAfterCopy = false;
                setTimeout(function () {
                    //////////////////////////debugger
                    if (that.loadModalAfterClose) {
                        //////debugger
                        var rowToLoad = $(document).find(
                            "#formTable tbody>tr>td:contains(" +
                                that.ROW_ID_PRE +
                                ")"
                        );
                        rowToLoad.parents("tr:first").find("button").click();
                        that.loadModalAfterClose = false;
                    }
                    if (loadModalAfterCopy) {
                        $(document)
                            .find("#formTable tbody>tr:first td:nth(6) button")
                            .click();
                    }
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }
}
