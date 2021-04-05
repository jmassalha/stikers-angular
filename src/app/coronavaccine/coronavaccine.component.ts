import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
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
export interface TableRow {
    EmployeeID: string;
    EmployeePhone: string;
    EmployeeFirstName: string;
    EmployeeLastName: string;
    EmployeeGender: string;
    EmployeeDob: string;
    EmployeeWorkPlace: string;
    EmployeeKupatHolem: string;
    AgeUnder16: string;
    pregnancy: string;
    breastfeeding: string;
    feverOver38: string;
    AllergicVaccinationPast: string;
    AllergicVaccinationPastDesc: string;
    AllergicVaccinationFoodMedication: string;
    AllergicAfterFirstVaccination: string;
    VaccinationPlace1: string;
    VaccinationNum1: string;
    VaccinationBatch1: string;
    ManufacturerVaccinationPlace1: string;
    StoragePlace1: string;
    VaccinationDate1: string;
    VaccinationTime1: string;
    VaccinationPlace2: string;
    VaccinationNum2: string;
    VaccinationBatch2: string;
    ManufacturerVaccinationPlace2: string;
    StoragePlace2: string;
    VaccinationDate2: string;
    VaccinationTime2: string;
    EmployeeUpdateDate: string;
    SecretaryRemarks: string;
    SecretaryUpdateDate: string;
    EmployeeInsertDate: string;
    SecretaryID: string;
    SecretaryID_2: string;
    SecretaryRemarks_2: string;
    SecretaryUpdateDate_2: string;
    RowID: string;
    RowStatus: string;
    HaveYouBeenVaccinatedInLastTwoWeeks: string;
    smoker: string;
    ChronicLungDisease: string;
    Hypertension: string;
    HeartDisease: string;
    CirrhosisLiver: string;
    ChronicKidneyDiseaseDialysis: string;
    Obesity: string;
    ImmuneSuppression: string;
    Chemotherapy: string;
    Cancer: string;
    AutoimmuneDisease: string;
    Diabetes: string;
    VaccinationForm: string;
    SideEffects: string;
    MedicalTreatmentAfterFirstVaccination: string;
    MedicalTreatmentAfterFirstVaccinationNote: string;
    Covid19afterthefirst: string;
    pregnancyWeek: string;
}

@Component({
    selector: "app-coronavaccine",
    templateUrl: "./coronavaccine.component.html",
    styleUrls: ["./coronavaccine.component.css"],
})
export class CoronavaccineComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    displayedColumns: string[] = [
        // 'ROW_ID',
        "EmployeeID",
        "EmployeeFirstName",
        "EmployeeLastName",
        "EmployeeGender",
        "EmployeeDob",
        "EmployeeWorkPlace",
        "EmployeeKupatHolem",
        "VaccinationForm",
        "CLICK",
        // "CLICK_TO_RELEASE",
    ];
    VaccinationForm_1: Boolean;
    VaccinationForm_2: Boolean;
    Checked_Yes_CS_SURVEY_Q2_1: Boolean;
    Checked_No_CS_SURVEY_Q2_1: Boolean;
    Checked_Yes_CS_SURVEY_Q3: Boolean;
    Checked_No_CS_SURVEY_Q3: Boolean;
    Checked_Yes_CS_SURVEY_Q4_1: Boolean;
    Checked_No_CS_SURVEY_Q4_1: Boolean;
    Checked_Yes_CS_SURVEY_Q4_2: Boolean;
    Checked_No_CS_SURVEY_Q4_2: Boolean;
    Checked_Yes_CS_SURVEY_Q4_3: Boolean;
    Checked_No_CS_SURVEY_Q4_3: Boolean;
    modalOptions: NgbModalOptions;
    closeResult: string;
    TABLE_DATA: TableRow[] = [];
    rowFormData = {} as TableRow;
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    tableLoader: Boolean;
    resultsLength = 0;
    fliterVal = "";
    registerForm: FormGroup;
    submitted = false;
    WorkerForm: FormGroup;
    AllergicVaccinationPastYes: Boolean;
    ChronicLungDisease: Boolean;
    Diabetes: Boolean;
    Hypertension: Boolean;
    HeartDisease: Boolean;
    CirrhosisLiver: Boolean;
    ChronicKidneyDiseaseDialysis: Boolean;
    Obesity: Boolean;
    ImmuneSuppression: Boolean;
    Chemotherapy: Boolean;
    Cancer: Boolean;
    AutoimmuneDisease: Boolean;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        public fb: FormBuilder,
        private formBuilder: FormBuilder
    ) {
        this.WorkerForm = this.fb.group({
            pregnancy: ["", null],
            breastfeeding: ["", null],
            feverOver38: ["", null],
            AllergicVaccinationPast: ["", null],
            AllergicVaccinationPastDesc: ["", null],
            AllergicVaccinationFoodMedication: ["", null],
            AllergicAfterFirstVaccination: ["", null],
            HaveYouBeenVaccinatedInLastTwoWeeks: ["", null],
            EmployeeID: ["", null],
            smoker: ["", null],
            AgeUnder16: ["", null],
            ChronicLungDisease: ["", null],
            Diabetes: ["", null],
            Hypertension: ["", null],
            HeartDisease: ["", null],
            CirrhosisLiver: ["", null],
            ChronicKidneyDiseaseDialysis: ["", null],
            Obesity: ["", null],
            ImmuneSuppression: ["", null],
            Chemotherapy: ["", null],
            Cancer: ["", null],
            AutoimmuneDisease: ["", null],
        });
    }
    startdateVal: string;
    enddateVal: string;
    Sdate: FormControl;
    Edate: FormControl;
    fullnameVal: string;
    idPatient: string;
    rightHand: Boolean;
    leftHand: Boolean;
    showRed: Boolean;
    firstSe: Boolean;
    secondSe: Boolean;
    fizer: Boolean;
    moderna: Boolean;
    phoneNumber: string;
    pregnancyWeek: string;
    viccatnNumber: string;
    radioChange(_event) {
        if (_event.value == "1") {
            this.AllergicVaccinationPastYes = true;
        } else {
            this.AllergicVaccinationPastYes = false;
        }
    }
    ngOnInit() {
        this.VaccinationForm_1 = true;
        this.VaccinationForm_2 = false;
        this.showRed = false;
        this.rightHand = false;
        this.rightHand = false;
        this.firstSe = false;
        this.secondSe = false;
        this.fizer = true;
        this.moderna = false;
        this.AllergicVaccinationPastYes = false;
        this.fullnameVal = "";
        this.idPatient = "";
        this.phoneNumber = "";
        this.loader = false;
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);
        let dateIn = new Date();
        dateIn.setDate(dateIn.getDate() - 1);
        this.Sdate = new FormControl(dateIn);
        this.Edate = new FormControl(new Date());
        this.startdateVal = this.Sdate.value;
        this.enddateVal = this.Edate.value;
        this.registerForm = this.formBuilder.group({
            fullnameVal: ["", null],
            idPatient: ["", null],
            phoneNumber: ["", null],
        });
        if (
            localStorage.getItem("loginState") != "true" ||
            localStorage.getItem("loginUserName") == ""
        ) {
            this.router.navigate(["login"]);
        } else if (
            localStorage.getItem("loginUserName").toLowerCase() ==
                "jmassalha" ||
            localStorage.getItem("loginUserName").toLowerCase() == "eonn" ||
            localStorage.getItem("loginUserName").toLowerCase() == "samer" ||
            localStorage.getItem("loginUserName").toLowerCase() ==
                "owertheim" ||
            localStorage.getItem("loginUserName").toLowerCase() == "tnapso"
        ) {
        } else {
            //this.router.navigate(["login"]);
            ///$("#chadTable").DataTable();
        }
        //this.dataSource = new MatTableDataSource(this.TABLE_DATA);
        //console.log(this.paginator.pageIndex);
        // $(document).on('submit', '#sendForm', function(e){
        //     //debugger
        // })
        this.getTableFromServer(
            this.startdateVal,
            this.enddateVal,
            this.paginator.pageIndex,
            50,
            this.fliterVal
        );
        window.onafterprint = function () {
            console.log("Printing completed...");
        };
    }
    openSnackBar() {
        this._snackBar.open("נשלח בהצלחה", "", {
            duration: 2500,
            direction: "rtl",
            panelClass: "success",
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        this.http
            .post(
                "http://srv-apps/wsrfc/WebService.asmx//SendSmsToCoronaSurvey",
                {
                    _FullName: this.fullnameVal,
                    _id: this.idPatient,
                    _phoneNumber: this.phoneNumber,
                }
            )
            .subscribe((Response) => {
                // //debugger 888888
                this.openSnackBar();
            });
        // display form values on success
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
        this.modalService.dismissAll();
    }
    getReport($event: any): void {
        if (this.startdateVal && this.enddateVal)
            this.getTableFromServer(
                this.startdateVal,
                this.enddateVal,
                this.paginator.pageIndex,
                this.paginator.pageSize,
                this.fliterVal
            );
    }
    applyFilter(filterValue: string) {
        this.fliterVal = filterValue;
        if (this.startdateVal && this.enddateVal) {
            this.getTableFromServer(
                this.startdateVal,
                this.enddateVal,
                this.paginator.pageIndex,
                this.paginator.pageSize,
                this.fliterVal
            );
        }
        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    open(content, _type, _element) {
        //$('#free_text').text(_element.FreeText);
        // //debugger
        this.fullnameVal = "";
        this.idPatient = "";
        this.phoneNumber = "";
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                ////debugger
                if ("Save" == result) {
                    // //debugger;
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
    toShortFormat(d: Date) {
        ////debugger;
        let monthNames = [
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
        ];

        let day = d.getDate();

        let monthIndex = d.getMonth();
        let monthName = monthNames[monthIndex];

        let year = d.getFullYear();
        ////debugger
        return `${day}/${monthName}/${year}`;
    }

    ngAfterViewInit(): void {}
    getPaginatorData(event: PageEvent) {
        //console.log(this.paginator.pageIndex);
        if (this.startdateVal && this.enddateVal) {
            this.getTableFromServer(
                this.startdateVal,
                this.enddateVal,
                this.paginator.pageIndex,
                this.paginator.pageSize,
                this.fliterVal
            );
        }
    }
    releaseRow(row) {}
    public printRowForm(row): void {
       // debugger
        this.viccatnNumber = row.VaccinationForm;
        if (row.VaccinationForm == "1") {
            this.VaccinationForm_1 = true;
            this.VaccinationForm_2 = false;
        } else {
            this.VaccinationForm_1 = false;
            this.VaccinationForm_2 = true;
        }
        // //debugger
        this.rowFormData = row;
        if (this.rowFormData.ChronicLungDisease == "1") {
            this.ChronicLungDisease = true;
        } else {
            this.ChronicLungDisease = false;
        }
        if (this.rowFormData.Diabetes == "1") {
            this.Diabetes = true;
        } else {
            this.Diabetes = false;
        }
        if (this.rowFormData.Hypertension == "1") {
            this.Hypertension = true;
        } else {
            this.Hypertension = false;
        }
        if (this.rowFormData.HeartDisease == "1") {
            this.HeartDisease = true;
        } else {
            this.HeartDisease = false;
        }
        if (this.rowFormData.CirrhosisLiver == "1") {
            this.CirrhosisLiver = true;
        } else {
            this.CirrhosisLiver = false;
        }
        if (this.rowFormData.ChronicKidneyDiseaseDialysis == "1") {
            this.ChronicKidneyDiseaseDialysis = true;
        } else {
            this.ChronicKidneyDiseaseDialysis = false;
        }
        if (this.rowFormData.Obesity == "1") {
            this.Obesity = true;
        } else {
            this.Obesity = false;
        }
        if (this.rowFormData.ImmuneSuppression == "1") {
            this.ImmuneSuppression = true;
        } else {
            this.ImmuneSuppression = false;
        }
        if (this.rowFormData.Chemotherapy == "1") {
            this.Chemotherapy = true;
        } else {
            this.Chemotherapy = false;
        }
        if (this.rowFormData.Cancer == "1") {
            this.Cancer = true;
        } else {
            this.Cancer = false;
        }
        if (this.rowFormData.AutoimmuneDisease == "1") {
            this.AutoimmuneDisease = true;
        } else {
            this.AutoimmuneDisease = false;
        }
        this.pregnancyWeek = row.pregnancyWeek;
        this.WorkerForm = this.fb.group({
            pregnancy: [this.rowFormData.pregnancy, null],
            breastfeeding: [this.rowFormData.breastfeeding, null],
            feverOver38: [this.rowFormData.feverOver38, null],
            AllergicVaccinationPast: [
                this.rowFormData.AllergicVaccinationPast,
                null,
            ],
            AllergicVaccinationPastDesc: [
                this.rowFormData.AllergicVaccinationPastDesc,
                null,
            ],
            AllergicVaccinationFoodMedication: [
                this.rowFormData.AllergicVaccinationFoodMedication,
                null,
            ],
            AllergicAfterFirstVaccination: [
                this.rowFormData.AllergicAfterFirstVaccination,
                null,
            ],
            HaveYouBeenVaccinatedInLastTwoWeeks: [
                this.rowFormData.HaveYouBeenVaccinatedInLastTwoWeeks,
                null,
            ],
            EmployeeID: [this.rowFormData.EmployeeID, null],
            smoker: [this.rowFormData.smoker, null],
            AgeUnder16: [this.rowFormData.AgeUnder16, null],
            ChronicLungDisease: [this.ChronicLungDisease, null],
            Diabetes: [this.Diabetes, null],
            Hypertension: [this.Hypertension, null],
            HeartDisease: [this.HeartDisease, null],
            CirrhosisLiver: [this.CirrhosisLiver, null],
            ChronicKidneyDiseaseDialysis: [
                this.ChronicKidneyDiseaseDialysis,
                null,
            ],
            Obesity: [this.Obesity, null],
            ImmuneSuppression: [this.ImmuneSuppression, null],
            Chemotherapy: [this.Chemotherapy, null],
            Cancer: [this.Cancer, null],
            AutoimmuneDisease: [this.AutoimmuneDisease, null],
            SideEffects: [this.rowFormData.SideEffects, null],
            MedicalTreatmentAfterFirstVaccination: [
                this.rowFormData.MedicalTreatmentAfterFirstVaccination,
                null,
            ],
            MedicalTreatmentAfterFirstVaccinationNote: [
                this.rowFormData.MedicalTreatmentAfterFirstVaccinationNote,
                null,
            ],
            Covid19afterthefirst: [this.rowFormData.Covid19afterthefirst, null],
        });
        //debugger
        var row = this.WorkerForm.value;

        for (var i = 0; i < Object.values(row).length; i++) {
            //debugger
            if (Object.values(row)[i] == "1") {
                this.showRed = true;
                debugger;
                break;
            }
        }
        //debugger
        $("#loader").removeClass("d-none");
        /*if (row.CS_SURVEY_Q2_2 == "Invalid Date") {
            row.CS_SURVEY_Q2_2 = "";
            //debugger
        }*/

        setTimeout(function () {
            $("#loader").addClass("d-none");
            window.print();
        }, 1500);
    }
    public getTableFromServer(
        _startDate: string,
        _endDate: string,
        _pageIndex: number,
        _pageSize: number,
        _FreeText: string
    ) {
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // //debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        this.http
            .post("http://srv-apps/wsrfc/WebService.asmx//GetAllVaccine", {
                _fromDate: _startDate,
                _toDate: _endDate,
                _pageIndex: _pageIndex,
                _pageSize: _pageSize,
                _FreeText: _FreeText,
            })
            .subscribe((Response) => {
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                var json = $.parseJSON(Response["d"]);
                let json_2 = $.parseJSON(json);
                let CoronaData = $.parseJSON(json_2["aaData"]);
                // debugger;
                for (var i = 0; i < CoronaData.length; i++) {
                    ////debugger
                    this.TABLE_DATA.push({
                        EmployeeID: CoronaData[i].EmployeeID,
                        EmployeePhone: CoronaData[i].EmployeePhone,
                        EmployeeFirstName: CoronaData[i].EmployeeFirstName,
                        EmployeeLastName: CoronaData[i].EmployeeLastName,
                        EmployeeGender: CoronaData[i].EmployeeGender,
                        EmployeeDob: CoronaData[i].EmployeeDob,
                        EmployeeWorkPlace: CoronaData[i].EmployeeWorkPlace,
                        EmployeeKupatHolem: CoronaData[i].EmployeeKupatHolem,
                        AgeUnder16: CoronaData[i].AgeUnder16,
                        pregnancy: CoronaData[i].pregnancy,
                        breastfeeding: CoronaData[i].breastfeeding,
                        feverOver38: CoronaData[i].feverOver38,
                        AllergicVaccinationPast:
                            CoronaData[i].AllergicVaccinationPast,
                        AllergicVaccinationPastDesc:
                            CoronaData[i].AllergicVaccinationPastDesc,
                        AllergicVaccinationFoodMedication:
                            CoronaData[i].AllergicVaccinationFoodMedication,
                        AllergicAfterFirstVaccination:
                            CoronaData[i].AllergicAfterFirstVaccination,
                        VaccinationPlace1: CoronaData[i].VaccinationPlace1,
                        VaccinationNum1: CoronaData[i].VaccinationNum1,
                        VaccinationBatch1: CoronaData[i].VaccinationBatch1,
                        ManufacturerVaccinationPlace1:
                            CoronaData[i].ManufacturerVaccinationPlace1,
                        StoragePlace1: CoronaData[i].StoragePlace1,
                        VaccinationDate1: CoronaData[i].VaccinationDate1,
                        VaccinationTime1: CoronaData[i].VaccinationTime1,
                        VaccinationPlace2: CoronaData[i].VaccinationPlace2,
                        VaccinationNum2: CoronaData[i].VaccinationNum2,
                        VaccinationBatch2: CoronaData[i].VaccinationBatch2,
                        ManufacturerVaccinationPlace2:
                            CoronaData[i].ManufacturerVaccinationPlace2,
                        StoragePlace2: CoronaData[i].StoragePlace2,
                        VaccinationDate2: CoronaData[i].VaccinationDate2,
                        VaccinationTime2: CoronaData[i].VaccinationTime2,
                        EmployeeUpdateDate: CoronaData[i].EmployeeUpdateDate,
                        SecretaryRemarks: CoronaData[i].SecretaryRemarks,
                        SecretaryUpdateDate: CoronaData[i].SecretaryUpdateDate,
                        EmployeeInsertDate: CoronaData[i].EmployeeInsertDate,
                        SecretaryID: CoronaData[i].SecretaryID,
                        SecretaryID_2: CoronaData[i].SecretaryID_2,
                        SecretaryRemarks_2: CoronaData[i].SecretaryRemarks_2,
                        SecretaryUpdateDate_2:
                            CoronaData[i].SecretaryUpdateDate_2,
                        RowID: CoronaData[i].RowID,
                        RowStatus: CoronaData[i].RowStatus,
                        HaveYouBeenVaccinatedInLastTwoWeeks:
                            CoronaData[i].HaveYouBeenVaccinatedInLastTwoWeeks,
                        smoker: CoronaData[i].smoker,
                        ChronicLungDisease: CoronaData[i].ChronicLungDisease,
                        Hypertension: CoronaData[i].Hypertension,
                        HeartDisease: CoronaData[i].HeartDisease,
                        CirrhosisLiver: CoronaData[i].CirrhosisLiver,
                        ChronicKidneyDiseaseDialysis:
                            CoronaData[i].ChronicKidneyDiseaseDialysis,
                        Obesity: CoronaData[i].Obesity,
                        ImmuneSuppression: CoronaData[i].ImmuneSuppression,
                        Chemotherapy: CoronaData[i].Chemotherapy,
                        Cancer: CoronaData[i].Cancer,
                        AutoimmuneDisease: CoronaData[i].AutoimmuneDisease,
                        Diabetes: CoronaData[i].Diabetes,
                        VaccinationForm: CoronaData[i].VaccinationForm,
                        SideEffects: CoronaData[i].SideEffects,
                        MedicalTreatmentAfterFirstVaccination:
                            CoronaData[i].MedicalTreatmentAfterFirstVaccination,
                        MedicalTreatmentAfterFirstVaccinationNote:
                            CoronaData[i]
                                .MedicalTreatmentAfterFirstVaccinationNote,
                        Covid19afterthefirst:
                            CoronaData[i].Covid19afterthefirst,
                            pregnancyWeek:
                            CoronaData[i].pregnancyWeek ,
                    });                    
                }

                // //debugger
                this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                this.resultsLength = parseInt(
                    $.parseJSON(json_2["iTotalRecords"])
                );
                setTimeout(function () {
                    ////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }
}
