import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
} from '@angular/core';
import {
  startOfDay,
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { DatePipe, formatDate } from '@angular/common';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { AddupdateactionComponent } from '../cardiology-calendar/addupdateaction/addupdateaction.component';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

const colors: any = {
  red: '#ad2121',
  blue: '#1e90ff',
  yellow: '#e3bc08',
};

@Component({
  selector: 'app-cardiology-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cardiology-calendar.component.html',
  styleUrls: ['./cardiology-calendar.component.css']
})
export class CardiologyCalendarComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.confirmationDialogService
          .confirm("נא לאשר..", "האם אתה בטוח ...? ")
          .then((confirmed) => {
            console.log("User confirmed:", confirmed);
            if (confirmed) {
              this.events = this.events.filter((iEvent) => iEvent !== event);
              // this.handleEvent('Deleted', event);
            } else {
            }
          })
          .catch(() =>
            console.log(
              "User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)"
            )
          );

      },
    },
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;
  patientSearch: FormGroup;

  constructor(private modal: NgbModal,
    public datePipe: DatePipe,
    private confirmationDialogService: ConfirmationDialogService,
    private http: HttpClient,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.patientSearch = new FormGroup({
      'searchWord': new FormControl('', null),
      'passportSearch': new FormControl('', null),
      'fromDate': new FormControl('', null),
      'untilDate': new FormControl('', null),
    });
    this.getPatientsQueues();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }, event): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true || events.length === 0)
      ) {
        this.activeDayIsOpen = false;
        this.handleEvent('NewEvent', event);
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
        };
      }
      return iEvent;
    });
    // this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'md' });
  }

  addEvent(event): void {
    const dialogRef = this.dialog.open(AddupdateactionComponent, {
      width: 'md'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        let date = this.datePipe.transform(event, 'yyyy-MM-dd');
        let time = this.datePipe.transform(event, 'hh:mm');
        let event2 = {
          title: result.FirstName + ' ' + result.LastName,
          patientAction: {
            Row_ID: '',
            PersonID: result.PersonID,
            PatientAction: '',
            MidsOrder: '',
            ArrivalDate: date,
            ArrivalTime: time
          },
          patientDetails: {
            FirstName: result.FirstName,
            LastName: result.LastName,
            PersonID: result.PersonID,
            DOB: result.DOB,
            Gender: result.Gender,
            PhoneNumber: result.PhoneNumber,
            Email: result.Email,
            Address: result.Address
          },
          start: startOfDay(event),
          color: colors.red,
          draggable: true,
          actions: this.actions,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
        };
        this.events = [
          ...this.events,
          event2
        ];
        this.modalData.event["day"]["events"].push(event2);
      }

    });


  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
    this.modalData.event["day"]["events"] = this.events;
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  saveDayEvents(day) {
    let thisDate = this.datePipe.transform(day, 'yyyy-MM-dd');
    let thisDateEvents = this.events.filter(t=>t.patientAction.ArrivalDate === thisDate);
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/SubmitUpdateCardiologyPatientQueue", {
        _queueDetails: thisDateEvents
      })
      .subscribe((Response) => {
        if (Response["d"]) {
          this.openSnackBar("נשמר בהצלחה");
        } else {
          this.openSnackBar("משהו השתבש, לא נשמר");
        }
      });
  }

  getPatientsQueues() {
    let fromDate = this.datePipe.transform(this.patientSearch.controls['fromDate'].value, 'yyyy-MM-dd');
    let untilDate = this.datePipe.transform(this.patientSearch.controls['untilDate'].value, 'yyyy-MM-dd');
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetPatientsQueues", {
        _searchWord: this.patientSearch.controls['searchWord'].value,
        _passportSearch: this.patientSearch.controls['passportSearch'].value,
        _fromDate: fromDate,
        _untilDate: untilDate,
      })
      .subscribe((Response) => {
        let tempArr = [];
        tempArr = Response["d"];
        tempArr.forEach(element => {
          element.draggable =  true,
          element.actions = this.actions,
          element.resizable = {
            beforeStart: true,
            afterEnd: true,
          },
          element.start = new Date(element.patientAction.ArrivalDate + " " +element.patientAction.ArrivalTime);
          this.events.push(element);
          this.refresh.next();
        }); 
      });
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

}
// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit, ViewChild } from '@angular/core';
// import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatTableDataSource } from '@angular/material/table';
// import { Router } from '@angular/router';
// import { MatDialog } from '@angular/material/dialog';
// import { DatePipe } from '@angular/common';
// import { AddupdateactionComponent } from '../cardiology-calendar/addupdateaction/addupdateaction.component';

// @Component({
//   selector: 'app-cardiology-calendar',
//   templateUrl: './cardiology-calendar.component.html',
//   styleUrls: ['./cardiology-calendar.component.css']
// })
// export class CardiologyCalendarComponent implements OnInit {

//   @ViewChild(MatPaginator) paginator: MatPaginator;

//   patientSearch: FormGroup;
//   displayedColumns: string[] = [
//     'passport', 'patientname', 'datetime', 'action', 'update'
//   ];
//   TABLE_DATA: any[] = [];
//   patientsQueuesArray = [];
//   dataSource = new MatTableDataSource(this.TABLE_DATA);

//   constructor(
//     private formBuilder: FormBuilder,
//     public dialog: MatDialog,
//     private router: Router,
//     private http: HttpClient,
//     public datepipe: DatePipe) { }

//   ngOnInit(): void {
//     this.patientSearch = new FormGroup({
//       'searchWord': new FormControl('', null),
//       'passportSearch': new FormControl('', null),
//       'fromDate': new FormControl('', null),
//       'untilDate': new FormControl('', null),
//     });
//     this.getPatientsQueues();
//   }

//   openToAddUpdateAction(id,element) {
//     let dialogRef = this.dialog.open(AddupdateactionComponent, { disableClose: true });
//     dialogRef.componentInstance.actionID = id;
//     dialogRef.componentInstance.QueueDetails = element;
//   }

//   getPatientsQueues(){
//     let fromDate = this.datepipe.transform(this.patientSearch.controls['fromDate'].value, 'yyyy-MM-dd');
//     let untilDate = this.datepipe.transform(this.patientSearch.controls['untilDate'].value, 'yyyy-MM-dd');
//     this.http
//       .post("http://srv-apps/wsrfc/WebService.asmx/GetPatientsQueues", {
//         _searchWord: this.patientSearch.controls['searchWord'].value,
//         _passportSearch: this.patientSearch.controls['passportSearch'].value,
//         _fromDate: fromDate,
//         _untilDate: untilDate,
//       })
//       .subscribe((Response) => {
//         this.patientsQueuesArray = Response["d"];
//         this.TABLE_DATA.push(this.patientsQueuesArray);
//         this.dataSource = new MatTableDataSource<any>(this.patientsQueuesArray);
//       this.dataSource.paginator = this.paginator;
//       });
//   }

// }
