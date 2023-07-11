import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Chart } from 'chart.js';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-quality-measures-dashboard',
  templateUrl: './quality-measures-dashboard.component.html',
  styleUrls: ['./quality-measures-dashboard.component.css']
})
export class QualityMeasuresDashboardComponent implements OnInit {


  ELEMENT_DATA: any[] = [];
  monthsList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  yearsList: number[] = [2023, 2022, 2021, 2020];
  displayedColumns: string[] = ['measure_code', 'measure_desc', 'department', 'quarter', 'year', 'value', 'target'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  QMTypes = [];
  departments_list = [];
  years: number[] = [];
  months: number[] = [];
  chartTab: boolean = false;
  chartLabels = [
    { name: 'Red', color: 'rgba(255, 99, 132, 0.2)' },
    { name: 'Blue', color: 'rgba(54, 162, 235, 0.2)' },
    { name: 'Yellow', color: 'rgba(255, 206, 86, 0.2)' },
    { name: 'Green', color: 'rgba(75, 192, 192, 0.2)' },
    { name: 'Purple', color: 'rgba(153, 102, 255, 0.2)' },
    { name: 'Orange', color: 'rgba(255, 159, 64, 0.2)' }];

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private datePipe: DatePipe,
  ) { }

  searchCard: FormGroup;

  ngOnInit(): void {
    this.getQMTypes();
    this.getDepartmentsList();
    this.searchCard = this.fb.group({
      measureID: new FormControl('', null),
      department: new FormControl('', null),
      years: new FormControl(this.years, null),
      quarter: new FormControl('', null),
      months: new FormControl(this.months, null),
    });
    this.searchMeasures();
  }

  returnLabelsAndColorsToChart(chartData) {
    let dataList = [];
    let colorList = [];
    let returnList = [];
    // const randomElement = this.chartLabels[Math.floor(Math.random() * this.chartLabels.length)];
    for (let i = 0; i < chartData.length; i++) {
      const random = Math.floor(Math.random() * chartData.length);
      dataList.push(chartData[i].Year + '/' + chartData[i].Measure_TimeLine);
      colorList.push(this.chartLabels[i].color);
    }
    returnList.push(dataList);
    returnList.push(colorList);
    return returnList;
  }

  returnDataValuesToChart() {
    let dataList = [];
    for (let j = 0; j < this.dataSource.filteredData.length; j++) {
      dataList.push(parseInt(this.dataSource.filteredData[j].Value));
    }
    return dataList;
  }

  monthsQuarterDevider() {
    if (this.searchCard.controls['months'].value.length > 0) {
      this.searchCard.controls['quarter'].setValue('');
      this.searchCard.controls['quarter'].disable();
    } else {
      this.searchCard.controls['quarter'].enable();
    }
  }

  loadCharts(event) {
    if(event == 1 || event == true) this.chartTab = true;
    else this.chartTab = false;
    if (event) {
      let data = this.returnLabelsAndColorsToChart(this.dataSource.filteredData)[0];
      const ctx = document.getElementById('myChart') as HTMLCanvasElement;
      const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.returnLabelsAndColorsToChart(this.dataSource.filteredData)[0],
          datasets: [{
            label: 'מדדים/יעדים',
            data: this.returnDataValuesToChart(),
            backgroundColor: [this.returnLabelsAndColorsToChart(this.dataSource.filteredData)[1]],
            borderColor: [this.returnLabelsAndColorsToChart(this.dataSource.filteredData)[1]],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            // y: {
            //   beginAtZero: true
            // }
          }
        }
      });
    }
  }

  searchMeasures() {
    this.http
      .post(environment.url + "GetAllQualityMeasuresListToTableByParameters", {
        _searchCard: this.searchCard.getRawValue(),
      }).subscribe((Response) => {
        this.dataSource = new MatTableDataSource<any>(Response["d"]);
        if(this.chartTab){
          this.loadCharts(this.chartTab);
        }
      });
  }

  clearSearch() {
    this.searchCard.patchValue({ 'years': [] });
    this.searchCard.patchValue({ 'months': [] });
    this.searchCard.patchValue({ 'measureID': '' });
    this.searchCard.patchValue({ 'department': '' });
    this.searchCard.patchValue({ 'quarter': '' });
  }

  getQMTypes() {
    this.http
      .post(environment.url + "GetAllQualityMeasuresList", {}).subscribe((Response) => {
        this.QMTypes = Response["d"];
      });
  }

  getDepartmentsList() {
    this.http
      .post(environment.url + "GetAllQualityMeasuresDepartmentsList", {}).subscribe((Response) => {
        this.departments_list = Response["d"];
      });
  }

}
