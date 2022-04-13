import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  innerWidth: number;

  constructor(private http: HttpClient) { }

  TimeLineParam: string = "1";

  // title = 'Average Temperatures of Cities';
  type = 'LineChart';
  data = [];
  columnNames = ["יום"];
  options = {
    is3D: true,
    backgroundColor: 'darkgray',
    hAxis: {
      title: 'זמן'
    },
    vAxis: {
      title: 'כמות'
    },
    crosshair: {
      color: '#000000',
      trigger: 'selection'
    },
    pointSize: 5,
    curveType: 'function',
    textStyle:{color: '#FFF'}
  };
  width:number;
  height = 600;


  refresh(elem) {
    this.TimeLineParam = elem;
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.width = this.innerWidth - 70;
    this.discreteBarChart();
  }

  public discreteBarChart() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/LineBarChart", {
        param: this.TimeLineParam
      })
      .subscribe((Response) => {
        let inquiriesStatLine = Response["d"];
        // this.columnNames = inquiriesStatLine[0];
        this.data = [];
        let departsArr = [];
        // create depart array
        for (let d = 0; d < inquiriesStatLine[1].length; d++) {
          departsArr.push(inquiriesStatLine[1][d].DIMDataTypeSubDesc);
          this.columnNames.push(inquiriesStatLine[1][d].DIMDataTypeSubDesc);
        }


        for (let d = 0; d < inquiriesStatLine[0].length; d++) {
          let temp = [];
          temp.push(inquiriesStatLine[0][d]);
          for (let d = 0; d < departsArr.length; d++) {
            temp.push(0);
          }
          this.data.push(temp);
        }


        for (let i = 0; i < inquiriesStatLine[2].length; i++) {
          // if (!this.columnNames.includes(inquiriesStatLine[2][i].depart)) {
          //   this.columnNames.push(inquiriesStatLine[2][i].depart);
          // }
          let dayIndex = inquiriesStatLine[0].findIndex(x => x === inquiriesStatLine[2][i].x);
          let departIndex = departsArr.findIndex(x => x === inquiriesStatLine[2][i].depart);
          this.data[dayIndex][departIndex] = inquiriesStatLine[2][i].y;
        }
      });
  }

}
