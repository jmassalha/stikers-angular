import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormArray } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialogRef } from "@angular/material/dialog";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-additional-cpr-tables',
  templateUrl: './additional-cpr-tables.component.html',
  styleUrls: ['./additional-cpr-tables.component.css']
})
export class AdditionalCprTablesComponent implements OnInit {

  constructor(
    public dialog: MatDialogRef<AdditionalCprTablesComponent>,
    private formBuilder: FormBuilder
  ) { }

  SecondSection: any;
  toSave: boolean;
  firstTableArray: FormArray = this.formBuilder.array([]);
  thirdTableArray: FormArray = this.formBuilder.array([]);
  firstTablecolumns = Array(12).fill("שעה");
  secondTablecolumns = Array(7).fill("שעה");
  secondTableMeds = ['ADRENALINE', 'AMIODARONE', '', '', '', ''];
  statusDropDown = ['VF', 'PEA', 'ASYSTOLE', 'VT', 'BRADY ARITMIA'];
  rateHeadDropdown = ['יש', 'אין'];
  _data = {
    form: 0,
    save: false
  }

  ngOnInit(): void {
    this._data = {
      form: this.SecondSection,
      save: this.toSave
    }
  }

  submit() {
    this._data.save = true;
    this.dialog.close(this._data);
  }

  closeModal() {
    this._data.save = false;
    this.dialog.close(this._data);
  }

}
