import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ViewChild,
    AfterViewInit,
    Input,
    TemplateRef,
} from "@angular/core";
import { DatePipe } from '@angular/common';
import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours,
} from "date-fns";
import { CalendarEvent, CalendarView } from "angular-calendar";

import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatRadioChange } from "@angular/material/radio";
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import { formatDate } from "@angular/common";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";

import {
    NgbModal,
    ModalDismissReasons,
    NgbModalOptions,
    NgbActiveModal,
} from "@ng-bootstrap/ng-bootstrap";
import * as $ from "jquery";
import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
} from "@angular/forms";

export interface EventDay {
    Depart: string;
    AppointmentDate: string;
    Total: number;
}
export interface EventDepartDay {
  RowId: string;
  ServiceNumber: string;
  ServiceDescription: string;
  Depart: string;
  AppointmentDate: string;
  AppointmentTime: string;
  Duration: string;
  PatientNumber: string;
  PatientId: string;
  PatientFirstName: string;
  PatientLastName: string;
  UniqueServiceNumber: string;
  Total: string;
}
@Component({
    selector: "app-online-appointments",
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./online-appointments.component.html",
    styleUrls: ["./online-appointments.component.css"],
})
export class OnlineAppointmentsComponent implements OnInit {
    @ViewChild("modalContent", { static: true }) modalContent: TemplateRef<any>;
    view: CalendarView = CalendarView.Month;
    TABLE_DATA: EventDepartDay[] = [];
    dataSource = new MatTableDataSource<EventDepartDay>(this.TABLE_DATA);    
    resultsLength = 0;
    displayedColumns: string[] = [
      "ServiceDescription",
      "AppointmentTime",
      "PatientNumber",
      "PatientId",
      "PatientFirstName",
      "PatientLastName",
     // "CLICK_sendtosafe",
  ];
    EventsDay = [] as EventDay[];
    viewDate: Date = new Date();
    EventDerpatDay = {} as EventDepartDay;
    EventsDerpatDay = [] as EventDepartDay[];
    activeDayIsOpen: boolean = false;
    events: CalendarEvent[] = [];
    departEvents: CalendarEvent[] = [];
    locale: string = "he";
    modalData: {
        action: string;
        events: EventDepartDay[];
        dataSource: any
    };
    constructor(
        private modal: NgbModal,
        private _snackBar: MatSnackBar,
        private router: Router,
        private http: HttpClient,
        private datePipe: DatePipe
    ) {}

    ngOnInit(): void {
        this.getEvents();
    }
    getEvents() {
        $("#loader").removeClass("d-none");
        this.http
            .post(
                "http://srv-apps-prod/RCF_WS/WebService.asmx/GetAllAppointments",
                {}
            )
            .subscribe((Response) => {
                this.EventsDay = Response["d"] as EventDay[];
                //debugger
                for (var i = 0; i < this.EventsDay.length; i++) {
                    let event = {
                        title:
                            this.EventsDay[i].Depart +
                            " (" +
                            this.EventsDay[i].Total +
                            ") ",
                        start: new Date(
                            Date.parse(this.EventsDay[i].AppointmentDate)
                        ),
                        cssClass: "my-custom-class",
                        depart: this.EventsDay[i].Depart,
                    };
                    //debugger
                    this.events.push(event);
                }
                $("#loader").addClass("d-none");
            });
    }
    dayClicked({
        date,
        events,
    }: {
        date: Date;
        events: CalendarEvent[];
    }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) &&
                    this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
            }
            this.viewDate = date;
        }
    }
    handleEvent(action: string, event: CalendarEvent): void {
      $("#loader").removeClass("d-none");
     // debugger
      this.http
          .post(
              "http://srv-apps-prod/RCF_WS/WebService.asmx/GetAllDepartAppointmentsByDay",
              {
                depart: event['depart'],
                date: this.datePipe.transform(event['start'],"yyyy-MM-dd"),
              }
          )
          .subscribe((Response) => {
              this.EventsDerpatDay = Response["d"] as EventDepartDay[];
              this.TABLE_DATA = [];
              this.TABLE_DATA = this.EventsDerpatDay
              this.dataSource = new MatTableDataSource<EventDepartDay>(this.TABLE_DATA); ;
              this.modalData = { 
                  action: "זימונים ל- "+ event['depart'] + ", לתאריך "+ this.datePipe.transform(event['start'],"yyyy-MM-dd"),
                  events: this.EventsDerpatDay,
                  dataSource: this.EventsDerpatDay,
              };
              this.modal.open(this.modalContent, { size: "lg" });
              $("#loader").addClass("d-none");
          });
        
    }
}
