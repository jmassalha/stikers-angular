import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  innerWidth: number;

  TimeLineParam: string = "1";
  timesString = ['שבוע', 'חודש', 'שנה', '5 שנים מקבילות', '5 שנים מלאות'];

  constructor(private http: HttpClient) { }

  // title = 'Browser market shares at a specific website, 2014';
  type = 'PieChart';
  data = [];
  options = {
    is3D: true,
    chartArea: {
      height: "600px",
      width: "600px"
    }
  };
  width: number;
  height = 600;

  refresh(elem) {
    this.TimeLineParam = elem;
    this.ngOnInit();
    return this.timesString[parseInt(elem) - 1];
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.width = (this.innerWidth - 100) / 2;
    if (this.width <= 740) {
      this.width = this.width * 2;
    }
    this.pieChart();
  }

  public pieChart() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/PieChart", {
        param: this.TimeLineParam
      })
      .subscribe((Response) => {
        let inquiriesStatLine = Response["d"];
        this.data = [];
        for (let i = 0; i < inquiriesStatLine.length; i++) {
          this.data.push([inquiriesStatLine[i].key, parseInt(inquiriesStatLine[i].y)]);
        }
      });
  }

}