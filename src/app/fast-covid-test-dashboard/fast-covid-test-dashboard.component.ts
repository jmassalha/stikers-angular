import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FastCovid19TestComponent } from '../fast-covid19-test/fast-covid19-test.component';
import { DatePipe } from '@angular/common';
import { FastCovidSendEamilComponent } from '../fast-covid-send-eamil/fast-covid-send-eamil.component';

@Component({
  selector: 'app-fast-covid-test-dashboard',
  templateUrl: './fast-covid-test-dashboard.component.html',
  styleUrls: ['./fast-covid-test-dashboard.component.css']
})
export class FastCovidTestDashboardComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  startdateVal: string;
  enddateVal: string;
  constructor(private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    
    public datePipe: DatePipe,
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
  
  Sdate;
  Edate;
  displayedColumns: string[] = [
    'SampleDate', 'IdNumber', 'IdNumber2', 'FullName', 'Result', 'QrCode', 'Print', 'resend'
  ];
  dataSource = new MatTableDataSource(this.TABLE_DATA);

  ngOnInit(): void {

    if(localStorage.getItem("loginState") == "true"){
      let dateIn = new Date();
      dateIn.setDate(dateIn.getDate() - 1);
      this.Sdate = new FormControl(dateIn);
      this.Edate = new FormControl(new Date());
      this.startdateVal = this.Sdate.value;
      this.enddateVal = this.Edate.value;
      this.searchCovidTestPatients = new FormGroup({
        searchWord: new FormControl('',null),
        startdateVal: new FormControl(this.startdateVal,null),
        enddateVal: new FormControl(this.enddateVal,null),
      });
      this.getAllAntigTestedPatients();
    }
  }


  getAllAntigTestedPatients(){
    this.http
    .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetAllAntigTestedPatients", {
      _searchWord: this.searchCovidTestPatients.controls['searchWord'].value,
      _startdateVal:  this.datePipe.transform(this.searchCovidTestPatients.controls['startdateVal'].value, 'yyyy-MM-dd'),
      _enddateVal: this.datePipe.transform(this.searchCovidTestPatients.controls['enddateVal'].value, 'yyyy-MM-dd'),
    })
    .subscribe((Response) => {
      this.all_Patients_array = Response["d"];

      this.TABLE_DATA = [];
      for (var i = 0; i < this.all_Patients_array.length; i++) {
        var json = JSON.parse(this.all_Patients_array[i].TestData.ImgQrCode);
        var FastCoronaTestResponse = json["FastCoronaTestResponse"];
        //debugger
        if(FastCoronaTestResponse["FastTest"]["QRCode"]){
          var img = "data:image/png;base64," +FastCoronaTestResponse["FastTest"]["QRCode"];
        }else{
          var img = "";
        }
//debugger
        this.TABLE_DATA.push({
          SampleDate: this.all_Patients_array[i].SampleData.SamplingTime.Day +'/'+this.all_Patients_array[i].SampleData.SamplingTime.Month+'/'+this.all_Patients_array[i].SampleData.SamplingTime.Year,
          SampleEndDate: (parseInt(this.all_Patients_array[i].SampleData.SamplingTime.Day) + 1) +'/'+this.all_Patients_array[i].SampleData.SamplingTime.Month+'/'+this.all_Patients_array[i].SampleData.SamplingTime.Year,
          IdNumber: this.all_Patients_array[i].TestData.IDNum,
          FullName: this.all_Patients_array[i].TestData.LastName+' '+this.all_Patients_array[i].TestData.FirstName,
          Result: this.all_Patients_array[i].TestData.Result,
          IdType: this.all_Patients_array[i].TestData.IdType,
          QrCode: img,
          Tell: this.all_Patients_array[i].SampleData.Tel1,
          RowId: this.all_Patients_array[i].TestData.RowId,
          Email: this.all_Patients_array[i].TestData.EMail,
          SampleTime: this.all_Patients_array[i].SampleData.SamplingTime.Hour+":"+this.all_Patients_array[i].SampleData.SamplingTime.Minutes          
        });
      }
      this.dataSource = new MatTableDataSource<any>(this.TABLE_DATA);
      this.dataSource.paginator = this.paginator;
    });
  }
  resendEmail(element){
    let dialogRef = this.dialog.open(FastCovidSendEamilComponent, { disableClose: false, width: '1080px', data: element});
  }
  openNewTest(){
    let dialogRef = this.dialog.open(FastCovid19TestComponent, { disableClose: true });
  }
  print(element){
    ////debugger
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