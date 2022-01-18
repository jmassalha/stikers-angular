import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";

import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as $ from "jquery";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationDialogService } from  "../confirmation-dialog/confirmation-dialog.service";
export interface Message {
    ID: number;
    Title: string;
    MessageVal: string;
    BgColor: string;
}
@Component({
    selector: "app-sendsmsadmin",
    templateUrl: "./sendsmsadmin.component.html",
    styleUrls: ["./sendsmsadmin.component.css"],
})
export class SendsmsadminComponent implements OnInit {
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";

    @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();
    sendSmsForm: FormGroup;
    MessagesTemp: Message[] = [];
    loader: Boolean;
    emergencyCall: Boolean = false;
    submitted = false;
    smsText: string;
    smsNumbers: string;
    surveyNumber: string;
    toShow: string = "true";
    smsType: string = "SMSOnLineAdmin";
    textAreaVal: string = "";
    activeModal: NgbActiveModal;
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalServicematernitypatients: NgbModal,
        private formBuilder: FormBuilder,
        private confirmationDialogService: ConfirmationDialogService,
        activeModal: NgbActiveModal
    ) {
        this.activeModal = activeModal;
        debugger
        if(localStorage.getItem("textAreaVal") && localStorage.getItem("textAreaVal") != ""){
            debugger
            this.smsType = localStorage.getItem("smsType") ;//"SMSMaternity"
            this.emergencyCall = true;
            this.GetMessagesTemp();
            this.textAreaVal = localStorage.getItem("textAreaVal");
            localStorage.setItem("textAreaVal", "");
            debugger
        }else{
            this.emergencyCall = false;
            this.smsType = "SMSOnLineAdmin";
        }
        this.sendSmsForm = this.formBuilder.group({
            smsText: ["", Validators.required],
            smsNumbers: [this.textAreaVal, Validators.required],
            surveyNumber: ["0", Validators.required],
        });
    }
    @Input()
    ngOnInit(): void {
        this.toShow = localStorage.getItem("toShow");
        this.smsText = "";
        this.smsNumbers = "";
        this.surveyNumber = "";
        this.loader = false;

        if (
            localStorage.getItem("loginState") != "true" ||
            localStorage.getItem("loginUserName") == ""
        ) {
            this.router.navigate(["login"]);
        } else if (
            localStorage.getItem("loginUserName").toLowerCase() ==
                "jmassalha" ||
            localStorage.getItem("loginUserName").toLowerCase() == "eonn" ||
            localStorage.getItem("loginUserName").toLowerCase() == "dporat" ||
            localStorage.getItem("loginUserName").toLowerCase() ==
                "sabuhanna" ||
            localStorage.getItem("loginUserName").toLowerCase() == "samer" ||
            localStorage.getItem("loginUserName").toLowerCase() == "owertheim" ||
            localStorage.getItem("loginUserName").toLowerCase() == "waraidy" ||
             localStorage.getItem("loginUserName").toLowerCase() == "mmadmon" ||
             localStorage.getItem("loginUserName").toLowerCase() == "jubartal" ||
             localStorage.getItem("loginUserName").toLowerCase() == ("kmandel").toLowerCase() ||
             localStorage.getItem("loginUserName").toLowerCase() == ("NCaspi").toLowerCase() ||
             localStorage.getItem("loginUserName").toLowerCase() == ("BMonastirsky").toLowerCase() ||
             localStorage.getItem("loginUserName").toLowerCase() == ("NAli").toLowerCase() ||
             localStorage.getItem("loginUserName").toLowerCase() == ("EMansour").toLowerCase() ||
             localStorage.getItem("loginUserName").toLowerCase() == ("IAharon").toLowerCase() ||
             localStorage.getItem("loginUserName").toLowerCase() == ("KLibai").toLowerCase() ||
             localStorage.getItem("loginUserName").toLowerCase() == ("TLivnat").toLowerCase() ||
             localStorage.getItem("loginUserName").toLowerCase() == ("OHaccoun").toLowerCase() ||
             localStorage.getItem("loginUserName").toLowerCase() == ("AAsheri").toLowerCase() ||
             localStorage.getItem("loginUserName").toLowerCase() == ("KMassalha").toLowerCase() ||
             localStorage.getItem("loginUserName").toLowerCase() == ("ANujedat").toLowerCase() ||
             localStorage.getItem("loginUserName").toLowerCase() == ("NSela").toLowerCase() ||
             localStorage.getItem("loginUserName").toLowerCase() == ("GJidovetsk").toLowerCase() ||
             localStorage.getItem("loginUserName").toLowerCase() == ("MTsaban").toLowerCase() ||
             localStorage.getItem("loginUserName").toLowerCase() == ("MRuach").toLowerCase() ||
             localStorage.getItem("loginUserName").toLowerCase() == ("LCerem").toLowerCase()  
        ) {
        } else {
            this.router.navigate(["login"]);
            ///$("#chadTable").DataTable();
        }
    }
    SetMessageVal(val){
        this.sendSmsForm = this.formBuilder.group({
            smsText: [val, Validators.required],
            smsNumbers: [this.textAreaVal, Validators.required],
            surveyNumber: ["0", Validators.required],
        });
    }
    openSnackBar() {
        this._snackBar.open("נשלח בהצלחה", "", {
            duration: 2500,
            direction: "rtl",
            panelClass: "success",
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
    ngAfterViewInit(): void {}
    public GetMessagesTemp(){
        this.http
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetMessagesTemp", {
                
            })
            .subscribe((Response) => {
               // debugger
                this.MessagesTemp = Response["d"];
               // debugger
            });
    }
    public sendSms() {
        ////debugger
        // stop here if form is invalid
        if (this.sendSmsForm.invalid) {
            return;
        }
        this.submitted = true;

        let tableLoader = false;
        
        var lines = [];
        $.each(this.sendSmsForm.value.smsNumbers.split(/\n/), function(i, line){
            if(line){
                lines.push(line.split(" ")[0]);
            }
        });
    //console.log(lines);
    //return;
        this.confirmationDialogService.confirm('נא לאשר..', 'האם אתה בטוח ...? ')
        .then((confirmed) =>{
            console.log('User confirmed:', confirmed);
            if(confirmed){
                if ($("#loader").hasClass("d-none")) {
                    // //debugger
                    tableLoader = true;
                    $("#loader").removeClass("d-none");
                }
                this.http
                .post("http://srv-apps-prod/RCF_WS/WebService.asmx/SendSMSOnLineAdmin", {
                    smsText: this.sendSmsForm.value.smsText,
                    smsNumbers: this.sendSmsForm.value.smsNumbers,
                    surveyNumber: 0,
                    smsType: this.smsType
                })
                .subscribe((Response) => {
                    this.openSnackBar();
                    this.sendSmsForm = this.formBuilder.group({
                        smsText: ["", Validators.required],
                        smsNumbers: ["", Validators.required],
                        surveyNumber: ["0", Validators.required],
                    });
                    localStorage.setItem("textAreaVal", "");
                    
                    this.parentFun.emit();
                    setTimeout(function () {
                        ////debugger
                        if (tableLoader) {
                            $("#loader").addClass("d-none");
                        }
                    });
                });
            }else{

            }
            
        } )
        .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
       
    }
}
