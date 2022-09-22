import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MenuPerm } from "../menu-perm";
export interface Servers {
  VMName: string;
  Hostname: string;
  IPAddress: string;
  OS: string;
  Boottime: string;
  VMState: string;
  TotalCPU: string;
  CPUAffinity: string;
  CPUHotAdd: string;
  CPUShare: string;
  CPUlimit: string;
  OverallCpuUsage: string;
  CPUreservation: string;
  TotalMemory: string;
  MemoryShare: string;
  MemoryUsage: string;
  MemoryHotAdd: string;
  MemoryLimit: string;
  MemoryReservation: string;
  Swapped: string;
  Ballooned: string;
  Compressed: string;
  TotalNics: string;
  ToolsStatus: string;
  ToolsVersion: string;
  HardwareVersion: string;
  TimeSync: string;
  CBT: string;
}
@Component({
    selector: "app-servers",
    templateUrl: "./servers.component.html",
    styleUrls: ["./servers.component.css"],
})
export class ServersComponent implements OnInit {
  
    AllServers: Servers[] = [];
    OnLineServers: Servers[] = [];
    OffLineServers: Servers[] = [];
    TotalServers = 0;
    TotalOffLineServers = 0;
    TotalOnLineServers = 0;
    constructor(
        private _snackBarUsers: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalServiceresearchesusers: NgbModal,
        private formBuilderUsers: FormBuilder,
        activeModal: NgbActiveModal,
        private mMenuPerm: MenuPerm
    ) {
        mMenuPerm.setRoutName("servers");
        setTimeout(() => {
            if (!mMenuPerm.getHasPerm()) {
                localStorage.clear();
                this.router.navigate(["login"]);
            }
        }, 2000);
    }

    ngOnInit(): void {
      this.getServers();
    }
    public getServers() {
      let tableLoader = false;
      if ($("#loader").hasClass("d-none")) {
          // ////debugger
          tableLoader = true;
          $("#loader").removeClass("d-none");
      }
      this.http
          .post(
              "http://srv-apps-prod/RCF_WS/WebService.asmx/ServersTable",
              //"http://localhost:64964/WebService.asmx/ServersTable",
              {
                 
              }
          )
          .subscribe((Response) => {
              this.AllServers.splice(0, this.AllServers.length);
              ////debugger
              this.AllServers = Response["d"];
              this.TotalServers = this.AllServers.length;
              this.OnLineServers = this.AllServers.filter(obj => {
                return obj.VMState === "poweredOn";
              });
              this.OffLineServers = this.AllServers.filter(obj => {
                return obj.VMState === "poweredOff";
              });
              
              this.TotalOffLineServers = this.OffLineServers.length;
              
              this.TotalOnLineServers = this.OnLineServers.length;
              
              setTimeout(function () {
                  //////debugger
                  if (tableLoader) {
                      $("#loader").addClass("d-none");
                  }
              });
          });
  }
}
