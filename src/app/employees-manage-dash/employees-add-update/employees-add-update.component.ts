import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employees-add-update',
  templateUrl: './employees-add-update.component.html',
  styleUrls: ['./employees-add-update.component.css']
})
export class EmployeesAddUpdateComponent implements OnInit {

  employee: any;

  constructor() { }

  ngOnInit(): void {
  }

}
