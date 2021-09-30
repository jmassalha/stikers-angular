import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import {
  NgbModal,
  NgbActiveModal,
} from "@ng-bootstrap/ng-bootstrap";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ConfirmationDialogService } from "../../confirmation-dialog/confirmation-dialog.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from "@angular/material/table";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

export interface Actions {
  ActionValue: string;
}
export interface MidsOrders {
  MidsValue: string;
}

@Component({
  selector: 'app-addupdateaction',
  templateUrl: './addupdateaction.component.html',
  styleUrls: ['./addupdateaction.component.css']
})
export class AddupdateactionComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  isLinear = false;
  now = new Date();
  detailsFormGroup: FormGroup;
  actionForm: FormGroup;
  searchPatient: FormGroup;
  patientFound: boolean = false;
  searchPatientProgressBar: boolean = true;

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  constructor(private _snackBar: MatSnackBar,
    private router: Router,
    private http: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddupdateactionComponent>,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private confirmationDialogService: ConfirmationDialogService,
    activeModal: NgbActiveModal) { }

  actionID: string;
  QueueDetails: any;
  time: string;
  date: string;
  actionControl = new FormControl();
  actions: Actions[] = [
    {ActionValue: 'בדיקה 1'},
    {ActionValue: 'בדיקה 2'},
    {ActionValue: 'בדיקה 3'},
    {ActionValue: 'בדיקה 4'},
    {ActionValue: 'בדיקה 5'},
  ];
  filteredOptions: Observable<Actions[]>;
  midsControl = new FormControl();
  midsorders: MidsOrders[] = [
    {MidsValue: 'בדיקה 1'},
    {MidsValue: 'בדיקה 2'},
    {MidsValue: 'בדיקה 3'},
    {MidsValue: 'בדיקה 4'},
    {MidsValue: 'בדיקה 5'},
  ];
  filteredOptions2: Observable<MidsOrders[]>;
  UserName = localStorage.getItem("loginUserName").toLowerCase();

  ngOnInit(): void {
    this.detailsFormGroup = this.fb.group({
      FirstName: ['', null],
      LastName: ['', null],
      PersonID: ['', null],
      DOB: ['', null],
      Gender: ['', null],
      PhoneNumber: ['', null],
      Email: ['', null],
      Address: ['', null],
    });
    this.actionForm = this.fb.group({
      Row_ID: ['', null],
      PersonID: ['', null],
      PatientAction: ['', null],
      MidsOrder: ['', null],
      ArrivalDate: ['', null],
      ArrivalTime: ['', null],
    });
    this.searchPatient = this.fb.group({
      Passport: ['', null],
    });
    if(this.actionID == '1'){
      this.searchPatient.controls['Passport'].setValue(this.QueueDetails.PersonID);
      this.actionForm.controls['PersonID'].setValue(this.QueueDetails.PersonID);
      this.actionForm.controls['Row_ID'].setValue(this.QueueDetails.Row_ID);
      this.actionForm.controls['ArrivalDate'].setValue(this.QueueDetails.ArrivalDate);
      this.actionForm.controls['ArrivalTime'].setValue(this.QueueDetails.ArrivalTime);
      this.midsControl.setValue(this.QueueDetails.MidsOrder);
      this.actionControl.setValue(this.QueueDetails.PatientAction);
      this.getPatients();
    }
    this.filteredOptions = this.actionControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.filteredOptions2 = this.midsControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter2(value))
    );
  }

  setNow(){
    let now = new Date();
    let hours = ("0" + now.getHours()).slice(-2);
    let minutes = ("0" + now.getMinutes()).slice(-2);
    // let day = now.getDate();
    // let month = now.getMonth() + 1;
    // let year = now.getFullYear();
    let str = hours + ':' + minutes;
    // let str2 = day+'/'+month+'/'+year;
    this.time = str;
    // this.date = str2;
    this.actionForm.controls['ArrivalTime'].setValue(this.time);
    this.actionForm.controls['ArrivalDate'].setValue(now);
  }

  private _filter(value: string): Actions[] {
    const filterValue = value.toLowerCase();

    return this.actions.filter(option => option.ActionValue.toLowerCase().includes(filterValue));
  }
  private _filter2(value: string): MidsOrders[] {
    const filterValue = value.toLowerCase();

    return this.midsorders.filter(option => option.MidsValue.toLowerCase().includes(filterValue));
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  clearSearch() {
    this.searchPatient.controls['Passport'].setValue('');
    this.patientFound = false;
  }

  closeModal() {
    this.dialogRef.close();
  }

  getPatients() {
    let passport = this.searchPatient.controls['Passport'].value;
    this.searchPatientProgressBar = false;
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetCardiologyPatientDetails", {
        _passport: passport
      })
      .subscribe((Response) => {
        let mPersonalDetails = Response["d"];
        // if(mPersonalDetails.PersonID == null){
          this.detailsFormGroup = this.fb.group({
            Row_ID: new FormControl(mPersonalDetails.Row_ID, null),
            FirstName: new FormControl(mPersonalDetails.FirstName, null),
            LastName: new FormControl(mPersonalDetails.LastName, null),
            PersonID: new FormControl(mPersonalDetails.PersonID, null),
            DOB: new FormControl(mPersonalDetails.DOB, null),
            Gender: new FormControl(mPersonalDetails.Gender, null),
            PhoneNumber: new FormControl(mPersonalDetails.PhoneNumber, null),
            Email: new FormControl(mPersonalDetails.Email, null),
            Address: new FormControl(mPersonalDetails.Address, null),
          });
        // }else{
        //   this.detailsFormGroup = this.fb.group({
        //     Row_ID: new FormControl({value: mPersonalDetails.Row_ID,disabled: true}, null),
        //     FirstName: new FormControl({value: mPersonalDetails.FirstName,disabled: true}, null),
        //     LastName: new FormControl({value: mPersonalDetails.LastName,disabled: true}, null),
        //     PersonID: new FormControl({value: mPersonalDetails.PersonID,disabled: true}, null),
        //     DOB: new FormControl({value: mPersonalDetails.DOB,disabled: true}, null),
        //     Gender: new FormControl({value: mPersonalDetails.Gender,disabled: true}, null),
        //     PhoneNumber: new FormControl({value: mPersonalDetails.PhoneNumber,disabled: true}, null),
        //     Email: new FormControl({value: mPersonalDetails.Email,disabled: true}, null),
        //     Address: new FormControl({value: mPersonalDetails.Address,disabled: true}, null),
        //   });
        // }
        this.patientFound = true;
        this.searchPatientProgressBar = true;
      });
  }

  // onSubmit() {
  //   this.actionForm.controls['MidsOrder'].setValue(this.midsControl.value);
  //   this.actionForm.controls['PatientAction'].setValue(this.actionControl.value);
  //   this.actionForm.controls['PersonID'].setValue(this.searchPatient.controls['Passport'].value);
  //   this.actionForm.controls['ArrivalDate'].setValue(this.datePipe.transform(this.actionForm.controls['ArrivalDate'].value, 'yyyy-MM-dd'));
  //   let url = "";
  //   if(this.actionID == '1'){
  //     url = "http://srv-apps/wsrfc/WebService.asmx/UpdateCardiologyPatientQueue";
  //   }else{
  //     url = "http://srv-apps/wsrfc/WebService.asmx/SubmitCardiologyPatientQueue";
  //   }
  //   this.http
  //     .post(url, {
  //       _actionDetails: this.actionForm.value
  //     })
  //     .subscribe((Response) => {
  //       if(Response["d"]){
  //         this.dialogRef.close();
  //         this.openSnackBar("נשמר בהצלחה");
  //       }else{
  //         this.openSnackBar("משהו השתבש, לא נשמר");
  //       }
  //     });
  // }
  
  onNoClick(): void {
    this.dialogRef.close(this.detailsFormGroup.value);
  }
}
