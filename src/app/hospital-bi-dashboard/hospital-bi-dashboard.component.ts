import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { GroupedBarChartComponent } from './grouped-bar-chart/grouped-bar-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GroupedBarChart2Component } from './grouped-bar-chart2/grouped-bar-chart2.component';
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
  public departParam: string = "1";
  barTime: string = "שבוע";
  groupTime: string = "שבוע";
  groupTime2: string = "שבוע";
  // lineTime: string = "שבוע";
  pieTime: string = "שבוע";
  innerWidth: number;
  width: number;
  phoneMode: string = "0";
  @ViewChild(PieChartComponent) pie: PieChartComponent;
  @ViewChild(GroupedBarChartComponent) group: GroupedBarChartComponent;
  @ViewChild(GroupedBarChart2Component) group2: GroupedBarChart2Component;
  @ViewChild(BarChartComponent) bar: BarChartComponent;
  // @ViewChild(LineChartComponent) line: LineChartComponent;

  constructor(private http: HttpClient, private fb: FormBuilder) { }
  graphsCtrl: FormGroup;
  surgeryDeptTypeGroup: FormGroup;
  hospitalDepartTypeGroup: FormGroup;
  titles = {
    pie: ['TOP 10 ניתוחים', '', '', '', '', 'TOP 10 אבחנות', 'פילוח סוגי לידות'],
    bar: ['ניתוחים ברמת אתר', '', '', '', '', 'כמות פניות למחלקות רפואיות', 'כמות לידות'],
    group: ['ניתוחים לפי אתר וסוג ניתוח', '', '', '', '', 'פניות לפי משמרת', 'כמות וסוגי לידות לפי משמרת'],
    group2: ['כמות ניתוחים לאתר', '', '', '', '', 'פניות למחלקות רפואיות', 'לידות לפי ציר זמן'],
    // line: ['', '', '', '', '', '', ''],
  };

  ngOnInit(): void {
    this.surgeryDeptTypeGroup = this.fb.group({
      surgeryDeptType: new FormControl('0', null)
    });
    this.hospitalDepartTypeGroup = this.fb.group({
      hospitalDepartType: new FormControl('0', null)
    });
    this.graphsCtrl = this.fb.group({
      pieCtrl: new FormControl('1', null),
      barCtrl: new FormControl('1', null),
      groupCtrl: new FormControl('1', null),
      groupCtrl2: new FormControl('1', null),
      // lineCtrl: new FormControl('1', null),
    });

    this.innerWidth = window.innerWidth;
    this.width = (this.innerWidth - 100);
    if (this.width <= 740) {
      this.phoneMode = "1";
    }
    this.getTimeType(this.TimeLineParam);
  }

  changeTime(event, type) {
    let _surgeryDeptType = this.surgeryDeptTypeGroup.controls['surgeryDeptType'].value;
    let _hospitalDeptType = this.hospitalDepartTypeGroup.controls['hospitalDepartType'].value;
    let valueOfSwitch = _surgeryDeptType;
    if (this.departParam == "6") {
      valueOfSwitch = _hospitalDeptType;
    }
    switch (type) {
      case "all": {
        this.pieTime = this.titles.pie[parseInt(this.departParam) - 1] + ' ' + this.pie.refresh(event, this.departParam, valueOfSwitch);
        this.graphsCtrl.controls['pieCtrl'].setValue(event);
        this.barTime = this.titles.bar[parseInt(this.departParam) - 1] + ' ' + this.bar.refresh(event, this.departParam, valueOfSwitch);
        this.graphsCtrl.controls['barCtrl'].setValue(event);
        this.groupTime = this.titles.group[parseInt(this.departParam) - 1] + ' ' + this.group.refresh(event, this.departParam, valueOfSwitch);
        this.graphsCtrl.controls['groupCtrl'].setValue(event);
        this.groupTime2 = this.titles.group2[parseInt(this.departParam) - 1] + ' ' + this.group2.refresh(event, this.departParam, valueOfSwitch);
        this.graphsCtrl.controls['groupCtrl2'].setValue(event);
        // this.lineTime = this.titles.line[parseInt(this.departParam) - 1] + ' ' + this.line.refresh(event, this.departParam, _surgeryDeptType);
        // this.graphsCtrl.controls['lineCtrl'].setValue(event);
        break;
      }
      case "pie": {
        this.pieTime = this.titles.pie[parseInt(this.departParam) - 1] + ' ' + this.pie.refresh(event, this.departParam, valueOfSwitch);
        this.graphsCtrl.controls['pieCtrl'].setValue(event);
        break;
      }
      case "group": {
        this.groupTime = this.titles.group[parseInt(this.departParam) - 1] + ' ' + this.group.refresh(event, this.departParam, valueOfSwitch);
        this.graphsCtrl.controls['groupCtrl'].setValue(event);
        break;
      }
      case "group2": {
        this.groupTime2 = this.titles.group2[parseInt(this.departParam) - 1] + ' ' + this.group2.refresh(event, this.departParam, valueOfSwitch);
        this.graphsCtrl.controls['groupCtrl2'].setValue(event);
        break;
      }
      case "bar": {
        this.barTime = this.titles.bar[parseInt(this.departParam) - 1] + ' ' + this.bar.refresh(event, this.departParam, valueOfSwitch);
        this.graphsCtrl.controls['barCtrl'].setValue(event);
        break;
      }
      // case "line": {
      //   this.lineTime = this.titles.line[parseInt(this.departParam) - 1] + ' ' + this.line.refresh(event, this.departParam, _surgeryDeptType);
      //   this.graphsCtrl.controls['lineCtrl'].setValue(event);
      //   break;
      // }
      default: {
        this.pieTime = this.titles.pie[parseInt(this.departParam) - 1] + ' ' + this.pie.refresh(event, this.departParam, valueOfSwitch);
        this.graphsCtrl.controls['pieCtrl'].setValue(event);
        this.barTime = this.titles.bar[parseInt(this.departParam) - 1] + ' ' + this.bar.refresh(event, this.departParam, valueOfSwitch);
        this.graphsCtrl.controls['barCtrl'].setValue(event);
        this.groupTime = this.titles.group[parseInt(this.departParam) - 1] + ' ' + this.group.refresh(event, this.departParam, valueOfSwitch);
        this.graphsCtrl.controls['groupCtrl'].setValue(event);
        this.groupTime2 = this.titles.group2[parseInt(this.departParam) - 1] + ' ' + this.group2.refresh(event, this.departParam, valueOfSwitch);
        this.graphsCtrl.controls['groupCtrl2'].setValue(event);
        // this.lineTime = this.titles.line[parseInt(this.departParam) - 1] + ' ' + this.line.refresh(event, this.departParam, _surgeryDeptType);
        // this.graphsCtrl.controls['lineCtrl'].setValue(event);
        break;
      }
    }
  }

  chooseDataType(dept) {
    this.choosenDept = dept;
    this.departParam = dept.DIMDataTypeID;
    if (dept.DIMDataTypeID != "1") {
      this.surgeryDeptTypeGroup.controls['surgeryDeptType'].setValue('0');
      this.hospitalDepartTypeGroup.controls['hospitalDepartType'].setValue('0');
    }
    this.changeTime('1', 'all');
  }

  changeSurgeryType() {
    this.changeTime('1', 'all');
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