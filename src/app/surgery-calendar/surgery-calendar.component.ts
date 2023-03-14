import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import {
  startOfDay,
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import {
  NgbModal
} from "@ng-bootstrap/ng-bootstrap";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { AddupdateactionComponent } from '../cardiology-calendar/addupdateaction/addupdateaction.component';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeHe from '@angular/common/locales/he';
import { MenuPerm } from '../menu-perm';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SurgeryRoomsMenuComponent } from './surgery-rooms-menu/surgery-rooms-menu.component';


const colors: any = {
  red: '#ad2121',
  blue: '#1e90ff',
  yellow: '#e3bc08',
};
export interface Action {
  Row_ID: string,
  ActionDesc: string,
  selected: boolean
}
registerLocaleData(localeHe);

@Component({
  selector: 'app-surgery-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './surgery-calendar.component.html',
  styleUrls: ['./surgery-calendar.component.css']
})
export class SurgeryCalendarComponent implements OnInit {


  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('actionInput') public actionInput: ElementRef;
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();
  locale: string = 'he';
  _actionsList = [];
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
  activeDayIsOpen: boolean = false;
  patientSearch: FormGroup;
  date = new Date();
  UserName = localStorage.getItem("loginUserName").toLowerCase();

  constructor(
    private modal: NgbModal,
    public datePipe: DatePipe,
    private confirmationDialogService: ConfirmationDialogService,
    private http: HttpClient,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private mMenuPerm: MenuPerm,
  ) {
    mMenuPerm.setRoutName("surgery-calendar");
    setTimeout(() => {
      if (!mMenuPerm.getHasPerm()) {
        localStorage.clear();
        this.router.navigate(["login"]);
      }
    }, 2000);
  }

  ngOnInit(): void {
    if (this.UserName != null) {
      let month = this.datePipe.transform(this.viewDate, 'MM');
      this.getSurgeryRooms(month);
    }
  }


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }, event): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
        this.activeDayIsOpen = false;
        this.handleEvent('NewEvent', event);
      
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
    const dialogRef = this.dialog.open(SurgeryRoomsMenuComponent, {
      data: this.modalData
    })
    dialogRef.afterClosed().subscribe(result => {
      let month = this.datePipe.transform(this.viewDate, 'MM');
      this.getSurgeryRooms(month);
    });
    // this.modal.open(this.modalContent, { size: 'md' });
  }

  SetNewTime(event2, event) {
    event.patientAction.ArrivalTime = event2;//.srcElement.defaultValue.split('T')[1];
  }

  addEvent(event): void {
    const dialogRef = this.dialog.open(AddupdateactionComponent, {
      width: 'md'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        let date = this.datePipe.transform(event, 'yyyy-MM-dd');
        let time = this.datePipe.transform(event, 'HH:mm');
        let event2 = {
          title: result.FirstName + ' ' + result.LastName,
          patientAction: {
            Row_ID: '',
            PersonID: result.PersonID,
            PatientAction: [],
            MidsOrder: '',
            Notes: '',
            ArrivalDate: date,
            ArrivalTime: time,
            Status: 'True'
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
          // actions: this.actions,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
        };
        this.modalData.event["day"]["events"].push(event2);
        this.events = [
          ...this.events,
          event2
        ];
      }
      this.cdr.detectChanges();
    });
  }

  deleteEvent(eventToDelete: CalendarEvent, day) {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/DeleteEventInCalendarCardiology", {
        _rowID: eventToDelete.patientAction.Row_ID
      })
      .subscribe((Response) => {
        if (Response["d"]) {
          this.openSnackBar("נמחק בהצלחה");
        } else {
          this.openSnackBar("משהו השתבש, לא נמחק");
        }
        let thisDate = this.datePipe.transform(day, 'yyyy-MM-dd');
        let thisDateEvents = this.events.filter(t => this.datePipe.transform(t.patientAction.ArrivalDate, 'yyyy-MM-dd') === thisDate);
        this.events = this.events.filter((event) => event !== eventToDelete);
        thisDateEvents = thisDateEvents.filter((event) => event !== eventToDelete);
        this.modalData.event["day"]["events"] = thisDateEvents;
      });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    let month = this.datePipe.transform(this.viewDate, 'MM');
    this.getSurgeryRooms(month);
    this.activeDayIsOpen = false;
  }

  saveDayEvents(day) {

    $("#loader").removeClass("d-none");
    let that = this;
    let month = this.datePipe.transform(this.viewDate, 'MM');
    setTimeout(function () {
      let thisDate = that.datePipe.transform(day, 'yyyy-MM-dd');
      let thisDateEvents = that.events.filter(t => that.datePipe.transform(t.patientAction.ArrivalDate, 'yyyy-MM-dd') === thisDate);
      that.http
        .post("http://srv-apps-prod/RCF_WS/WebService.asmx/SubmitUpdateCardiologyPatientQueue", {
          _queueDetails: thisDateEvents
        })
        .subscribe((Response) => {
          if (Response["d"]) {
            that.modal.dismissAll();
            that.openSnackBar("נשמר בהצלחה");
            $("#loader").addClass("d-none");
          } else {
            that.openSnackBar("משהו השתבש, לא נשמר");
          }
          that.getSurgeryRooms(month);
        });
    }, 1000)

  }

  // get the elements to the main calendar page
  getSurgeryRooms(month) {
    this.events = [];
    this.http
      .post(environment.url + "GetSurgeryRooms", {
        _month: month,
        _year: this.date.getFullYear()
      })
      .subscribe((Response) => {
        let tempArr = [];
        tempArr = Response["d"];
        tempArr.forEach(element => {
          element.forEach(element2 => {
            // element2.draggable = true,
            // element.actions = this.actions,
            // element2.resizable = {
            //   beforeStart: true,
            //   afterEnd: true,
            // },
            element2.start = new Date(element2.ArrivalDate);
            element2.time = '00:00';
            element2.title = element2.RoomGroupDesc + " " + element2.SurgeryRoomDesc;
            element2.color = element2.Color;
            this.events.push(element2);
          });
        });
        this.refresh.next();
      });
  }

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }


  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

}