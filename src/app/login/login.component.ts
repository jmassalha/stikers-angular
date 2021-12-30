import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpClient } from "@angular/common/http";
import * as $ from "jquery";
@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
    constructor(
        private snackBar: MatSnackBar,
        private http: HttpClient,
        private router: Router
    ) {}
    username: string;
    password: string;
    hide : boolean = true;

    ngOnInit() {
        if (
            localStorage.getItem("loginState") == "true" &&
            localStorage.getItem("loginUserName") != ""
        ) {
            this.router.navigate(["dashboard"]);
        }
    }
    hidePassword() {
        this.hide = !this.hide;
      }
    login(): void {
        $("#loader").removeClass("d-none");
        if (this.username && this.password) {
            this.http
                .post("http://srv-apps/wsrfc/WebService.asmx/Login", {
                    _userName: this.username,
                    _mPassword: this.password
                })
                .subscribe(
                    response => {
                        $("#loader").addClass("d-none");
                        var arrRes = (response["d"]).split(' -');
                        if (arrRes[0].replace('"','') == "TRUE") {
                            localStorage.setItem("loginState", "true");
                            localStorage.setItem("Depart", arrRes[1].trim().replace('"',''));
                            localStorage.setItem(
                                "loginUserName",
                                this.username
                            );
                            this.router.navigate(["dashboard"]);
                        } else {
                            localStorage.setItem("loginState", "false");
                            localStorage.setItem("loginUserName", "");
                            this.snackBar.open("Login Error!", "X", {
                                duration: 2000
                            });
                        }
                    },
                    error => {
                        $("#loader").addClass("d-none");
                        this.snackBar.open("Login Error!", "X", {
                            duration: 2000
                        });
                    }
                );
        } else {
            $("#loader").addClass("d-none");
            this.snackBar.open("Login Error!", "X", {
                duration: 2000
            });
        }
    }
}
