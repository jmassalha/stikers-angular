import { Component, OnInit, NgModule, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { CircleProgressComponent } from "ng-circle-progress";
import {
    NgbModal,
    ModalDismissReasons,
    NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
export interface DepartRefoee {
    DepartName: string;
    DepartBedsNumber: number;
    DepartBedsInUsed: number;
    DepartBedsInUsedPer: number;
    Moshamem: number;
}
@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
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
            return "";
        },
    };
    aobjTotal: string;
    resporatoryCount: number;
    name: string;
    birthdayUser: boolean = false;
    constructor(private router: Router, private http: HttpClient) { }
    today: number = Date.now();
    // date = new Date();
    Departmints = {
        departs: [],
        total: 0,
        resp: 0
    };
    arrDepartsRefoee: DepartRefoee[]  = [];
    _dotsLoader =
        '<div class="spinner">' +
        '<div class="bounce1"></div>' +
        '<div class="bounce2"></div>' +
        '<div class="bounce3"></div>' +
        "</div>";
    ngOnInit() {
        $("#Vector_13").append('text').text('This is some information about whatever')
            .attr('x', 50)
            .attr('y', 150)
            .attr('fill', '#938F8F');

        this.getDataFormServer("");
        this.getEmployeesBirthDates();
    }
    // public getData(){
    //     this.Departmints["departs"].forEach((element, key) => {
    //         this.Departmints["departs"][key].Used = "";
    //        // ////debugger
    //         //$(document).find("._Departmints li:nth("+key+") .append-dots").append($(this._dotsLoader));
    //         this.getDataFormServer(key, element.Code);
    //     });
    // }

    getEmployeesBirthDates() {
        let userName = localStorage.getItem("loginUserName").toLowerCase();
        this.http
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetEmployeesBirthDates", {
                _userName: userName
            })
            .subscribe((Response) => {
                let user = Response["d"];
                this.name = user.FirstName;
                let currentDate = new Date();
                let day = user.DateOfBirth.split("-")[1];
                let month = user.DateOfBirth.split("-")[0];
                if (parseInt(day) == currentDate.getDate() && parseInt(month) == (currentDate.getMonth() + 1)) {
                    this.birthdayUser = true;
                }
            });
    }
    public getDataFormServer(_Depart: string) {
        $("#loader").removeClass("d-none");
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/TfosaDashBoardAppRefoee",
                //"http://srv-apps-prod/RCF_WS/WebService.asmx/TfosaDashBoardAppRefoee",
                {
                    _depart: _Depart,
                }
            )
            .subscribe(
                (Response: DepartRefoee[]) => {
                    this.arrDepartsRefoee = Response["d"];
                    var totalBeds = 0;
                    var totalInUsed = 0;
                    var totalMonshame = 0;
                    for(var i = 0; i < this.arrDepartsRefoee.length; i++){
                        totalBeds += parseInt(this.arrDepartsRefoee[i].DepartBedsNumber + "");
                        totalInUsed += parseInt(this.arrDepartsRefoee[i].DepartBedsInUsed + "");
                        totalMonshame = parseInt(this.arrDepartsRefoee[i].Moshamem + "");
                    }
                    this.resporatoryCount = totalMonshame;
                    this.aobjTotal = totalBeds  + " / " +  totalInUsed ;
                   // debugger
                    // var obj = JSON.parse(Response["d"]);
                    // var aobjTotal = JSON.parse(obj["total"]);
                    // var aobj = JSON.parse(obj["DepartObjects"]);
                    // var totalReal = JSON.parse(obj["totalReal"]);
                    // this.resporatoryCount = JSON.parse(obj["totalReal2"]);
                    // var aaobj = JSON.parse("[" + aobj[0] + "]");
                    // aobjTotal = JSON.parse(aobjTotal);
                    // this.aobjTotal = aobjTotal["total"];
                    // aaobj.forEach((element, index) => {
                    //     if (element.BedsReal != "0") {
                    //         for (var i = index + 1; i < aaobj.length; i++) {
                    //             if (aaobj[i].BedsReal == "0" && aaobj[i].Name != 'ילוד בריא') {
                    //                 element.Used =
                    //                     parseInt(element.Used) +
                    //                     parseInt(aaobj[i].Used);
                    //             } else {
                    //                 break;
                    //             }
                    //         }
                    //     } else {
                    //     }
                    // });

                    // this.Departmints["departs"] = aaobj;
                    // //debugger
                    this.Departmints["total"] = parseInt(
                        ((
                            totalInUsed / totalBeds) * 100).toFixed(
                            0
                        )
                    );
                    this.Departmints["resp"] = parseInt(
                        ((totalMonshame /totalBeds) * 100).toFixed(
                            0
                        )
                    );
                    setTimeout(() => {
                        $("#loader").addClass("d-none");
                    });
                },
                (error) => {
                    setTimeout(() => {
                        $("#loader").addClass("d-none");
                    });
                }
            );
    }
}
