import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  ElementRef,
  ChangeDetectorRef,
  Inject
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
import { FormGroup } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeHe from '@angular/common/locales/he';
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
  specificRooms = [];
  filteredSpecificRooms = [];
  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;
  patientSearch: FormGroup;
  date = new Date();
  UserName = localStorage.getItem("loginUserName").toLowerCase();
  loader: boolean = true;
  surgerySurf: boolean = false;


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
      this.specificRooms = this.data.room.SurgeryRooms.filter(x => x.SurgeryRoom.includes(this.data.room.type));
      this.getPatientsQueues(this.viewDate);
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
    else {
      // event['SurgeryRooms'] = this.data.room.SurgeryRoom;
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
          if (res != "") this.getPatientsQueues(this.viewDate);
        })
      }
    }
  }

  showSummaryReport(room) {
    // let tempRoom = room;
    room['newSurgeries'] = room.Surgeries.filter(x => (x.SurgeryType != 'ססיה' && x.SurgeryType != 'דחוף'));
    let dialogRef = this.dialog.open(SummaryDialogComponent, {
      data: {
        room: room,
      },
      width: '60%',
      height: '60%'
    });
  }

  closeOpenDayViewDay() {
    this.getPatientsQueues(this.viewDate);
    // this.activeDayIsOpen = false;
  }

  filterDepartment(departmentName) {
    this.filteredSpecificRooms = this.deepClone(this.specificRooms);
    if (departmentName != "undo") {
      this.filteredSpecificRooms.forEach((element, index) => {
        if (element.Surgeries != undefined) {
          let shit = element.Surgeries.filter(x => departmentName == x.SurgeryRequestDepartments.S_DEPARTMENT);
          this.filteredSpecificRooms[index].Surgeries = this.deepClone(shit);
        }
      });
    }
  }

  // get the elements to the main calendar page
  getPatientsQueues(fullDate) {
    this.refresh = new Subject();
    this.loader = true;
    this.events = [];
    fullDate = this.datePipe.transform(this.viewDate, 'yyyy-MM-dd');
    this.http
      .post(environment.url + "GetSurgeriesBySurgeryRoomCode", {
        _fullDate: fullDate,
        _surRoomCode: this.data.room.CalendarRoomsArea
      })
      .subscribe((Response) => {
        let tempArr = Response["d"];
        let tempTitle;
        let tempArrOfSurgeryRooms = [];
        let colors = {
          Completed: '#0ef12f',
          InProgress: '#e8abf1',
          Planned: '#abeff1',
          Canceled: '#f10e0e'
        }
        // filter the surgery rooms in array
        this.specificRooms.forEach(x => {
          tempArrOfSurgeryRooms.push(x.SurgeryRoom);
        });

        tempArr['SurgeriesCalendarClassList'].forEach(element => {
          // set the title of the surgeries tabs in the dashboard
          if (element.SurgeryPatientDetails == null) {
            tempTitle = `<h6 class="text-center"><b>זמן הכנה משעה: </b>${element.ArrivalDate.split(' ')[1]}</h6>`;
          } else {
            tempTitle = `מחלקה: <b>${element.SurgeryRequestDepartments.S_DEPARTMENT}</b><br>
            שם: <b>${element.SurgeryPatientDetails.PM_FIRST_NAME} ${element.SurgeryPatientDetails.PM_LAST_NAME}</b><b> -- ${element.SurgeryPatientDetails.PM_CASE_NUMBER}</b> <br>
            סוג ניתוח: <b>${element.SurgeryType}</b><br>
            S:<b>${element.ArrivalDate.split(' ')[1]}</b> - E:<b>${element.EndDate.split(' ')[1]}</b>`;
          }
          // set start and end time for surgeries
          element.start = new Date(element.ArrivalDate);
          element.end = new Date(element.EndDate);
          element.title = tempTitle;
          element.color = {
            primary: '#000000', secondary: colors[element.SurgeryStatus]
          }
          // set uniqe color to sesia and dhof surgeries
          if (element.SurgeryType == 'ססיה') element.color = { primary: '#000000', secondary: '#FFA100' }
          if (element.SurgeryType == 'דחוף') element.color = { primary: '#000000', secondary: '#F1F305' }
          // element.resizable = {
          //   beforeStart: true,
          //   afterEnd: true,
          // }
          element.draggable = true;
          let index = tempArrOfSurgeryRooms.indexOf(element.SurgeryRoom);
          // when there's no room the index is -1, BUG!
          if (index >= 0) {
            // some of the surgeries isn't associated with a room!!
            // this.specificRooms[index]['Surgeries'] == undefined && 
            if (element.SurgeryRoom != "") {
              this.specificRooms[index]['Surgeries'] = tempArr['SurgeriesCalendarClassList'].filter(x => x.SurgeryRoom == element.SurgeryRoom);
              this.specificRooms[index] = this.checkSurfingSurgeryDays(this.specificRooms[index]);
            }
          }
          this.events.push(element);
        });
        // filter the surgery rooms in array
        this.specificRooms.forEach((x, index) => {
          let tempArrayOfDepartments = [];
          // fill the departments array for the menu button use
          if (x.Surgeries != undefined) {
            x.Surgeries.forEach(element => {
              // push only non existing departments -- unique
              if (!tempArrayOfDepartments.includes(element.SurgeryRequestDepartments.S_DEPARTMENT)) {
                tempArrayOfDepartments.push(element.SurgeryRequestDepartments.S_DEPARTMENT);
              }
            });
          }
          this.specificRooms[index]['uniqueDepartments'] = tempArrayOfDepartments;
        });
        this.filteredSpecificRooms = this.deepClone(this.specificRooms);
        this.refresh.next();
        this.loader = false;
      });
  }

  checkSurfingSurgeryDays(room) {
    if (room.Surgeries != undefined) {
      let deptsNoSisia = room.Surgeries.filter(x => (x.SurgeryType != 'ססיה' && x.SurgeryType != 'דחוף'));
      let ArrivalTime = room.Surgeries[0].ArrivalTime;
      // let EndTime = room.Surgeries[room.Surgeries.length - 1].EndTime;
      let EndTimeNoSisia = deptsNoSisia[deptsNoSisia.length - 1].EndTime;
      let datefordiff = this.datePipe.transform(room.Surgeries[0].ArrivalDate, 'yyyy-MM-dd');
      let before = new Date(datefordiff + ' ' + ArrivalTime);
      let after = new Date(datefordiff + ' ' + EndTimeNoSisia);
      let diff = Math.abs(after.getTime() - before.getTime());//difference in time
      let hours = Math.floor((diff % 86400000) / 3600000);//hours
      let minutes = Math.round(((diff % 86400000) % 3600000) / 60000);//minutes
      // the condition that determinds if the room is overtime or not.
      // if the end time of the last surgery - the start time of the first surgery above 8 hours.
      // if the last surgery is after 3 Oclock.
      let totalTime = parseFloat(hours + '.' + minutes);
      // set it to false as initial 
      room['surgerySurf'] = false;
      // if (totalTime < 1) totalTime = totalTime / 0.6;
      if (EndTimeNoSisia > '15:00') {
        room['surgerySurf'] = true;
      }
      return room;
    }
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

  deepClone(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }

    const cloneObj = Array.isArray(obj) ? [] : {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloneObj[key] = this.deepClone(obj[key]);
      }
    }

    return cloneObj;
  }


}
@Component({
  selector: 'app-summary-dialog',
  templateUrl: 'summary-dialog.html',
  styles: ['surgeries-management.component.css']
})
export class SummaryDialogComponent implements OnInit {

  totalSurgeriesDuration: number = 0;

  constructor(
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<SummaryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public surdata: any
  ) { }


  ngOnInit(): void {
    // this.surdata.room.Surgeries = this.surdata.room.Surgeries.filter(x => (x.SurgeryType != 'ססיה' && x.SurgeryType != 'דחוף'));
    if (this.surdata.room.newSurgeries != undefined) this.differenceInTimes();
  }

  differenceInTimes() {
    this.surdata.room.newSurgeries.forEach(element => {
      let datefordiff = this.datePipe.transform(element.ArrivalDate, 'yyyy-MM-dd');
      let before = new Date(datefordiff + ' ' + element.ArrivalTime);
      let after = new Date(datefordiff + ' ' + element.EndTime);
      let diff = Math.abs(after.getTime() - before.getTime());//difference in time
      let hours = Math.floor((diff % 86400000) / 3600000);//hours
      let minutes = Math.round(((diff % 86400000) % 3600000) / 60000);//minutes
      element['duration'] = hours + '.' + minutes;
      // if (hours == 0) element['duration'] = parseFloat(element['duration']) / 0.6;
      this.totalSurgeriesDuration += parseFloat(element['duration']);
    });
    // this.totalSurgeriesDuration += ((this.surdata.room.Surgeries.length * 0.2)/0.6);
  }
  // differenceInTimes() {
  //   var totalMin = 0;
  //   var totalHouers = 0;
  //   this.surdata.room.newSurgeries.forEach(element => {
  //     let datefordiff = this.datePipe.transform(element.ArrivalDate, 'yyyy-MM-dd');
  //     let before = new Date(datefordiff + ' ' + element.ArrivalTime);
  //     let after = new Date(datefordiff + ' ' + element.EndTime);
  //     let diff = Math.abs(after.getTime() - before.getTime());//difference in time
  //     let hours = Math.floor((diff % 86400000) / 3600000);//hours
  //     let minutes = Math.round(((diff % 86400000) % 3600000) / 60000);//minutes
  //     if(minutes < 10) {element['duration'] = hours + ':0' + minutes;}else{
  //       element['duration'] = hours + ':' + minutes;
  //     }
  //     totalMin +=minutes 
  //     totalHouers +=hours
  //     //if (hours == 0) element['duration'] = parseFloat(element['duration']) / 0.6;

  //   });
  //   var totalTime = (totalHouers + Math.floor(totalMin/60)) ;
  //   this.totalSurgeriesDuration = totalTime + ':' +(totalMin%60);
  //   // this.totalSurgeriesDuration += ((this.surdata.room.Surgeries.length * 0.2)/0.6);
  // }

}