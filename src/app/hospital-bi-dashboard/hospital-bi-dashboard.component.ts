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
interface Cards {
  Depart: string;
  Card1: string;
  Card2: string;
  Card3: string;
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
    // { DIMDataTypeID: "2", DIMDataTypeDesc: "פעולות" },
    { DIMDataTypeID: "3", DIMDataTypeDesc: "מכון רנטגן" },
    // { DIMDataTypeID: "4", DIMDataTypeDesc: "מרפאות ומכונים" },
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
  _ifSeode = 'סיעודיות';
  changePercent: number = 0;
  _changeScale = "Up";
  @ViewChild(PieChartComponent) pie: PieChartComponent;
  @ViewChild(GroupedBarChartComponent) group: GroupedBarChartComponent;
  @ViewChild(GroupedBarChart2Component) group2: GroupedBarChart2Component;
  @ViewChild(BarChartComponent) bar: BarChartComponent;
  // @ViewChild(LineChartComponent) line: LineChartComponent;

  constructor(private http: HttpClient, private fb: FormBuilder) { }
  graphsCtrl: FormGroup;
  surgeryDeptTypeGroup: FormGroup;
  hospitalDepartTypeGroup: FormGroup;
  surgeryChooseTypeGroup: FormGroup;
  

  ngOnInit(): void {
    this.surgeryDeptTypeGroup = this.fb.group({
      surgeryDeptType: new FormControl('0', null),
    });
    this.hospitalDepartTypeGroup = this.fb.group({
      hospitalDepartType: new FormControl('0', null)
    });
    this.surgeryChooseTypeGroup = this.fb.group({
      surgeryChooseType: new FormControl('0', null)
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
    setTimeout(() => {
      this.changeTime('1', 'all');
    }, 1500);
    this.getCardsVals();
  }

  changeTime(event, type) {
    let cardsTitles: Cards[] = [

    ];
    let titles = {
      pie: ['TOP 10 ניתוחים', '', 'TOP 10 צילומים', '', 'מחלקות עם מספר מאושפזים גבוה', 'TOP 10 אבחנות', 'פילוח סוגי לידות'],
      bar: ['ניתוחים ברמת מחלקה', '', 'צילומים ברמת מכון', '', 'כמות מאושפזים', 'כמות פניות למחלקות '+this._ifSeode, 'כמות לידות'],
      group: ['ניתוחים לפי מחלקה וסוג ניתוח', '', 'צילומים לפי מכון ומשמרת', '', 'אשפוזים לפי משמרת', 'פניות לפי מחלקות '+this._ifSeode+' במשמרת', 'כמות וסוגי לידות לפי משמרת'],
      group2: ['כמות ניתוחים למחלקה', '', 'כמות צילומים למכון', '', 'אשפוזים לפי ציר זמן ומחלקה', 'פניות למחלקות '+this._ifSeode, 'לידות לפי ציר זמן'],
      // line: ['', '', '', '', '', '', ''],
    };
    let _surgeryDeptType = this.surgeryDeptTypeGroup.controls['surgeryDeptType'].value;
    let _hospitalDeptType = this.hospitalDepartTypeGroup.controls['hospitalDepartType'].value;
    let _surgeryChooseType = this.surgeryChooseTypeGroup.controls['surgeryChooseType'].value;
    let valueOfSwitch = _surgeryDeptType;
    if (this.departParam == "6" || this.departParam == "5") {
      valueOfSwitch = _hospitalDeptType;
    }
    switch (type) {
      case "all": {
        this.pieTime = titles.pie[parseInt(this.departParam) - 1] + ' ' + this.pie.refresh(event, this.departParam, valueOfSwitch);
        this.graphsCtrl.controls['pieCtrl'].setValue(event);
        this.barTime = titles.bar[parseInt(this.departParam) - 1] + ' ' + this.bar.refresh(event, this.departParam, valueOfSwitch);
        this.graphsCtrl.controls['barCtrl'].setValue(event);
        this.groupTime = titles.group[parseInt(this.departParam) - 1] + ' ' + this.group.refresh(event, this.departParam, valueOfSwitch, _surgeryChooseType);
        this.graphsCtrl.controls['groupCtrl'].setValue(event);
        this.groupTime2 = titles.group2[parseInt(this.departParam) - 1] + ' ' + this.group2.refresh(event, this.departParam, valueOfSwitch);
        this.graphsCtrl.controls['groupCtrl2'].setValue(event);
        // this.lineTime = this.titles.line[parseInt(this.departParam) - 1] + ' ' + this.line.refresh(event, this.departParam, _surgeryDeptType);
        // this.graphsCtrl.controls['lineCtrl'].setValue(event);
        break;
      }
      case "pie": {
        this.pieTime = titles.pie[parseInt(this.departParam) - 1] + ' ' + this.pie.refresh(event, this.departParam, valueOfSwitch);
        this.graphsCtrl.controls['pieCtrl'].setValue(event);
        break;
      }
      case "group": {
        this.groupTime = titles.group[parseInt(this.departParam) - 1] + ' ' + this.group.refresh(event, this.departParam, valueOfSwitch, _surgeryChooseType);
        this.graphsCtrl.controls['groupCtrl'].setValue(event);
        break;
      }
      case "group2": {
        this.groupTime2 = titles.group2[parseInt(this.departParam) - 1] + ' ' + this.group2.refresh(event, this.departParam, valueOfSwitch);
        this.graphsCtrl.controls['groupCtrl2'].setValue(event);
        break;
      }
      case "bar": {
        this.barTime = titles.bar[parseInt(this.departParam) - 1] + ' ' + this.bar.refresh(event, this.departParam, valueOfSwitch);
        this.graphsCtrl.controls['barCtrl'].setValue(event);
        break;
      }
      // case "line": {
      //   this.lineTime = this.titles.line[parseInt(this.departParam) - 1] + ' ' + this.line.refresh(event, this.departParam, _surgeryDeptType);
      //   this.graphsCtrl.controls['lineCtrl'].setValue(event);
      //   break;
      // }
      default: {
        this.pieTime = titles.pie[parseInt(this.departParam) - 1] + ' ' + this.pie.refresh(event, this.departParam, valueOfSwitch);
        this.graphsCtrl.controls['pieCtrl'].setValue(event);
        this.barTime = titles.bar[parseInt(this.departParam) - 1] + ' ' + this.bar.refresh(event, this.departParam, valueOfSwitch);
        this.graphsCtrl.controls['barCtrl'].setValue(event);
        this.groupTime = titles.group[parseInt(this.departParam) - 1] + ' ' + this.group.refresh(event, this.departParam, valueOfSwitch, _surgeryChooseType);
        this.graphsCtrl.controls['groupCtrl'].setValue(event);
        this.groupTime2 = titles.group2[parseInt(this.departParam) - 1] + ' ' + this.group2.refresh(event, this.departParam, valueOfSwitch);
        this.graphsCtrl.controls['groupCtrl2'].setValue(event);
        // this.lineTime = this.titles.line[parseInt(this.departParam) - 1] + ' ' + this.line.refresh(event, this.departParam, _surgeryDeptType);
        // this.graphsCtrl.controls['lineCtrl'].setValue(event);
        break;
      }
    }
    this.getCardsVals();
  }

  chooseDataType(dept) {
    this.choosenDept = dept;
    this.departParam = dept.DIMDataTypeID;
    if (dept.DIMDataTypeID != "1") {
      this.surgeryDeptTypeGroup.controls['surgeryDeptType'].setValue('0');
      this.hospitalDepartTypeGroup.controls['hospitalDepartType'].setValue('0');
      this.surgeryChooseTypeGroup.controls['surgeryChooseType'].setValue('0');
    }
    this.changeTime('1', 'all');
  }

  changeSurgeryType() {
    if(this.hospitalDepartTypeGroup.controls['hospitalDepartType'].value == "0"){
      this._ifSeode = 'סיעודיות';
    }else{
      this._ifSeode = 'רפואיות';
    }
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

  getCardsVals(){
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetStatsValues", {
        deptCode: this.departParam
      })
      .subscribe((Response) => {
        let data = Response["d"];
        this.changePercent = parseFloat(data[0].y);
        this.changePercent = parseFloat(this.changePercent.toFixed(2));
        if(this.changePercent < 1){
          this._changeScale = "Down";
        }
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