import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as $ from "jquery";
@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
    panelOpenState = false;

    constructor(private router: Router,
        private http: HttpClient) {
        this.getPermission();
    }

    personReadInquiry: boolean = false;
    clinicsUserPermission: boolean = false;
    loginUserName: string;
    numberOfUnread: number;
    _shoDimot: Boolean;
    _shoCorona: Boolean;
    _shoCoronaform: Boolean;
    _shoSettings: Boolean;
    _sendSMS: Boolean;
    _sendSMSADMIN: Boolean;
    _shoGlucose: Boolean;
    _shoMersham: Boolean;
    _shoDrugs: Boolean;
    _shoCortinas: Boolean;
    _formsArea: Boolean;
    _publicInquiry: Boolean;
    _shoCortinasSettings: Boolean;
    _shoSofiMenu: Boolean;
    _clinicsPricing: Boolean;
    _shoCoronavaccine: Boolean;
    _shocovid19report: Boolean;
    _shoResearches: Boolean;
    _permResearch: Boolean;
    _SHowToAdmins: Boolean;
    _shomaternity: Boolean;
    _shoEmergincyCall: Boolean;
    _shoEventsschedule: Boolean;
    _shoCaseinvoises: Boolean;
    _shoToWesam: Boolean;
    _shoNIC: Boolean;
    getPermission() {
        this.http
            .post(
                "http://srv-apps/wsrfc/WebService.asmx/getResearchPermission",
                {
                    _UserName: localStorage.getItem("loginUserName"),
                }
            )
            .subscribe((Response) => {
                // ////////debugger
                var json = $.parseJSON(Response["d"]);
                switch (json) {
                    case 1:
                    case "1":
                        this._permResearch = true;
                        break;
                    default:
                        this._permResearch = false;
                }
                setTimeout(function () {
                    // $("#loader").addClass("d-none");
                    //this.DeleteRowId = "";
                    //this.openSnackBar("נמחק בהצלחה", "success");
                }, 500);
            });
    }

    ngOnInit() {
        this._shoNIC = false;
        this._shoToWesam = false;
        this._shocovid19report = false;
        this._shoCaseinvoises = false;
        this._shomaternity = false;
        this._SHowToAdmins = false;
        this._shoResearches = false;
        this._shoSofiMenu = false;
        this._shoCoronavaccine = true;
        this._sendSMSADMIN = false;
        this._clinicsPricing = false;
        this._formsArea = false;
        this._publicInquiry = false;
        this._shoEventsschedule = false;
        this._shoEmergincyCall = false;
        this.loginUserName = localStorage.getItem("loginUserName");
        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "adahabre" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "waraidy" ||
            this.loginUserName.toLowerCase() == "mmadmon" ||
            this.loginUserName.toLowerCase() == "jubartal" ||
            this.loginUserName.toLowerCase() == ("kmandel").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("NCaspi").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("BMonastirsky").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("NAli").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("EMansour").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("IAharon").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("KLibai").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("TLivnat").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("OHaccoun").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("AAsheri").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("KMassalha").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("ANujedat").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("NSela").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("GJidovetsk").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("LCerem").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("MTsaban").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("MRuach").toLowerCase() ||
            this.loginUserName.toLowerCase() == "owertheim"
        ) {
            this._shoEventsschedule = true;
            this._shoToWesam = true;
        }
        if (
            this.loginUserName.toLowerCase() == "adahabre"
        ) {
            this._clinicsPricing = true;
        }
        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "owertheim" ||
            this.loginUserName.toLowerCase() == "ocohen"
        ) {
            this._shoCaseinvoises = true;
        }
        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "owertheim"
        ) {
            this._SHowToAdmins = true;
        }
        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "adahabre" ||
            this.loginUserName.toLowerCase() == "matias" ||
            this.loginUserName.toLowerCase() == "owertheim"
        ) {
            this._publicInquiry = true;
        }
        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "adahabre" ||
            this.loginUserName.toLowerCase() == "owertheim" ||
            this.loginUserName.toLowerCase() == "klibai" ||
            this.loginUserName.toLowerCase() == "smatta"
        ) {
            this._formsArea = true;
        }

        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "owertheim" ||
            this.loginUserName.toLowerCase() == "raharon" ||
            this.loginUserName.toLowerCase() == ("MTsaban").toLowerCase()
        ) {
            this._shomaternity = true;
        }
        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "owertheim" ||
            this.loginUserName.toLowerCase() == "jubartal" ||
            this.loginUserName.toLowerCase() == "emassalha" 
        ) {
            this._shoNIC = true;
        }
        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "owertheim" ||
            this.loginUserName.toLowerCase() == "okatz"
        ) {
            this._shoResearches = true;
        }
        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "adahabre" ||
            this.loginUserName.toLowerCase() == "owertheim"
            || this.loginUserName.toLowerCase() == "waraidy"
        ) {
            this._shoEmergincyCall = true;
        }
        if (
            this.loginUserName.toLowerCase() == "sharush" ||
            this.loginUserName.toLowerCase() == "lyizhak" ||
            this.loginUserName.toLowerCase() == ("MESHEK").toLowerCase()
        ) {
            this._shoSofiMenu = true;
        } else {
            this._shoCorona = false;
            this._shoDimot = false;
            this._shoCorona = false;
            this._shoCoronaform = false;
            this._shoSettings = false;
            this._sendSMS = false;
            this._shoGlucose = false;
            this._shoMersham = false;
            this._shoDrugs = false;
            this._shoCortinas = false;
            this._shoCortinasSettings = false;
            this._shoSofiMenu = false;
        }
        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "eonn" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "owertheim" ||
            this.loginUserName.toLowerCase() == "habuzayyad" ||
            this.loginUserName.toLowerCase() == "hmizrahi" ||
            this.loginUserName.toLowerCase() == "mruach" ||
            this.loginUserName.toLowerCase() == "yarosenfel" ||
            this.loginUserName.toLowerCase() == "mmatan" ||
            this.loginUserName.toLowerCase() == "etalor" ||
            this.loginUserName.toLowerCase() == "batzadok" ||
            this.loginUserName.toLowerCase() == "mmadmon" ||
            this.loginUserName.toLowerCase() == "mlehrer" ||
            this.loginUserName.toLowerCase() == "nsela" ||
            this.loginUserName.toLowerCase() == "ssabach" ||
            this.loginUserName.toLowerCase() == "dsalameh" ||
            this.loginUserName.toLowerCase() == "bmonastirsky" ||
            this.loginUserName.toLowerCase() == "mgershovich" ||
            this.loginUserName.toLowerCase() == "klibai" ||
            this.loginUserName.toLowerCase() == "aasheri" ||
            this.loginUserName.toLowerCase() == "obenor" ||
            this.loginUserName.toLowerCase() == "ohaccoun" ||
            this.loginUserName.toLowerCase() == "iaharon" ||
            this.loginUserName.toLowerCase() == "jubartal" ||
            this.loginUserName.toLowerCase() == "hseffada" ||
            this.loginUserName.toLowerCase() == "waraidy" ||
            this.loginUserName.toLowerCase() == "cmagen" ||
            this.loginUserName.toLowerCase() == "tlivnat" ||
            this.loginUserName.toLowerCase() == "mjourno" ||
            this.loginUserName.toLowerCase() == "nali" ||
            this.loginUserName.toLowerCase() == "emansour" ||
            this.loginUserName.toLowerCase() == "kmandel" ||
            this.loginUserName.toLowerCase() == "smatta" ||
            this.loginUserName.toLowerCase() == "rnakhle" ||
            this.loginUserName.toLowerCase() == "aibrahim" ||
            this.loginUserName.toLowerCase() == "mkheer" ||
            this.loginUserName.toLowerCase() == "ssarusi" ||
            this.loginUserName.toLowerCase() == "sabuhanna" ||
            this.loginUserName.toLowerCase() == "tklinger"
            ||
            this.loginUserName.toLowerCase() == "aamara"
        ) {
            this._shoCorona = true;
        } else {
            this._shoCorona = false;
        }

        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "eonn" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "owertheim" ||
            this.loginUserName.toLowerCase() == "yshoa" ||
            this.loginUserName.toLowerCase() == "sahadar" ||
            this.loginUserName.toLowerCase() == "hyakobi" ||
            this.loginUserName.toLowerCase() == "atekali" ||
            this.loginUserName.toLowerCase() == "yradia" ||
            this.loginUserName.toLowerCase() == "zevensaban" ||
            this.loginUserName.toLowerCase() == "nstepman" ||
            this.loginUserName.toLowerCase() == "sgamliel" ||
            this.loginUserName.toLowerCase() == "eliberty" ||
            this.loginUserName.toLowerCase() == "tnapso" ||
            this.loginUserName.toLowerCase() == "szidan" ||
            this.loginUserName.toLowerCase() == "sabuhanna" ||
            this.loginUserName.toLowerCase() == "rnakhle" ||
            this.loginUserName.toLowerCase() == "aibrahim" ||
            this.loginUserName.toLowerCase() == "mkheer" ||
            this.loginUserName.toLowerCase() == "ssarusi" ||
            this.loginUserName.toLowerCase() == "samos"
            ||

            this.loginUserName.toLowerCase() == "thajouj" ||
            this.loginUserName.toLowerCase() == "ssarusi" ||
            this.loginUserName.toLowerCase() == "gmoldavsky" ||
            this.loginUserName.toLowerCase() == "ekellerman" ||
            this.loginUserName.toLowerCase() == "tklinger"

        ) {
            this._shoCoronaform = true;
        } else {
            this._shoCoronaform = false;
        }
        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "eonn" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "mjerdev" ||
            this.loginUserName.toLowerCase() == "owertheim" ||
            this.loginUserName.toLowerCase() == "hmizrahi" ||
            this.loginUserName.toLowerCase() == "mruach" ||
            this.loginUserName.toLowerCase() == "yarosenfel" ||
            this.loginUserName.toLowerCase() == "yarosenfel" ||
            this.loginUserName.toLowerCase() == "lbogun" ||
            this.loginUserName.toLowerCase() == ("MLehrer").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("mshugan").toLowerCase()||
            this.loginUserName.toLowerCase() == ("SZidan").toLowerCase()||
            this.loginUserName.toLowerCase() == ("YBitton").toLowerCase()
        ) {
            this._shoDimot = true;
        } else {
            this._shoDimot = false;
        }

        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "eonn" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "owertheim" ||
            this.loginUserName.toLowerCase() == "jubartal" ||
            this.loginUserName.toLowerCase() == "nsuheil" ||
            this.loginUserName.toLowerCase() == "mcohen" ||
            this.loginUserName.toLowerCase() == "rnave" ||
            this.loginUserName.toLowerCase() == "lbernstein" ||
            this.loginUserName.toLowerCase() == "lshavit" ||
            this.loginUserName.toLowerCase() == "kyanai" ||
            this.loginUserName.toLowerCase() == "edinisman" ||
            this.loginUserName.toLowerCase() == "emassalha" ||
            this.loginUserName.toLowerCase() == "dsalameh" ||
            this.loginUserName.toLowerCase() == "whanout" ||
            this.loginUserName.toLowerCase() == "zprassolov" ||
            this.loginUserName.toLowerCase() == "kailabouni" ||
            this.loginUserName.toLowerCase() == "rhakim" ||
            this.loginUserName.toLowerCase() == "rzraik" ||
            this.loginUserName.toLowerCase() == "syeganeh" ||
            this.loginUserName.toLowerCase() == "iatlas" ||
            this.loginUserName.toLowerCase() == "jbaram" ||
            this.loginUserName.toLowerCase() == "sganem" ||
            this.loginUserName.toLowerCase() == "nmansour"
        ) {
            // //debugger
            this._shoMersham = true;
        } else {
            //  //debugger
            this._shoMersham = false;
        }


        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "eonn" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "owertheim" ||
            this.loginUserName.toLowerCase() == "tklinger" ||
            this.loginUserName.toLowerCase() == "lyizhak"

        ) {
            this._shoCortinas = true;
            this._shoCortinasSettings = true;
        } else {
            this._shoCortinas = false;
            this._shoCortinasSettings = false;
        }


        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "eonn" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "owertheim" ||
            this.loginUserName.toLowerCase() == "tklinger"
        ) {
            this._shoCoronavaccine = true;
        } else {
            this._shoCoronavaccine = true;
        }

        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "eonn" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "owertheim" ||
            this.loginUserName.toLowerCase() == "jubartal"
        ) {
            // //debugger
            this._shoDrugs = true;
        } else {
            //  //debugger
            this._shoDrugs = false;
        }
        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "eonn" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "owertheim" ||
            this.loginUserName.toLowerCase() == "mbilya"
        ) {
            // //debugger
            this._shoSettings = true;
        } else {
            //  //debugger
            this._shoSettings = false;
        }


        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "owertheim"
            || this.loginUserName.toLowerCase() == "edinisman"
            || this.loginUserName.toLowerCase() == "whanout"
            || this.loginUserName.toLowerCase() == "dsalameh"
        ) {
            // //debugger
            this._shocovid19report = true;
        } else {
            //  //debugger
            this._shocovid19report = false;
        }
        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "eonn" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "owertheim" ||
            this.loginUserName.toLowerCase() == "lshavit" ||
            this.loginUserName.toLowerCase() == "mbadarni" ||
            this.loginUserName.toLowerCase() ==
            "mubadarne" ||
            this.loginUserName.toLowerCase() ==
            "muhbadarne"
        ) {
            // //debugger
            this._shoGlucose = true;
        } else {
            //  //debugger
            this._shoGlucose = false;
        }
        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "eonn" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "owertheim" ||
            this.loginUserName.toLowerCase() == "dporat" ||
            this.loginUserName.toLowerCase() == "sabuhanna"
        ) {
            this._sendSMS = true;
        } else {
            this._sendSMS = false;
        }
        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "owertheim" ||
            this.loginUserName.toLowerCase() == "sabuhanna"
        ) {
            this._sendSMSADMIN = true;
        } else {
            this._sendSMSADMIN = false;
        }
        $(document).on("click", "[routerlink], .nav-link", function () {
            // //debugger;
            localStorage.setItem("ReseachRowId", "0");
            $("#app-menu").removeClass("show");
            $("#menu-btn").removeClass("show");
            // debugger
            if ($(this).attr('routerlink') == 'mersham') {
                $('body').addClass('bg-blue-light');
            } else {
                $('body').removeClass('bg-blue-light');
            }
        });
        $("#menu-btn").click(function () {
            ////debugger;
            $(this).toggleClass("show");
            $("#app-menu").toggleClass("show");
        });
        this.ifPersonRead();
        this.ClinicsPricingPermission();
    }
    logout($event): void {
        ////debugger
        localStorage.clear();
        $("#app-menu").removeClass("show");
        $("#menu-btn").removeClass("show");
        this.router.navigate(["login"]);
    }

    ClinicsPricingPermission() {
        let userName = localStorage.getItem("loginUserName").toLowerCase();
        this.http
            .post("http://srv-apps/wsrfc/WebService.asmx/ClinicsUserPersmission", {
                _userName: userName
            })
            .subscribe((Response) => {
                this.clinicsUserPermission = Response["d"];
            });
    }

    ifPersonRead() {
        let userName = localStorage.getItem("loginUserName").toLowerCase();
        this.http
            .post("http://srv-apps/wsrfc/WebService.asmx/IfUserRead", {
                _userName: userName
            })
            .subscribe((Response) => {
                this.numberOfUnread = Response["d"];
                if (this.numberOfUnread > 0) {
                    this.personReadInquiry = true;
                } else {
                    this.personReadInquiry = false;
                }
            });
    }
}
