import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-whatsapp-messages-dashboard',
  templateUrl: './whatsapp-messages-dashboard.component.html',
  styleUrls: ['./whatsapp-messages-dashboard.component.css']
})
export class WhatsappMessagesDashboardComponent implements OnInit {

  displayedColumns: string[] = ['name', 'number', 'content'];
  dataSource = new MatTableDataSource([]);
  searchForm: FormGroup;
  customInputs: any[] = [];
  customForm: FormGroup;
  manyContacts: FormGroup;
  typeOfScreen: boolean;
  screenTitle = 'יחידים';

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      byPhone: new FormControl('', null),
      byName: new FormControl('', null),
      byType: new FormControl('', null)
    });
    this.customForm = this.fb.group({
      customInputs: this.fb.array([])
    });
    this.manyContacts = this.fb.group({
      ContactPhoneNumber: new FormControl('', null),
      ContactContent: new FormControl('', null)
    });
  }

  get customFormArray(): FormArray {
    return this.customForm.get('customInputs') as FormArray;
  }

  removecustomInput(index: number) {
    this.customFormArray.removeAt(index);
  }

  addInput() {
    const contact = new FormGroup({
      ContactType: new FormControl('0', Validators.required),
      ContactPhoneNumber: new FormControl('', Validators.required),
      ContactName: new FormControl('', null),
      ContactContent: new FormControl('', Validators.required),
    });
    (<FormArray>this.customForm.get('customInputs')).push(contact);
  }

  deleteRow(row: any, index: number) {
    if (index >= 0) {
      (this.customForm.get('customInputs') as FormArray).removeAt(index);
      this.cd.detectChanges();
    }
  }

  sendMessages() {
    if (!this.typeOfScreen) {
      console.log(this.customForm.value);
    } else {
      console.log(this.manyContacts.value);
    }
  }

  changeScreens() {
    this.typeOfScreen = !this.typeOfScreen;
    if (this.typeOfScreen) this.screenTitle = 'כללי';
    else this.screenTitle = 'יחידים';
  }

  startSearch() {
    console.log(this.searchForm.value);
  }

}
