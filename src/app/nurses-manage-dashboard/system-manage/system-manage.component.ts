import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfirmationDialogService } from 'src/app/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-system-manage',
  templateUrl: './system-manage.component.html',
  styleUrls: ['./system-manage.component.css']
})
export class SystemManageComponent implements OnInit {

  UserName = localStorage.getItem("loginUserName").toLowerCase();
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private confirmationDialogService: ConfirmationDialogService,) { }

  updateBedsGroup: FormGroup;
  departmentfilter = new FormControl();
  filteredOptions2: Observable<string[]>;
  department = [];

  ngOnInit(): void {

    this.updateBedsGroup = this.formBuilder.group({
      Row_ID: ['', null],
      Namer_ID: ['', null],
      Depart_Name: ['', null],
      Depts_For_Nurses_Dashboard: ['', null],
      number_of_beds: ['', null],
    });
    this.getDepartmentsToUpdateBeds();
    this.filteredOptions2 = this.departmentfilter.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter2(value))
      );
  }

  private _filter2(value: string): string[] {
    const filterValue2 = value;
    let depart: any = this.department.filter(t => t.Namer_ID === filterValue2);
    if (depart.length > 0) {
      this.updateBedsGroup.controls['number_of_beds'].setValue(depart[0].number_of_beds);
      this.updateBedsGroup.controls['Row_ID'].setValue(depart[0].Row_ID);
    }
    return this.department.filter(option => option.Depart_Name.includes(filterValue2));
  }


  getDepartmentsToUpdateBeds() {
    this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/GetDepartmentsToUpdateBeds", {
      })
      .subscribe((Response) => {
        let all_departs_filter = Response["d"];

        all_departs_filter.forEach(element => {
          this.department.push(element);
        })
      });
  }

  submitUpdateBeds() {
    let numberOfBeds = this.updateBedsGroup.controls['number_of_beds'].value;
    let Row_ID = this.updateBedsGroup.controls['Row_ID'].value;
    if(Row_ID != ""){
      this.http
      .post("http://srv-apps/wsrfc/WebService.asmx/SubmitUpdateBeds", {
        _row_ID: Row_ID,
        _numberOfBeds: numberOfBeds
      })
      .subscribe((Response) => {
        if(Response["d"]){
          this.openSnackBar("שינוי התבצע בהצלחה");
        }
        else{
          this.openSnackBar("משהו השתבש לא התבצע");
        }
      });
    }else{
      this.openSnackBar("נא לבחור מחלקה מהרשימה");
    }
    
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'X', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

}
