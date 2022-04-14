import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  innerWidth: number;

  constructor(private http: HttpClient) { }

  TimeLineParam: string = "1";

  // title = 'כמות ניתוחים';
  type = 'ColumnChart';
  data = [];
  options = {
    legend: 'none',
    colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],
  };
  width: number;
  height = 600;


  refresh(elem) {
    this.TimeLineParam = elem;
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.width = (this.innerWidth - 100)/2;
    if (this.width <= 740) {
      this.width = this.width * 2;
    }
    this.discreteBarChart();
  }

  public discreteBarChart() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/DiscreteBarChart", {
        param: this.TimeLineParam
      })
      .subscribe((Response) => {
        let inquiriesStatLine = Response["d"];
        this.data = [];
        for (let i = 0; i < inquiriesStatLine.length; i++) {
          this.data.push([inquiriesStatLine[i].label, parseInt(inquiriesStatLine[i].value)]);
        }
      });
  }

}
