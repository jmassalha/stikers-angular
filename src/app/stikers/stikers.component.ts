import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient, HttpParams } from "@angular/common/http";
export interface PersonalDetails {
    PatientNumber: string;
    DateIn: string;
    TimeIn: string;
    FirstName: string;
    FatherName: string;
    LastName: string;
    PersonID: string;
    DOB: string;
    Gender: string;
    PhoneNumber: string;
    Email: string;
    Address: string;
    CaseNumber: string;
    Depart: string;
    DepartDescription: string;
    SeodeDepart: string;
    SeodeDepartDescription: string;
    DischargeDate: string;
    InDate: string;
    DischargeTime: string;
    InTime: string;
    Age: string;
    PASSNR: string;
    ZNE_FNAMEZZ: string;
    ZNE_LNAMEZZ: string;
    DOTIM: string;
    DODAT: string;
}
@Component({
    selector: "app-stikers",
    templateUrl: "./stikers.component.html",
    styleUrls: ["./stikers.component.css"],
})
export class StikersComponent implements OnInit {
    constructor(
        private http: HttpClient,
        private _Activatedroute: ActivatedRoute
    ) {
        //debugger
    }
    disabled: boolean = true
    @ViewChild("stickers") stickers: ElementRef;
    id = "";
    number = 6;
    mPersonalDetails: PersonalDetails = {
        PatientNumber: "",
        DateIn: "",
        TimeIn: "",
        FirstName: "",
        FatherName: "",
        LastName: "",
        PersonID: "",
        DOB: "",
        Gender: "",
        PhoneNumber: "",
        Email: "",
        Address: "",
        CaseNumber: "",
        Depart: "",
        DepartDescription: "",
        SeodeDepart: "",
        SeodeDepartDescription: "",
        DischargeDate: "",
        InDate: "",
        DischargeTime: "",
        InTime: "",
        Age: "",
        PASSNR: "",
        ZNE_FNAMEZZ: "",
        ZNE_LNAMEZZ: "",
        DOTIM: "",
        DODAT: "",
    };
    ngOnInit(): void {
        
    }
    ngAfterViewInit() {
        // console.log(this.stickers.nativeElement.innerHTML);
    }
    GetData(event: any){
        this.GetPersonalDetails(event.currentTarget.value);
    }
    openPrintWindow() {
        var mywindow = window.open("", "PRINT");

        mywindow.document.write(
            "<html><head><style>.col-8{width:66%;float:right;}pl-20{padding-left: 20px;}p-20{padding: 0 20px;}.pos-1{position: relative;height: 124px;}.pos-1-1{padding-right: 10px;position: absolute;top: 25px;}.pos-1-2{position: absolute;top: 42px;z-index: 111;padding-right: 10px;}.pos-1-3{position: absolute;    right: -6px;top: 52px;height: 35px;overflow: hidden; }.pos-1-4{position: absolute;top: 87px;}.pos-1-5{padding-right: 16px;padding-left: 25px;position: absolute;top: 102px;}.ngx-barcode{width:100%;float:right;text-align: center}.fz-b{font-size:20px;    padding-top: 30px;}*, ::after, ::before {box-sizing: border-box;}.d-block{width:100%;float:right;}.col{width:100%;float:right;}.col-4{width:33%;float:right;}.col-6{width:50%;float:right;} .col-3{width:25%;float:right;}.text-center {text-align: center!important;}.text-right{text-align: right!important;}.text-left{text-align: left!important;}table {page-break-after: always;}.row{width:100%;float:right;}.col-6{width:50%; float:right;}</style><title>מדביקות</title>"
        );
        mywindow.document.write(
            '</head><body>'
        );
        mywindow.document.write(
            this.stickers.nativeElement.innerHTML
        );
        mywindow.document.write("</body></html>");

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/

        mywindow.print();
        mywindow.close();
    }
    GetPersonalDetails(id) {        
        this.http
            .get(
                "http://localhost:44313/api/GetPatientDetails?EXTNR="+id
            )
            .subscribe((Response: any) => {
                var json = Response;
                this.mPersonalDetails = json;
                if(this.mPersonalDetails.FirstName && this.mPersonalDetails.FatherName != ""){
                    this.disabled = false
                }else{
                    this.disabled = true
                }
                //debugger;
            });
    }
}
