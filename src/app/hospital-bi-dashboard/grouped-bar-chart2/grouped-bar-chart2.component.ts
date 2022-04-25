import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-grouped-bar-chart2',
  templateUrl: './grouped-bar-chart2.component.html',
  styleUrls: ['./grouped-bar-chart2.component.css']
})
export class GroupedBarChart2Component implements OnInit {

  innerWidth: number;

  constructor(private http: HttpClient) { }

  TimeLineParam: string = "1";
  departParam: string = "1";
  _surgerydeptType: string = "0";
  timesString = ['שבוע', 'חודש', 'שנה', '5 שנים מקבילות', '5 שנים מלאות'];

  // title = 'Population (in millions)';
  type = 'ColumnChart';
  data = [];
  columnNames = [];
  options = {
    hAxis: {
      title: 'זמן'
    },
    vAxis: {
      minValue: 0
    },
    isStacked: false
  };
  width: number;
  height = 600;


  refresh(elem, dept, _surgeryDeptType) {
    this.TimeLineParam = elem;
    this.departParam = dept;
    this._surgerydeptType = _surgeryDeptType;
    this.ngOnInit();
    return this.timesString[parseInt(elem) - 1];
  }

  ngOnInit(): void {
    if (this.departParam != "6") {
      this.options = {
        hAxis: {
          title: 'זמן'
        },
        vAxis: {
          minValue: 0
        },
        isStacked: false
      };
    } else {
      if(this.TimeLineParam != "1")
      this.options = {
        hAxis: {
          title: 'זמן'
        },
        vAxis: {
          minValue: 0
        },
        isStacked: true
      };
    }
    this.innerWidth = window.innerWidth;
    this.width = this.innerWidth - 70;
    this.discreteBarChart();
  }

  public discreteBarChart() {
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/StackedBarChart2", {
        param: this.TimeLineParam,
        deptCode: this.departParam,
        surgerydeptType: this._surgerydeptType
      })
      .subscribe((Response) => {
        let inquiriesStatLine = Response["d"][0];
        let departments = [];
        let date = new Date();
        this.data = [];
        let finalarr = [];
        this.columnNames = ['Year'];
        let daysHebrew = [
          'ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'
        ];
        let yearHebrew = [
          'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
        ];
        for (let s = 0; s < Response["d"][1].length; s++) {
          departments.push(Response["d"][1][s]);
          if (!this.options.isStacked) {
            departments.push({ role: 'annotation' });
          }
        }
        this.columnNames = [...this.columnNames, ...departments];

        for (let i = 0; i < inquiriesStatLine.length; i++) {
          let temp = [];
          let notNullIndex = inquiriesStatLine[i].findIndex(x => x !== null);
          let value = inquiriesStatLine[i][notNullIndex].key;
          if (this.TimeLineParam == "4" || this.TimeLineParam == "5") {
            let t = new Date(date);
            value = t.getFullYear() + parseInt(value);
          }
          temp.push(value.toString());
          for (let j = 0; j < inquiriesStatLine[i].length; j++) {
            if (inquiriesStatLine[i][j] != null) {
              temp.push(inquiriesStatLine[i][j].y);
              if (!this.options.isStacked) {
                temp.push(inquiriesStatLine[i][j].y);
              }
            } else {
              temp.push(0);
              if (!this.options.isStacked) {
                temp.push(0);
              }
            }
          }
          finalarr.push(temp);
          
        }
        this.data = finalarr;
        let d = new Date();
        // if (this.TimeLineParam == "1") {
        //   // let temp = [daysHebrew[d.getDay()], 0, 0, 0, 0, 0, 0, 0, 0];
        //   // finalarr.splice(d.getDay(), 0, temp)
        //   let counter = 1;
        //   finalarr[0][0] = 'ראשון';
        //   finalarr[1][0] = 'שני';
        //   finalarr[2][0] = 'שלישי';
        //   finalarr[3][0] = 'רביעי';
        //   finalarr[4][0] = 'חמישי';
        //   finalarr[5][0] = 'שישי';
        //   finalarr[6][0] = 'שבת';
        //   for (let f = 0; f < inquiriesStatLine.length; f++) {
        //     let t = new Date(date);
        //     let dayName = inquiriesStatLine[t.getDay()];
        //     let todayIndex = inquiriesStatLine.findIndex(x => x == dayName);
        //     let dateDifference = todayIndex - f;
        //     // if (dateDifference < 0) {
        //     //   dateDifference = todayIndex + Math.abs(dateDifference);
        //     // }
        //     if (dateDifference < 0) {
        //       dateDifference = todayIndex + ((finalarr.length - counter) - todayIndex);
        //       counter++;//Math.abs(dateDifference);
        //     }

        //     this.data[f] = finalarr[dateDifference];
        //     // this.data = finalarr;
        //   }
        //   this.data.reverse();
        // } else if (this.TimeLineParam == "2") {
        //   let counter = 1;
        //   for (let f = 0; f < inquiriesStatLine[0].length; f++) {
        //     let t = new Date(date);
        //     let day = t.getDate();
        //     let todayIndex = inquiriesStatLine[0].findIndex(x => x == day);
        //     let dateDifference = todayIndex - f;
        //     if (dateDifference < 0) {
        //       dateDifference = todayIndex + ((finalarr.length - counter) - todayIndex);
        //       counter++;//Math.abs(dateDifference);
        //     }
        //     this.data[f] = finalarr[dateDifference];
        //     // this.data = finalarr;
        //   }
        //   this.data.reverse();
        // } else if (this.TimeLineParam == "3") {
        //   let counter = 1;
        //   finalarr[0][0] = 'ינואר';
        //   finalarr[1][0] = 'פברואר';
        //   finalarr[2][0] = 'מרץ';
        //   finalarr[3][0] = 'אפריל';
        //   finalarr[4][0] = 'מאי';
        //   finalarr[5][0] = 'יוני';
        //   finalarr[6][0] = 'יולי';
        //   finalarr[7][0] = 'אוגוסט';
        //   finalarr[8][0] = 'ספטמבר';
        //   finalarr[9][0] = 'אוקטובר';
        //   finalarr[10][0] = 'נובמבר';
        //   finalarr[11][0] = 'דצמבר';
        //   for (let f = 0; f < inquiriesStatLine[0].length; f++) {
        //     let t = new Date(date);
        //     let month = t.getMonth();
        //     let monthIndex = month - f;
        //     if (monthIndex < 0) {
        //       monthIndex = finalarr.length - counter;
        //       counter++;
        //     }
        //     this.data[f] = finalarr[monthIndex];
        //     // this.data = finalarr;
        //   }
        //   this.data.reverse();
        // }
        // else {
        //   this.data = finalarr;
        // }
      });
  }

}
