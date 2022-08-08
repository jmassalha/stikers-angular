import { Injectable } from "@angular/core";
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpClient,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class LogAllRequestsInterceptor implements HttpInterceptor {
    constructor(private logHttp: HttpClient, private router: Router) {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        //console.log(request.url);
        if (localStorage.getItem("loginUserName") != "" && localStorage.getItem("loginUserName")) {
            if (!localStorage.getItem("LastRout")) {
                localStorage.setItem(
                    "LastRout",
                    this.router.url.replace("/", "")
                );
                this.logHttp
                    .post(
                        //"http://srv-apps-prod/RCF_WS/WebService.asmx/LinksLog",
                        "http://srv-apps-prod/RCF_WS/WebService.asmx/LinksLog",
                        {
                            usaerName: localStorage.getItem("loginUserName"),
                            linkId: this.router.url.replace("/", ""),
                        }
                    )
                    .subscribe((Response) => {});
            }
            if (request.url.indexOf("LinksLog") < 0)
                if (
                    localStorage.getItem("LastRout") !=
                    this.router.url.replace("/", "")
                && localStorage.getItem("loginUserName")) {
                    localStorage.setItem(
                        "LastRout",
                        this.router.url.replace("/", "")
                    );
                    this.logHttp
                        .post(
                           // "http://srv-apps-prod/RCF_WS/WebService.asmx/LinksLog",
                            "http://srv-apps-prod/RCF_WS/WebService.asmx/LinksLog",
                            {
                                usaerName: localStorage.getItem("loginUserName"),
                                linkId: this.router.url.replace("/", ""),
                            }
                        )
                        .subscribe((Response) => {});
                }
        }

        return next.handle(request);
    }
}
