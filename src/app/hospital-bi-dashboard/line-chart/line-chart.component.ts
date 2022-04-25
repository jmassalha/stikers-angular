import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  innerWidth: number;

  constructor(private http: HttpClient) { }

  TimeLineParam: string = "1";
  departParam: string = "1";
  _surgerydeptType: string = "0";
  timesString = ['שבוע', 'חודש', 'שנה', '5 שנים מקבילות', '5 שנים מלאות'];

  type = 'ColumnChart';
  data = [];
  columnNames = ["יום"];
  options = {
    hAxis: {
      title: 'זמן'
    },
    vAxis: {
      minValue: 0
    },
    isStacked: false
  };
  // options = {
  //   is3D: true,
  //   hAxis: {
  //     title: 'זמן'
  //   },
  //   vAxis: {
  //     title: 'כמות'
  //   },
  //   crosshair: {
  //     color: '#000000',
  //     trigger: 'selection'
  //   },
  //   pointSize: 5,
  //   curveType: 'function',
  // };
  width: number;
  height = 600;

  refresh(elem,dept,_surgeryDeptType) {
    this.TimeLineParam = elem;
    this.departParam = dept;
    this._surgerydeptType = _surgeryDeptType;
    this.ngOnInit();
    return this.timesString[parseInt(elem) - 1];
  }

  ngOnInit(): void {
    if (this.departParam == "6" && (this.TimeLineParam == "2" || this.TimeLineParam == "3")) {
      this.options = {
        hAxis: {
          title: 'זמן'
        },
        vAxis: {
          minValue: 0
        },
        isStacked: true
      };
    } else {
      this.options = {
        hAxis: {
          title: 'זמן'
        },
        vAxis: {
          minValue: 0
        },
        isStacked: false
      };
    }
    this.innerWidth = window.innerWidth;
    this.width = this.innerWidth - 70;
    this.discreteBarChart();
  }

  public discreteBarChart() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/LineBarChart", {
        param: this.TimeLineParam,
        deptCode: this.departParam
      })
      .subscribe((Response) => {
        let inquiriesStatLine = Response["d"];
        this.data = [7];
        let date = new Date();
        let finalarr = [];
        this.columnNames = ["יום"];
        if (this.TimeLineParam == "4" || this.TimeLineParam == "5") {
          let t = new Date(date);
          inquiriesStatLine[0].forEach((element, index) => {
            let temp = t.getFullYear() + parseInt(element);
            inquiriesStatLine[0][index] = temp.toString();
          });
        }
        // for (let h = 0; h < inquiriesStatLine[1].length; h++) {
        //   inquiriesStatLine[1][h] = null;
        // }

        for (let i = 0; i < inquiriesStatLine[2].length; i++) {
          let temp = [];
          let notNullIndex = inquiriesStatLine[2][i].findIndex(x => x !== null);
          let value = inquiriesStatLine[2][i][notNullIndex].x;
          if (this.TimeLineParam == "4" || this.TimeLineParam == "5") {
            let t = new Date(date);
            value = t.getFullYear() + parseInt(value);
          }
          temp.push(value.toString());
          for (let j = 0; j < inquiriesStatLine[2][i].length; j++) {
            if (inquiriesStatLine[2][i][j] != null) {
              temp.push(inquiriesStatLine[2][i][j].y);
              inquiriesStatLine[1][j] = inquiriesStatLine[2][i][j].depart;
            } else {
              temp.push(0);
            }
          }
          finalarr.push(temp);
        } 

        for (let d = 0; d < inquiriesStatLine[0].length; d++) {
          let value = inquiriesStatLine[0][d];
          if (this.TimeLineParam == "4" || this.TimeLineParam == "5") {
            let t = new Date(date);
            value = t.getFullYear() + parseInt(value);
          }
          let arrTemp = [value, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          if (inquiriesStatLine[0][d] != finalarr[d][0]) {
            finalarr.splice(d, 0, arrTemp);
          }
        }

        if (this.TimeLineParam == "1") {
          let counter = 1;
          finalarr[0][0] = 'ראשון';
          finalarr[1][0] = 'שני';
          finalarr[2][0] = 'שלישי';
          finalarr[3][0] = 'רביעי';
          finalarr[4][0] = 'חמישי';
          finalarr[5][0] = 'שישי';
          finalarr[6][0] = 'שבת';
          for (let f = 0; f < inquiriesStatLine[0].length; f++) {
            let t = new Date(date);
            let dayName = inquiriesStatLine[0][t.getDay()];
            let todayIndex = inquiriesStatLine[0].findIndex(x => x == dayName);
            let dateDifference = todayIndex - f;
            // if (dateDifference < 0) {
            //   dateDifference = todayIndex + Math.abs(dateDifference);
            // }
            if (dateDifference < 0) {
              dateDifference = todayIndex + ((finalarr.length - counter) - todayIndex);
              counter++;//Math.abs(dateDifference);
            }

            this.data[f] = finalarr[dateDifference];
          }
          this.data.reverse();
        } else if (this.TimeLineParam == "2") {
          let counter = 1;
          for (let f = 0; f < inquiriesStatLine[0].length; f++) {
            let t = new Date(date);
            let day = t.getDate();
            let todayIndex = inquiriesStatLine[0].findIndex(x => x == day);
            let dateDifference = todayIndex - f;
            if (dateDifference < 0) {
              dateDifference = todayIndex + ((finalarr.length - counter) - todayIndex);
              counter++;//Math.abs(dateDifference);
            }
            this.data[f] = finalarr[dateDifference];
          }
          this.data.reverse();
        } else if (this.TimeLineParam == "3") {
          let counter = 1;
          finalarr[0][0] = 'ינואר';
          finalarr[1][0] = 'פברואר';
          finalarr[2][0] = 'מרץ';
          finalarr[3][0] = 'אפריל';
          finalarr[4][0] = 'מאי';
          finalarr[5][0] = 'יוני';
          finalarr[6][0] = 'יולי';
          finalarr[7][0] = 'אוגוסט';
          finalarr[8][0] = 'ספטמבר';
          finalarr[9][0] = 'אוקטובר';
          finalarr[10][0] = 'נובמבר';
          finalarr[11][0] = 'דצמבר';
          for (let f = 0; f < inquiriesStatLine[0].length; f++) {
            let t = new Date(date);
            let month = t.getMonth();
            let monthIndex = month - f;
            if (monthIndex < 0) {
              monthIndex = finalarr.length - counter;
              counter++;
            }
            this.data[f] = finalarr[monthIndex];
          }
          this.data.reverse();
        }
        else {
          this.data = finalarr;
        }
        this.columnNames = [...this.columnNames, ...inquiriesStatLine[1]];

      });
  }
}
