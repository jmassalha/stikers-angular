import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { GroupedBarChartComponent } from './grouped-bar-chart/grouped-bar-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
interface Time {
  DimTimeTypeID: string;
  DimTimeTypeDesc: string;
}
interface Depart {
  DIMDataTypeID: string;
  DIMDataTypeDesc: string;
}
@Component({
  selector: 'app-hospital-bi-dashboard',
  templateUrl: './hospital-bi-dashboard.component.html',
  styleUrls: ['./hospital-bi-dashboard.component.css']
})
export class HospitalBIDashboardComponent implements OnInit {

  configUrl = 'http://srv-apps-prod/RCF_WS/WebService.asmx/';
  departments: Depart[] = [
    { DIMDataTypeID: "1", DIMDataTypeDesc: "ניתוחים" },
    { DIMDataTypeID: "2", DIMDataTypeDesc: "פעולות" },
    { DIMDataTypeID: "3", DIMDataTypeDesc: "מכון רנטגן" },
    { DIMDataTypeID: "4", DIMDataTypeDesc: "מרפאות ומכונים" },
    { DIMDataTypeID: "5", DIMDataTypeDesc: "מחלקות אשפוז" },
    { DIMDataTypeID: "6", DIMDataTypeDesc: "מלר'ד" },
    { DIMDataTypeID: "7", DIMDataTypeDesc: "חדר לידה" }
  ];
  choosenDept = this.departments[0];
  timeLine: Time[] = [];
  public TimeLineParam: string = "1";
  innerWidth: number;
  width: number;
  phoneMode: string = "0";
  @ViewChild(PieChartComponent) pie: PieChartComponent;
  @ViewChild(GroupedBarChartComponent) group: GroupedBarChartComponent;
  @ViewChild(BarChartComponent) bar: BarChartComponent;
  @ViewChild(LineChartComponent) line: LineChartComponent;

  constructor(private http: HttpClient) { }


  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.width = (this.innerWidth - 100);
    if (this.width <= 740) {
      this.phoneMode = "1";
    }
    this.getTimeType(this.TimeLineParam);
  }

  changeTime(event, type) {
    switch (type) {
      case "all": {
        this.pie.refresh(event);
        this.bar.refresh(event);
        this.group.refresh(event);
        this.line.refresh(event);
        break;
      }
      case "pie": {
        this.pie.refresh(event);
        break;
      }
      case "group": {
        this.group.refresh(event);
        break;
      }
      case "bar": {
        this.bar.refresh(event);
        break;
      }
      case "line": {
        this.line.refresh(event);
        break;
      }
      default: {
        this.pie.refresh(event);
        this.bar.refresh(event);
        this.group.refresh(event);
        this.line.refresh(event);
        break;
      }
    }
  }

  chooseDataType(dept) {
    this.choosenDept = dept;
  }

  getTimeType(elem) {
    this.TimeLineParam = elem;
    let that = this;
    this.ManagedGetServerFunction('GetTimeTypes').subscribe({
      next(x) { that.timeLine = x["d"]; },
      error(err) { alert('אירעה תקלה'); },
      complete() { }
    });
  }

  public ManagedGetServerFunction(func): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('content-type', 'application/json');
    return this.http.get(this.configUrl + func, {
      headers
    })
  }

  public ManagedPostServerFunction(func, param): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('content-type', 'application/json');
    return this.http.post(this.configUrl + func, {
      param: param
    })
  }



}