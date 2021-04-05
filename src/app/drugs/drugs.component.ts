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
} from "@angular/forms";

export interface Drug {
  MedID: number;
  MedName: string;
  MedGroup: string;
  MedGroupID: number;
  MedStatus: string;
}
export interface MedGroup {
  id: string;
  name: string;
}

@Component({
  selector: 'app-drugs',
  templateUrl: './drugs.component.html',
  styleUrls: ['./drugs.component.css']
})
export class DrugsComponent implements OnInit {

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";
    displayedColumns: string[] = [
        "MedID",
        "MedName",
        "MedGroup",
        "D_CLICK",
    ];

    MedID: string;
    MedName: string;
    MedGroup: string;
    modalOptions: NgbModalOptions;
    closeResult: string;
    TABLE_DATA: Drug[] = [];
    groups: MedGroup[] = [];
    groups_submit: MedGroup[] = [];
    rowFormData = {} as Drug;
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    loader: Boolean;
    tableLoader: Boolean;
    resultsLength = 0;
    RoleStatus = 0;
    fliterVal = "";

    GroupID: string;
    MedGroupID: string;
    MedStatus: string;
    drugForm: FormGroup;
    submitted = false;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private formBuilder: FormBuilder
    ) {}
    @Input()
    foo: string = "bar";
    startdateVal: string;
    enddateVal: string;
    Sdate: FormControl;
    Edate: FormControl;
    drugnameVal: string;
    DS_drug_ROW_ID: string;
    rowIdVal: string;
    rowElement: Drug = {
      MedID: 0,
      MedName: "",
      MedGroup: "",
      MedGroupID: 0,
      MedStatus: "1",
    };
    ngOnInit(): void {
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
        this.drugForm = this.formBuilder.group({
            MedID: ["0", false],
            MedName: [
                "",
                [Validators.required, Validators.pattern("[A-Za-z0-9 .()]*")],
            ],
            MedGroup: ["", false],
            MedGroupID: ["", Validators.required],
            MedStatus: ["1", false],
            NewRow: ["false", false]
        });

        if (
            localStorage.getItem("loginState") != "true" ||
            localStorage.getItem("loginUserName") == ""
        ) {
            this.router.navigate(["login"]);
        } else if (
            localStorage.getItem("loginUserName").toLowerCase() ==
                "jmassalha" ||
                localStorage.getItem("loginUserName").toLowerCase() ==
                    "eonn" ||
            localStorage.getItem("loginUserName").toLowerCase() == "samer" ||
            localStorage.getItem("loginUserName").toLowerCase() == "owertheim" ||
            localStorage.getItem("loginUserName").toLowerCase() == "jubartal"
        ) {
        } else {
            this.router.navigate(["login"]);
            ///$("#chadTable").DataTable();
        }
        this.getMedGroups();
        var that = this;
        setTimeout(function(){
            that.getReport(that);
        }, 500)
        
    }

    getMedGroups() {
        this.http
            .post("http://srv-apps/wsrfc/WebService.asmx//GetTbl_MedGroups", {})
            .subscribe((Response) => {
                 ////debugger
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                var json = $.parseJSON(Response["d"]);
                json = $.parseJSON(json);
                // // //debugger
                var _d = $.parseJSON(json["GroupOptions"]);
                var i = 0;
                for (var s = 0; s < _d.length; s++) {
                   //  //debugger
                    var _sD: MedGroup = { id: _d[s].GroupID, name:  _d[s].GroupName };

                    

                    if (i == 0) {
                        var _sDSub: MedGroup = { id: "99", name: "ללא קבוצה" };
                        this.groups_submit.push(_sDSub);
                        
                        var _sDSub: MedGroup = { id: "-1", name: "הכל" };
                        this.groups.push(_sDSub);
                        
                        var _sDSub: MedGroup = { id: "99", name: "ללא קבוצה" };
                        this.groups.push(_sDSub);
                        
                        this.groups.push(_sD);
                        this.groups_submit.push(_sD);
                    } else { 
                         this.groups.push(_sD);
                        this.groups_submit.push(_sD);
                    }
                    i++;
                }
            });
    }
    search(nameKey, myArray){
        for (var i=0; i < myArray.length; i++) {
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
        var  resultDeparts= this.search(this.drugForm.value.MedGroupID, this.groups_submit);
        this.drugForm.value.MedGroup = resultDeparts['name'];
        //debugger
        //return
        // stop here if form is invalid
        if (this.drugForm.invalid) {
            return;
        }
        // //debugger
        this.http
            .post("http://srv-apps/wsrfc/WebService.asmx//insertOrUpdateDrug", {
              drugRow: this.drugForm.value,
            })
            .subscribe((Response) => {
              //debugger
              this.getReport(null)
                this.openSnackBar();

            });
        // display form values on success
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.drugForm.value, null, 4));
        this.modalService.dismissAll();
    }
    editRow(content, _type, _element) {
      var  resultDeparts= this.search(_element.MedGroupID, this.groups_submit);
      
      if(_element.MedGroupID == "" || _element.MedGroupID  == "0"){
        _element.MedGroupID = "99";
        resultDeparts= this.search(_element.MedGroupID, this.groups_submit);
      }
        this.drugForm = this.formBuilder.group({
            MedName: [_element.MedName, [Validators.required, Validators.pattern("[A-Za-z0-9 .()]*")]],
            MedGroup: [resultDeparts['name'], false],
            MedGroupID: [_element.MedGroupID, Validators.required],
            MedStatus: ["1", false],
            MedID: [_element.MedID, false],
            NewRow: ["false", false]
        });
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
    getReport($event: any): void {
        ////debugger
        this.getTableFromServer(
            this.paginator.pageIndex,
            10,
            this.fliterVal,
            this.GroupID,
        );
    }
    applyFilter(filterValue: string) {
        this.fliterVal = filterValue;
       // //debugger
        this.getTableFromServer(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.fliterVal,
            this.GroupID
        );

        //this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    open(content, _type, _element) {

        this.drugForm = this.formBuilder.group({
          MedName: ["",  [Validators.required, Validators.pattern("[A-Za-z0-9 .()]*")]],
          MedGroup: ["", false],
          MedGroupID: ["", Validators.required],
          MedStatus: ["1", false],
          MedID: ["0", false],
          NewRow: ["true", false]
        });
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

    ngAfterViewInit(): void {}
    getPaginatorData(event: PageEvent) {
        //console.log(this.paginator.pageIndex);

        this.getTableFromServer(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.fliterVal,
            this.GroupID,
        );
    }

    public getTableFromServer(
        _pageIndex: number,
        _pageSize: number,
        _FreeText: string,
        _GroupID: string,
    ) {
       // //debugger
        let tableLoader = false;
        if ($("#loader").hasClass("d-none")) {
            // //debugger
            tableLoader = true;
            $("#loader").removeClass("d-none");
        }
        this.http
            .post("http://srv-apps/wsrfc/WebService.asmx//getDrugsTbl", {
                _pageIndex: _pageIndex,
                _pageSize: _pageSize,
                _FreeText: _FreeText,
                _GroupID: this.GroupID,
            })
            .subscribe((Response) => {
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                var json = $.parseJSON(Response["d"]);
                json = $.parseJSON(json);
                let drugData = $.parseJSON(json["aaData"]);
                ////debugger
                for (var i = 0; i < drugData.length; i++) {
                    ////debugger
                    /*var  resultDeparts= this.search(drugData[i].DS_DEPART_ID, this.departs);*/
                 
                    this.TABLE_DATA.push({
                      MedID: drugData[i].MedID,
                      MedName: drugData[i].MedName,
                      MedGroup: drugData[i].MedGroup,
                      MedGroupID: drugData[i].MedGroupID,
                      MedStatus: drugData[i].MedStatus,
                    });
                }

                // //debugger
                this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
                this.resultsLength = parseInt($.parseJSON(json["iTotalRecords"]));
                setTimeout(function () {
                    ////debugger
                    if (tableLoader) {
                        $("#loader").addClass("d-none");
                    }
                });
            });
    }

}
