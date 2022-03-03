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
import { CdkDragDrop, CdkDragEnter, CdkDragExit, moveItemInArray } from "@angular/cdk/drag-drop";
import { Item } from "./models/item";
export interface Link {
    RowId: string;
    LinkId: string;
    LinkDescription: string;
    LinkStatus: string;
    Level: string;
    SubToLinkId: string;
}

export interface OutpatientClinic {
    RowId: string;
    LinkId: string;
    LinkDescription: string;
    LinkStatus: string;
    Level: string;
    SubToLinkId: string;
    SubToLinkDescription: string;
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
    public get connectedDropListsIds(): string[] {
        // We reverse ids here to respect items nesting hierarchy
        return [];// this.getIdsRecursive(this.TABLE_DATA).reverse();
    }
    AllLinks: Link[] = [];
    FilterdLinks: Link[] = [];
    dataSource = new MatTableDataSource(this.TABLE_DATA);
    modalOptions: NgbModalOptions;
    resultsLength = 0;
    pageSize = 10;
    LinksStatus = "-1";
    displayedColumns: string[] = [
       // "RowId",
        //"LinkId",
        "LinkDescription",
       // "Level",
        "SubToLinkId",
        "LinkStatus",
        "EditLink",
        "ListOfUsers",
        "AddUser",
    ];

    LinksForm: FormGroup;
    LinksSearchForm: FormGroup;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private modalService_2: NgbModal,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit(): void {
        this.LinksSearchForm = this.formBuilder.group({
            FreeText: ["", null],
            Status: ["-1", null],
        });
        this.getLinks();
       // this.getLinksToLinked();
    }
    onSubmit() {
        if(!this.LinksForm.valid){
            return;
        }
        $("#loader").removeClass("d-none");
        this.http
            .post(
                //"http://srv-apps-prod/RCF_WS/WebService.asmx/insertOrUpdateLink",
                "http://localhost:64964/WebService.asmx/insertOrUpdateLink",
                {
                    mLink: this.LinksForm.value,
                }
            )
            .subscribe((Response) => {  
                this.modalService.dismissAll();              
                this.getLinks();
            });
        
    }
    editLink(content, _type, _element){
        this.LinksForm = this.formBuilder.group({
            LinkId: [_element.LinkId, null],
            LinkDescription: [_element.LinkDescription, Validators.required],
            LinkStatus: [_element.LinkStatus, Validators.required],
            Level: [_element.Level, null],
            SubToLinkId: [_element.SubToLinkId, null],
            RowId: [_element.RowId, false],
        });
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                if ("Save" == result) {
                    // ////debugger;
                    //this.saveChad(_element.ROW_ID);
                }
            },
            (reason) => {}
        );
    }
    open(content, _type, _element) {
        this.LinksForm = this.formBuilder.group({
            LinkId: ["", null],
            LinkDescription: ["", Validators.required],
            LinkStatus: ["1", Validators.required],
            Level: ["", null],
            SubToLinkId: ["", Validators.required],
            RowId: ["0", false],
        });
        this.modalService.open(content, this.modalOptions).result.then(
            (result) => {
                if ("Save" == result) {
                    // ////debugger;
                    //this.saveChad(_element.ROW_ID);
                }
            },
            (reason) => {}
        );
    }
    addUser(content, _type, _element) {}
    ListOfPerUsers(content, _type, _element) {}
    getPaginatorData(event: PageEvent) {
        this.getLinks();
    }
    changeStatus(event) {
        this.LinksStatus = event.value;
    }

    onSubmitSearch() {}
    getLinksToLinked() {
        
        this.http
            .post(
                //"http://srv-apps-prod/RCF_WS/WebService.asmx/selectOnnLineLinks",
                "http://localhost:64964/WebService.asmx/selectOnnLineLinks",
                {
                    freeText: "",
                    status: "",
                }
            )
            .subscribe((Response) => {
                
                this.AllLinks = Response["d"];
               // debugger
            });
    }
    getLinks() {
        $("#loader").removeClass("d-none");
        this.http
            .post(
                //"http://srv-apps-prod/RCF_WS/WebService.asmx/selectOnnLineLinks",
                "http://localhost:64964/WebService.asmx/selectOnnLineLinks",
                {
                    freeText: this.LinksSearchForm.value.FreeText,
                    status: this.LinksSearchForm.value.Status,
                }
            )
            .subscribe((Response) => {
                this.TABLE_DATA.splice(0, this.TABLE_DATA.length);
                this.TABLE_DATA = Response["d"];
                this.dataSource = new MatTableDataSource(this.TABLE_DATA);
                this.getLinksToLinked();
                setTimeout(function () {
                    $("#loader").addClass("d-none");
                });
            });
    }
    public onDragDrop(event: CdkDragDrop<Item>) {
        event.container.element.nativeElement.classList.remove('active');
        if (this.canBeDropped(event)) {
          const movingItem: Item = event.item.data;
          event.container.data.Children.push(movingItem);
          event.previousContainer.data.Children = event.previousContainer.data.Children.filter((child) => child.RowId !== movingItem.RowId);
        } else {
          moveItemInArray(
            event.container.data.Children,
            event.previousIndex,
            event.currentIndex
          );
        }
      }
    
      private getIdsRecursive(item: Item): string[] {
        let ids = [item.RowId];
        item.Children.forEach((childItem) => { ids = ids.concat(this.getIdsRecursive(childItem)) });
        return ids;
      }
    
      private canBeDropped(event: CdkDragDrop<Item, Item>): boolean {
        const movingItem: Item = event.item.data;
    
        return event.previousContainer.id !== event.container.id
          && this.isNotSelfDrop(event)
          && !this.hasChild(movingItem, event.container.data);
      }
    
      private isNotSelfDrop(event: CdkDragDrop<Item> | CdkDragEnter<Item> | CdkDragExit<Item>): boolean {
        return event.container.data.RowId !== event.item.data.RowId;
      }
    
      private hasChild(parentItem: Item, childItem: Item): boolean {
        const hasChild = parentItem.Children.some((item) => item.RowId === childItem.RowId);
        return hasChild ? true : parentItem.Children.some((item) => this.hasChild(item, childItem));
      }
}
