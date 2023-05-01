import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-grouped-bar-chart2',
  templateUrl: './grouped-bar-chart2.component.html',
  styleUrls: ['./grouped-bar-chart2.component.css']
})
export class GroupedBarChart2Component implements OnInit {

  innerWidth: number;
  innerHeight: number;

  constructor(private http: HttpClient, private eRef: ElementRef) { }

  @Output() newItemEvent = new EventEmitter<string[]>();
  @Output() secondItemEvent = new EventEmitter<string[]>();
  @Input() filterValue;
  TimeLineParam: string = "1";
  departParam: string = "1";
  periodList: any;
  @Input() graphSource;
  @Input() graphNumber;
  _surgerydeptType: string = "0";
  filterVal = "";
  totalNumberOfOccurincy = 0;
  percent: boolean = false;
  _returnedPatients: boolean = false;
  timesString = ['', '', '', '', ''];
  Excel_Data = [];
  type = 'ColumnChart';
  data = [];
  allData = [];
  columnNames = [];
  allColumnNames = [];
  options = {
    hAxis: {
      title: 'זמן'
    },
    vAxis: {
      // format: '#%',
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
    if ((this.TimeLineParam == "2" || this.TimeLineParam == "3") || this.departParam == "5" || this.departParam == "1" || this.departParam == "2") {
      this.options = {
        hAxis: {
          title: 'זמן'
        },
        vAxis: {
          // format: '#%',
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
          // format: '#%',
          minValue: 0
        },
        isStacked: false
      };
    }
    this.innerWidth = window.innerWidth;
    this.height = window.innerWidth / 3.2;
    this.width = this.innerWidth - 70;

    if (this.filterValue == undefined) {
      this.discreteBarChart();
    } else {
      let selection = {
        selection: [{
          column: this.filterValue,
          row: 0
        }]
      }
      this.universalSelect(selection);
    }
  }

  sendDataToParentExcel() {
    let result = [];
    if (!this.options.isStacked) {
      this.data.forEach(element => {
        for (let i = 0; i < element.length; i++) {
          if (i % 2 != 0) {
            delete element[i];
          } else if (i % 2 == 0 && i != 0) {
            delete this.columnNames[i];
          }
        }
      });
    }
    result.push(this.columnNames);
    result.push(this.data);
    return result;
  }

  onSelect(event) {
    if (event !== undefined) {
      let selected = event.selection[0];
      if (this.columnNames.length == 3) {
        this.discreteBarChart();
      } else {
        this.totalNumberOfOccurincy = 0;
        let index = selected.column;
        this.columnNames = [this.columnNames[0], this.columnNames[index]];
        this.columnNames.push({ role: 'annotation' });

        for (let i = 0; i < this.data.length; i++) {
          this.data[i] = [this.allData[i][0], this.allData[i][index], this.allData[i][index]];
        }
      }
    }
    this.newItemEvent.emit(this.columnNames[1]);
  }

  universalSelect(event) {
    if (event.selection[0].column !== undefined) {
      let selected = event.selection[0];
      if (selected.column == "הכל") {
        this.discreteBarChart();
      } else {
        let index = this.allColumnNames.indexOf(selected.column.trim());
        this.columnNames = [this.allColumnNames[0], selected.column];
        this.columnNames.push({ role: 'annotation' });
        this.data = [];
        // for (let i = this.allData.length - 1; i >= 0; i--) {
        //   this.data.push([this.allData[i][0], this.allData[i][index], this.allData[i][index]]);
        // }
        for (let i = 0; i < this.allData.length; i++) {
          if (this.allData[i].length == 3) {
            this.data.push([this.allData[i][0], this.allData[i][1], this.allData[i][2]]);
          } else {
            this.data.push([this.allData[i][0], this.allData[i][index], this.allData[i][index]]);
          }
        }
      }
    }
  }

  // @HostListener('document:click', ['$event'])
  // clickout(event) {
  //   if (this.eRef.nativeElement.contains(event.target)) {
  //     let clickedType = event["srcElement"]["localName"];
  //     let departClicked = "";
  //     if (clickedType == "text") {
  //       departClicked = event["srcElement"]["innerHTML"];
  //     }
  //     if (departClicked == this.filterVal && this.filterVal != "") {
  //       this.filterVal = "";
  //       this.discreteBarChart();
  //     } else if (departClicked != "" && this.columnNames.includes(departClicked)) {
  //       this.filterVal = departClicked;
  //       this.filterChart();
  //     }
  //   }
  // }

  changePercent() {
    let index = this.columnNames.indexOf(this.filterVal);
    if (!this.percent) {
      this.percent = true;
      for (let i = 0; i < this.data.length; i++) {
        let percent = (this.data[i][1] / this.totalNumberOfOccurincy) * 100;
        this.data[i] = [this.data[i][0], parseFloat(percent.toFixed(0)), parseFloat(percent.toFixed(0))];
      }
    } else {
      this.percent = false;
      for (let i = 0; i < this.data.length; i++) {
        this.data[i] = [this.data[i][0], this.data[i][1], this.data[i][1]];
      }
    }
  }

  // filterChart() {
  //   this.totalNumberOfOccurincy = 0;
  //   let index = this.columnNames.indexOf(this.filterVal);
  //   this.columnNames = [this.columnNames[0], this.columnNames[index]];
  //   this.columnNames.push({ role: 'annotation' });

  //   for (let i = 0; i < this.data.length; i++) {
  //     this.data[i] = [this.data[i][0], this.data[i][index], this.data[i][index]];
  //   }
  // }

  public discreteBarChart() {
    let url = "LineBarChart";
    if (this.graphSource == "normal") {
      if (this.departParam == "6") {
        url = "LineBarChartForER";
      } else if (this.departParam == "5") {
        url = "LineBarChartHospitalDeparts";
      } else if (this.departParam == "3") {
        url = "LineBarChartRentgenDimot";
      }
    } else {
      url = "LineBarChartSurgeryStatistics";
    }
    if (this.periodList == undefined) {
      this.periodList = "";
    }
    this.http
      .post(environment.url + url, {
        param: this.TimeLineParam,
        deptCode: this.departParam,
        surgerydeptType: this._surgerydeptType,
        filter: this.filterVal,
        returnedPatients: this._returnedPatients,
        periodList: this.periodList,
        graphNumber: this.graphNumber,
      })
      .subscribe((Response) => {
        let inquiriesStatLine = Response["d"];
        let date = new Date();
        let finalarr = [];
        this.columnNames = ["יום"];
        this.allColumnNames = ["יום"];
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

        // PROCCESS THE DATA INTO ARRAYS
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
              if (!this.options.isStacked) {
                temp.push(inquiriesStatLine[2][i][j].y);
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
            this.allData[f] = finalarr[dateDifference];
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
              this.allData[f] = finalarr[dateDifference];
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
            this.allData[f] = finalarr[monthIndex];
          }
          this.data.reverse();
        }
        else {
          this.data = finalarr;
          this.allData = finalarr;
          this.data.reverse();
        }
        let departments = [];
        for (let s = 0; s < inquiriesStatLine[1].length; s++) {
          departments.push(inquiriesStatLine[1][s]);
          if (!this.options.isStacked) {
            departments.push({ role: 'annotation' });
          }
        }
        this.columnNames = [...this.columnNames, ...departments];
        this.allColumnNames = [...this.allColumnNames, ...departments];
      });
  }
}