import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
   selector: 'app-public-inquiries-charts',
   templateUrl: './public-inquiries-charts.component.html',
   styleUrls: ['./public-inquiries-charts.component.css']
})
export class PublicInquiriesChartsComponent implements OnInit {

   constructor(private _snackBar: MatSnackBar,
      public dialog: MatDialog,
      private router: Router,
      private http: HttpClient) { }

   ngOnInit(): void {
      this.getLineChart();
   }

   Linetitle = 'מספר פניות לפי שנה';
   Linetype = 'LineChart';
   Linedata = [];
   Lineoptions = {
      hAxis: {
         title: 'שנה'
      },
      vAxis: {
         title: 'מספר פניות'
      },
      pointSize: 10
   };
   Linewidth = 650;
   Lineheight = 800;

   Pietitle = 'Browser market shares at a specific website, 2014';
   Pietype = 'PieChart';
   Piedata = [
      ['Firefox', 45.0],
      ['IE', 26.8],
      ['Chrome', 12.8],
      ['Safari', 8.5],
      ['Opera', 6.2],
      ['Others', 0.7] 
   ];
   Pieoptions = {    
      is3D:true
   };
   Piewidth = 650;
   Pieheight = 800;


   getLineChart() {
      this.http
         .post("http://srv-apps/wsrfc/WebService.asmx/GetLineChart", {
         })
         .subscribe((Response) => {
            let inquiriesStat = Response["d"];
            for(let i = 0 ; i < inquiriesStat.length ; i++){
               this.Linedata.push([inquiriesStat[i].InquiriesYear,parseInt(inquiriesStat[i].NumOfInquiries)]);
            }
         });
   }
}
