import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
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
import { Chart } from "chart.js";
import { formatDate, Time } from "@angular/common";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import * as Fun from "../public.functions";
export interface Link {
    RowId: string;
    LinkId: string;
    LinkDescription: string;
    LinkStatus: string;
    Level: string;
    SubToLinkId: string;
}

@Component({
    selector: "app-onn-line",
    templateUrl: "./onn-line.component.html",
    styleUrls: ["./onn-line.component.css"],
})
export class OnnLineComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    RowId = "0";
    LinkId = "";
    LinkDescription = "";
    LinkStatus = "";
    Level = "";
    SubToLinkId = "";
    TABLE_DATA: Link[] = [];
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    modalOptions: NgbModalOptions;
    resultsLength = 0;
    pageSize = 10;
    LinksStatus = "-1";
    displayedColumns: string[] = [
        "RowId",
        "LinkId",
        "LinkDescription",
        "Level",
        "SubToLinkId",
        "LinkStatus",
        "ListOfUsers",
        "AddUser",
    ];

    LinksForm: FormGroup;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private modalService_2: NgbModal,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit(): void {}
    onSubmit() {}
    open(content, _type, _element) {}
    addUser(content, _type, _element) {}
    ListOfPerUsers(content, _type, _element) {}
    getPaginatorData(event: PageEvent) {
        //console.log(this.paginator.pageIndex);

        this.getLinks();
    }
    changeStatus(event) {
        ////debugger
        this.LinksStatus = event.value;
    }
    getLinks() {}
}
