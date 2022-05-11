import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-grouped-bar-chart',
  templateUrl: './grouped-bar-chart.component.html',
  styleUrls: ['./grouped-bar-chart.component.css']
})
export class GroupedBarChartComponent implements OnInit {
  innerWidth: number;

  constructor(private http: HttpClient, private eRef: ElementRef) { }

  TimeLineParam: string = "1";
  departParam: string = "1";
  _surgerydeptType: string = "0";
  _surgeryChooseType: string = "0";
  inquiriesStatLine = [];
  responseDeparts = [];
  loader: boolean = false;
  filterVal = "";
  timesString = ['בשבוע', 'בחודש', 'בשנה', 'ב5 שנים מקבילות', 'ב5 שנים מלאות'];

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
    isStacked: false
  };
  width: number;
  height = 800;


  refresh(elem, dept, _surgeryDeptType, _surgeryChooseType) {
    this.TimeLineParam = elem;
    this.departParam = dept;
    this._surgerydeptType = _surgeryDeptType;
    this._surgeryChooseType = _surgeryChooseType;
    this.ngOnInit();
    return this.timesString[parseInt(elem) - 1];
  }

  ngOnInit(): void {
    if (this.departParam == "5" && (this.TimeLineParam == "4" || this.TimeLineParam == "5")) {
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
    this.waitData();
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.eRef.nativeElement.contains(event.target)) {
      let clickedType = event["srcElement"]["localName"];
      let departClicked = "";
      if(clickedType == "text"){
        departClicked = event["srcElement"]["innerHTML"];
      }    
      if (departClicked == this.filterVal && this.filterVal != "") {
        this.filterVal = "";
        this.waitData();
      }else if (departClicked != "" && this.columnNames.includes(departClicked)) {
        this.filterVal = departClicked;
        this.filterChart();
      }
    }
  }

  filterChart(){
    let index = this.columnNames.indexOf(this.filterVal);
    this.columnNames = [this.columnNames[0],this.columnNames[index]];
    for(let i = 0; i < this.data.length; i++){
      this.data[i] = [this.data[i][0],this.data[i][index]];
    }
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
        if (!(this.departParam == "5" && (this.TimeLineParam == "4" || this.TimeLineParam == "5"))) {
          departments.push({ role: 'annotation' });
        }

      }
      this.columnNames = [...this.columnNames, ...departments];

      for (let i = 0; i < this.inquiriesStatLine.length; i++) {
        let temp = [];
        let notNullIndex = this.inquiriesStatLine[i].findIndex(x => x !== null);
        temp.push(this.inquiriesStatLine[i][notNullIndex].key);
        for (let j = 0; j < this.inquiriesStatLine[i].length; j++) {
          if (this.inquiriesStatLine[i][j] != null) {
            temp.push(this.inquiriesStatLine[i][j].y);
            if (!(this.departParam == "5" && (this.TimeLineParam == "4" || this.TimeLineParam == "5"))){
              temp.push(this.inquiriesStatLine[i][j].y);
            }
            
          } else {
            temp.push(0);
            if (!(this.departParam == "5" && (this.TimeLineParam == "4" || this.TimeLineParam == "5"))){
              temp.push(0);
            }
            
          }
        }
        this.data.push(temp);
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
      this.http
        .post("http://srv-apps-prod/RCF_WS/WebService.asmx/" + url, {
          param: this.TimeLineParam,
          deptCode: this.departParam,
          deptType: this._surgerydeptType,
          chooseType: this._surgeryChooseType
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
