import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FastCovid19TestComponent } from '../fast-covid19-test/fast-covid19-test.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-fast-covid-test-dashboard',
  templateUrl: './fast-covid-test-dashboard.component.html',
  styleUrls: ['./fast-covid-test-dashboard.component.css']
})
export class FastCovidTestDashboardComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    public datepipe: DatePipe) { }

  searchCovidTestPatients: FormGroup;
  all_Patients_array = [];
  TABLE_DATA: any[] = [];
  displayedColumns: string[] = [
    'FormID', 'FormName', 'formDepartment', 'FormDate', 'update', 'showAll'
  ];
  dataSource = new MatTableDataSource(this.TABLE_DATA);

  ngOnInit(): void {

    this.searchCovidTestPatients = new FormGroup({

    });

  }

  getAllAntigTestedPatients(){
    this.http
    .post("http://srv-apps/wsrfc/WebService.asmx/GetAllAntigTestedPatients", {
    })
    .subscribe((Response) => {
      this.all_Patients_array = Response["d"];

      this.TABLE_DATA = [];
      for (var i = 0; i < this.all_Patients_array.length; i++) {
        this.TABLE_DATA.push({
          FormID: this.all_Patients_array[i],
          FormName: this.all_Patients_array[i],
          FormDate: this.all_Patients_array[i],
          FormDepartment: this.all_Patients_array[i],
        });
      }
      this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
      this.dataSource.paginator = this.paginator;
    });
  }

}
