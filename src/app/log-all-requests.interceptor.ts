import { Injectable } from "@angular/core";
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpClient,
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class LogAllRequestsInterceptor implements HttpInterceptor {
    constructor(private logHttp: HttpClient) {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        if (request.body["RoutName"]) {
            console.log(request.body["RoutName"]);
            console.log(request.body["UserName"]);
            this.logHttp
                .post(
                    "http://localhost:64964/WebService.asmx/LinksLog",
                    //"http://srv-apps-prod/RCF_WS/WebService.asmx/LinksLog",
                    {
                        usaerName: request.body["UserName"],
                        linkId: request.body["RoutName"],
                    }
                )
                .subscribe((Response) => {
                });
        }
        return next.handle(request);
    }
}
