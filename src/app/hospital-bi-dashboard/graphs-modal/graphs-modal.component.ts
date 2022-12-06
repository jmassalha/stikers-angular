// import { Component, Inject, OnInit } from "@angular/core";
// import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
// import { DialogData } from "src/app/medigate-servers/data-row-table/data-row-table.component";

// @Component({
//   selector: 'app-graphs-modal',
//   templateUrl: './graphs-modal.component.html',
//   styleUrls: ['./graphs-modal.component.css']
// })
// export class GraphsModalComponent implements OnInit {

//   graphSource: string;
//   constructor(
//     public dialogRef: MatDialogRef<GraphsModalComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: DialogData
//   ) { }

//   ngOnInit(): void {
//     this.graphSource = this.data["graphSource"];
//   }

//   onNoClick(): void {
//     this.dialogRef.close();
//   }
// }

import { Component, ElementRef, EventEmitter, HostListener, Inject, Input, OnInit, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/medigate-servers/data-row-table/data-row-table.component';

@Component({
  selector: 'app-graphs-modal',
  templateUrl: './graphs-modal.component.html',
  styleUrls: ['./graphs-modal.component.css']
})
export class GraphsModalComponent implements OnInit {

  innerWidth: number;
  innerHeight: number;

  constructor(private http: HttpClient, private eRef: ElementRef,
    public dialogRef: MatDialogRef<GraphsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DialogData) { }

  @Output() myEvent = new EventEmitter();
  @Output() newItemEvent = new EventEmitter<string[]>();
  @Output() secondItemEvent = new EventEmitter<string[]>();
  @Input() filterValue;
  @Input() surgeriesPlace;
  @Input() surgeriesType;
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
  data1 = [];
  data2 = [];
  data3 = [];
  data4 = [];
  data5 = [];
  allData1 = [];
  allData2 = [];
  allData3 = [];
  allData4 = [];
  allData5 = [];
  columnNames1 = [];
  columnNames2 = [];
  columnNames3 = [];
  columnNames4 = [];
  columnNames5 = [];
  allColumnNames1 = [];
  allColumnNames2 = [];
  allColumnNames3 = [];
  allColumnNames4 = [];
  allColumnNames5 = [];
  excelLoader: boolean;
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
  options2 = {
    legend: 'none',
    colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f']
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
    this.filterValue = this.dataDialog['filterValue'];
    this.surgeriesPlace = this.dataDialog['surgeriesPlace'];
    this.surgeriesType = this.dataDialog['surgeriesType'];
    this.excelLoader = true;
    this.TimeLineParam = this.dataDialog['param'];
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
    this.innerWidth = window.innerWidth;
    // this.height = window.innerWidth / 3.2;
    // this.width = this.innerWidth - 70;
    this.width = (this.innerWidth - 100) / 2;
    if (this.width <= 740) {
      this.width = this.width * 2;
    }

    let that = this;

    this.discreteBarChart(1);
    setTimeout(() => {
      that.discreteBarChart(2);
    }, 500);
    setTimeout(() => {
      that.discreteBarChart(3);
    }, 700);
    setTimeout(() => {
      that.discreteBarChart(4);
    }, 1200);
    setTimeout(() => {
      that.discreteBarChart(5);
    }, 1500);
    if (this.filterValue != undefined) {
      let selection = {
        selection: [{
          column: this.filterValue,
          row: 0
        }]
      }
      setTimeout(() => {
        that.universalSelect(selection);
      }, 1700);
    }
    if (that.dataDialog['type'] == "excel") {
      setTimeout(() => {
        that.dialogRef.close(that.sendDataToParentExcel());
      }, 2000);
    } else {
      this.excelLoader = false;
    }
  }


  sendDataToParentExcel() {
    let result = [];
    // let data2 = [];
    // let data4 = [];
    // this.data2.forEach(element => {
    //   data2.push([element[0], element[1]])
    // })
    // this.data4.forEach(element => {
    //   data4.push([element[0], element[1]])
    // })
    result.push({ number: 1, columnnames: this.columnNames1, arr: this.data1 });
    result.push({ number: 2, columnnames: this.columnNames2, arr: this.data2 });
    result.push({ number: 3, columnnames: this.columnNames3, arr: this.data3 });
    result.push({ number: 4, columnnames: this.columnNames4, arr: this.data4 });
    result.push({ number: 5, columnnames: this.columnNames5, arr: this.data5 });
    return result;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSelect(event, graphNumber) {
    if (event !== undefined) {
      let selected = event.selection[0];
      let that = this;
      if (this.columnNames1.length == 3) {
        this.discreteBarChart(1);
        setTimeout(() => {
          that.discreteBarChart(2);
        }, 500);
        setTimeout(() => {
          that.discreteBarChart(3);
        }, 700);
        setTimeout(() => {
          that.discreteBarChart(4);
        }, 850);
        setTimeout(() => {
          that.discreteBarChart(5);
        }, 1000);
      } else {
        this.totalNumberOfOccurincy = 0;
        let index = selected.column;
        let word = "";
        if (graphNumber == 1) {
          word = this.columnNames1[index].trim();
        } else if (graphNumber == 2) {
          word = this.columnNames2[index].trim();
        } else if (graphNumber == 3) {
          word = this.columnNames3[index].trim();
        } else if (graphNumber == 4) {
          word = this.columnNames4[index].trim();
        } else if (graphNumber == 5) {
          word = this.columnNames5[index].trim();
        }
        let index1 = this.allColumnNames1.indexOf(word);
        this.columnNames1 = [this.columnNames1[0], this.columnNames1[index1]];
        this.columnNames1.push({ role: 'annotation' });
        let index2 = this.allColumnNames2.indexOf(word);
        this.columnNames2 = [this.columnNames2[0], this.columnNames2[index2]];
        this.columnNames2.push({ role: 'annotation' });
        let index3 = this.allColumnNames3.indexOf(word);
        this.columnNames3 = [this.columnNames3[0], this.columnNames3[index3]];
        this.columnNames3.push({ role: 'annotation' });
        let index4 = this.allColumnNames4.indexOf(word);
        this.columnNames4 = [this.columnNames4[0], this.columnNames4[index4]];
        this.columnNames4.push({ role: 'annotation' });
        let index5 = this.allColumnNames5.indexOf(word);
        this.columnNames5 = [this.columnNames5[0], this.columnNames5[index5]];
        this.columnNames5.push({ role: 'annotation' });

        for (let i = 0; i < this.data1.length; i++) {
          this.data1[i] = [this.allData1[i][0], this.allData1[i][index1], this.allData1[i][index1]];
        }
        for (let i = 0; i < this.data2.length; i++) {
          this.data2[i] = [this.allData2[i][0], this.allData2[i][index2], this.allData2[i][index2]];
        }
        for (let i = 0; i < this.data3.length; i++) {
          this.data3[i] = [this.allData3[i][0], this.allData3[i][index3], this.allData3[i][index3]];
        }
        for (let i = 0; i < this.data4.length; i++) {
          this.data4[i] = [this.allData4[i][0], this.allData4[i][index4], this.allData4[i][index4]];
        }
        for (let i = 0; i < this.data5.length; i++) {
          this.data5[i] = [this.allData5[i][0], this.allData5[i][index5], this.allData5[i][index5]];
        }
      }
    }
    // this.newItemEvent.emit(this.columnNames1[1]);
  }

  universalSelect(event) {
    if (event.selection[0].column !== undefined) {
      let selected = event.selection[0];
      let that = this;
      if (selected.column == "הכל") {
        this.discreteBarChart(1);
        setTimeout(() => {
          that.discreteBarChart(2);
        }, 500);
        setTimeout(() => {
          that.discreteBarChart(3);
        }, 700);
        setTimeout(() => {
          that.discreteBarChart(4);
        }, 850);
        setTimeout(() => {
          that.discreteBarChart(5);
        }, 1000);
      } else {
        let index = this.allColumnNames1.indexOf(selected.column.trim());
        this.columnNames1 = [this.allColumnNames1[0], selected.column];
        this.columnNames1.push({ role: 'annotation' });
        let index2 = this.allColumnNames2.indexOf(selected.column.trim());
        this.columnNames2 = [this.allColumnNames2[0], selected.column];
        this.columnNames2.push({ role: 'annotation' });
        let index3 = this.allColumnNames3.indexOf(selected.column.trim());
        this.columnNames3 = [this.allColumnNames3[0], selected.column];
        this.columnNames3.push({ role: 'annotation' });
        let index4 = this.allColumnNames4.indexOf(selected.column.trim());
        this.columnNames4 = [this.allColumnNames4[0], selected.column];
        this.columnNames4.push({ role: 'annotation' });
        let index5 = this.allColumnNames5.indexOf(selected.column.trim());
        this.columnNames5 = [this.allColumnNames5[0], selected.column];
        this.columnNames5.push({ role: 'annotation' });
        this.data1 = [];
        this.data2 = [];
        this.data3 = [];
        this.data4 = [];
        this.data5 = [];
        for (let i = 0; i < this.allData1.length; i++) {
          if (this.allData1[i].length == 3) {
            this.data1.push([this.allData1[i][0], this.allData1[i][1], this.allData1[i][2]]);
          } else {
            this.data1.push([this.allData1[i][0], this.allData1[i][index], this.allData1[i][index]]);
          }
        }
        for (let i = 0; i < this.allData2.length; i++) {
          if (this.allData2[i].length == 3) {
            this.data2.push([this.allData2[i][0], this.allData2[i][1], this.allData2[i][2]]);
          } else {
            this.data2.push([this.allData2[i][0], this.allData2[i][index2], this.allData2[i][index2]]);
          }
        }
        for (let i = 0; i < this.allData3.length; i++) {
          if (this.allData3[i].length == 3) {
            this.data3.push([this.allData3[i][0], this.allData3[i][1], this.allData3[i][2]]);
          } else {
            this.data3.push([this.allData3[i][0], this.allData3[i][index3], this.allData3[i][index3]]);
          }
        }
        for (let i = 0; i < this.allData4.length; i++) {
          if (this.allData4[i].length == 3) {
            this.data4.push([this.allData4[i][0], this.allData4[i][1], this.allData4[i][2]]);
          } else {
            this.data4.push([this.allData4[i][0], this.allData4[i][index4], this.allData4[i][index4]]);
          }
        }
        for (let i = 0; i < this.allData5.length; i++) {
          if (this.allData5[i].length == 3) {
            this.data5.push([this.allData5[i][0], this.allData5[i][1], this.allData5[i][2]]);
          } else {
            this.data5.push([this.allData5[i][0], this.allData5[i][index5], this.allData5[i][index5]]);
          }
        }
      }
    }
  }

  changePercent() {
    let index = this.columnNames1.indexOf(this.filterVal);
    if (!this.percent) {
      this.percent = true;
      for (let i = 0; i < this.data1.length; i++) {
        let percent = (this.data1[i][1] / this.totalNumberOfOccurincy) * 100;
        this.data1[i] = [this.data1[i][0], parseFloat(percent.toFixed(0)), parseFloat(percent.toFixed(0))];
      }
      for (let i = 0; i < this.data2.length; i++) {
        let percent = (this.data2[i][1] / this.totalNumberOfOccurincy) * 100;
        this.data2[i] = [this.data2[i][0], parseFloat(percent.toFixed(0)), parseFloat(percent.toFixed(0))];
      }
      for (let i = 0; i < this.data3.length; i++) {
        let percent = (this.data3[i][1] / this.totalNumberOfOccurincy) * 100;
        this.data3[i] = [this.data3[i][0], parseFloat(percent.toFixed(0)), parseFloat(percent.toFixed(0))];
      }
      for (let i = 0; i < this.data4.length; i++) {
        let percent = (this.data4[i][1] / this.totalNumberOfOccurincy) * 100;
        this.data4[i] = [this.data4[i][0], parseFloat(percent.toFixed(0)), parseFloat(percent.toFixed(0))];
      }
      for (let i = 0; i < this.data5.length; i++) {
        let percent = (this.data5[i][1] / this.totalNumberOfOccurincy) * 100;
        this.data5[i] = [this.data5[i][0], parseFloat(percent.toFixed(0)), parseFloat(percent.toFixed(0))];
      }
    } else {
      this.percent = false;
      for (let i = 0; i < this.data1.length; i++) {
        this.data1[i] = [this.data1[i][0], this.data1[i][1], this.data1[i][1]];
      }
      for (let i = 0; i < this.data2.length; i++) {
        this.data2[i] = [this.data2[i][0], this.data2[i][1], this.data2[i][1]];
      }
      for (let i = 0; i < this.data3.length; i++) {
        this.data3[i] = [this.data3[i][0], this.data3[i][1], this.data3[i][1]];
      }
      for (let i = 0; i < this.data4.length; i++) {
        this.data4[i] = [this.data4[i][0], this.data4[i][1], this.data4[i][1]];
      }
      for (let i = 0; i < this.data5.length; i++) {
        this.data5[i] = [this.data5[i][0], this.data5[i][1], this.data5[i][1]];
      }
    }
  }

  public discreteBarChart(graphNumber) {
    let url = "LineBarChart";
    if (graphNumber == "6") {
      this.width = (this.innerWidth - 100) / 2;
      if (this.width <= 740) {
        this.width = this.width * 2;
      }
      this.columnNames2 = ['יום', 'כמות', { role: 'annotation' }];
      this.columnNames4 = ['יום', 'כמות', { role: 'annotation' }];
      url = "DiscreteBarChartSurgeryStatistics";
    } else {
      url = "LineBarChartSurgeryStatistics";
    }
    if (this.periodList == undefined) {
      this.periodList = "";
    }
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/" + url, {
        param: this.TimeLineParam,
        deptCode: this.departParam,
        surgerydeptType: this.surgeriesType,
        filter: this.filterVal,
        returnedPatients: this.surgeriesPlace,
        periodList: this.periodList,
        graphNumber: graphNumber,
      })
      .subscribe((Response) => {
        let inquiriesStatLine = Response["d"];
        switch (graphNumber) {
          case 1:
            this.proccessData1(inquiriesStatLine);
            break;
          case 2:
            this.proccessData2(inquiriesStatLine);
            break;
          case 3:
            this.proccessData3(inquiriesStatLine);
            break;
          case 4:
            this.proccessData4(inquiriesStatLine);
            break;
          case 5:
            this.proccessData5(inquiriesStatLine);
            break;
        }
      });
  }

  proccessData1(inquiriesStatLine) {
    let date = new Date();
    let finalarr = [];
    this.columnNames1 = ["יום"];
    this.allColumnNames1 = ["יום"];
    if (this.TimeLineParam == "4" || this.TimeLineParam == "5") {
      let t = new Date(date);
      inquiriesStatLine[0].forEach((element, index) => {
        let temp = t.getFullYear() + parseInt(element);
        inquiriesStatLine[0][index] = temp.toString();
      });
    }

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
      this.data1 = new Array(7);
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

        if (dateDifference < 0) {
          dateDifference = todayIndex + ((finalarr.length - counter) - todayIndex);
          counter++;
        }

        this.data1[f] = finalarr[dateDifference];
        this.allData1[f] = finalarr[dateDifference];
      }
      this.data1.reverse();
    } else if (this.TimeLineParam == "2") {
      let dt = new Date();
      let day = dt.getDate();
      let month = dt.getMonth();
      let year = dt.getFullYear();
      let daysInMonth = new Date(year, month - 1, 0).getDate();
      this.data1 = new Array(daysInMonth);
      let counter = 1;
      if (day == 1) {
        this.data1 = finalarr;
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
          this.data1[f] = finalarr[dateDifference];
          this.allData1[f] = finalarr[dateDifference];
        }
        this.data1.reverse();
      }
    } else if (this.TimeLineParam == "3") {
      this.data1 = new Array(12);
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
        this.data1[f] = finalarr[monthIndex];
        this.allData1[f] = finalarr[monthIndex];
      }
      this.data1.reverse();
    }
    else {
      this.data1 = finalarr;
      this.allData1 = finalarr;
      this.data1.reverse();
    }
    let departments = [];
    for (let s = 0; s < inquiriesStatLine[1].length; s++) {
      departments.push(inquiriesStatLine[1][s]);
      if (!this.options.isStacked) {
        departments.push({ role: 'annotation' });
      }
    }
    this.columnNames1 = [...this.columnNames1, ...departments];
    this.allColumnNames1 = [...this.allColumnNames1, ...departments];
  }

  // proccessData2(inquiriesStatLine) {
  //   let date = new Date();
  //   if (this.TimeLineParam == "4" || this.TimeLineParam == "5") {
  //     let t = new Date(date);
  //     inquiriesStatLine.forEach((element, index) => {
  //       let temp = t.getFullYear() + parseInt(element.label);
  //       inquiriesStatLine[index].label = temp.toString();
  //     });
  //     inquiriesStatLine = inquiriesStatLine.reverse();
  //   }
  //   let deptsArr = [];
  //   this.data2 = [];
  //   if (this.TimeLineParam == "1") {
  //     inquiriesStatLine[0].label = 'ראשון';
  //     inquiriesStatLine[1].label = 'שני';
  //     inquiriesStatLine[2].label = 'שלישי';
  //     inquiriesStatLine[3].label = 'רביעי';
  //     inquiriesStatLine[4].label = 'חמישי';
  //     inquiriesStatLine[5].label = 'שישי';
  //     inquiriesStatLine[6].label = 'שבת';
  //   } else if (this.TimeLineParam == "3") {
  //     inquiriesStatLine[0].label = 'ינואר';
  //     inquiriesStatLine[1].label = 'פברואר';
  //     inquiriesStatLine[2].label = 'מרץ';
  //     inquiriesStatLine[3].label = 'אפריל';
  //     inquiriesStatLine[4].label = 'מאי';
  //     inquiriesStatLine[5].label = 'יוני';
  //     inquiriesStatLine[6].label = 'יולי';
  //     inquiriesStatLine[7].label = 'אוגוסט';
  //     inquiriesStatLine[8].label = 'ספטמבר';
  //     inquiriesStatLine[9].label = 'אוקטובר';
  //     inquiriesStatLine[10].label = 'נובמבר';
  //     inquiriesStatLine[11].label = 'דצמבר';
  //   }
  //   for (let i = 0; i < inquiriesStatLine.length; i++) {
  //     this.data2.push([inquiriesStatLine[i].label, parseInt(inquiriesStatLine[i].value), parseInt(inquiriesStatLine[i].value)]);
  //     this.allData2 = this.data2;
  //     deptsArr.push(inquiriesStatLine[i].label);
  //   }
  // }
  proccessData2(inquiriesStatLine) {
    let date = new Date();
    let finalarr = [];
    this.columnNames2 = ["יום"];
    this.allColumnNames2 = ["יום"];
    if (this.TimeLineParam == "4" || this.TimeLineParam == "5") {
      let t = new Date(date);
      inquiriesStatLine[0].forEach((element, index) => {
        let temp = t.getFullYear() + parseInt(element);
        inquiriesStatLine[0][index] = temp.toString();
      });
    }

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
      this.data2 = new Array(7);
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

        if (dateDifference < 0) {
          dateDifference = todayIndex + ((finalarr.length - counter) - todayIndex);
          counter++;
        }

        this.data2[f] = finalarr[dateDifference];
        this.allData2[f] = finalarr[dateDifference];
      }
      this.data2.reverse();
    } else if (this.TimeLineParam == "2") {
      let dt = new Date();
      let day = dt.getDate();
      let month = dt.getMonth();
      let year = dt.getFullYear();
      let daysInMonth = new Date(year, month - 1, 0).getDate();
      this.data2 = new Array(daysInMonth);
      let counter = 1;
      if (day == 1) {
        this.data2 = finalarr;
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
          this.data2[f] = finalarr[dateDifference];
          this.allData2[f] = finalarr[dateDifference];
        }
        this.data2.reverse();
      }
    } else if (this.TimeLineParam == "3") {
      this.data2 = new Array(12);
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
        this.data2[f] = finalarr[monthIndex];
        this.allData2[f] = finalarr[monthIndex];
      }
      this.data2.reverse();
    }
    else {
      this.data2 = finalarr;
      this.allData2 = finalarr;
      this.data2.reverse();
    }
    let departments = [];
    for (let s = 0; s < inquiriesStatLine[1].length; s++) {
      departments.push(inquiriesStatLine[1][s]);
      if (!this.options.isStacked) {
        departments.push({ role: 'annotation' });
      }
    }
    this.columnNames2 = [...this.columnNames2, ...departments];
    this.allColumnNames2 = [...this.allColumnNames2, ...departments];

  }

  proccessData3(inquiriesStatLine) {
    let date = new Date();
    let finalarr = [];
    this.columnNames3 = ["יום"];
    this.allColumnNames3 = ["יום"];
    if (this.TimeLineParam == "4" || this.TimeLineParam == "5") {
      let t = new Date(date);
      inquiriesStatLine[0].forEach((element, index) => {
        let temp = t.getFullYear() + parseInt(element);
        inquiriesStatLine[0][index] = temp.toString();
      });
    }

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
      this.data3 = new Array(7);
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

        if (dateDifference < 0) {
          dateDifference = todayIndex + ((finalarr.length - counter) - todayIndex);
          counter++;
        }

        this.data3[f] = finalarr[dateDifference];
        this.allData3[f] = finalarr[dateDifference];
      }
      this.data3.reverse();
    } else if (this.TimeLineParam == "2") {
      let dt = new Date();
      let day = dt.getDate();
      let month = dt.getMonth();
      let year = dt.getFullYear();
      let daysInMonth = new Date(year, month - 1, 0).getDate();
      this.data3 = new Array(daysInMonth);
      let counter = 1;
      if (day == 1) {
        this.data3 = finalarr;
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
          this.data3[f] = finalarr[dateDifference];
          this.allData3[f] = finalarr[dateDifference];
        }
        this.data3.reverse();
      }
    } else if (this.TimeLineParam == "3") {
      this.data3 = new Array(12);
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
        this.data3[f] = finalarr[monthIndex];
        this.allData3[f] = finalarr[monthIndex];
      }
      this.data3.reverse();
    }
    else {
      this.data3 = finalarr;
      this.allData3 = finalarr;
      this.data3.reverse();
    }
    let departments = [];
    for (let s = 0; s < inquiriesStatLine[1].length; s++) {
      departments.push(inquiriesStatLine[1][s]);
      if (!this.options.isStacked) {
        departments.push({ role: 'annotation' });
      }
    }
    this.columnNames3 = [...this.columnNames3, ...departments];
    this.allColumnNames3 = [...this.allColumnNames3, ...departments];
  }

  // proccessData4(inquiriesStatLine) {
  //   let date = new Date();
  //   if (this.TimeLineParam == "4" || this.TimeLineParam == "5") {
  //     let t = new Date(date);
  //     inquiriesStatLine.forEach((element, index) => {
  //       let temp = t.getFullYear() + parseInt(element.label);
  //       inquiriesStatLine[index].label = temp.toString();
  //     });
  //     inquiriesStatLine = inquiriesStatLine.reverse();
  //   }
  //   let deptsArr = [];
  //   this.data4 = [];
  //   if (this.TimeLineParam == "1") {
  //     inquiriesStatLine[0].label = 'ראשון';
  //     inquiriesStatLine[1].label = 'שני';
  //     inquiriesStatLine[2].label = 'שלישי';
  //     inquiriesStatLine[3].label = 'רביעי';
  //     inquiriesStatLine[4].label = 'חמישי';
  //     inquiriesStatLine[5].label = 'שישי';
  //     inquiriesStatLine[6].label = 'שבת';
  //   } else if (this.TimeLineParam == "3") {
  //     inquiriesStatLine[0].label = 'ינואר';
  //     inquiriesStatLine[1].label = 'פברואר';
  //     inquiriesStatLine[2].label = 'מרץ';
  //     inquiriesStatLine[3].label = 'אפריל';
  //     inquiriesStatLine[4].label = 'מאי';
  //     inquiriesStatLine[5].label = 'יוני';
  //     inquiriesStatLine[6].label = 'יולי';
  //     inquiriesStatLine[7].label = 'אוגוסט';
  //     inquiriesStatLine[8].label = 'ספטמבר';
  //     inquiriesStatLine[9].label = 'אוקטובר';
  //     inquiriesStatLine[10].label = 'נובמבר';
  //     inquiriesStatLine[11].label = 'דצמבר';
  //   }
  //   for (let i = 0; i < inquiriesStatLine.length; i++) {
  //     this.data4.push([inquiriesStatLine[i].label, parseInt(inquiriesStatLine[i].value), parseInt(inquiriesStatLine[i].value)]);
  //     this.allData4 = this.data4;
  //     deptsArr.push(inquiriesStatLine[i].label);
  //   }
  // }

  proccessData4(inquiriesStatLine) {
    let date = new Date();
    let finalarr = [];
    this.columnNames4 = ["יום"];
    this.allColumnNames4 = ["יום"];
    if (this.TimeLineParam == "4" || this.TimeLineParam == "5") {
      let t = new Date(date);
      inquiriesStatLine[0].forEach((element, index) => {
        let temp = t.getFullYear() + parseInt(element);
        inquiriesStatLine[0][index] = temp.toString();
      });
    }

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
      this.data4 = new Array(7);
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

        if (dateDifference < 0) {
          dateDifference = todayIndex + ((finalarr.length - counter) - todayIndex);
          counter++;
        }

        this.data4[f] = finalarr[dateDifference];
        this.allData4[f] = finalarr[dateDifference];
      }
      this.data4.reverse();
    } else if (this.TimeLineParam == "2") {
      let dt = new Date();
      let day = dt.getDate();
      let month = dt.getMonth();
      let year = dt.getFullYear();
      let daysInMonth = new Date(year, month - 1, 0).getDate();
      this.data4 = new Array(daysInMonth);
      let counter = 1;
      if (day == 1) {
        this.data4 = finalarr;
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
          this.data4[f] = finalarr[dateDifference];
          this.allData4[f] = finalarr[dateDifference];
        }
        this.data4.reverse();
      }
    } else if (this.TimeLineParam == "3") {
      this.data4 = new Array(12);
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
        this.data4[f] = finalarr[monthIndex];
        this.allData4[f] = finalarr[monthIndex];
      }
      this.data4.reverse();
    }
    else {
      this.data4 = finalarr;
      this.allData4 = finalarr;
      this.data4.reverse();
    }
    let departments = [];
    for (let s = 0; s < inquiriesStatLine[1].length; s++) {
      departments.push(inquiriesStatLine[1][s]);
      if (!this.options.isStacked) {
        departments.push({ role: 'annotation' });
      }
    }
    this.columnNames4 = [...this.columnNames4, ...departments];
    this.allColumnNames4 = [...this.allColumnNames4, ...departments];
  }

  proccessData5(inquiriesStatLine) {
    let date = new Date();
    let finalarr = [];
    this.columnNames5 = ["יום"];
    this.allColumnNames5 = ["יום"];
    if (this.TimeLineParam == "4" || this.TimeLineParam == "5") {
      let t = new Date(date);
      inquiriesStatLine[0].forEach((element, index) => {
        let temp = t.getFullYear() + parseInt(element);
        inquiriesStatLine[0][index] = temp.toString();
      });
    }

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
      this.data5 = new Array(7);
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

        if (dateDifference < 0) {
          dateDifference = todayIndex + ((finalarr.length - counter) - todayIndex);
          counter++;
        }

        this.data5[f] = finalarr[dateDifference];
        this.allData5[f] = finalarr[dateDifference];
      }
      this.data5.reverse();
    } else if (this.TimeLineParam == "2") {
      let dt = new Date();
      let day = dt.getDate();
      let month = dt.getMonth();
      let year = dt.getFullYear();
      let daysInMonth = new Date(year, month - 1, 0).getDate();
      this.data5 = new Array(daysInMonth);
      let counter = 1;
      if (day == 1) {
        this.data5 = finalarr;
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
          this.data5[f] = finalarr[dateDifference];
          this.allData5[f] = finalarr[dateDifference];
        }
        this.data5.reverse();
      }
    } else if (this.TimeLineParam == "3") {
      this.data5 = new Array(12);
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
        this.data5[f] = finalarr[monthIndex];
        this.allData5[f] = finalarr[monthIndex];
      }
      this.data5.reverse();
    }
    else {
      this.data5 = finalarr;
      this.allData5 = finalarr;
      this.data5.reverse();
    }
    let departments = [];
    for (let s = 0; s < inquiriesStatLine[1].length; s++) {
      departments.push(inquiriesStatLine[1][s]);
      if (!this.options.isStacked) {
        departments.push({ role: 'annotation' });
      }
    }
    this.columnNames5 = [...this.columnNames5, ...departments];
    this.allColumnNames5 = [...this.allColumnNames5, ...departments];
  }
}
