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
    'SampleDate', 'IdNumber', 'FullName', 'Result', 'QrCode'
  ];
  dataSource = new MatTableDataSource(this.TABLE_DATA);

  ngOnInit(): void {

    this.searchCovidTestPatients = new FormGroup({
      searchWord: new FormControl('',null)
    });
    this.getAllAntigTestedPatients();

  }


  getAllAntigTestedPatients(){
    this.http
    .post("http://srv-apps/wsrfc/WebService.asmx/GetAllAntigTestedPatients", {
      _searchWord: this.searchCovidTestPatients.controls['searchWord'].value
    })
    .subscribe((Response) => {
      this.all_Patients_array = Response["d"];

      this.TABLE_DATA = [];
      for (var i = 0; i < this.all_Patients_array.length; i++) {
        var json = JSON.parse(this.all_Patients_array[i].TestData.ImgQrCode);
        console.log(json);
        var FastCoronaTestResponse = json["FastCoronaTestResponse"];
        console.log(FastCoronaTestResponse["FastTest"]["QRCode"]);
        var img = "data:image/png;base64," +FastCoronaTestResponse["FastTest"]["QRCode"];
        this.TABLE_DATA.push({
          SampleDate: this.all_Patients_array[i].SampleData.SamplingTime.Day +'/'+this.all_Patients_array[i].SampleData.SamplingTime.Month+'/'+this.all_Patients_array[i].SampleData.SamplingTime.Year,
          IdNumber: this.all_Patients_array[i].TestData.IDNum,
          FullName: this.all_Patients_array[i].TestData.LastName+' '+this.all_Patients_array[i].TestData.FirstName,
          Result: this.all_Patients_array[i].TestData.Result,
           QrCode: img,
        });
      }
      this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
      this.dataSource.paginator = this.paginator;
    });
  }

  openNewTest(){
    let dialogRef = this.dialog.open(FastCovid19TestComponent, { disableClose: true });
  }


}
