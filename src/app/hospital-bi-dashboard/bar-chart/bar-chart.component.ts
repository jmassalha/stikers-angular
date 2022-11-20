import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  innerWidth: number;

  constructor(private http: HttpClient) { }

  @Output() newItemEvent = new EventEmitter<string[]>();
  @Output() secondItemEvent = new EventEmitter<string[]>();
  @Input() filterValue;
  loader: boolean = true;
  TimeLineParam;
  departParam: string = "1";
  periodList = [];
  allData = [];
  _surgerydeptType: string = "0";
  _returnedPatients: boolean = false;
  timesString = ['', '', '', '', ''];
  Excel_Data = [];

  type = 'ColumnChart';
  data = [];
  columnNames = ['מחלקה', 'כמות', { role: 'annotation' }];
  options = {
    legend: 'none',
    colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f']
  };
  width: number;
  height = 600;


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
    this.innerWidth = window.innerWidth;
    this.width = (this.innerWidth - 100) / 2;
    if (this.width <= 740) {
      this.width = this.width * 2;
    }
    // BUG - when its having a period list and a filter value it doesnt get data from server!! on change of period list we must get data from server
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
    let excel = this.data;
    excel.forEach(element => {
      for (let i = 0; i < element.length; i++) {
        if (i % 2 != 0) {
          delete element[i];
        }
      }
    });
    let header = ['מחלקה', 'כמות']
    excel = [header, ...excel];
    return excel;
  }

  sendToParent(eve) {
    this.secondItemEvent.emit(eve);
  }

  onSelect(event) {
    if (event !== undefined) {
      let selected = event.selection[0];
      if (this.columnNames.length == 3) {
        this.discreteBarChart();
      } else {
        let index = selected.column;
        this.columnNames = [this.columnNames[0], this.columnNames[index]];
        this.columnNames.push({ role: 'annotation' });

        for (let i = 0; i < this.data.length; i++) {
          this.data[i] = [this.data[i][0], this.data[i][index], this.data[i][index]];
        }
      }
    }
    this.newItemEvent.emit(this.data[event.selection[0].row][0]);
  }

  universalSelect(event) {
    if (event.selection[0].column !== undefined) {
      let selected = event.selection[0];
      if (selected.column == "הכל") {
        this.discreteBarChart();
      } else {
        if (this.data.length == 1) {
          this.data = this.allData;
        }
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i][0].trim() == selected.column) {
            this.data = [];
            this.data.push([this.allData[i][0], this.allData[i][1], this.allData[i][2]]);
          }
        }
      }
    }
  }


  public discreteBarChart() {
    let url = "DiscreteBarChart";
    if (this.departParam == "6") {
      url = "DiscreteBarChartForER";
    } else if (this.departParam == "5") {
      url = "DiscreteBarChartHospitalDeparts";
    } else if (this.departParam == "3") {
      url = "DiscreteBarChartRentgenDimot";
    }
    if (this.TimeLineParam != undefined) {
      this.loader = true;
      this.http
        .post("http://srv-apps-prod/RCF_WS/WebService.asmx/" + url, {
          param: this.TimeLineParam,
          deptCode: this.departParam,
          surgerydeptType: this._surgerydeptType,
          returnedPatients: this._returnedPatients,
          periodList: this.periodList
        })
        .subscribe((Response) => {
          let inquiriesStatLine = Response["d"];
          let deptsArr = [];
          this.data = [];
          for (let i = 0; i < inquiriesStatLine.length; i++) {
            this.data.push([inquiriesStatLine[i].label, parseInt(inquiriesStatLine[i].value), parseInt(inquiriesStatLine[i].value)]);
            this.allData = this.data;
            deptsArr.push(inquiriesStatLine[i].label);
          }
          // this.newItemEvent.emit(deptsArr);
          this.loader = false;
        });
    }

  }

}
