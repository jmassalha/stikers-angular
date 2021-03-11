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

export interface GroupMember {
    GroupID: string;
    MemberID: string;
    EmployeeID: string;
    FirstName: string;
    LastName: string;
    Email: string;
    CellNumber: string;
}
@Component({
  selector: 'app-emergencymembers',
  templateUrl: './emergencymembers.component.html',
  styleUrls: ['./emergencymembers.component.css']
})
export class EmergencymembersComponent implements OnInit {

  
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    displayedColumns: string[] = [
        "EmployeeID",
        "FirstName",
        "LastName",
        "Email",
        "CellNumber",
        "Click",
    ];

    modalOptions: NgbModalOptions = {
        windowClass: "marg-t-60",
    };
    closeResult: string;
    TABLE_DATA: GroupMember[] = [];
    rowFormData = {} as GroupMember;
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    tableLoader: Boolean;
    UserSmsStatus: Boolean;
    UserEmailStatus: Boolean;
    resultsLength = 0;
    fliterValGroupMember = "";
    StatusGroupMember = "-1";
    removeMemberForm: FormGroup;

    GroupID = localStorage.getItem("GroupID");
    submitted = false;
    activeModal: NgbActiveModal;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalServiceGroupMember: NgbModal,
        private formBuilder: FormBuilder,
        activeModal: NgbActiveModal
    ) {
        this.activeModal = activeModal;
    }
    @Input()
    foo: string = "bar";
    startdateVal: string;
    enddateVal: string;
    Sdate: FormControl;
    Edate: FormControl;
    fullnameVal: string;
    rowIdVal: string;
    ngOnInit(): void {
       // debugger
        this.UserSmsStatus = false;
        this.UserEmailStatus = false;
        this.fullnameVal = "";
        this.rowIdVal = "0";
        this.loader = false;
        this.dataSource = new MatTableDataSource(this.TABLE_DATA);

        if (
            localStorage.getItem("loginState") != "true" ||
            localStorage.getItem("loginUserName") == ""
        ) {
            this.router.navigate(["login"]);
        } else if (
            localStorage.getItem("loginUserName").toLowerCase() ==
                "jmassalha" ||
            this.GroupID != "0"
        ) {
        } else {
            this.router.navigate(["login"]);
            ///$("#chadTable").DataTable();
        }
        this.getReportGroupMember(this);
    }
    openSnackBar(message, type) {
        this._snackBar.open(message, "", {
            duration: 2500,
            direction: "rtl",
            panelClass: type,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

    onRemoveSubmit(){
        //debugger

      // stop here if form is invalid
      if (this.removeMemberForm.invalid) {
          // console.log(this.removeMemberForm.controls.errors);
          return;
      }
      //debugger;
      this.http
          .post(
              "http://srv-apps/wsrfc/WebService.asmx/RemoveMemberFromGroup",
              {
                MemberId: this.removeMemberForm.value.EmployeeID,
                GroupId: this.removeMemberForm.value.GroupId,
              }
          )
          .subscribe((Response) => {
              this.applyFilterGroupMember(this.fliterValGroupMember);
              this.openSnackBar("נמחק ההצלחה", "success");
          });
      // display form values on success
      //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.removeMemberForm.value, null, 4));
      // this.modalServiceGroupMember.dismissAll();
      this.activeModal.close();
    }
    parentFun(){
      this.applyFilterGroupMember(this.fliterValGroupMember);
    }
    editRow(content, _type, _element) {
       // debugger
        this.removeMemberForm = this.formBuilder.group({

            EmployeeID: [_element.EmployeeID, Validators.required],
            GroupId: [_element.GroupID, Validators.required],
        });
        this.activeModal = this.modalServiceGroupMember.open(
            content,
            this.modalOptions
        );
    }
    getReportGroupMember($event: any): void {
        ////debugger
        this.getTableFromServer(
            this.fliterValGroupMember
        );
    }
    applyFilterGroupMember(filterValue: string) {
        this.fliterValGroupMember = filterValue;

        this.getTableFromServer(
            this.fliterValGroupMember
        );

        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    open(content, _type, _element) {
        
        this.activeModal = this.modalServiceGroupMember.open(
            content,
            this.modalOptions
        );
    }

    
    getPaginatorData(event: PageEvent) {
        //console.log(this.paginator.pageIndex);

        this.getTableFromServer(
            this.fliterValGroupMember
        );
    }
    
    public getTableFromServer(
        _FreeText: string
    ) {
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // //debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        //debugger
        //http://srv-apps/wsrfc/WebService.asmx
        this.http
            .post(
                "http://srv-apps/wsrfc/WebService.asmx/GetGroupEmployeesMember",
                {
                    _FreeText: _FreeText,
                    _GroupID: this.GroupID,
                }
            )
            .subscribe((Response) => {
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                //debugger
                this.TABLE_DATA = Response["d"];
                

                // //debugger
                this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                this.resultsLength = this.TABLE_DATA.length;
                setTimeout(function () {
                    ////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }

}
