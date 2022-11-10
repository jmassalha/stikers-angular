import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { GroupedBarChartComponent } from './grouped-bar-chart/grouped-bar-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GroupedBarChart2Component } from './grouped-bar-chart2/grouped-bar-chart2.component';
import { GroupedBarChartReleaseComponent } from './grouped-bar-chart-release/grouped-bar-chart-release.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

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
    { DIMDataTypeID: "2", DIMDataTypeDesc: "מרפאות ומכונים" },
    // { DIMDataTypeID: "11", DIMDataTypeDesc: "מרפאות מיוחדות" },
    { DIMDataTypeID: "3", DIMDataTypeDesc: "מכון רנטגן" },
    // { DIMDataTypeID: "4", DIMDataTypeDesc: "פעולות" },
    { DIMDataTypeID: "5", DIMDataTypeDesc: "קבלות לאשפוז" },
    { DIMDataTypeID: "6", DIMDataTypeDesc: "מלר'ד" },
    { DIMDataTypeID: "7", DIMDataTypeDesc: "חדר לידה" },
    { DIMDataTypeID: "8", DIMDataTypeDesc: "דיאליזה" },
    { DIMDataTypeID: "9", DIMDataTypeDesc: "גסטרו" },
    { DIMDataTypeID: "10", DIMDataTypeDesc: "צנתורים" }
  ];

  sheet_data_1 = [];
  sheet_data_2 = [];
  sheet_data_3 = [];
  sheet_data_4 = [];

  surgeryTypesArray = [
    { id: 1, value: 'אמבולטורי', search: "'_AMBOLATORY','_ELECTIVE_AMBOLATORY'" },
    { id: 2, value: 'דחוף', search: "'_DHOF_AMBOLATORY','_DHOF_ELECTIVE','_DHOF_SISIA_ELECTIVE'" },
    { id: 3, value: 'אלקטיב', search: "'_ELECTIVE','_ELECTIVE_ELECTIVE'" },
    { id: 4, value: 'ססיה אמבולטורי', search: "'_SISIA_AMBOLATORY'" },
    { id: 5, value: 'ססיה אלקטיב', search: "'_SISIA_ELECTIVE'" }
  ];
  selectSurgeryTypes = new FormControl(0, null);
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
  groupReleaseTime: string = "";
  // lineTime: string = "שבוע";
  pieTime: string = "";
  innerWidth: number;
  width: number;
  phoneMode: string = "0";
  _ifSeode = 'סיעודיות';
  changePercent: number = 0;
  displayedColumns: string[] = ['DoctorName', 'DepartmentName', 'Q', 'Actions'];
  tableView = false;
  UserName = localStorage.getItem("loginUserName").toLowerCase();
  _changeScale = "Up";
  filterValue: any;
  filterDeparts = [];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(PieChartComponent) pie: PieChartComponent;
  @ViewChild(GroupedBarChartComponent) group: GroupedBarChartComponent;
  @ViewChild(GroupedBarChart2Component) group2: GroupedBarChart2Component;
  @ViewChild(GroupedBarChartReleaseComponent) groupRelease: GroupedBarChartReleaseComponent;
  @ViewChild(BarChartComponent) bar: BarChartComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(LineChartComponent) line: LineChartComponent;

  constructor(private http: HttpClient, private fb: FormBuilder) {
  }
  graphsCtrl: FormGroup;
  surgeryDeptTypeGroup: FormGroup;
  hospitalDepartTypeGroup: FormGroup;
  surgeryChooseTypeGroup: FormGroup;
  releaseDeptChooseGroup: FormGroup;
  deliveryPrematureGroup: FormGroup;
  releasePatient: any;

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
    this.releaseDeptChooseGroup = this.fb.group({
      releaseDeptChoose: new FormControl('ספנ-א', null)
    });
    this.deliveryPrematureGroup = this.fb.group({
      deliveryPremature: new FormControl(false, null),
      ByDoctor: new FormControl(false, null)
    });
    this.graphsCtrl = this.fb.group({
      pieCtrl: new FormControl('1', null),
      barCtrl: new FormControl('1', null),
      groupCtrl: new FormControl('1', null),
      groupCtrl2: new FormControl('1', null),
      groupReleaseCtrl: new FormControl('1', null),
      // lineCtrl: new FormControl('1', null),
    });

    this.innerWidth = window.innerWidth;
    this.width = (this.innerWidth - 100);
    if (this.width <= 1180) {
      this.phoneMode = "1";
    }
    this.getCardsVals();
    this.getTimeType(this.TimeLineParam);
    setTimeout(() => {
      this.changeTime(this.TimeLineParam, 'all', this.periodListToSend);
    }, 1500);
    this.showYearsPeriod();
  }

  // test() {
  //   var btn = document.querySelector(".depts-list-menu");
  //   var position = 0 ;
  //   btn.addEventListener("mouseover", function () {
  //     position ? (position = 0) : (position = 150);
  //     btn.setAttribute("style", `transform: translate(${position}px,0px); transition: all 0.2s ease`);
  //   });
  // }

  graphsTitles() {
    let titles = {
      pie: ['TOP 10 ניתוחים', '', 'TOP 10 צילומים', '', 'מחלקות עם מספר קבלות גבוה', 'TOP 10 אבחנות', 'פילוח סוגי לידות', 'אחוז מטופלים לפי ימים', 'אחוז פעולות לפי מבצע', 'אחוז צנתורים לפי ימי שבוע', ''],
      bar: ['ניתוחים ברמת מחלקה', 'ביקורים לפי מרפאה', 'צילומים ברמת מכון', '', 'כמות קבלות', 'כמות פניות למחלקות ' + this._ifSeode, 'כמות לידות', 'מספר מטופלים', 'מספר פעולות', 'מספר צנתורים לתקופת', 'ביקורים לפי מרפאה'],
      group: ['ניתוחים לפי מחלקה וסוג ניתוח', 'ביקורים לפי מרפאה ומשמרת', 'צילומים לפי מכון ומשמרת', '', 'קבלות לפי משמרת', 'פניות לפי מחלקות ' + this._ifSeode + ' במשמרת', 'כמות וסוגי לידות לפי משמרת', 'כמות מטופלי דיאליזה במשמרת', 'מספר מטופלים לפי משמרת', 'מספר צנתורים לפי משמרת', 'ביקורים לפי מרפאה ומשמרת'],
      group2: ['כמות ניתוחים למחלקה', 'ביקורים לפי מרפאה וזמן', 'כמות צילומים למכון', '', 'קבלות לפי ציר זמן ומחלקה', 'פניות למחלקות ' + this._ifSeode, 'לידות לפי ציר זמן', 'מספר מטופלי דיאליזה לפי ציר זמן', 'מספר מטופלים לפי ציר זמן', 'מספר צנתורים לפי צרי זמן', 'ביקורים לפי מרפאה וזמן'],
      groupRelease: ['', '', '', '', 'שחרורים לפי זמן ', '', '', '', '', '', ''],
    };
    return titles;
  }

  changeTime(event, type, periodList) {
    this.TimeLineParam = event;

    let _surgeryDeptType = this.surgeryDeptTypeGroup.controls['surgeryDeptType'].value;
    let _hospitalDeptType = this.hospitalDepartTypeGroup.controls['hospitalDepartType'].value;
    let _surgeryChooseType = this.surgeryChooseTypeGroup.controls['surgeryChooseType'].value;
    let _returnedPatients = this.hospitalDepartTypeGroup.controls['returnedPatients'].value;
    let _releaseDeptChoose = this.releaseDeptChooseGroup.controls['releaseDeptChoose'].value;
    this.releasePatient = _releaseDeptChoose;
    if (this.departParam == "7" || this.departParam == "3" || this.departParam == "1" || this.departParam == "2") {
      _returnedPatients = this.deliveryPrematureGroup.controls['deliveryPremature'].value;
      if (this.departParam == "2") {
        _surgeryChooseType = this.deliveryPrematureGroup.controls['ByDoctor'].value;
      }
    }
    let valueOfSwitch = _surgeryDeptType;
    if (this.departParam == "6" || this.departParam == "5") {
      valueOfSwitch = _hospitalDeptType;
    }
    // the multiple select form
    if (this.departParam == "1" && _surgeryDeptType.value != undefined) {
      valueOfSwitch = _surgeryDeptType.value.map(x => x).join(",");
    }
    // choosing the years period of the 5 year screen
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
    this.getCardsVals();
    switch (type) {
      case "all": {
        this.pieTime = this.graphsTitles().pie[parseInt(this.departParam) - 1] + ' ' + this.pie.refresh(event, this.departParam, valueOfSwitch, _returnedPatients, periodList);
        this.graphsCtrl.controls['pieCtrl'].setValue(event);
        this.barTime = this.graphsTitles().bar[parseInt(this.departParam) - 1] + ' ' + this.bar.refresh(event, this.departParam, valueOfSwitch, _returnedPatients, periodList);
        this.graphsCtrl.controls['barCtrl'].setValue(event);
        this.groupTime = this.graphsTitles().group[parseInt(this.departParam) - 1] + ' ' + this.group.refresh(event, this.departParam, valueOfSwitch, _surgeryChooseType, _returnedPatients, periodList);
        this.graphsCtrl.controls['groupCtrl'].setValue(event);
        this.groupTime2 = this.graphsTitles().group2[parseInt(this.departParam) - 1] + ' ' + this.group2.refresh(event, this.departParam, valueOfSwitch, _returnedPatients, periodList);
        this.graphsCtrl.controls['groupCtrl2'].setValue(event);
        // this.lineTime = this.titles.line[parseInt(this.departParam) - 1] + ' ' + this.line.refresh(event, this.departParam, _surgeryDeptType);
        // this.graphsCtrl.controls['lineCtrl'].setValue(event);
        // let test = this.groupRelease.test();
        if (this.departParam == "5" || this.departParam == "6") {
          try {
            this.groupReleaseTime = this.graphsTitles().groupRelease[parseInt(this.departParam) - 1] + ' ' + this.groupRelease.refresh(event, this.departParam, valueOfSwitch, _returnedPatients, periodList, this.releasePatient);
          } catch (error) {
            console.log("error");
          }

          this.graphsCtrl.controls['groupReleaseCtrl'].setValue(event);
        }
        break;
      }
      case "pie": {
        this.pieTime = this.graphsTitles().pie[parseInt(this.departParam) - 1] + ' ' + this.pie.refresh(event, this.departParam, valueOfSwitch, _returnedPatients, periodList);
        this.graphsCtrl.controls['pieCtrl'].setValue(event);
        break;
      }
      case "group": {
        this.groupTime = this.graphsTitles().group[parseInt(this.departParam) - 1] + ' ' + this.group.refresh(event, this.departParam, valueOfSwitch, _surgeryChooseType, _returnedPatients, periodList);
        this.graphsCtrl.controls['groupCtrl'].setValue(event);
        break;
      }
      case "group2": {
        this.groupTime2 = this.graphsTitles().group2[parseInt(this.departParam) - 1] + ' ' + this.group2.refresh(event, this.departParam, valueOfSwitch, _returnedPatients, periodList);
        this.graphsCtrl.controls['groupCtrl2'].setValue(event);
        break;
      }
      case "groupRelease": {
        try {
          this.groupReleaseTime = this.graphsTitles().groupRelease[parseInt(this.departParam) - 1] + ' ' + this.groupRelease.refresh(event, this.departParam, valueOfSwitch, _returnedPatients, periodList, this.releasePatient);
        } catch (error) {
          console.log("error");
        }
        this.graphsCtrl.controls['groupReleaseCtrl'].setValue(event);
        break;
      }
      case "bar": {
        this.barTime = this.graphsTitles().bar[parseInt(this.departParam) - 1] + ' ' + this.bar.refresh(event, this.departParam, valueOfSwitch, _returnedPatients, periodList);
        this.graphsCtrl.controls['barCtrl'].setValue(event);
        break;
      }
      // case "line": {
      //   this.lineTime = this.titles.line[parseInt(this.departParam) - 1] + ' ' + this.line.refresh(event, this.departParam, _surgeryDeptType);
      //   this.graphsCtrl.controls['lineCtrl'].setValue(event);
      //   break;
      // }
      default: {
        this.pieTime = this.graphsTitles().pie[parseInt(this.departParam) - 1] + ' ' + this.pie.refresh(event, this.departParam, valueOfSwitch, _returnedPatients, periodList);
        this.graphsCtrl.controls['pieCtrl'].setValue(event);
        this.barTime = this.graphsTitles().bar[parseInt(this.departParam) - 1] + ' ' + this.bar.refresh(event, this.departParam, valueOfSwitch, _returnedPatients, periodList);
        this.graphsCtrl.controls['barCtrl'].setValue(event);
        this.groupTime = this.graphsTitles().group[parseInt(this.departParam) - 1] + ' ' + this.group.refresh(event, this.departParam, valueOfSwitch, _surgeryChooseType, _returnedPatients, periodList);
        this.graphsCtrl.controls['groupCtrl'].setValue(event);
        this.groupTime2 = this.graphsTitles().group2[parseInt(this.departParam) - 1] + ' ' + this.group2.refresh(event, this.departParam, valueOfSwitch, _returnedPatients, periodList);
        this.graphsCtrl.controls['groupCtrl2'].setValue(event);
        if (this.departParam == "5" || this.departParam == "6") {
          try {
            this.groupReleaseTime = this.graphsTitles().groupRelease[parseInt(this.departParam) - 1] + ' ' + this.groupRelease.refresh(event, this.departParam, valueOfSwitch, _returnedPatients, periodList, this.releasePatient);
          } catch (error) {
            console.log("error");
          }
          this.graphsCtrl.controls['groupReleaseCtrl'].setValue(event);
        }
        // this.lineTime = this.titles.line[parseInt(this.departParam) - 1] + ' ' + this.line.refresh(event, this.departParam, _surgeryDeptType);
        // this.graphsCtrl.controls['lineCtrl'].setValue(event);
        break;
      }
    }

    if (this.departParam == "5") {
      this.getHospitalDepartmentsTableChartList();
    }
  }


  chooseTimeValue(event) {
    this.filterValue = undefined;
    if (this.deliveryPrematureGroup.controls['ByDoctor'].value) {
      if (this.deliveryPrematureGroup.controls['deliveryPremature'].value) {
        this.getTableViewItems(event, "11");
      } else {
        this.getTableViewItems(event, "2");
      }
    } else {
      let that = this;
      setTimeout(() => {
        that.changeTime(event, 'all', []);
      }, 1000);
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
    this.filterValue = undefined;
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
      let that = this;
      setTimeout(() => {
        this.changeTime(this.TimeLineParam, 'all', this.periodListToSend);
      }, 1000);
    } else if (this.first == "undefined") {
      this.periodListToSend = [];//["-1", "-2", "-3", "-4", "-5"]
      let that = this;
      setTimeout(() => {
        this.changeTime(this.TimeLineParam, 'all', this.periodListToSend);
      }, 1000);
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
    this.deliveryPrematureGroup.controls['deliveryPremature'].setValue(false);
    this.deliveryPrematureGroup.controls['ByDoctor'].setValue(false);
    this.tableView = false;
    this.filterValue = undefined;
    this.selectSurgeryTypes.setValue('');
    this.surgeryDeptTypeGroup.controls['surgeryDeptType'].setValue('0');
    let that = this;
    setTimeout(() => {
      that.changeTime(that.TimeLineParam, 'all', that.periodListToSend);
    }, 1000);

  }

  changeSurgeryType() {
    let byDoc = this.deliveryPrematureGroup.controls['ByDoctor'].value;
    if (this.hospitalDepartTypeGroup.controls['hospitalDepartType'].value == "0") {
      this._ifSeode = 'סיעודיות';
    } else {
      this._ifSeode = 'רפואיות';
    }
    if (this.selectSurgeryTypes.value != '') {
      this.surgeryDeptTypeGroup.controls['surgeryDeptType'].setValue(this.selectSurgeryTypes);
    }
    if (byDoc) {
      if (this.deliveryPrematureGroup.controls['deliveryPremature'].value) {
        this.getTableViewItems("1", "11");
      } else {
        this.getTableViewItems("1", "2");
      }
      this.tableView = true;
    } else {
      this.tableView = false;
      let that = this;
      setTimeout(() => {
        that.changeTime(that.TimeLineParam, 'all', that.periodListToSend);
      }, 1000);
    }
  }

  applyFilter(event: Event) {
    let filterValue;
    if (event == undefined) {
      filterValue = "";
    } else if (event.isTrusted == undefined) {
      filterValue = event;
    } else {
      filterValue = (event.target as HTMLInputElement).value;
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getTableViewItems(time, depart) {
    this.http
      .post(this.configUrl + "GetTableViewForHospitalDashboard", {
        param: time,
        deptCode: depart
      })
      .subscribe((Response) => {
        this.dataSource = new MatTableDataSource<any>(Response["d"]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  changeDepartInModal(val) {
    if (this.filterValue == undefined) {
      this.filterValue = val.trim();
    } else {
      this.filterValue = undefined
    }
    let that = this;
    setTimeout(() => {
      that.changeTime(that.TimeLineParam, 'all', that.periodListToSend);
    }, 1000);
  }


  changeReleasedDept() {
    this.changeTime(this.TimeLineParam, 'all', this.periodListToSend);
  }

  getTimeType(elem) {
    // this.TimeLineParam = elem;
    let that = this;
    this.ManagedGetServerFunction('GetTimeTypes').subscribe({
      next(x) { that.timeLine = x["d"]; },
      error(err) {
        debugger
        alert('אירעה תקלה');
      },
      complete() { }
    });
  }

  getCardsVals() {
    this.loader = true;
    this.http
      .post(this.configUrl + "GetStatsValues", {
        deptCode: this.departParam,
        returnedPatients: this.deliveryPrematureGroup.controls['deliveryPremature'].value
      })
      .subscribe((Response) => {
        this.loader = false;
        this.cardsList = Response["d"];
        this.cardsList[0].y = this.cardsList[0].y + "%";
      });
  }

  getHospitalDepartmentsTableChartList() {
    this.http
      .post(this.configUrl + "GetHospitalDepartmentsTableChartList", {
        surgerydeptType: this.hospitalDepartTypeGroup.controls['hospitalDepartType'].value
      })
      .subscribe((Response) => {
        this.hospitalDepartments = Response["d"];
      });
  }

  public ManagedGetServerFunction(func): Observable<any> {
    //debugger
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

  exportToExcel() {
    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let title = this.graphsTitles();
    let worksheet = workbook.addWorksheet('Pie Chart');
    let worksheet_2 = workbook.addWorksheet('Bar Chart');
    let worksheet_3 = workbook.addWorksheet('Line Chart');
    let worksheet_4 = workbook.addWorksheet('Stacked Chart');

    //Add Row and formatting
    worksheet.mergeCells('C1', 'F1');
    worksheet.getCell('C1').value = title.pie[parseInt(this.departParam) - 1] + ' ב' + this.timeLine[parseInt(this.TimeLineParam) - 1].DimTimeTypeDesc;
    worksheet_2.mergeCells('C1', 'F1');
    worksheet_2.getCell('C1').value = title.bar[parseInt(this.departParam) - 1] + ' ב' + this.timeLine[parseInt(this.TimeLineParam) - 1].DimTimeTypeDesc;
    worksheet_3.mergeCells('C1', 'F1');
    worksheet_3.getCell('C1').value = title.group2[parseInt(this.departParam) - 1] + ' ב' + this.timeLine[parseInt(this.TimeLineParam) - 1].DimTimeTypeDesc;
    worksheet_4.mergeCells('C1', 'F1');
    worksheet_4.getCell('C1').value = title.group[parseInt(this.departParam) - 1] + ' ב' + this.timeLine[parseInt(this.TimeLineParam) - 1].DimTimeTypeDesc;

    this.sheet_data_1 = this.pie.sendDataToParent();
    this.sheet_data_2 = this.bar.sendDataToParent();
    this.sheet_data_3 = this.group2.sendDataToParent();
    this.sheet_data_4 = this.group.sendDataToParent();

    // Add Header Rows
    worksheet.addRow(Object.keys(this.sheet_data_1[0]));
    worksheet_2.addRow(Object.keys(this.sheet_data_2[0]));
    worksheet_3.addRow(Object.keys(this.sheet_data_3[0]));
    worksheet_4.addRow(Object.keys(this.sheet_data_4[0]));

    // Adding Data with Conditional Formatting
    this.sheet_data_1.forEach((d: any) => {
      worksheet.addRow(Object.values(d));
    });

    this.sheet_data_2.forEach((d: any) => {
      worksheet_2.addRow(Object.values(d));
    });

    worksheet_3.addRow(Object.values(this.sheet_data_3[0]));

    this.sheet_data_3[1].forEach((d: any) => {
      worksheet_3.addRow(Object.values(d));
    });

    worksheet_4.addRow(Object.values(this.sheet_data_4[0]));

    this.sheet_data_4[1].forEach((d: any) => {
      worksheet_4.addRow(Object.values(d));
    });

    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'נתוני דאשבורד הנהלה.xlsx');
    });
  }
}