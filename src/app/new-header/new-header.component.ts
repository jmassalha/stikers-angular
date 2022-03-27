import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as $ from "jquery";

export interface Link {
  RowId: string;
  LinkId: string;
  LinkDescription: string;
  LinkStatus: string;
  Level: string;
  SubToLinkId: string;
  Children: Link[];
}

@Component({
    selector: "app-new-header",
    templateUrl: "./new-header.component.html",
    styleUrls: ["./new-header.component.css"],
})
export class NewHeaderComponent implements OnInit {
    personReadInquiry: boolean = false;
    constructor(private router: Router, private http: HttpClient) {}
    Links: Link[] = [];
    ngOnInit(): void {
        $(document).on("click", "[routerlink], .nav-link", function () {
            // ////debugger;
            localStorage.setItem("ReseachRowId", "0");
            $("#app-menu").removeClass("show");
            $("#menu-btn").removeClass("show");
            // //debugger
            if ($(this).attr("routerlink") == "mersham") {
                $("body").addClass("bg-blue-light");
            } else {
                $("body").removeClass("bg-blue-light");
            }
        });
        $("#menu-btn").click(function () {
            //////debugger;
            $(this).toggleClass("show");
            $("#app-menu").toggleClass("show");
        });
        this.getMenuLinks();
    }
    logout($event): void {
        //////debugger
        localStorage.clear();
        $("#app-menu").removeClass("show");
        $("#menu-btn").removeClass("show");
        this.router.navigate(["login"]);
    }
    getMenuLinks(){
      $("#loader").removeClass("d-none");
        this.http
            .post(
                //"http://localhost:64964/WebService.asmx/GetOnnLineLinks",
                "http://srv-apps-prod/RCF_WS/WebService.asmx/GetOnnLineLinks",
                {
                    user: localStorage.getItem("loginUserName") ,
                }
            )
            .subscribe((Response) => {
              //debugger
              this.Links = Response["d"];
              console.log(this.Links)
              ////debugger
                setTimeout(function () {
                    $("#loader").addClass("d-none");
                });
            });
    }
}
