import { Component, ElementRef, EventEmitter, HostListener, Inject, Input, OnInit, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/medigate-servers/data-row-table/data-row-table.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-eshpoz-modal',
  templateUrl: './eshpoz-modal.component.html',
  styleUrls: ['./eshpoz-modal.component.css']
})
export class EshpozModalComponent implements OnInit {

  innerWidth: number;
  innerHeight: number;
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
  allData1 = [];
  allData2 = [];
  columnNames1 = [];
  columnNames2 = [];
  allColumnNames1 = [];
  allColumnNames2 = [];
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
  hospitalDepartType: FormControl;


  constructor(private http: HttpClient, private eRef: ElementRef,
    public dialogRef: MatDialogRef<EshpozModalComponent>,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DialogData) { }

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
    this.hospitalDepartType = new FormControl(this.dataDialog['eshpozSelectBtn'], null);
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
        let closeObj = {
          excel: that.sendDataToParentExcel(),
          selectBtn: that.hospitalDepartType.value
        };
        that.dialogRef.close(closeObj);
      }, 2000);
    } else {
      this.excelLoader = false;
    }
  }

  sendDataToParentExcel() {
    let result = [];
    result.push({ number: 1, columnnames: this.columnNames1, arr: this.data1 });
    result.push({ number: 2, columnnames: this.columnNames2, arr: this.data2 });
    return result;
  }

  onNoClick(): void {
    let closeObj = {
      excel: this.sendDataToParentExcel(),
      selectBtn: this.hospitalDepartType.value
    };
    this.dialogRef.close(closeObj);
  }

  changeDeaprtOfEshpoz() {
    this.discreteBarChart(1);
    setTimeout(() => {
      this.discreteBarChart(2);
    }, 500);
  }

  onSelect(event, graphNumber) {
    if (event !== undefined) {
      let selected = event.selection[0];
      let that = this;
      if (this.columnNames1[2].role == "annotation") {
        this.discreteBarChart(1);
        setTimeout(() => {
          that.discreteBarChart(2);
        }, 500);
      } else {
        this.totalNumberOfOccurincy = 0;
        let index = selected.column;
        let word = "";
        if (graphNumber == 1) {
          word = this.columnNames1[index].trim();
        } else if (graphNumber == 2) {
          word = this.columnNames2[index].trim();
        }
        let index1 = this.allColumnNames1.indexOf(word);
        this.columnNames1 = [this.columnNames1[0], this.columnNames1[index1]];
        this.columnNames1.push({ role: 'annotation' });
        let index2 = this.allColumnNames2.indexOf(word);
        this.columnNames2 = [this.columnNames2[0], this.columnNames2[index2]];
        this.columnNames2.push({ role: 'annotation' });

        for (let i = 1; i <= this.data1.length; i++) {
          this.data1[this.data1.length - i] = [this.allData1[i - 1][0], this.allData1[i - 1][index1], this.allData1[i - 1][index1]];
        }
        for (let i = 1; i <= this.data2.length; i++) {
          this.data2[this.data2.length - i] = [this.allData2[i - 1][0], this.allData2[i - 1][index2], this.allData2[i - 1][index2]];
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
      } else {
        let index = this.allColumnNames1.indexOf(selected.column.trim());
        this.columnNames1 = [this.allColumnNames1[0], selected.column];
        this.columnNames1.push({ role: 'annotation' });
        let index2 = this.allColumnNames2.indexOf(selected.column.trim());
        this.columnNames2 = [this.allColumnNames2[0], selected.column];
        this.columnNames2.push({ role: 'annotation' });
        this.data1 = [];
        this.data2 = [];
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
      }
    }
  }


  public discreteBarChart(graphNumber) {
    let url = "LineBarChartEshpozStatistics";
    if (this.periodList == undefined) {
      this.periodList = "";
    }
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/" + url, {
        param: this.TimeLineParam,
        deptCode: this.departParam,
        surgerydeptType: this.hospitalDepartType.value,
        filter: this.filterVal,
        returnedPatients: "this.surgeriesPlace",
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

}
