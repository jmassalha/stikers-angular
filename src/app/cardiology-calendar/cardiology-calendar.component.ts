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
import { Observable, Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
  NgbActiveModal,
} from "@ng-bootstrap/ng-bootstrap";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { AddupdateactionComponent } from '../cardiology-calendar/addupdateaction/addupdateaction.component';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { registerLocaleData } from '@angular/common';
import localeHe from '@angular/common/locales/he';
import { MenuPerm } from '../menu-perm';
import { Router } from '@angular/router';

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
  selector: 'app-cardiology-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cardiology-calendar.component.html',
  styleUrls: ['./cardiology-calendar.component.css']
})
export class CardiologyCalendarComponent implements OnInit {

  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  actionCtrl = new FormControl();
  filteredActions: Observable<string[]>;
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
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,    
    private router: Router,
    private mMenuPerm: MenuPerm
) {
    mMenuPerm.setRoutName("cardiologycalendar");
    setTimeout(() => {
        if(!mMenuPerm.getHasPerm()){
            localStorage.clear();
            this.router.navigate(["login"]);
        }
    }, 2000); }

  ngOnInit(): void {
    if (this.UserName != null) {
      this.patientSearch = new FormGroup({
        'searchWord': new FormControl('', null),
        'passportSearch': new FormControl('', null),
        'fromDate': new FormControl('', null),
        'untilDate': new FormControl('', null),
      });
      let month = this.datePipe.transform(this.viewDate, 'MM');
      this.getPatientsQueues(month);
      this.getactionsList();
      this.filteredActions = this.actionCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => fruit ? this._filter(fruit) : this._actionsList.slice()));
    }
  }

  add(event: MatChipInputEvent, inputName, personQueue): void {
    const value = (event.value || '').trim();

    if (value) {
      personQueue.patientAction.PatientAction.push({
        Row_ID: '',
        ActionDesc: value,
        Status: 'True'
      });
    }

    // event.chipInput!.clear();
    inputName.value = "";

    this.actionCtrl.setValue(null);
  }

  remove(fruit: string, event): void {
    const index = event.patientAction.PatientAction.indexOf(fruit);
    event.patientAction.PatientAction[index].Status = 'False';

    // if (index >= 0) {
    //   event.patientAction.PatientAction.splice(index, 1);
    // }
  }

  selected(event: MatAutocompleteSelectedEvent, actionInput, personQueue): void {
    personQueue.patientAction.PatientAction.push({
      Row_ID: '',
      ActionDesc: event.option.viewValue,
      Status: 'True'
    });
    actionInput.value = '';
    this.actionCtrl.setValue(null);
  }

  private _filter(value: string): Action[] {
    const filterValue = value.toLowerCase();

    return this._actionsList.filter(action => action.ActionDesc.toLowerCase().includes(filterValue));
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
    this.modal.open(this.modalContent, { size: 'md'});
  }

  SetNewTime(event2, event) {
    event.patientAction.ArrivalTime = event2.srcElement.defaultValue.split('T')[1];
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
    this.getPatientsQueues(month);
    this.activeDayIsOpen = false;
  }

  saveDayEvents(day) {

    $("#loader").removeClass("d-none");
    let that = this;
    let month = this.datePipe.transform(this.viewDate, 'MM');
    setTimeout(function () {
      let thisDate = that.datePipe.transform(day, 'yyyy-MM-dd');
      let thisDateEvents = that.events.filter(t => t.patientAction.ArrivalDate === thisDate);
      that.http
        .post("http://srv-apps-prod/RCF_WS/WebService.asmx/SubmitUpdateCardiologyPatientQueue", {
          _queueDetails: thisDateEvents
        })
        .subscribe((Response) => {
          if (Response["d"]) {
            that.modal.dismissAll();
            that.openSnackBar("נשמר בהצלחה");
          } else {
            that.openSnackBar("משהו השתבש, לא נשמר");
          }
          $("#loader").addClass("d-none");
          that.getPatientsQueues(month);
        });
    }, 1000)

  }

  getPatientsQueues(month) {
    this.events = [];
    let fromDate = this.datePipe.transform(this.patientSearch.controls['fromDate'].value, 'yyyy-MM-dd');
    let untilDate = this.datePipe.transform(this.patientSearch.controls['untilDate'].value, 'yyyy-MM-dd');
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetPatientsQueues", {
        _searchWord: this.patientSearch.controls['searchWord'].value,
        _passportSearch: this.patientSearch.controls['passportSearch'].value,
        _fromDate: fromDate,
        _untilDate: untilDate,
        _month: month
      })
      .subscribe((Response) => {
        let tempArr = [];
        tempArr = Response["d"];
        tempArr.forEach(element => {
          element.draggable = true,
            // element.actions = this.actions,
            element.resizable = {
              beforeStart: true,
              afterEnd: true,
            },
            element.start = new Date(element.patientAction.ArrivalDate + " " + element.patientAction.ArrivalTime);
          this.events.push(element);
          this.refresh.next();
        });
        /* alert(this.date.getFullYear()+'/'+(this.date.getMonth()+1)+'/'+this.date.getDate());*/
      });
  }

  getactionsList() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetActionsList", {
      })
      .subscribe((Response) => {
        this._actionsList = Response["d"];
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
