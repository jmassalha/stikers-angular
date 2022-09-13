import {
    Component,
    OnInit,
    ViewChild,
    AfterViewInit,
    Input,
    TemplateRef,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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

export interface NewBorn {
    RowID: number;
    MotherCaseNumber: string;
    MotherID: string;
    MotherFirstName: string;
    MotherLastName: string;
    NewBornDOB: string;
    NewBornTime: string;
    BornProcedure: string;
    NewBornGender: string;
    NewBornWeight: string;
    NewBornWeightInProgress: string;
    NewBornWeekOfPregnancy: string;
    MultipleBirth: string;
    NumberOfBirths: string;
    BirthNumber: string;
    BirthIsDie: string;
    hospitalizedAt: string;
    UserName: string;
    UserFllName: string;
    UserTell: string;
    DateTimeInsert: string;
    TotalRows: string;
}
export interface NewBornUsers {
    UserID: string;
    UserName: string;
    UserFullName: string;
    CellNumber: string;
}
@Component({
    selector: "app-new-born",
    templateUrl: "./new-born.component.html",
    styleUrls: ["./new-born.component.css"],
})
export class NewBornComponent implements OnInit {
    @ViewChild('newBornBtn') newBornBtn: ElementRef;
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('patientDetailsModal', { static: true }) patientDetailsModal: TemplateRef<any>;
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    UserNameList: string[] = [];
    displayedColumns: string[] = [
        "MotherCaseNumber",
        "MotherID",
        "MotherFirstName",
        "MotherLastName",
        "Click",
    ];

    modalOptions: NgbModalOptions = {
        windowClass: "marg-t-60",
        backdrop: 'static',
        keyboard: false
    };
    ShowSubmit: Boolean = true;
    closeResult: string;
    TABLE_DATA: NewBorn[] = [];
    NewBornUsersList: NewBornUsers[] = [];
    rowFormData = {} as NewBorn;
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
        private modalServiceresearchespatients: NgbModal,
        private formBuilder: FormBuilder,
        activeModal: NgbActiveModal,
        private _Activatedroute:ActivatedRoute,
    ) {
        this.activeModal = activeModal;
    }
    filteredOptions: Observable<NewBornUsers[]>;
    @Input()
    foo: string = "bar";
    @Input()
    motherCaseNumber;
    startdateVal: string;
    enddateVal: string;
    NewBornDOB: string;
    NewBornTime: string;
    Sdate: FormControl;
    Edate: FormControl;
    fullnameVal: string;
    rowIdVal: string;
    UserFrom: string;
    myControl = new FormControl("");
    casenumber = '';
    ngOnInit(): void {
        //debugger
        
        this.selectNewBornUsers();
        this.UserFrom = localStorage.getItem("loginUserName");
        this.UserSmsStatus = false;
        this.UserEmailStatus = false;
        this.fullnameVal = "";
        this.rowIdVal = "0";
        this.loader = false;
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);
        this.Sdate = new FormControl(new Date());
        this.Edate = new FormControl(new Date());
        this.startdateVal = this.Sdate.value;
        this.enddateVal = this.Edate.value;

        this.getReportresearchespatients(this);
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(""),
            map(value => (typeof value === 'string' ? value : value?.name)),
            map(name => (name ? this._filter(name) : this.NewBornUsersList.slice()))
        ); 
        this._Activatedroute.queryParams.subscribe(
            params => {
              console.log(params)
              if(params['casenumber']){
                this.casenumber = params['casenumber'];
                document.getElementById("rolesDetailsBtn").click();
                this.getMotherDetails(null);
              }
            }
          )
    }


>>>>>>> e0d8607 (newBornPull)
    }
    private _filter(value: string): NewBornUsers[] {
        //debugger

        const filterValue = value.toLowerCase();

        return this.NewBornUsersList.filter((e) =>
            e.UserFullName.toLowerCase().includes(filterValue)
        );
    }
    updateUser(option) {
        // console.log(option);
        this.patientForm.value.UserName = option.option.value.UserName;
        this.patientForm.patchValue({
            UserName: option.option.value.UserName,
            UserTell: option.option.value.CellNumber,
            UserFllName: option.option.value.UserFullName,
        });
        this.UserFrom = option.option.value.UserName
        console.log(this.patientForm.value)
        this.ShowFormNewBorn = true;
    }
    displayFn(user: any): string {
        console.log(user)
        // if(user != ""){
        //     this.patientForm.value.UserName = user.UserName
        //     this.ShowFormNewBorn = true;
        // }

        return user && user.UserFullName ? user.UserFullName : "";
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
        this.patientForm.value.UserName = this.UserFrom;
        this.patientForm.value.NewBornDOB = formatDate(
            this.patientForm.value.NewBornDOB,
            "yyyy-MM-dd",
            "en-US"
        );
        if (this.patientForm.value.NewBornWeightInProgress == "") {
            this.patientForm.value.NewBornWeightInProgress = "לא";
        }
        if (this.patientForm.value.MultipleBirth == "") {
            this.patientForm.value.MultipleBirth = "לא";
        }
        if (this.patientForm.value.BirthIsDie == "") {
            this.patientForm.value.BirthIsDie = "לא";
        }
        // stop here if form is invalid
        if (this.patientForm.invalid) {
            // console.log(this.patientForm.controls.errors);
            return;
        }
        if ($("#loader").hasClass("d-none")) {
            $("#loader").removeClass("d-none");
        }
        //debugger;
        this.http
            .post(
                //"http://srv-apps-prod/RCF_WS/WebService.asmx/SaveNewBornForm",
                "http://srv-ipracticom:8080/WebService.asmx/SaveNewBornForm",
                {
                    _patientForm: this.patientForm.value,
                }
            )
            .subscribe((Response) => {
                this.applyFilterresearchespatients(this.fliterValPatient);
                this.openSnackBar();
                $("#loader").addClass("d-none");
                this.patientForm.value.UserName = "";
                this.ShowFormNewBorn = false;
                this.modalServiceresearchespatients.dismissAll();
            });
        // display form values on success
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.patientForm.value, null, 4));
        // this.modalServiceresearchespatients.dismissAll();
    }
    getMotherDetails(event) {
        var dataCasenumber = '';
        console.log(event);
        if(event == null){
            dataCasenumber = this.casenumber
        }else{
            dataCasenumber = event.target.value
        }
        //event.target.value
        this.http
            .post(
                //"http://srv-apps-prod/RCF_WS/WebService.asmx/GetPersonalDetails",
                "http://srv-ipracticom:8080/WebService.asmx/GetPersonalDetails",
                {
                    CaseNumber: dataCasenumber,
                }
            )
            .subscribe((Response) => {
                var json = Response["d"];
                this.patientForm.patchValue({
                    MotherFirstName: json["FirstName"],
                    MotherLastName: json["LastName"],
                    MotherID: json["PersonID"].replace("-", ""),
                });
                console.log(this.patientForm.value);
            });
    }

    selectNewBornUsers() {
        this.http
            .post(
                //"http://srv-apps-prod/RCF_WS/WebService.asmx/selectNewBornUsers",
                "http://srv-ipracticom:8080/WebService.asmx/selectNewBornUsers",
                {}
            )
            .subscribe((Response) => {
                debugger
                var json = Response["d"];
                this.NewBornUsersList = json;
            });
    }
    showRow(content, _type, _element) {
        debugger
        this.ShowFormNewBorn = true;
        this.ShowSubmit = false;
        if (_element.NewBornWeightInProgress == "לא") {
            _element.NewBornWeightInProgress = "";
        }
        if (_element.MultipleBirth == "לא") {
            _element.MultipleBirth = "";
        }
        if (_element.BirthIsDie == "לא") {
            _element.BirthIsDie = "";
        }
        this.NewBornDOB = _element.NewBornDOB;
        this.NewBornTime = _element.NewBornTime;
        this.patientForm = this.formBuilder.group({
            MotherCaseNumber: [
                { value: _element.MotherCaseNumber, disabled: true },
                [Validators.required],
            ],
            MotherID: [
                { value: _element.MotherID, disabled: true },
                [Validators.required],
            ],
            MotherFirstName: [
                { value: _element.MotherFirstName, disabled: true },
                Validators.required,
            ],
            MotherLastName: [
                { value: _element.MotherLastName, disabled: true },
                Validators.required,
            ],
            NewBornDOB: [
                { value: _element.NewBornDOB, disabled: true },
                Validators.required,
            ],
            NewBornTime: [
                { value: _element.NewBornTime, disabled: true },
                Validators.required,
            ],
            BornProcedure: [
                { value: _element.BornProcedure, disabled: true },
                Validators.required,
            ],
            NewBornGender: [
                { value: _element.NewBornGender, disabled: true },
                Validators.required,
            ],
            NewBornWeight: [
                { value: _element.NewBornWeight, disabled: true },
                [Validators.required, Validators.pattern(/^[0-9]{1,4}$/)],
            ],
            NewBornWeightInProgress: [
                { value: _element.NewBornWeightInProgress, disabled: true },
                null,
            ],
            NewBornWeekOfPregnancy: [
                { value: _element.NewBornWeekOfPregnancy, disabled: true },
                [Validators.required, Validators.pattern(/^[0-9]{1,2}$/)],
            ],
            MultipleBirth: [
                { value: _element.MultipleBirth, disabled: true },
                null,
            ],
            NumberOfBirths: [
                { value: _element.NumberOfBirths, disabled: true },
                [Validators.required, Validators.pattern(/^[0-9]{1,1}$/)],
            ],
            BirthNumber: [
                { value: _element.BirthNumber, disabled: true },
                [Validators.required, Validators.pattern(/^[0-9]{1,1}$/)],
            ],
            BirthIsDie: [{ value: _element.BirthIsDie, disabled: true }, null],
            hospitalizedAt: [
                { value: _element.hospitalizedAt, disabled: true },
                Validators.required,
            ],
            UserName: [
                { value: _element.UserFllName + " - " + _element.UserTell, disabled: true },
                Validators.required,
            ],
            RowID: [
                { value: _element.RowID, disabled: true },
                Validators.required,
            ],
        });
        this.modalServiceresearchespatients.open(
            content,
            this.modalOptions
        ).result.then(
            result => {
                this.closeResult = `Closed with: ${result}`;
                if ("Save" == result) {
                    // //////debugger;
                }

                //debugger
            },
            reason => {
                //debugger
                this.patientForm.value.UserName = '';
                this.ShowFormNewBorn = false;
                this.myControl = new FormControl("");
            }
        );;;
    }
    open(content, _type, _element) {
        //$('#free_text').text(_element.FreeText);
        //////debugger
      //  debugger
        let now = new Date();
        let hours = ("0" + now.getHours()).slice(-2);
        let minutes = ("0" + now.getMinutes()).slice(-2);
        let str = formatDate(new Date(), 'yyyy-MM-dd HH:mm', 'en-US');
       // debugger
        this.UserSmsStatus = false;
        this.UserEmailStatus = false;
        this.patientForm = this.formBuilder.group({
            MotherCaseNumber: [this.casenumber, [Validators.required]],
            MotherID: ["", [Validators.required]],
            MotherFirstName: ["", Validators.required],
            MotherLastName: ["", Validators.required],
            NewBornDOB: [new Date(), Validators.required],
            NewBornTime: [str, Validators.required],
            BornProcedure: ["", Validators.required],
            NewBornGender: ["", Validators.required],
            NewBornWeight: [
                "0",
                [Validators.required, Validators.pattern(/^[0-9]{1,4}$/)],
            ],
            NewBornWeightInProgress: ["", null],
            NewBornWeekOfPregnancy: [
                "",
                [Validators.required, Validators.pattern(/^[0-9]{1,2}$/)],
            ],
            MultipleBirth: ["", null],
            NumberOfBirths: [
                "1",
                [Validators.required, Validators.pattern(/^[0-9]{1,1}$/)],
            ],
            BirthNumber: [
                "1",
                [Validators.required, Validators.pattern(/^[0-9]{1,1}$/)],
            ],
            BirthIsDie: ["", null],
            hospitalizedAt: ["", Validators.required],
            UserName: [
                "",
                Validators.required,
            ],
            UserFllName: [
                "",
                Validators.required,
            ],
            UserTell: [
                "",
                Validators.required,
            ],
            RowID: [0, null],
        });
        this.modalServiceresearchespatients.open(
            content,
            this.modalOptions
        ).result.then(
            result => {
                this.closeResult = `Closed with: ${result}`;
                if ("Save" == result) {
                    // //////debugger;
                }

                //debugger
            },
            reason => {
                //debugger
                this.patientForm.value.UserName = '';
                this.ShowFormNewBorn = false;
                this.myControl = new FormControl("");
            }
        );;
    }
    getReportresearchespatients($event: any): void {
        //////debugger
        this.getTableFromServer(
            this.paginator.pageIndex,
            10,
            this.fliterValPatient
        );
    }
    applyFilterresearchespatients(filterValue: string) {
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
                // "http://srv-apps-prod/RCF_WS/WebService.asmx/GetNewBornTable",
                "http://srv-ipracticom:8080/WebService.asmx/GetNewBornTable",
                {
                    _pageIndex: _pageIndex,
                    _pageSize: _pageSize,
                    _freeText: _FreeText,
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
                    this.resultsLength = parseInt(json[0]["TotalRows"]);
                } else {
                    this.resultsLength = 0;
                }

                setTimeout(function () {
                    //////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }
}
