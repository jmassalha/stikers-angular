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
      this.getPieChart();
      this.getBarChart();
   }

   // Line Chart
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

   // Pie Chart
   Pietitle = 'פירוט עפ"י סוג פנייה';
   Pietype = 'PieChart';
   Piedata = [];
   Pieoptions = {    
      is3D:true
   };
   Piewidth = 650;
   Pieheight = 800;

   // Bar Chart
   Bartitle = 'פירוט פניות עפ"י שנים';
   Bartype = 'BarChart';
   Bardata = [];
   Baroptions = {   
      vAxis: {
         title: 'שנה'
      },
      hAxis:{
         title:'מספר פניות לכל סוג',
         minValue:0
      },
      isStacked:true	  
   };
   Barwidth = 650;
   Barheight = 800;


   getLineChart() {
      this.http
         .post("http://srv-apps/wsrfc/WebService.asmx/GetLineChart", {
         })
         .subscribe((Response) => {
            let inquiriesStatLine = Response["d"];
            for(let i = 0 ; i < inquiriesStatLine.length ; i++){
               this.Linedata.push([inquiriesStatLine[i].InquiriesYear,parseInt(inquiriesStatLine[i].NumOfInquiries)]);
            }
         });
   }
   
   getPieChart() {
      this.http
         .post("http://srv-apps/wsrfc/WebService.asmx/GetPieChart", {
         })
         .subscribe((Response) => {
            let inquiriesStatPie = Response["d"];
            for(let i = 0 ; i < inquiriesStatPie.length ; i++){
               this.Piedata.push([inquiriesStatPie[i].Comp_Type,parseInt(inquiriesStatPie[i].NumberOfCompType)]);
            }
         });
   }
   
   getBarChart() {
      this.http
         .post("http://srv-apps/wsrfc/WebService.asmx/GetBarChart", {
         })
         .subscribe((Response) => {
            let inquiriesStatBar = Response["d"];
            for(let i = 0 ; i < inquiriesStatBar.length ; i++){
               this.Bardata.push([inquiriesStatBar[i].YEAR,parseInt(inquiriesStatBar[i].Inquiry),parseInt(inquiriesStatBar[i].Thank),parseInt(inquiriesStatBar[i].Complaint),parseInt(inquiriesStatBar[i].Job)]);
            }
         });
   }
}
