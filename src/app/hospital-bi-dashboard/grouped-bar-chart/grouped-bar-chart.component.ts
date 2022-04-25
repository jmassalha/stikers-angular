import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-grouped-bar-chart',
  templateUrl: './grouped-bar-chart.component.html',
  styleUrls: ['./grouped-bar-chart.component.css']
})
export class GroupedBarChartComponent implements OnInit {
  innerWidth: number;

  constructor(private http: HttpClient) { }

  TimeLineParam: string = "1";
  departParam: string = "1";
  _surgerydeptType: string = "0";
  inquiriesStatLine = [];
  responseDeparts = [];
  loader: boolean = false;
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
  height = 800;


  refresh(elem, dept, _surgeryDeptType) {
    this.TimeLineParam = elem;
    this.departParam = dept;
    this._surgerydeptType = _surgeryDeptType;
    this.ngOnInit();
    return this.timesString[parseInt(elem) - 1];
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.width = this.innerWidth - 70;
    this.waitData();
  }

  async waitData() {
    // await this.discreteBarChart();
    this.discreteBarChart().then(() => {
      this.loader = false;
      let departments = [];
      this.data = [];
      this.columnNames = ['Year'];
      for (let s = 0; s < this.responseDeparts.length; s++) {
        departments.push(this.responseDeparts[s]);
        departments.push({ role: 'annotation' });
      }
      this.columnNames = [...this.columnNames, ...departments];

      for (let i = 0; i < this.inquiriesStatLine.length; i++) {
        let temp = [];
        let notNullIndex = this.inquiriesStatLine[i].findIndex(x => x !== null);
        temp.push(this.inquiriesStatLine[i][notNullIndex].key);
        for (let j = 0; j < this.inquiriesStatLine[i].length; j++) {
          if (this.inquiriesStatLine[i][j] != null) {
            temp.push(this.inquiriesStatLine[i][j].y);
            temp.push(this.inquiriesStatLine[i][j].y);
          } else {
            temp.push(0);
            temp.push(0);
          }
        }
        this.data.push(temp);
      }
    })
  }

  discreteBarChart(): Promise<any> {
    this.loader = true;
    return new Promise<void>((resolve, reject) => {
      this.http
        .post("http://srv-apps-prod/RCF_WS/WebService.asmx/StackedBarChart", {
          param: this.TimeLineParam,
          deptCode: this.departParam,
          surgerydeptType: this._surgerydeptType
        }).subscribe(
          res => {
            this.inquiriesStatLine = res["d"][0];
            this.responseDeparts = res["d"][1];
            resolve()
          },
          error => {
            console.error("Something went wrong: undefined: " + error);
            reject()
          }
        );
    });
  }

}
