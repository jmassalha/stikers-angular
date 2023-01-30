import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-grouped-bar-chart',
  templateUrl: './grouped-bar-chart.component.html',
  styleUrls: ['./grouped-bar-chart.component.css']
})
export class GroupedBarChartComponent implements OnInit {
  innerWidth: number;

  constructor(private http: HttpClient, private eRef: ElementRef) { }

  @Output() newItemEvent = new EventEmitter<string[]>();
  @Output() secondItemEvent = new EventEmitter<string[]>();
  @Input() filterValue;
  TimeLineParam: string = "1";
  departParam: string = "1";
  periodList: any;
  _surgerydeptType: string = "0";
  _surgeryChooseType: string = "0";
  _surgeryChooseTypeSpare: any = null;
  inquiriesStatLine = [];
  responseDeparts = [];
  allData = [];
  loader: boolean = false;
  filterVal = "";
  _returnedPatients: boolean = false;
  timesString = ['', '', '', '', ''];
  Excel_Data = [];

  type = 'BarChart';
  data = [];
  allColumnNames = [];

  columnNames = [];
  options = {
    hAxis: {
      title: 'כמות'
    },
    vAxis: {
      minValue: 0
    },
    isStacked: false
  };
  width: number;
  height = 800;


  refresh(elem, dept, _surgeryDeptType, _surgeryChooseType, _returnedPatients, periodList) {
    this.TimeLineParam = elem;
    this.departParam = dept;
    this.periodList = periodList;
    this._surgerydeptType = _surgeryDeptType;
    this._surgeryChooseType = _surgeryChooseType;
    this._returnedPatients = _returnedPatients;
    if (this._surgeryChooseTypeSpare == null || (this._surgeryChooseTypeSpare != _surgeryChooseType && this.filterValue == undefined)) {
      this._surgeryChooseTypeSpare = _surgeryChooseType;
    }
    this.ngOnInit();
    return this.timesString[parseInt(elem) - 1];
  }

  ngOnInit(): void {
    if (this.departParam == "5" && (this.TimeLineParam == "4" || this.TimeLineParam == "5")) {
      this.options = {
        hAxis: {
          title: 'כמות'
        },
        vAxis: {
          minValue: 0
        },
        isStacked: true
      };
    } else {
      this.options = {
        hAxis: {
          title: 'כמות'
        },
        vAxis: {
          minValue: 0
        },
        isStacked: false
      };
    }
    this.innerWidth = window.innerWidth;
    this.width = this.innerWidth - 70;
    if (this.filterValue == undefined) {
      this.waitData();
    } else {
      if (this.departParam == "1" && this._surgeryChooseTypeSpare != this._surgeryChooseType) {
        this.waitData();
      } else {
        this._surgeryChooseTypeSpare = this._surgeryChooseType;
        let selection = {
          selection: [{
            column: this.filterValue,
            row: 0
          }]
        }
        this.universalSelect(selection);
      }
    }
  }

  sendDataToParentExcel() {
    let result = [];
    this.data.forEach(element => {
      for (let i = 0; i < element.length; i++) {
        if (i % 2 != 0) {
          delete element[i];
        } else if (i % 2 == 0 && i != 0) {
          delete this.columnNames[i];
        }
      }
    });
    result.push(this.columnNames);
    result.push(this.data);
    return result;
  }


  onSelect(event) {
    if (event !== undefined) {
      let selected = event.selection[0];
      if (this.columnNames.length == 3) {
        this.waitData();
      } else {
        let index = selected.column;
        this.columnNames = [this.columnNames[0], this.columnNames[index]];
        this.columnNames.push({ role: 'annotation' });
        for (let i = 0; i < this.data.length; i++) {
          this.data[i] = [this.data[i][0], this.data[i][index], this.data[i][index]];
        }
      }
    }
    this.newItemEvent.emit(this.columnNames[1]);
  }

  universalSelect(event) {
    if (event.selection[0].column !== undefined) {
      let selected = event.selection[0];
      if (selected.column == "הכל") {
        this.waitData();
      } else {
        let index = this.allColumnNames.indexOf(selected.column.trim());
        this.columnNames = [this.allColumnNames[0], selected.column];
        this.columnNames.push({ role: 'annotation' });
        this.data = [];
        for (let i = 0; i < this.allData.length; i++) {
          this.data.push([this.allData[i][0], this.allData[i][index], this.allData[i][index]]);
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
  //       this.waitData();
  //     } else if (departClicked != "" && this.columnNames.includes(departClicked)) {
  //       this.filterVal = departClicked;
  //       this.filterChart();
  //     }
  //   }
  // }

  // filterChart() {
  //   let index = this.columnNames.indexOf(this.filterVal);
  //   this.columnNames = [this.columnNames[0], this.columnNames[index]];
  //   this.columnNames.push({ role: 'annotation' });
  //   for (let i = 0; i < this.data.length; i++) {
  //     this.data[i] = [this.data[i][0], this.data[i][index], this.data[i][index]];
  //   }
  // }

  async waitData() {
    this.discreteBarChart().then(() => {
      this.loader = false;
      let departments = [];
      this.data = [];
      this.allData = [];
      this.columnNames = ['תקופה'];
      this.allColumnNames = ['תקופה'];
      if (this.responseDeparts == undefined) {
        console.log("No Data Returned");
        let that = this;
        setTimeout(() => {
          that.waitData();
        }, 2000);
      } else {
        for (let s = 0; s < this.responseDeparts.length; s++) {
          departments.push(this.responseDeparts[s]);
          if (!(this.departParam == "5" && (this.TimeLineParam == "4" || this.TimeLineParam == "5"))) {
            departments.push({ role: 'annotation' });
          }

        }
        this.columnNames = [...this.columnNames, ...departments];
        this.allColumnNames = [...this.allColumnNames, ...departments];

        for (let i = 0; i < this.inquiriesStatLine.length; i++) {
          let temp = [];
          let notNullIndex = this.inquiriesStatLine[i].findIndex(x => x !== null);
          temp.push(this.inquiriesStatLine[i][notNullIndex].key);
          for (let j = 0; j < this.inquiriesStatLine[i].length; j++) {
            if (this.inquiriesStatLine[i][j] != null) {
              temp.push(this.inquiriesStatLine[i][j].y);
              if (!(this.departParam == "5" && (this.TimeLineParam == "4" || this.TimeLineParam == "5"))) {
                temp.push(this.inquiriesStatLine[i][j].y);
              }

            } else {
              temp.push(0);
              if (!(this.departParam == "5" && (this.TimeLineParam == "4" || this.TimeLineParam == "5"))) {
                temp.push(0);
              }

            }
          }
          this.data.push(temp);
          this.allData.push(temp);
        }
      }
    })

  }


  discreteBarChart(): Promise<any> {
    this.loader = true;
    let url = "StackedBarChart";
    if (this.departParam == "5") {
      url = "StackedBarChartForHospitalDeparts";
    } else if (this.departParam == "6") {
      url = "StackedBarChartForER";
    } else if (this.departParam == "3") {
      url = "StackedBarChartRentgenDimot";
    }
    return new Promise<void>((resolve, reject) => {
      if (this.periodList == undefined) {
        this.periodList = "";
      }
      this.http
        .post(environment.url + url, {
          param: this.TimeLineParam,
          deptCode: this.departParam,
          deptType: this._surgerydeptType,
          chooseType: this._surgeryChooseType,
          returnedPatients: this._returnedPatients,
          periodList: this.periodList
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
