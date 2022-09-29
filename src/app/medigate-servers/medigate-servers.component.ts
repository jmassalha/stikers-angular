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
import { MenuPerm } from "../menu-perm";

export interface InventoryHighLevelStats {
    TotalDevices: number;
    TotalCorporate: number;
    TotalGuest: number;
    TotalMedical: number;
    TotalOT: number;
    TotalIoT: number;
    TotalIT: number;
    TotalOnLine: number;
    TotalHighRisk: number;
    TotalCompromised: number;
    TotalNewThisWeek: number;
}
@Component({
    selector: "app-medigate-servers",
    templateUrl: "./medigate-servers.component.html",
    styleUrls: ["./medigate-servers.component.css"],
})
export class MedigateServersComponent implements OnInit {
    constructor(
        private activeModal: NgbActiveModal,
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private elementRef: ElementRef,
        //private cdRef:ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private mMenuPerm: MenuPerm
    ) {
        mMenuPerm.setRoutName("medigate");
        setTimeout(function () {
            //  debugger
            if (mMenuPerm.getHasPerm()) {
            } else {
                localStorage.clear();
                this.router.navigate(["login"]);
            }
        }, 1000);
    }
    mInventoryHighLevelStats:InventoryHighLevelStats;
    ngOnInit(): void {
        //debugger
        this.GetInventoryHighLevelStats();
    }
    GetInventoryHighLevelStats(){
       // debugger
        this.http
            .post(
                //"http://srv-apps-prod/RCF_WS/WebService.asmx/GetInventoryHighLevelStats",
                "http://localhost:64964/WebService.asmx/GetInventoryHighLevelStats",
                {}
            )
            .subscribe((Response) => {
                this.mInventoryHighLevelStats = Response["d"];
                debugger;
            }); 
    }
}
