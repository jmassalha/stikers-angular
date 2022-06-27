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

  loader: boolean = true;
  TimeLineParam;
  periodList = [];
  departParam: string = "1";
  _surgerydeptType: string = "0";
  _returnedPatients: boolean = false;
  timesString = ['בשבוע', 'בחודש', 'בשנה', 'ב5 שנים מקבילות', 'ב5 שנים מלאות'];

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

  refresh(elem, dept, _surgeryDeptType, _returnedPatients, periodList) {
    this.TimeLineParam = elem;
    this.periodList = periodList;
    this.departParam = dept;
    this._surgerydeptType = _surgeryDeptType;
    this._returnedPatients = _returnedPatients;
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
    this.loader = true;
    let url = "http://localhost:64964/WebService.asmx/";
    if (this.departParam == "6") {
      url += "PieChartER";
    } else if (this.departParam == "7") {
      url += "PieChartDelivery";
    } else if (this.departParam == "5") {
      url += "PieChartDepartments";
    } else if (this.departParam == "3") {
      url += "PieChartRentgenDimot";
    } else {
      url += "PieChart";
    }
    if (this.TimeLineParam != undefined) {
      this.http
        .post(url, {
          param: this.TimeLineParam,
          deptCode: this.departParam,
          surgerydeptType: this._surgerydeptType,
          returnedPatients: this._returnedPatients,
          periodList: this.periodList
        })
        .subscribe((Response) => {
          let inquiriesStatLine = Response["d"];
          this.data = [];
          for (let i = 0; i < inquiriesStatLine.length; i++) {
            this.data.push([inquiriesStatLine[i].key, parseInt(inquiriesStatLine[i].y)]);
          }
          this.loader = false;
        });
    }

  }

}