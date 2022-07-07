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
    { DIMDataTypeID: "7", DIMDataTypeDesc: "חדר לידה" },
    { DIMDataTypeID: "8", DIMDataTypeDesc: "דיאליזה" },
    { DIMDataTypeID: "9", DIMDataTypeDesc: "גסטרו" },
    { DIMDataTypeID: "10", DIMDataTypeDesc: "צנתורים" }
  ];

  choosenDept = this.departments[0];
  timeLine: Time[] = [];
  yearsPeriodList = [];
  yearsPeriodList2 = [];
  periodListToSend = [];
  loader: boolean = true;
  cardsList = [];
  returnedPatients = false;
  hospitalDepartments = [];
  TimeLineParam;
  first: any = "undefined";
  second: any = "undefined";
  public departParam: string = "1";
  barTime: string = "";
  groupTime: string = "";
  groupTime2: string = "";
  // lineTime: string = "שבוע";
  pieTime: string = "";
  innerWidth: number;
  width: number;
  phoneMode: string = "0";
  _ifSeode = 'סיעודיות';
  changePercent: number = 0;
  UserName = localStorage.getItem("loginUserName").toLowerCase();
  _changeScale = "Up";
  @ViewChild(PieChartComponent) pie: PieChartComponent;
  @ViewChild(GroupedBarChartComponent) group: GroupedBarChartComponent;
  @ViewChild(GroupedBarChart2Component) group2: GroupedBarChart2Component;
  @ViewChild(BarChartComponent) bar: BarChartComponent;
  // @ViewChild(LineChartComponent) line: LineChartComponent;

  constructor(private http: HttpClient, private fb: FormBuilder) {
  }
  graphsCtrl: FormGroup;
  surgeryDeptTypeGroup: FormGroup;
  hospitalDepartTypeGroup: FormGroup;
  surgeryChooseTypeGroup: FormGroup;
  deliveryPrematureGroup: FormGroup;


  ngOnInit(): void {
    this.TimeLineParam = "1"
    this.surgeryDeptTypeGroup = this.fb.group({
      surgeryDeptType: new FormControl('0', null),
    });
    this.hospitalDepartTypeGroup = this.fb.group({
      hospitalDepartType: new FormControl('0', null),
      returnedPatients: new FormControl(false, null)
    });
    this.surgeryChooseTypeGroup = this.fb.group({
      surgeryChooseType: new FormControl('0', null)
    });
    this.deliveryPrematureGroup = this.fb.group({
      deliveryPremature: new FormControl(false, null)
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
    if (this.width <= 1180) {
      this.phoneMode = "1";
    }
    this.getTimeType(this.TimeLineParam);
    setTimeout(() => {
      this.changeTime(this.TimeLineParam, 'all', this.periodListToSend);
    }, 1500);
    this.getCardsVals();
    this.showYearsPeriod();
  }

  changeTime(event, type, periodList) {
    this.TimeLineParam = event;
    let titles = {
      pie: ['TOP 10 ניתוחים', '', 'TOP 10 צילומים', '', 'מחלקות עם מספר קבלות גבוה', 'TOP 10 אבחנות', 'פילוח סוגי לידות', 'אחוז מטופלים לפי ימים', 'אחוז פניות לפי ימים', 'אחוז צנתורים לפי ימי שבוע'],
      bar: ['ניתוחים ברמת מחלקה', '', 'צילומים ברמת מכון', '', 'כמות קבלות', 'כמות פניות למחלקות ' + this._ifSeode, 'כמות לידות', 'מספר מטופלים', 'מספר פונים ליחידה', 'מספר צנתורים לתקופת'],
      group: ['ניתוחים לפי מחלקה וסוג ניתוח', '', 'צילומים לפי מכון ומשמרת', '', 'קבלות לפי משמרת', 'פניות לפי מחלקות ' + this._ifSeode + ' במשמרת', 'כמות וסוגי לידות לפי משמרת', 'כמות מטופלי דיאליזה במשמרת', 'מספר מטופלים לפי משמרת', 'מספר צנתורים לפי משמרת'],
      group2: ['כמות ניתוחים למחלקה', '', 'כמות צילומים למכון', '', 'קבלות לפי ציר זמן ומחלקה', 'פניות למחלקות ' + this._ifSeode, 'לידות לפי ציר זמן', 'מספר מטופלי דיאליזה לפי ציר זמן', 'מספר מטופלים לפי ציר זמן', 'מספר צנתורים לפי צרי זמן'],
      // line: ['', '', '', '', '', '', ''],
    };
    let _surgeryDeptType = this.surgeryDeptTypeGroup.controls['surgeryDeptType'].value;
    let _hospitalDeptType = this.hospitalDepartTypeGroup.controls['hospitalDepartType'].value;
    let _surgeryChooseType = this.surgeryChooseTypeGroup.controls['surgeryChooseType'].value;
    let _returnedPatients = this.hospitalDepartTypeGroup.controls['returnedPatients'].value;
    if (this.departParam == "7") {
      _returnedPatients = this.deliveryPrematureGroup.controls['deliveryPremature'].value;
    }
    let valueOfSwitch = _surgeryDeptType;
    if (this.departParam == "6" || this.departParam == "5") {
      valueOfSwitch = _hospitalDeptType;
    }
    if (periodList.length > 0 && this.TimeLineParam == "5") {
      let tempList = periodList;
      periodList = "(";
      for (let i = 0; i < tempList.length - 1; i++) {
        periodList += tempList[i] + ",";
      }
      periodList += tempList[tempList.length - 1] + ")";
    } else {
      periodList = "";
    }
    switch (type) {
      case "all": {
        this.pieTime = titles.pie[parseInt(this.departParam) - 1] + ' ' + this.pie.refresh(event, this.departParam, valueOfSwitch, _returnedPatients, periodList);
        this.graphsCtrl.controls['pieCtrl'].setValue(event);
        this.barTime = titles.bar[parseInt(this.departParam) - 1] + ' ' + this.bar.refresh(event, this.departParam, valueOfSwitch, _returnedPatients, periodList);
        this.graphsCtrl.controls['barCtrl'].setValue(event);
        this.groupTime = titles.group[parseInt(this.departParam) - 1] + ' ' + this.group.refresh(event, this.departParam, valueOfSwitch, _surgeryChooseType, _returnedPatients, periodList);
        this.graphsCtrl.controls['groupCtrl'].setValue(event);
        this.groupTime2 = titles.group2[parseInt(this.departParam) - 1] + ' ' + this.group2.refresh(event, this.departParam, valueOfSwitch, _returnedPatients, periodList);
        this.graphsCtrl.controls['groupCtrl2'].setValue(event);
        // this.lineTime = this.titles.line[parseInt(this.departParam) - 1] + ' ' + this.line.refresh(event, this.departParam, _surgeryDeptType);
        // this.graphsCtrl.controls['lineCtrl'].setValue(event);
        break;
      }
      case "pie": {
        this.pieTime = titles.pie[parseInt(this.departParam) - 1] + ' ' + this.pie.refresh(event, this.departParam, valueOfSwitch, _returnedPatients, periodList);
        this.graphsCtrl.controls['pieCtrl'].setValue(event);
        break;
      }
      case "group": {
        this.groupTime = titles.group[parseInt(this.departParam) - 1] + ' ' + this.group.refresh(event, this.departParam, valueOfSwitch, _surgeryChooseType, _returnedPatients, periodList);
        this.graphsCtrl.controls['groupCtrl'].setValue(event);
        break;
      }
      case "group2": {
        this.groupTime2 = titles.group2[parseInt(this.departParam) - 1] + ' ' + this.group2.refresh(event, this.departParam, valueOfSwitch, _returnedPatients, periodList);
        this.graphsCtrl.controls['groupCtrl2'].setValue(event);
        break;
      }
      case "bar": {
        this.barTime = titles.bar[parseInt(this.departParam) - 1] + ' ' + this.bar.refresh(event, this.departParam, valueOfSwitch, _returnedPatients, periodList);
        this.graphsCtrl.controls['barCtrl'].setValue(event);
        break;
      }
      // case "line": {
      //   this.lineTime = this.titles.line[parseInt(this.departParam) - 1] + ' ' + this.line.refresh(event, this.departParam, _surgeryDeptType);
      //   this.graphsCtrl.controls['lineCtrl'].setValue(event);
      //   break;
      // }
      default: {
        this.pieTime = titles.pie[parseInt(this.departParam) - 1] + ' ' + this.pie.refresh(event, this.departParam, valueOfSwitch, _returnedPatients, periodList);
        this.graphsCtrl.controls['pieCtrl'].setValue(event);
        this.barTime = titles.bar[parseInt(this.departParam) - 1] + ' ' + this.bar.refresh(event, this.departParam, valueOfSwitch, _returnedPatients, periodList);
        this.graphsCtrl.controls['barCtrl'].setValue(event);
        this.groupTime = titles.group[parseInt(this.departParam) - 1] + ' ' + this.group.refresh(event, this.departParam, valueOfSwitch, _surgeryChooseType, _returnedPatients, periodList);
        this.graphsCtrl.controls['groupCtrl'].setValue(event);
        this.groupTime2 = titles.group2[parseInt(this.departParam) - 1] + ' ' + this.group2.refresh(event, this.departParam, valueOfSwitch, _returnedPatients, periodList);
        this.graphsCtrl.controls['groupCtrl2'].setValue(event);
        // this.lineTime = this.titles.line[parseInt(this.departParam) - 1] + ' ' + this.line.refresh(event, this.departParam, _surgeryDeptType);
        // this.graphsCtrl.controls['lineCtrl'].setValue(event);
        break;
      }
    }
    this.getCardsVals();
    if (this.departParam == "5") {
      this.getHospitalDepartmentsTableChartList();
    }
  }

  showYearsPeriod() {
    let date = new Date();
    let current = date.getFullYear();
    this.yearsPeriodList = [];
    for (let i = 1; i < 6; i++) {
      current = date.getFullYear() - i;
      this.yearsPeriodList.push({ year: current, number: -Math.abs(i) });
      this.yearsPeriodList2.push({ year: current, number: -Math.abs(i) });
    }
  }
  showYearsPeriod2(numberOfLoops) {
    let date = new Date();
    let current = date.getFullYear();
    this.yearsPeriodList2 = [];
    numberOfLoops = Math.abs(parseInt(numberOfLoops));
    for (let i = 1; i <= numberOfLoops; i++) {
      current = date.getFullYear() - i;
      this.yearsPeriodList2.push({ year: current, number: -Math.abs(i) });
    }
  }

  changePeriod(event) {
    if (event['srcElement'].id == "firstSelect") {
      this.first = event.target.value;
      this.showYearsPeriod2(this.first);
    }
    else if (event['srcElement'].id == "secondSelect") {
      this.second = event.target.value;
    }
    // let total = Math.abs(this.first) - Math.abs(this.second);
    if (this.first != "undefined" && this.second != "undefined") {
      this.periodListToSend = [];
      for (let i = Math.abs(this.second); i <= Math.abs(this.first); i++) {
        if (i == 0) {
          this.periodListToSend.push(Math.abs(i));
        } else {
          this.periodListToSend.push(-Math.abs(i));
        }
      }
      this.changeTime(this.TimeLineParam, 'all', this.periodListToSend);
    } else if (this.first == "undefined" && this.second == "undefined") {
      this.periodListToSend = ["-1", "-2", "-3", "-4", "-5"]
      this.changeTime(this.TimeLineParam, 'all', this.periodListToSend);
    }
  }

  chooseDataType(dept) {
    this.choosenDept = dept;
    this.departParam = dept.DIMDataTypeID;
    if (dept.DIMDataTypeID != "1") {
      this.surgeryDeptTypeGroup.controls['surgeryDeptType'].setValue('0');
      this.hospitalDepartTypeGroup.controls['hospitalDepartType'].setValue('0');
      this.surgeryChooseTypeGroup.controls['surgeryChooseType'].setValue('0');
    }
    this.changeTime(this.TimeLineParam, 'all', this.periodListToSend);
  }

  changeSurgeryType() {
    if (this.hospitalDepartTypeGroup.controls['hospitalDepartType'].value == "0") {
      this._ifSeode = 'סיעודיות';
    } else {
      this._ifSeode = 'רפואיות';
    }
    this.changeTime(this.TimeLineParam, 'all', this.periodListToSend);
  }

  getTimeType(elem) {
    // this.TimeLineParam = elem;
    let that = this;
    this.ManagedGetServerFunction('GetTimeTypes').subscribe({
      next(x) { that.timeLine = x["d"]; },
      error(err) { alert('אירעה תקלה'); },
      complete() { }
    });
  }

  getCardsVals() {
    this.loader = true;
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetStatsValues", {
        deptCode: this.departParam
      })
      .subscribe((Response) => {
        this.loader = false;
        this.cardsList = Response["d"];
        this.cardsList[0].y = this.cardsList[0].y + "%"; 
      });
  }

  getHospitalDepartmentsTableChartList() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/GetHospitalDepartmentsTableChartList", {
        surgerydeptType: this.hospitalDepartTypeGroup.controls['hospitalDepartType'].value
      })
      .subscribe((Response) => {
        this.hospitalDepartments = Response["d"];
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