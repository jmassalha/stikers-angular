import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Chart, ChartOptions } from 'chart.js';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];
@Component({
  selector: 'app-quality-measures-dashboard',
  templateUrl: './quality-measures-dashboard.component.html',
  styleUrls: ['./quality-measures-dashboard.component.css']
})
export class QualityMeasuresDashboardComponent implements OnInit {


  monthsList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  yearsList: number[] = [2023, 2022, 2021, 2020];
  displayedColumns: string[] = ['name', 'weight', 'symbol', 'position'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  data: PeriodicElement[] = ELEMENT_DATA;


  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private datePipe: DatePipe,
  ) { }

  searchCard: FormGroup;

  ngOnInit(): void {

    this.searchCard = this.fb.group({
      // fromDate: new FormControl('', null),
      // toDate: new FormControl('', null),
      measureID: new FormControl('', null),
      department: new FormControl('', null),
      years: new FormControl('', null),
      quarter: new FormControl('', null),
      months: new FormControl('', null),
    });

  }

  loadCharts(event) {
    if (event.index == 1) {
      const ctx = document.getElementById('myChart') as HTMLCanvasElement;
      const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [{
            label: 'Sample Chart',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
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
    // this.searchCard.controls['fromDate'].setValue(this.datePipe.transform(this.searchCard.controls['fromDate'].value, 'yyyy-MM-dd'))
    // this.searchCard.controls['toDate'].setValue(this.datePipe.transform(this.searchCard.controls['toDate'].value, 'yyyy-MM-dd'))
    console.log(this.searchCard.value);
    // this.http
    //   .post(environment.url + "SearchQualityMeasures", {
    //     _searchCard: this.searchCard.getRawValue(),
    //   }).subscribe((Response) => {

    //   });
  }

}
