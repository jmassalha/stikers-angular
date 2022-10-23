import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {
  MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import {
  MatDialog, MatDialogRef,
} from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { DatePipe } from "@angular/common";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { Observable } from "rxjs";
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-additional-cpr-tables',
  templateUrl: './additional-cpr-tables.component.html',
  styleUrls: ['./additional-cpr-tables.component.css']
})
export class AdditionalCprTablesComponent implements OnInit {

  constructor(
    public dialog: MatDialogRef<AdditionalCprTablesComponent>,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder
    ) {}

  SecondSection: any;
  firstTableArray: FormArray = this.formBuilder.array([]);
  thirdTableArray: FormArray = this.formBuilder.array([]);
  firstTablecolumns = Array(12).fill("שעה");
  secondTablecolumns = Array(7).fill("שעה");
  secondTableMeds = ['ADRENALINE', 'AMIODARONE', '', '', '', ''];
  statusDropDown = ['VF', 'PEA', 'ASYSTOLE', 'VT', 'BRADY ARITMIA'];
  rateHeadDropdown = ['יש', 'אין'];

  ngOnInit(): void {

    // for (let i = 0; i < 1; i++) {
    //   this.firstTableArray.push(this.formBuilder.group({
    //     subArray: this.subArrayTest(this.firstTablecolumns.length, 'actions')
    //   }));
    // }

    // for (let i = 0; i < 6; i++) {
    //   this.thirdTableArray.push(this.formBuilder.group({
    //     title: this.secondTableMeds[i],
    //     subArray: this.subArrayTest(this.secondTablecolumns.length, 'third')
    //   }));
    // }

    // this.SecondSection = this.formBuilder.group({
    //   firstTableArray: this.firstTableArray,
    //   thirdTableArray: this.thirdTableArray
    // });
  }

  // subArrayTest(number, tableName) {
  //   let t = this.formBuilder.array([]);
  //   let autoVal = '';
  //   if (tableName == 'forth') {
  //     autoVal = 'J 200'
  //   }
  //   if (number != 12) {
  //     for (let i = 0; i < number; i++) {
  //       t.push(this.formBuilder.group(
  //         {
  //           id: new FormControl(i, null),
  //           // title: new FormControl(this.secondTableMeds[place], null),
  //           textMed: new FormControl(autoVal, null),
  //           timeMed: new FormControl('', null)
  //         }
  //       ));
  //     }
  //   } else {
  //     for (let i = 0; i < number; i++) {
  //       t.push(this.formBuilder.group(
  //         {
  //           id: new FormControl(i, null),
  //           timeHead: new FormControl('', null),
  //           rateHead: new FormControl('', null),
  //           rateStatusHead: new FormControl('', null),
  //           etcoHead: new FormControl('', null)
  //         }
  //       ));
  //     }
  //   }
  //   return t;
  // }

  submit() {
    this.dialog.close(this.SecondSection);
  }

  closeModal() {
    this.dialog.close(this.SecondSection);
  }

}
