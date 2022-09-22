import {
    Component,
    OnInit,
    ViewChild,
    AfterViewInit,
    Input,
    ElementRef,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatRadioChange } from "@angular/material/radio";
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";

import {
    NgbModal,
    ModalDismissReasons,
    NgbModalOptions,
    NgbActiveModal,
} from "@ng-bootstrap/ng-bootstrap";
import * as $ from "jquery";
import * as Fun from "../public.functions";
import { formatDate, Time } from "@angular/common";
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
} from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
export interface PersonalDetails {
  PatientID: string;
  UserName: string;
  UserFullName: string;
  CellNumber: string;
}
@Component({
    selector: "app-stikers",
    templateUrl: "./stikers.component.html",
    styleUrls: ["./stikers.component.css"],
})
export class StikersComponent implements OnInit {
    constructor(
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private modalServiceresearchespatients: NgbModal,
        private formBuilder: FormBuilder,
        activeModal: NgbActiveModal,
        private _Activatedroute: ActivatedRoute
    ) {}
    casenumber = "";
    ngOnInit(): void {
        this._Activatedroute.queryParams.subscribe((params) => {
            console.log(params);
            if (params["casenumber"]) {
                this.casenumber = params["casenumber"];
                document.getElementById("rolesDetailsBtn").click();
                this.GetPersonalDetails(this.casenumber);
            }
        });
    }
    GetPersonalDetails(casenumber) {
      
      //event.target.value
      this.http
          .post(
              "http://localhost:64964/WebService.asmx/GetPersonalDetailsFromDB",
              //"http://srv-ipracticom:8080/WebService.asmx/GetPersonalDetails",
              {
                  CaseNumber: casenumber,
              }
          )
          .subscribe((Response) => {
              var json = Response["d"];              
          });
  }
}
