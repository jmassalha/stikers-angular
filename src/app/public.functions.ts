import { MatRadioChange } from '@angular/material/radio';
import { FormControl } from '@angular/forms';
import * as Chart from 'chart.js';

export class Functions{
    dateNow = new Date();
    public startdateVal: string;
    public _selectedYear = this.dateNow.getFullYear();
    public enddateVal: string;
    public  Sdate: FormControl;
    public Edate: FormControl;
    public yearsToSelect = {
        list: [
            { name: "year", ID: "2021", checked: true },
            { name: "year", ID: "2020", checked: false },
            { name: "year", ID: "2019", checked: false }
        ]
    };
    public RunFunction(){
        let _dateNow = new Date();
        if (_dateNow.getFullYear() > 2021) {
            let item = {
                name: "year",
                ID: (_dateNow.getFullYear()).toString(),
                checked: false
            };
            this.yearsToSelect.list.push(item);
            
        }
        this.yearsToSelect.list = this.yearsToSelect.list.sort((a, b) => (a.ID > b.ID) ? -1 : 1);
        for(var i = 0; i < this.yearsToSelect.list.length; i++ ){
            this.yearsToSelect.list[i].checked = false;
            if(i == 0){
                this.yearsToSelect.list[i].checked = true;
            }
        }
        //debugger
    }
    public radioChange(event: MatRadioChange) {
        //////debugger
        this._selectedYear = event.value; 
        this.Sdate = new FormControl(new Date(event.value, 0, 1));
        this.Edate = new FormControl(new Date(event.value, 11, 31));
        this.startdateVal = this.Sdate.value;
        this.enddateVal = this.Edate.value;
    }
    public quart_change(event: MatRadioChange) {
        ////////debugger;
        switch (event.value) {
            case "all":
                this.Sdate = new FormControl(
                    new Date(this._selectedYear, 0, 1)
                );
                this.Edate = new FormControl(
                    new Date(this._selectedYear, 11, 31)
                );
                this.startdateVal = this.Sdate.value;
                this.enddateVal = this.Edate.value;
                break;
            case "1":
                this.Sdate = new FormControl(
                    new Date(this._selectedYear, 0, 1)
                );
                this.Edate = new FormControl(
                    new Date(this._selectedYear, 2, 31)
                );
                this.startdateVal = this.Sdate.value;
                this.enddateVal = this.Edate.value;
                break;
            case "2":
                this.Sdate = new FormControl(
                    new Date(this._selectedYear, 3, 1)
                );
                this.Edate = new FormControl(
                    new Date(this._selectedYear, 5, 30)
                );
                this.startdateVal = this.Sdate.value;
                this.enddateVal = this.Edate.value;
                break;
            case "3":
                this.Sdate = new FormControl(
                    new Date(this._selectedYear, 6, 1)
                );
                this.Edate = new FormControl(
                    new Date(this._selectedYear, 8, 30)
                );
                this.startdateVal = this.Sdate.value;
                this.enddateVal = this.Edate.value;
                break;

            case "4":
                this.Sdate = new FormControl(
                    new Date(this._selectedYear, 9, 1)
                );
                this.Edate = new FormControl(
                    new Date(this._selectedYear, 11, 31)
                );
                this.startdateVal = this.Sdate.value;
                this.enddateVal = this.Edate.value;
                break;
        }
    }
    public getBackgroundArray(_length) {
        var backgroundColorArray = [];
        var backgroundColorArrayOpacity = [];
        for (var e = 0; e < _length; e++) {
            var f = Math.floor(Math.random() * 255 + 1);
            var s = Math.floor(Math.random() * 255 + 1);
            var t = Math.floor(Math.random() * 255 + 1);
            var backgound = "rgba(" + f + ", " + s + ", " + t + ", 1)";
            var backgoundOpacity = "rgba(" + f + ", " + s + ", " + t + ", 0.2)";
            ////////debugger;
            backgroundColorArray.push(backgound);

            backgroundColorArrayOpacity.push(backgoundOpacity);
        }
        return [backgroundColorArrayOpacity, backgroundColorArray];
    }
    public drawCharToDom(
        _dataType: string,
        _dataLable: string[],
        _data: any[],
        _wrapperId: string,
        _chartId: string,
        _label_1: string,
        _label_2: string
    ) {
        let optionCall;
        let totalDataLength = _data.length;
        let bgArray = this.getBackgroundArray(totalDataLength);
        let _yearStart = new Date(this.startdateVal).getFullYear();
        let _yearEnd = _yearStart - 1;
        // //////debugger;
        if (_dataType == "line") {
            $("#" + _wrapperId).empty();
            $("#" + _wrapperId).append(
                '<canvas id="' + _chartId + '"></canvas>'
            );
            var canvas: HTMLCanvasElement = <HTMLCanvasElement>(
                document.getElementById(_chartId)
            );
            var ctxIn: CanvasRenderingContext2D = canvas.getContext("2d");
            var myChart = new Chart(ctxIn, {
                type: "line",
                data: {
                    labels: _dataLable,
                    datasets: [
                        {
                            label: _label_1,
                            backgroundColor: "red",
                            borderColor: "red",
                            data: _data[0],
                            fill: false
                        },
                        {
                            label: _label_2,
                            fill: false,
                            backgroundColor: "blue",
                            borderColor: "blue",
                            data: _data[1]
                        }
                    ]
                },
                options: {
                    responsive: true,
                    tooltips: {
                        mode: "index",
                        intersect: false
                    },
                    scales: {
                        xAxes: [
                            {
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: "חודש"
                                }
                            }
                        ],
                        yAxes: [
                            {
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'סה"כ'
                                }
                            }
                        ]
                    }
                }
            });
        } else {
            if (_dataType == "pie" || _dataType == "doughnut") {
                optionCall = {
                    legend: {
                        display: false
                    },
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem, data) {
                                //get the concerned dataset
                                var dataset =
                                    data.datasets[tooltipItem.datasetIndex];
                                // //////debugger;
                                var total = 0;
                                for (var t = 0; t < dataset.data.length; t++) {
                                    total += parseInt(dataset.data[t]);
                                }

                                //get the current items value
                                var currentValue = parseInt(
                                    dataset.data[tooltipItem.index]
                                );
                                //calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
                                var percentage = Math.floor(
                                    (currentValue / total) * 100 + 0.5
                                );
                                console.log(currentValue);
                                console.log(dataset);
                                //return percentage + "%";
                                return percentage + "%";
                            }
                        }
                    },
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    beginAtZero: true
                                }
                            }
                        ]
                    },
                    animation: {
                        onProgress: function(animation) {
                            //   progress.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
                        }
                    }
                };
            } else {
                optionCall = {
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    beginAtZero: true
                                }
                            }
                        ]
                    },
                    animation: {
                        onProgress: function(animation) {
                            //   progress.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
                        }
                    }
                };
            }
            $("#" + _wrapperId).empty();
            $("#" + _wrapperId).append(
                '<canvas id="' + _chartId + '"></canvas>'
            );
            var canvas: HTMLCanvasElement = <HTMLCanvasElement>(
                document.getElementById(_chartId)
            );
            var ctxIn: CanvasRenderingContext2D = canvas.getContext("2d");
            ////////debugger
            var myChart = new Chart(ctxIn, {
                type: _dataType,
                data: {
                    labels: _dataLable,
                    datasets: [
                        {
                            label: _label_1,
                            data: _data,
                            backgroundColor: bgArray[0],
                            borderColor: bgArray[1],
                            borderWidth: 1
                        }
                    ]
                },
                options: optionCall
            });
        }
    }
}