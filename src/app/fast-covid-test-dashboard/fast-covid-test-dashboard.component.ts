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
    PatienId
    FirstName
    LastName
    date2
    time2
    dateEnd
    CheckResuls
    QRImage
  searchCovidTestPatients: FormGroup;
  all_Patients_array = [];
  TABLE_DATA: any[] = [];
  displayedColumns: string[] = [
    'SampleDate', 'IdNumber', 'FullName', 'Result', 'QrCode', 'Print'
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
       // console.log(json);
        var FastCoronaTestResponse = json["FastCoronaTestResponse"];
        if(FastCoronaTestResponse["FastTest"]["QRCode"]){
          console.log(FastCoronaTestResponse["FastTest"]["QRCode"]);
          var img = "data:image/png;base64," +FastCoronaTestResponse["FastTest"]["QRCode"];
        }else{
          var img = "";
        }

        this.TABLE_DATA.push({
          SampleDate: this.all_Patients_array[i].SampleData.SamplingTime.Day +'/'+this.all_Patients_array[i].SampleData.SamplingTime.Month+'/'+this.all_Patients_array[i].SampleData.SamplingTime.Year,
          SampleEndDate: (parseInt(this.all_Patients_array[i].SampleData.SamplingTime.Day) + 1) +'/'+this.all_Patients_array[i].SampleData.SamplingTime.Month+'/'+this.all_Patients_array[i].SampleData.SamplingTime.Year,
          IdNumber: this.all_Patients_array[i].TestData.IDNum,
          FullName: this.all_Patients_array[i].TestData.LastName+' '+this.all_Patients_array[i].TestData.FirstName,
          Result: this.all_Patients_array[i].TestData.Result,
          QrCode: img,
          SampleTime: this.all_Patients_array[i].SampleData.SamplingTime.Hour+":"+this.all_Patients_array[i].SampleData.SamplingTime.Minutes          
        });
      }
      this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
      this.dataSource.paginator = this.paginator;
    });
  }

  openNewTest(){
    let dialogRef = this.dialog.open(FastCovid19TestComponent, { disableClose: true });
  }
  print(element){
    //debugger
    this.PatienId = element.IdNumber
    this.FirstName =  element.FullName
    this.date2 =  element.SampleDate
    this.time2 =  element.SampleTime
    this.dateEnd =  element.SampleEndDate
    this.QRImage =  element.QrCode
    this.CheckResuls =  element.Result
    $("#loader").removeClass("d-none");
    setTimeout(function(){
      
      $("#loader").addClass("d-none");
      var mywindow = window.open('', 'PRINT');

      mywindow.document.write('<html><head><title>בדיקת קורונה מהירה</title>');
      mywindow.document.write('</head><body dir="rtl" style="text-align:right;width:300px;margin:auto;display:block;">');
      mywindow.document.write('<h1 style="text-align:center">בדיקת קורונה מהירה</h1>');
      mywindow.document.write(document.getElementById("printQrCode").innerHTML);
      mywindow.document.write('</body></html>');

      mywindow.document.close(); // necessary for IE >= 10
      mywindow.focus(); // necessary for IE >= 10*/

      mywindow.print();
      mywindow.close();
      return true;
    }, 1500)
    
  }

}
