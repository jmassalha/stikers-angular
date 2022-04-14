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
  };
  width: number;
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
        this.data = [7];
        let date = new Date();
        let finalarr = [];
        this.columnNames = ["יום"];

        this.columnNames = [...this.columnNames, ...inquiriesStatLine[1]];

        for (let i = 0; i < inquiriesStatLine[2].length; i++) {
          let temp = [];
          let notNullIndex = inquiriesStatLine[2][i].findIndex(x => x !== null);
          temp.push(inquiriesStatLine[2][i][notNullIndex].x);
          for (let j = 0; j < inquiriesStatLine[2][i].length; j++) {
            if (inquiriesStatLine[2][i][j] != null) {
              temp.push(inquiriesStatLine[2][i][j].y);
            } else {
              temp.push(0);
            }
          }
          finalarr.push(temp);
        }

        
        for (let d = 0; d < inquiriesStatLine[0].length; d++) {
          let arrTemp = [inquiriesStatLine[0][d], 0, 0, 0, 0, 0, 0, 0, 0, 0];
          if (inquiriesStatLine[0][d] != finalarr[d][0]) {
            finalarr.splice(d, 0, arrTemp);
          }
        }

        if (this.TimeLineParam == "1") {
          for (let f = 0; f < inquiriesStatLine[0].length; f++) {
            let t = new Date(date);
            let dayName = inquiriesStatLine[0][t.getDay()];
            let todayIndex = inquiriesStatLine[0].findIndex(x => x == dayName);
            let dateDifference = todayIndex - f;
            if (dateDifference < 0) {
              dateDifference = todayIndex + Math.abs(dateDifference);
            }
            this.data[f] = finalarr[dateDifference];
          }
          this.data.reverse();
        }else{
          this.data = finalarr;
        }
      });
  }

  calculateDiff(dateSent) {
    let currentDate = new Date();
    dateSent = new Date(dateSent);

    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));
  }

}
