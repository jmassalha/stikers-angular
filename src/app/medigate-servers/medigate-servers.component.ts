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
import { MatDialog } from "@angular/material/dialog";
import { DataTableComponent } from "./data-table/data-table.component";

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
export interface GooglePieChart {
    Type: string;
    Total: number;
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
        private mMenuPerm: MenuPerm,
        public dialog: MatDialog
    ) {
        mMenuPerm.setRoutName("medigate");
        setTimeout(function () {
            //  debugger
            if (mMenuPerm.getHasPerm()) {
            } else {
                localStorage.clear();
                //this.router.navigate(["login"]);
            }
        }, 1000);
    }
    ManufacturerDistributiontitle = "";
    ManufacturerDistributiontype = "PieChart";
    ManufacturerDistributiondata = [["",0]];
    
    DeviceTypeFamilyDistribution:GooglePieChart[];
    lastSelectedRow;
    lastSelectedColumn;
    ManufacturerDistributionoptions = {
        pieHole: 0.4,
    };
    ManufacturerDistributionwidth = 600;
    ManufacturerDistributionheight = 388;
    mInventoryHighLevelStats: InventoryHighLevelStats = {
        TotalDevices: 0,
        TotalCorporate: 0,
        TotalGuest: 0,
        TotalMedical: 0,
        TotalOT: 0,
        TotalIoT: 0,
        TotalIT: 0,
        TotalOnLine: 0,
        TotalHighRisk: 0,
        TotalCompromised: 0,
        TotalNewThisWeek: 0,
    };
    isOnline = '';
    AllManufacturerDistributiondata;
    AllDeviceTypeFamilyDistribution;
    AllmInventoryHighLevelStats;
    ngOnInit(): void {
        //debugger
        let that = this;
        this.GetInventoryHighLevelStats();
        setTimeout(function(){
            that.GetManufacturerDistribution();
        }, 500)
        
        this.GetDeviceTypeFamilyDistribution();

        setInterval(function () {
            that.GetInventoryHighLevelStats();
            setTimeout(function(){
                that.GetManufacturerDistribution();
            }, 500)
            
            that.GetDeviceTypeFamilyDistribution();
        }, 60*1000*10);
    }
    filterData(event){
        
        let that = this;
        switch (event.value) {
            case "All":
                this.isOnline = "";
                this.GetInventoryHighLevelStats();
                setTimeout(function(){
                    that.GetManufacturerDistribution();
                }, 500)
                
                this.GetDeviceTypeFamilyDistribution();
                break;
            case "False":
                this.isOnline = 'False';
                this.GetInventoryHighLevelStats();
                setTimeout(function(){
                    that.GetManufacturerDistribution();
                }, 500)
                
                this.GetDeviceTypeFamilyDistribution();
                break;
            
            case "True":
                this.isOnline = 'True';
                this.GetInventoryHighLevelStats();
                setTimeout(function(){
                    that.GetManufacturerDistribution();
                }, 500)
                
                this.GetDeviceTypeFamilyDistribution();
                break;
        }
    }
    getData(type){
        console.log(type);
        const dialogRef = this.dialog.open(DataTableComponent, {
            data: {
                selectedData: type,
                isOnline: this.isOnline,
                dataType: 'InventoryHighLevelStats'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }
    
    getDataByDevice(dataDevice){
        console.log(dataDevice);
        const dialogRef = this.dialog.open(DataTableComponent, {
            data: {
                selectedData: dataDevice,
                isOnline: this.isOnline,
                dataType: 'DeviceTypeFamilyDistribution'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }
    onSelect(event){
        var row;
        var column;
        if(event.selection.length == 0){
            row = this.lastSelectedRow;
            column = this.lastSelectedColumn;
        }else{
            this.lastSelectedRow = event.selection[0].row;
            this.lastSelectedColumn = event.selection[0].column;
            row = event.selection[0].row;
            column = event.selection[0].column;
        }
        
        console.log(this.ManufacturerDistributiondata[row]);
        const dialogRef = this.dialog.open(DataTableComponent, {
            data: {
                selectedData: this.ManufacturerDistributiondata[row],
                isOnline: this.isOnline,
                dataType: 'ManufacturerDistribution'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }
    GetManufacturerDistribution() {
        // debugger
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/GetManufacturerDistribution",
                //"http://srv-apps-prod/RCF_WS/WebService.asmx/GetManufacturerDistribution",
                {
                    online: this.isOnline
                }
            )
            .subscribe((Response) => {
                //debugger
                this.ManufacturerDistributiondata = []
                for(var i = 0; i <Response["d"].length; i++){
                    this.ManufacturerDistributiondata.push([Response["d"][i]["Type"], parseFloat(Response["d"][i]["Total"])])
                }
                this.AllManufacturerDistributiondata = this.ManufacturerDistributiondata
                 //debugger;
            });
    }
    GetDeviceTypeFamilyDistribution() {
        // debugger
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/GetDeviceTypeFamilyDistribution",
                //"http://srv-apps-prod/RCF_WS/WebService.asmx/GetDeviceTypeFamilyDistribution",
                {
                    online: this.isOnline
                }
            )
            .subscribe((Response) => {
                
                    this.DeviceTypeFamilyDistribution = Response["d"];
                    this.AllDeviceTypeFamilyDistribution = this.DeviceTypeFamilyDistribution
                 //debugger;
            });
    }
    GetInventoryHighLevelStats() {
        // debugger
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/GetInventoryHighLevelStats",
                //"http://srv-apps-prod/RCF_WS/WebService.asmx/GetInventoryHighLevelStats",
                {
                    online: this.isOnline
                }
            )
            .subscribe((Response) => {
                this.mInventoryHighLevelStats = Response["d"];
                this.AllmInventoryHighLevelStats = this.mInventoryHighLevelStats
                // debugger;
            });
    }
}
