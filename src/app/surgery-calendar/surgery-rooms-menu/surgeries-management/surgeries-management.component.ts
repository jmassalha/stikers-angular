import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  ElementRef,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';
import {
  endOfDay,
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
import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeHe from '@angular/common/locales/he';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ManageSingleSurgeryComponent } from './manage-single-surgery/manage-single-surgery.component';


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
  selector: 'app-surgeries-management',
  templateUrl: './surgeries-management.component.html',
  styleUrls: ['./surgeries-management.component.css']
})
export class SurgeriesManagementComponent {

  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('actionInput') public actionInput: ElementRef;
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date;
  locale: string = 'en';
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
  activeDayIsOpen: boolean = true;
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
    public dialogRef: MatDialogRef<SurgeriesManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit(): void {
    if (this.UserName != null) {
      this.viewDate = this.data.room.start;
      // let day = this.datePipe.transform(this.viewDate, 'dd');
      this.getPatientsQueues(this.viewDate, this.data.room.title, this.data.room.type);
    }
    this.setView(CalendarView.Day);
  }

  setView(view: CalendarView) {
    this.view = view;
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
  }

  handleEvent(action: string, event: CalendarEvent): void {
    if (event == undefined) event = this.data.room;
    event['SurgeryRooms'] = this.data.room.SurgeryRoom;
    event['RoomsList'] = this.data.roomsList;
    if (event['ArrivalTime'] != null) {
      let dialogRef = this.dialog.open(ManageSingleSurgeryComponent, {
        data: {
          event: event,
          action: action
        },
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res != "") this.getPatientsQueues(this.viewDate, this.data.room.title, this.data.room.type);
      })
    }
  }


  closeOpenDayViewDay() {
    this.getPatientsQueues(this.viewDate, this.data.room.title, this.data.room.type);
    // this.activeDayIsOpen = false;
  }

  saveDayEvents(day) {

    $("#loader").removeClass("d-none");
    let that = this;
    let month = this.datePipe.transform(this.viewDate, 'MM');
    setTimeout(function () {
      let thisDate = that.datePipe.transform(day, 'yyyy-MM-dd');
      let thisDateEvents = that.events.filter(t => that.datePipe.transform(t.patientAction.ArrivalDate, 'yyyy-MM-dd') === thisDate);
      that.http
        .post(environment.url + "SubmitUpdateCardiologyPatientQueue", {
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
          that.getPatientsQueues(this.viewDate, this.data.room.title, this.data.room.type);
        });
    }, 1000)

  }

  // get the elements to the main calendar page
  getPatientsQueues(fullDate, surgeryRoom, surgeryRoomType) {
    this.events = [];
    fullDate = this.datePipe.transform(this.viewDate, 'yyyy-MM-dd');
    this.http
      .post(environment.url + "GetSurgeriesBySurgeryRoomCode", {
        _fullDate: fullDate,
        _surRoomCode: surgeryRoom,
        _surRoomType: surgeryRoomType,
      })
      .subscribe((Response) => {
        let tempArr = [];
        tempArr = Response["d"];
        let tempTitle;
        tempArr['SurgeriesCalendarClassList'].forEach(element => {
          if (element.SurgeryPatientDetails == null) {
            tempTitle = `<h6 class="text-center"><b>זמן הכנה משעה: </b>${element.ArrivalDate.split(' ')[1]}</h6>`;
          } else {
            tempTitle = `מספר מקרה: <b>${element.SurgeryPatientDetails.PM_CASE_NUMBER}</b> - שם: <b>${element.SurgeryPatientDetails.PM_FIRST_NAME} ${element.SurgeryPatientDetails.PM_LAST_NAME}</b> - מחלקה מזמינה: 
          <b>${element.SurgeryRequestDepartments.S_DEPARTMENT}</b> <br> ניתוח: <b>${element.SurgeryServicesName.S_SERVICE_VAL}</b> 
          - שעת תחילה: <b>${element.ArrivalDate.split(' ')[1]}</b> - שעת סיום: <b>${element.EndDate.split(' ')[1]}</b>`;
          }
          element.start = new Date(element.ArrivalDate);
          element.end = new Date(element.EndDate);
          element.title = tempTitle;
          // element.resizable = {
          //   beforeStart: true,
          //   afterEnd: true,
          // }
          element.draggable = true;
          this.events.push(element);
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
