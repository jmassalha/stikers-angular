import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  innerWidth: number;

  constructor(private http: HttpClient) { }

  TimeLineParam: string = "1";
  departParam: string = "1";
  _surgerydeptType: string = "0";
  timesString = ['בשבוע', 'בחודש', 'בשנה', 'ב5 שנים מקבילות', 'ב5 שנים מלאות'];

  type = 'ColumnChart';
  data = [];
  columnNames = ['מחלקה', 'כמות', { role: 'annotation' }];
  options = {
    legend: 'none',
    colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f']
  };
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
    this.innerWidth = window.innerWidth;
    this.width = (this.innerWidth - 100) / 2;
    if (this.width <= 740) {
      this.width = this.width * 2;
    }
    this.discreteBarChart();
  }


  public discreteBarChart() {
    let url = "DiscreteBarChart";
    if(this.departParam == "6"){
      url = "DiscreteBarChartForER";
    }else if(this.departParam == "5"){
      url = "DiscreteBarChartHospitalDeparts";
    }
    this.http
      .post("http://srv-apps-prod/RCF_WS/WebService.asmx/"+url, {
        param: this.TimeLineParam,
        deptCode: this.departParam,
        surgerydeptType: this._surgerydeptType
      })
      .subscribe((Response) => {
        let inquiriesStatLine = Response["d"];
        this.data = [];
        for (let i = 0; i < inquiriesStatLine.length; i++) {
          this.data.push([inquiriesStatLine[i].label, parseInt(inquiriesStatLine[i].value), parseInt(inquiriesStatLine[i].value)]);;
        }
      });
  }

}
