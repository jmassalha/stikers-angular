import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as $ from "jquery";
import { VoiceRecognitionService } from '../header/service/voice-recognition.service'


@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.css"],
    providers: [VoiceRecognitionService]
})
export class HeaderComponent implements OnInit {
    panelOpenState = false;
    

    constructor(private router: Router,
        public service : VoiceRecognitionService,
        private http: HttpClient) {
        this.getPermission();
        this.service.init();
    }

    personReadInquiry: boolean = false;
    clinicsUserPermission: boolean = false;
    cardiologyPermission: boolean = false;
    visitorsUserPermission: boolean = false;
    fastCovidTestPermission: boolean = false;
    employeesManagePermission: boolean = false;
    loginUserName: string;
    numberOfUnread: number;
    _shoDimot: Boolean;
    _shoCorona: Boolean;
    _shoCoronaform: Boolean;
    _shoSettings: Boolean;
    _galitReport: Boolean;
    _sendSMS: Boolean;
    _sendSMSADMIN: Boolean;
    _shoGlucose: Boolean;
    _onnline: Boolean = false;
    _shoMersham: Boolean;
    _shoDrugs: Boolean;
    _shoCortinas: Boolean;
    _formsArea: Boolean;
    _nursesSystem: Boolean;
    _nursesSystemManage: Boolean;
    _devManage: Boolean;
    _employeesManage: Boolean;
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
    _EmSurgiries: Boolean = false;
    _OnlineAppointments: Boolean = false;
    _OrdersToAppointmentsComponent: Boolean = false;
    _shoNIC: Boolean;
    _shoScanners: Boolean;
    getPermission() {
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/getResearchPermission",
                {
                    _UserName: localStorage.getItem("loginUserName"),
                }
            )
            .subscribe((Response) => {
                // ////////debugger
                var json = JSON.parse(Response["d"]);
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
        this._nursesSystem = false;
        this._shoCoronavaccine = true;
        this._sendSMSADMIN = false;
        this._shoScanners = false;
        this._shoCoronavaccine = true;
        this._sendSMSADMIN = false;
        this._clinicsPricing = false;
        this._formsArea = false;
        this._devManage = false;
        this._publicInquiry = false;
        this._shoEventsschedule = false;
        this._shoEmergincyCall = false;
        this.loginUserName = localStorage.getItem("loginUserName").toLowerCase();
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
            this.loginUserName.toLowerCase() == ("ZAvraham").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("GJidovetsk").toLowerCase() ||
            this.loginUserName.toLowerCase() == "owertheim"
            || this.loginUserName.toLowerCase() == ("x_dshaull").toLowerCase()
            || this.loginUserName.toLowerCase() == ("IDitur").toLowerCase()
            || this.loginUserName.toLowerCase() == ("RYousef").toLowerCase()
            || this.loginUserName.toLowerCase() == ("DGolani").toLowerCase()
            || this.loginUserName.toLowerCase() == ("NSela").toLowerCase()
            || this.loginUserName.toLowerCase() == ("MRuach").toLowerCase()
            || this.loginUserName.toLowerCase() == ("MTsaban").toLowerCase()
            || this.loginUserName.toLowerCase() == ("VZamir").toLowerCase()
            || this.loginUserName.toLowerCase() == ("MAtias").toLowerCase()
            || this.loginUserName.toLowerCase() == ("SSabach").toLowerCase()
            || this.loginUserName.toLowerCase() == ("SBADER").toLowerCase()
            || this.loginUserName.toLowerCase() == ("ZLevi").toLowerCase()
            || this.loginUserName.toLowerCase() == ("KYedidia").toLowerCase()
            || this.loginUserName.toLowerCase() == ("OGolovkin").toLowerCase()
            || this.loginUserName.toLowerCase() == ("yhalif").toLowerCase()
            || this.loginUserName.toLowerCase() == ("GJidovetsk").toLowerCase()
            || this.loginUserName.toLowerCase() == ("ZAvraham").toLowerCase()
            || this.loginUserName.toLowerCase() == ("MMadmon").toLowerCase()
            || this.loginUserName.toLowerCase() == ("jubartal").toLowerCase()
            || this.loginUserName.toLowerCase() == ("BMonastirsky").toLowerCase()
            || this.loginUserName.toLowerCase() == ("EMansour").toLowerCase()
            || this.loginUserName.toLowerCase() == ("HSeffada").toLowerCase()
            || this.loginUserName.toLowerCase() == ("dvainshtei").toLowerCase()
            || this.loginUserName.toLowerCase() == ("NAli").toLowerCase()
            || this.loginUserName.toLowerCase() == ("kMandel").toLowerCase()
            || this.loginUserName.toLowerCase() == ("NCaspi").toLowerCase()
            || this.loginUserName.toLowerCase() == ("TLivnat").toLowerCase()
            || this.loginUserName.toLowerCase() == ("OHaccoun").toLowerCase()
            || this.loginUserName.toLowerCase() == ("WAraidy").toLowerCase()
            || this.loginUserName.toLowerCase() == ("KLibai").toLowerCase()
            || this.loginUserName.toLowerCase() == ("IAharon").toLowerCase()
            || this.loginUserName.toLowerCase() == ("MJourno").toLowerCase()
            || this.loginUserName.toLowerCase() == ("MCherum").toLowerCase()
            || this.loginUserName.toLowerCase() == ("MCherum1").toLowerCase()
            || this.loginUserName.toLowerCase() == ("MCherum2").toLowerCase()
            || this.loginUserName.toLowerCase() == ("MCherum3").toLowerCase()
        ) {
            this._shoEventsschedule = true;
            this._shoToWesam = true;
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
            this.loginUserName.toLowerCase() == "owertheim" ||
            this.loginUserName.toLowerCase() == "adahabre"
        ) {
            this._onnline = true;
        }
        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "owertheim" ||
            this.loginUserName.toLowerCase() == "adahabre" ||
            this.loginUserName.toLowerCase() == "sabuhanna" ||
            this.loginUserName.toLowerCase() == ("rsharlin").toLowerCase() || //רJKH13579-
            this.loginUserName.toLowerCase() == "oivry" ||
            this.loginUserName.toLowerCase() == "dbzuk" ||
            this.loginUserName.toLowerCase() == ("HDEMERI").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("hkatsh").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("laloni").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("llaybovich").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("RREVIVO").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("RHalfon").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("SAmos").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("lshimov").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("nmizrahi").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("MKatan").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("seliasaf").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("amild").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("acoplev").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("ashafik").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("jkhatib2").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("jkailikian").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("ddahamshi").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("dshogan").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("wtaha").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("hakhalil").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("ycohen4").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("mshakh").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("mabutayeh").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("ntimsit").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("ntischenko").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("szubi").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("akhoury").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("pvainner").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("cabuhani").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("rnazazleh").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("romalouf").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("rgotliv").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("rbenmayor").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("rbaavad").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("skatan").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("sshakeeb").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("sthawkho").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("Obergstein").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("OAvenaem").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("LAbutbul").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("Nsuheil").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("EFarber").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("Iatiya").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("jkailikian").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("djosef").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("DNoked").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("LShavit").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("muhbadarne").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("ntimsit").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("nsaleh").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("NAharon").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("ACohen").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("Enyefet").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("PVainner").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("SKatan").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("TAmiram").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("tkharanbah").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("EGrifat").toLowerCase() ||
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "lfisher" ||
            this.loginUserName.toLowerCase() == "salmalem" ||
            this.loginUserName.toLowerCase() == "skarasenti" ||
            this.loginUserName.toLowerCase() == "yhameiry" ||
            this.loginUserName.toLowerCase() == "saamar" ||
            this.loginUserName.toLowerCase() == "mshema" ||
            this.loginUserName.toLowerCase() == "malkobi" ||
            this.loginUserName.toLowerCase() == "owertheim"
        ) {
            this._shoScanners = true;
        }
        if (
            this.loginUserName.toLowerCase() == "adahabre" ||
            this.loginUserName.toLowerCase() == "jubartal"
        ) {
            this._nursesSystemManage = true;
        }
        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == ("HROSHROSH").toLowerCase() ||
            this.loginUserName.toLowerCase() == "owertheim"
        ) {
            this._SHowToAdmins = true;
        }
        if (
            this.loginUserName.toLowerCase() == "owertheim" ||
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "gmagril" ||
            this.loginUserName.toLowerCase() == "arozenwalt" ||
            this.loginUserName.toLowerCase() == "adahabre"
        ) {
            this._galitReport = true;
        }
        if (
            this.loginUserName.toLowerCase() == "owertheim" ||
            this.loginUserName.toLowerCase() == "dporat" ||
            this.loginUserName.toLowerCase() == "dfogel" ||
            this.loginUserName.toLowerCase() == "iditur" ||
            this.loginUserName.toLowerCase() == "ashoshany" ||
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "adahabre"
        ) {
            this.employeesManagePermission = true;
        }
        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "adahabre" ||
            this.loginUserName.toLowerCase() == "sabuhanna" ||
            this.loginUserName.toLowerCase() == "owertheim"
        ) {
            this._OnlineAppointments = true;
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
            this.loginUserName.toLowerCase() == "smatta" ||
            this.loginUserName.toLowerCase() == "rogolan" ||
            this.loginUserName.toLowerCase() == "hnlgbats" ||
            this.loginUserName.toLowerCase() == "arozenwalt" ||
            this.loginUserName.toLowerCase() == "gmagril" ||
            this.loginUserName.toLowerCase() == "emansour" ||
            this.loginUserName.toLowerCase() == "hseffada"
        ) {
            this._formsArea = true;
        }

        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "owertheim" ||
            this.loginUserName.toLowerCase() == ("skewan").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("HMizrahi").toLowerCase() ||
            this.loginUserName.toLowerCase() == "raharon" ||
            this.loginUserName.toLowerCase() == ("MTsaban").toLowerCase()
        ) {
            this._shomaternity = true;
        }
        if (
            this.loginUserName.toLowerCase() == "jmassalha" ||
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "mlehrer" ||
            this.loginUserName.toLowerCase() == "owertheim"
        ) {
            this._EmSurgiries = true;
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
            || this.loginUserName.toLowerCase() == ("x_dshaull").toLowerCase()
            || this.loginUserName.toLowerCase() == ("IDitur").toLowerCase()
            || this.loginUserName.toLowerCase() == ("RYousef").toLowerCase()
            || this.loginUserName.toLowerCase() == ("DGolani").toLowerCase()
            || this.loginUserName.toLowerCase() == ("NSela").toLowerCase()
            || this.loginUserName.toLowerCase() == ("MRuach").toLowerCase()
            || this.loginUserName.toLowerCase() == ("MTsaban").toLowerCase()
            || this.loginUserName.toLowerCase() == ("VZamir").toLowerCase()
            || this.loginUserName.toLowerCase() == ("MAtias").toLowerCase()
            || this.loginUserName.toLowerCase() == ("SSabach").toLowerCase()
            || this.loginUserName.toLowerCase() == ("SBADER").toLowerCase()
            || this.loginUserName.toLowerCase() == ("ZLevi").toLowerCase()
            || this.loginUserName.toLowerCase() == ("KYedidia").toLowerCase()
            || this.loginUserName.toLowerCase() == ("OGolovkin").toLowerCase()
            || this.loginUserName.toLowerCase() == ("yhalif").toLowerCase()
            || this.loginUserName.toLowerCase() == ("GJidovetsk").toLowerCase()
            || this.loginUserName.toLowerCase() == ("ZAvraham").toLowerCase()
            || this.loginUserName.toLowerCase() == ("MMadmon").toLowerCase()
            || this.loginUserName.toLowerCase() == ("jubartal").toLowerCase()
            || this.loginUserName.toLowerCase() == ("BMonastirsky").toLowerCase()
            || this.loginUserName.toLowerCase() == ("EMansour").toLowerCase()
            || this.loginUserName.toLowerCase() == ("HSeffada").toLowerCase()
            || this.loginUserName.toLowerCase() == ("dvainshtei").toLowerCase()
            || this.loginUserName.toLowerCase() == ("NAli").toLowerCase()
            || this.loginUserName.toLowerCase() == ("kMandel").toLowerCase()
            || this.loginUserName.toLowerCase() == ("NCaspi").toLowerCase()
            || this.loginUserName.toLowerCase() == ("TLivnat").toLowerCase()
            || this.loginUserName.toLowerCase() == ("OHaccoun").toLowerCase()
            || this.loginUserName.toLowerCase() == ("WAraidy").toLowerCase()
            || this.loginUserName.toLowerCase() == ("KLibai").toLowerCase()
            || this.loginUserName.toLowerCase() == ("IAharon").toLowerCase()
            || this.loginUserName.toLowerCase() == ("MJourno").toLowerCase()
            || this.loginUserName.toLowerCase() == ("MCherum").toLowerCase()
            || this.loginUserName.toLowerCase() == ("MCherum1").toLowerCase()
            || this.loginUserName.toLowerCase() == ("MCherum2").toLowerCase()
            || this.loginUserName.toLowerCase() == ("MCherum3").toLowerCase()
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
            this.loginUserName.toLowerCase() == "relmalem" ||
            this.loginUserName.toLowerCase() == ("HROSHROSH").toLowerCase() ||
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
            this.loginUserName.toLowerCase() == "samer" ||
            this.loginUserName.toLowerCase() == "owertheim" ||
            this.loginUserName.toLowerCase() == "adahabre" ||
            this.loginUserName.toLowerCase() == "sabuhanna" ||
            this.loginUserName.toLowerCase() == ("rsharlin").toLowerCase() || //רJKH13579-
            this.loginUserName.toLowerCase() == "oivry" ||
            this.loginUserName.toLowerCase() == "dbzuk" ||
            this.loginUserName.toLowerCase() == ("HDEMERI").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("hkatsh").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("laloni").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("llaybovich").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("RREVIVO").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("RHalfon").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("SAmos").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("lshimov").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("nmizrahi").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("MKatan").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("seliasaf").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("amild").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("acoplev").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("ashafik").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("jkhatib2").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("jkailikian").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("ddahamshi").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("dshogan").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("wtaha").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("hakhalil").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("ycohen4").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("mshakh").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("mabutayeh").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("ntimsit").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("ntischenko").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("szubi").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("akhoury").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("pvainner").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("cabuhani").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("rnazazleh").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("romalouf").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("rgotliv").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("rbenmayor").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("rbaavad").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("skatan").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("sshakeeb").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("sthawkho").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("Obergstein").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("OAvenaem").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("LAbutbul").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("Nsuheil").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("EFarber").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("Iatiya").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("jkailikian").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("djosef").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("DNoked").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("LShavit").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("muhbadarne").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("ntimsit").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("nsaleh").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("NAharon").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("ACohen").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("Enyefet").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("PVainner").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("SKatan").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("TAmiram").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("tkharanbah").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("laloni").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("EGrifat").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("Obenkalifa").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("oivry").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("CSimsolo").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("SYehuda").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("RBarKochva").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("FSabbah").toLowerCase() 
        ) {
            this._OrdersToAppointmentsComponent = true;
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
            this.loginUserName.toLowerCase() == "gabdo" ||
            this.loginUserName.toLowerCase() == "massadi" ||
            this.loginUserName.toLowerCase() == "ssarusi" ||
            this.loginUserName.toLowerCase() == "gmoldavsky" ||
            this.loginUserName.toLowerCase() == "ekellerman" ||
            this.loginUserName.toLowerCase() == "egrifat" ||
            this.loginUserName.toLowerCase() == "rhalfon" ||
            this.loginUserName.toLowerCase() == "relmalem" ||
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
            this.loginUserName.toLowerCase() == ("mshugan").toLowerCase() ||
            this.loginUserName.toLowerCase() == ("SZidan").toLowerCase() ||
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
            this.loginUserName.toLowerCase() == "iatlas" ||
            this.loginUserName.toLowerCase() == "bouganim" ||
            this.loginUserName.toLowerCase() == "tbouganim" ||
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
            this.loginUserName.toLowerCase() == "rtbol" ||
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
            this.loginUserName.toLowerCase() == "relmalem" ||
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
        this.VisitorsSystemPermission();
        this.fastCovidTestSystemPermission();
        this.CardiologyPermission();
        // this.EmployeesManagePermission();
    }
    startService(){
        this.service.start()
      }
    
      stopService(){
        this.service.stop()
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
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/ClinicsUserPersmission", {
                _userName: userName
            })
            .subscribe((Response) => {
                this.clinicsUserPermission = Response["d"];
            });
    }
    
    EmployeesManagePermission() {
        this.http
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/EmployeesManagePermission", {
                _userName: this.loginUserName
            })
            .subscribe((Response) => {
                this._employeesManage = Response["d"];
            });
    }

    CardiologyPermission() {
        let userName = localStorage.getItem("loginUserName").toLowerCase();
        this.http
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/CardiologyPermissions", {
                _userName: userName
            })
            .subscribe((Response) => {
                this.cardiologyPermission = Response["d"];
            });
    }

    VisitorsSystemPermission() {
        let userName = localStorage.getItem("loginUserName").toLowerCase();
        this.http
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/VisitorsUserPersmission", {
                _userName: userName
            })
            .subscribe((Response) => {
                this.visitorsUserPermission = Response["d"];
            });
    }

    fastCovidTestSystemPermission() {
        let userName = localStorage.getItem("loginUserName").toLowerCase();
        this.http
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/FastCovidTestSystemPermission", {
                _userName: userName
            })
            .subscribe((Response) => {
                this.fastCovidTestPermission = Response["d"];
            });
    }

    ifPersonRead() {
        let userName = localStorage.getItem("loginUserName").toLowerCase();
        this.http
            .post("http://srv-apps-prod/RCF_WS/WebService.asmx/IfUserRead", {
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
