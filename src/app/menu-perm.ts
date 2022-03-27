import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root",
})
export class MenuPerm {
    private UserName: string = "";
    private RoutName: string = "";
    private hasPerm: Boolean = false;
    constructor(private http: HttpClient) {}
    setRoutName(_RoutName: string) {
        this.RoutName = _RoutName;
        this.checkPermLinkForUser();
    }
    setUserName(_UserName: string) {
        this.UserName = _UserName;
    }
    getHasPerm(): Boolean {
        return this.hasPerm;
    }
    private checkPermLinkForUser() {
        let taht = this;
       // //debugger;
        this.http
            //.post("http://localhost:64964/WebService.asmx/GetPermLinkForUser", {
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetPermLinkForUser", {
                UserName: this.UserName,
                RoutName: this.RoutName,
            })
            .subscribe((Response) => {
                ////debugger
                if (Response["d"] == true) taht.hasPerm = true;
                else taht.hasPerm = false;
            });
    }
}
