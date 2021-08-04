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
import { formatDate } from "@angular/common";
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
} from "@angular/forms";
import { ConfirmationDialogService } from "../confirmation-dialog/confirmation-dialog.service";
export interface Boxes {
    RowID: number;
    BoxID: number;
    TotalCases: number;
}
@Component({
    selector: "app-scanners",
    templateUrl: "./scanners.component.html",
    styleUrls: ["./scanners.component.css"],
})
export class ScannersComponent implements OnInit {
    @ViewChild("SendSmsToemergencymembersModal", { static: true })
    SendSmsToemergencymembersModal: NgbModal;
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    displayedColumns: string[] = [
        "RowID",
        "BoxID",
        "TotalCases",
        "CLICK",
        "CLICK_casenumbers",
        "CLICK_print",
        "CLICK_sendtosafe",
    ];
    private activeModal: NgbActiveModal;
    modalOptions: NgbModalOptions;
    modalOptionsPrint: NgbModalOptions = {
        windowClass: "modalOptionsPrint",
    };;
    closeResult: string;
    TABLE_DATA: Boxes[] = [];
    rowFormData = {} as Boxes;
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    tableLoader: Boolean;
    resultsLength = 0;
    departStatus = 0;
    fliterVal = "";
    activeOrNot = "";
    BoxForm: FormGroup;
    GroupSmsToForm: FormGroup;
    submitted = false;
    perm: Boolean = false;
    NotAllOrNull: Boolean = false;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private confirmationDialogService: ConfirmationDialogService,
        activeModal: NgbActiveModal
    ) {
        // ////debugger
        this.activeModal = activeModal;
    }
    @Input()
    GroupName: string;
    GroupNumber: string;

    ngOnInit(): void {
        this.SendSmsToemergencymembersModal;
        //debugger;
        $("#loader").removeClass("d-none");
        this.GroupName = "";
        this.GroupNumber = "";
        this.activeOrNot = "-1";
        this.loader = false;
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);

        this.BoxForm = this.formBuilder.group({
            BoxID: ["", Validators.required],
            User: [
                localStorage.getItem("loginUserName"),
                Validators.required,
            ],
            RowID: ["0", false],
        });
        console.log("sleep");
        if (
            localStorage.getItem("loginUserName").toLowerCase() ==
                "jmassalha" ||
            localStorage.getItem("loginUserName").toLowerCase() == "samer" ||
            localStorage.getItem("loginUserName").toLowerCase() == "lfisher" ||
            localStorage.getItem("loginUserName").toLowerCase() == "malkobi" ||
            localStorage.getItem("loginUserName").toLowerCase() == "owertheim"
        ) {
        } else {
            this.router.navigate(["login"]);
            ///$("#chadTable").DataTable();
        }
        this.getReport(this);
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
    openSendSnackBar() {
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
        //debugger

        if (this.BoxForm.invalid) {
            return;
        }
        //////debugger
        setTimeout(function () {
            $("#loader").removeClass("d-none");
        });
        ////debugger;
        this.http
            .post(
                "http://srv-apps/wsrfc/WebService.asmx/InsertOrUpdateBox",
                {
                    boxes: this.BoxForm.value,
                }
            )
            .subscribe((Response) => {
                this.getReport(null);
                this.openSnackBar();
                setTimeout(function () {
                    $("#loader").addClass("d-none");
                });
            });
        // display form values on success
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.BoxForm.value, null, 4));
        this.modalService.dismissAll();
    }

    sendcasenumberstosafe(_element) {
       
       this.confirmationDialogService.confirm('נא לאשר..', 'האם אתה בטוח ...? ')
        .then((confirmed) =>{
            console.log('User confirmed:', confirmed);
            if(confirmed){
                this.sendToSafe(_element.RowID);
            }else{

            }
            
        } )
        .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }

    sendToSafe(RowId) {
        this.http
            .post("http://srv-ipracticom:8080/WebService.asmx/SendBoxCasesToSafe", {
                RowId: RowId,
            })
            .subscribe((Response) => {
                this.openSendSnackBar();
            })
    }
    showcasenumbers(content, _type, _element) {
        // //debugger;
        
        localStorage.setItem("Print", "false");
        localStorage.setItem("CartoonID", _element.RowID);
        localStorage.setItem("CartoonUNID", _element.BoxID);
        localStorage.setItem("TotalCases", _element.TotalCases);
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
               // debugger
                if ("Save" == result) {
                    // //////debugger;
                    //this.saveChad(_element.ROW_ID);
                }
            },
            (reason) => {
                this.getReport(this);
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }

    printcasenumbers(content, _type, _element) {
        // //debugger;
        localStorage.setItem("Print", "true");
        localStorage.setItem("CartoonID", _element.RowID);
        localStorage.setItem("CartoonUNID", _element.BoxID);
        localStorage.setItem("TotalCases", _element.TotalCases);
        this.activeModal = this.modalService.open(content, this.modalOptionsPrint);
        
    }

    CloseModalSendSms() {
        this.modalService.dismissAll();
    }
    editRow(content, _type, _element) {
        this.GroupName = _element.GroupName;
        ////debugger;
        this.BoxForm = this.formBuilder.group({
            BoxID: [_element.BoxID, Validators.required],
            User: [
                localStorage.getItem("loginUserName"),
                Validators.required,
            ],
            RowID: [_element.RowID, false],
        });
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
    }
    getReport($event: any): void {
        ////////debugger
        this.getTableFromServer(this.fliterVal, 0, 10);
    }
    applyFilter(filterValue: string) {
        this.fliterVal = filterValue;

        this.getTableFromServer(this.fliterVal, 0, this.paginator.pageSize);

        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    open(content, _type, _element) {
        this.GroupNumber = "";
        this.GroupName = "חדש";
        //////debugger;
        this.BoxForm = this.formBuilder.group({
            BoxID: ["", Validators.required],
            User: [
                localStorage.getItem("loginUserName"),
                Validators.required,
            ],
            RowID: ["0", false],
        });
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

        this.getTableFromServer(this.fliterVal, 0, this.paginator.pageSize);
    }

    public getTableFromServer(
        _FreeText: string,
        _pageIndex: number,
        _pageSize: number
    ) {
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // //////debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        //debugger
        //http://srv-apps/wsrfc/WebService.asmx/
        //http://srv-apps/wsrfc/WebService.asmx/
        this.http
            .post("http://srv-apps/wsrfc/WebService.asmx/GetBoxes", {
                serachTxt: _FreeText,
                pageIndex: _pageIndex,
                pageSize: _pageSize,
            })
            .subscribe((Response) => {
                ////////debugger
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                this.TABLE_DATA = Response["d"];
                //debugger
                if(this.TABLE_DATA[0]["BoxID"] == null){
                    
                    this.TABLE_DATA = [];

                    
                    this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                    this.resultsLength = 0;
                    
                    
                }else{
                    this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                    this.resultsLength = this.TABLE_DATA[0]["Total"];    
                }
                
                setTimeout(function () {
                    ////////debugger
                    //if (tableLoader) {
                    $("#loader").addClass("d-none");
                    // }
                });
            });
    }
}
