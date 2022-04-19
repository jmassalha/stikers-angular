import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-grouped-bar-chart',
  templateUrl: './grouped-bar-chart.component.html',
  styleUrls: ['./grouped-bar-chart.component.css']
})
export class GroupedBarChartComponent implements OnInit {
  innerWidth: number;

  constructor(private http: HttpClient) { }

  TimeLineParam: string = "1";
  timesString = ['שבוע', 'חודש', 'שנה', '5 שנים מקבילות', '5 שנים מלאות'];

  // title = 'Population (in millions)';
  type = 'BarChart';
  data = [];
  columnNames = [];
  options = {
    hAxis: {
      title: 'זמן'
    },
    vAxis: {
      minValue: 0
    },
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
    this.width = this.innerWidth - 70;
    this.discreteBarChart();
  }

  public discreteBarChart() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/StackedBarChart2", {
        param: this.TimeLineParam
      })
      .subscribe((Response) => {
        let inquiriesStatLine = Response["d"][0];
        let departments = [];
        this.data = [];
        this.columnNames = ['Year'];
        for (let s = 0; s < Response["d"][1].length; s++) {
          departments.push(Response["d"][1][s]);
          departments.push({ role: 'annotation' });
        }
        this.columnNames = [...this.columnNames, ...departments];

        for (let i = 0; i < inquiriesStatLine.length; i++) {
          let temp = [];
          let notNullIndex = inquiriesStatLine[i].findIndex(x => x !== null);
          temp.push(inquiriesStatLine[i][notNullIndex].key);
          for (let j = 0; j < inquiriesStatLine[i].length; j++) {
            if (inquiriesStatLine[i][j] != null) {
              temp.push(inquiriesStatLine[i][j].y);
              temp.push(inquiriesStatLine[i][j].y);
            } else {
              temp.push(0);
              temp.push(0);
            }
          }
          this.data.push(temp);
        }
      });
  }

}
