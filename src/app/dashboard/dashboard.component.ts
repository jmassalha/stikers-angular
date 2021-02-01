import { Component, OnInit, NgModule, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { CircleProgressComponent } from "ng-circle-progress";
import {
    NgbModal,
    ModalDismissReasons,
    NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
    @ViewChild("circleProgress", { static: true })
    circleProgress: CircleProgressComponent;
    ngCircleOptions = {
        outerStrokeColor: "blue",
        subtitleFormat: (percent: number): string => {
            if (percent > 100) {
                $("#real-precent")
                    .find("svg")
                    .append($("#extra-precent").find("path"));
            }

            ////debugger
            return "";
        },
    };
    constructor(private router: Router, private http: HttpClient) {}
    today: number = Date.now();
    Departmints = {
        departs: [],
        total: 0,
    };
    _dotsLoader =
        '<div class="spinner">' +
        '<div class="bounce1"></div>' +
        '<div class="bounce2"></div>' +
        '<div class="bounce3"></div>' +
        "</div>";
    ngOnInit() {
        if (
            localStorage.getItem("loginState") != "true" ||
            localStorage.getItem("loginUserName") == ""
        ) {
            this.router.navigate(["login"]);
        }
        this.getDataFormServer("");
    }
    // public getData(){
    //     this.Departmints["departs"].forEach((element, key) => {
    //         this.Departmints["departs"][key].Used = "";
    //        // //debugger
    //         //$(document).find("._Departmints li:nth("+key+") .append-dots").append($(this._dotsLoader));
    //         this.getDataFormServer(key, element.Code);
    //     });
    // }
    public getDataFormServer(_Depart: string) {
        $("#loader").removeClass("d-none");
        this.http
            .post(
                "http://srv-apps/wsrfc/WebService.asmx/TfosaDashBoardApp",
                {
                    _depart: _Depart,
                }
            )
            .subscribe(
                (Response) => {
                    ////debugger
                    //var json = $.parseJSON(Response["d"]);
                    var obj = JSON.parse(Response["d"]);
                    var aobjTotal = JSON.parse(obj["total"]);
                    var aobj = JSON.parse(obj["DepartObjects"]);
                    var totalReal = JSON.parse(obj["totalReal"]);
                    var aaobj = JSON.parse("[" + aobj[0] + "]");
                    ////debugger
                    aobjTotal = $.parseJSON(aobjTotal);

                    aaobj.forEach((element, index) => {
                        ////debugger
                        if (element.BedsReal != "0") {
                            //  //debugger
                            for (var i = index + 1; i < aaobj.length; i++) {
                                if (aaobj[i].BedsReal == "0") {
                                    element.Used =
                                        parseInt(element.Used) +
                                        parseInt(aaobj[i].Used);
                                } else {
                                    break;
                                }
                            }
                        }
                    });

                    this.Departmints["departs"] = aaobj;
                    this.Departmints["total"] = parseInt(
                        ((aobjTotal.total / parseInt(totalReal)) * 100).toFixed(
                            0
                        )
                    );
                    // this.Departmints["total"] = 140;
                    setTimeout(() => {
                        //this.dataSource.paginator = this.paginator
                        $("#loader").addClass("d-none");
                    });
                },
                (error) => {
                    setTimeout(() => {
                        //this.dataSource.paginator = this.paginator
                        $("#loader").addClass("d-none");
                    });
                }
            );
    }
}
