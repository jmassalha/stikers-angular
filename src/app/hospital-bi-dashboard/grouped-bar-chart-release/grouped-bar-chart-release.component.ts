import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-grouped-bar-chart-release',
  templateUrl: './grouped-bar-chart-release.component.html',
  styleUrls: ['./grouped-bar-chart-release.component.css']
})
export class GroupedBarChartReleaseComponent implements OnInit {

  innerWidth: number;
  innerHeight: number;


  constructor(private http: HttpClient, private eRef: ElementRef) { }

  loader: boolean = true;
  TimeLineParam: string = "1";
  departParam: string = "1";
  periodList: any;
  _surgerydeptType: string = "0";
  filterVal = "";
  _returnedPatients: boolean = false;
  timesString = ['', '', '', '', ''];
  // weekObject = [
  //   { x: 'Sunday', depart: '', y: 0 },
  //   { x: 'Monday', depart: '', y: 0 },
  //   { x: 'Tuesday', depart: '', y: 0 },
  //   { x: 'Wednesday', depart: '', y: 0 },
  //   { x: 'Thursday', depart: '', y: 0 },
  //   { x: 'Friday', depart: '', y: 0 },
  //   { x: 'Saturday', depart: '', y: 0 }
  // ]
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
  height: number;


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
    this.options = {
      hAxis: {
        title: 'זמן'
      },
      vAxis: {
        minValue: 0
      },
      isStacked: true
    };
    this.innerWidth = window.innerWidth;
    this.height = window.innerWidth / 3.2;
    this.width = this.innerWidth - 70;
    this.discreteBarChart();
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.eRef.nativeElement.contains(event.target)) {
      let clickedType = event["srcElement"]["localName"];
      let departClicked = "";
      if (clickedType == "text") {
        departClicked = event["srcElement"]["innerHTML"];
      }
      if (departClicked == this.filterVal && this.filterVal != "") {
        this.filterVal = "";
        this.discreteBarChart();
      } else if (departClicked != "" && this.columnNames.includes(departClicked)) {
        this.filterVal = departClicked;
        this.filterChart();
      }
    }
  }

  filterChart() {
    let index = this.columnNames.indexOf(this.filterVal);
    this.columnNames = [this.columnNames[0], this.columnNames[index]];
    this.columnNames.push({ role: 'annotation' });
    for (let i = 0; i < this.data.length; i++) {
      this.data[i] = [this.data[i][0], this.data[i][index], this.data[i][index]];
    }
  }

  public discreteBarChart() {
    this.loader = true;
    let url = "LineBarChartReleased";
    if (this.periodList == undefined) {
      this.periodList = "";
    }
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/" + url, {
        param: this.TimeLineParam,
        deptCode: this.departParam,
        surgerydeptType: this._surgerydeptType,
        filter: this.filterVal,
        returnedPatients: this._returnedPatients,
        periodList: this.periodList
      })
      .subscribe((Response) => {
        let inquiriesStatLine = Response["d"];
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
        // if (this.TimeLineParam == "2") {
        //   let dt = new Date();
        //   let month = dt.getMonth();
        //   let year = dt.getFullYear();
        //   let daysInMonth = new Date(year, month, 0).getDate();
        //   inquiriesStatLine[0] = inquiriesStatLine[0].slice(0, daysInMonth);
        //   inquiriesStatLine[2] = inquiriesStatLine[2].slice(0, daysInMonth);
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
              temp.push(inquiriesStatLine[2][i][j].y);

              // inquiriesStatLine[1][j] = inquiriesStatLine[2][i][j].depart;
            } else {
              temp.push(0);
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
          let arrTemp = [];
          arrTemp.push(value);
          let numberOfZerosStacked = inquiriesStatLine[1].length;
          let numberOfZeros = inquiriesStatLine[1].length * 2;
          if (this.options.isStacked) {
            for (let zero = 0; zero < numberOfZerosStacked; zero++) {
              arrTemp.push(0);
            }
          } else {
            for (let zero = 0; zero < numberOfZeros; zero++) {
              arrTemp.push(0);
            }
          }
          // if the day not in finalarr then add it in right place with values of zero
          if (finalarr.length > d) {
            if (inquiriesStatLine[0][d] != finalarr[d][0]) {
              finalarr.splice(d, 0, arrTemp);
            }
          }
          else {
            finalarr.splice(d, 0, arrTemp);
          }
        }

        if (this.TimeLineParam == "1") {
          this.data = new Array(7);
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
            todayIndex--;
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
          let dt = new Date();
          let day = dt.getDate();
          let month = dt.getMonth();
          let year = dt.getFullYear();
          let daysInMonth = new Date(year, month - 1, 0).getDate();
          this.data = new Array(daysInMonth);
          let counter = 1;
          if (day == 1) {
            this.data = finalarr;
          } else if (day != 1 && day != 31) {
            for (let f = 0; f < inquiriesStatLine[0].length; f++) {
              let t = new Date(date);
              let day = t.getDate();
              let todayIndex = inquiriesStatLine[0].findIndex(x => x == day);
              todayIndex--;
              let dateDifference = todayIndex - f;
              if (dateDifference < 0) {
                dateDifference = finalarr.length - counter;
                counter++;//Math.abs(dateDifference);
              }
              this.data[f] = finalarr[dateDifference];
            }
            this.data.reverse();
            // for (let f = 0; f < daysInMonth; f++) {
            // let yesterdayIndex = inquiriesStatLine[0].findIndex(x => x == day - f);
            // if (yesterdayIndex == -1) {
            //   // this.data[f] = new Array(finalarr[0].length).fill(0);
            //   // this.data[f][0] = day;
            // }
            // //else
            // else {
            //   this.data[counter] = finalarr[yesterdayIndex];
            //   counter++;
            // }
            // }
          }
        } else if (this.TimeLineParam == "3") {
          this.data = new Array(12);
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
            monthIndex--;
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
          this.data.reverse();
        }
        let departments = [];
        for (let s = 0; s < inquiriesStatLine[1].length; s++) {
          departments.push(inquiriesStatLine[1][s]);
          departments.push({ role: 'annotation' });
        }
        this.columnNames = [...this.columnNames, ...departments];
        this.loader = false;
      });
  }

}
