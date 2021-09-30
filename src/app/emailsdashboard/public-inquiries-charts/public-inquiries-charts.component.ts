import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
interface Departments {
   value: string;
   viewValue: string;
}
interface Types {
   value: string;
   viewValue: string;
}
@Component({
   selector: 'app-public-inquiries-charts',
   templateUrl: './public-inquiries-charts.component.html',
   styleUrls: ['./public-inquiries-charts.component.css']
})
export class PublicInquiriesChartsComponent implements OnInit {

   horizontalPosition: MatSnackBarHorizontalPosition = 'start';
   verticalPosition: MatSnackBarVerticalPosition = 'bottom';

   years: any[] = [];
   types: Types[] = [
      { value: 'Thank', viewValue: 'תודה' },
      { value: 'Complaint', viewValue: 'תלונה' },
      { value: 'Inquiry', viewValue: 'פנייה' },
      { value: 'Job', viewValue: 'עבודה' }
   ];
   departments: Departments[] = [
      { value: 'MRI', viewValue: 'MRI' },
      { value: 'מיילדותי us', viewValue: 'מיילדותי us' },
      { value: 'אונקולוגיה', viewValue: 'אונקולוגיה' },
      { value: 'אורולוגיה', viewValue: 'אורולוגיה' },
      { value: 'אורטופידיה', viewValue: 'אורטופידיה' },
      { value: 'אף אוזן גרון', viewValue: 'אף אוזן גרון' },
      { value: 'בטחון', viewValue: 'בטחון' },
      { value: 'גזברות', viewValue: 'גזברות' },
      { value: 'גסטרואנטרולוגיה', viewValue: 'גסטרואנטרולוגיה' },
      { value: 'דיאליזה', viewValue: 'דיאליזה' },
      { value: 'IVF - הפרייה חוץ גופית', viewValue: 'IVF - הפרייה חוץ גופית' },
      { value: 'זימון תורים', viewValue: 'זימון תורים' },
      { value: 'חדר ניתוח', viewValue: 'חדר ניתוח' },
      { value: 'חדרי לידה', viewValue: 'חדרי לידה' },
      { value: 'טיפול נמרץ כללי', viewValue: 'טיפול נמרץ כללי' },
      { value: 'טיפול נמרץ לב', viewValue: 'טיפול נמרץ לב' },
      { value: 'יולדות', viewValue: 'יולדות' },
      { value: 'ילדים', viewValue: 'ילדים' },
      { value: 'ילודים', viewValue: 'ילודים' },
      { value: 'כירורגיה כללית', viewValue: 'כירורגיה כללית' },
      { value: 'כירורגיה פלסטית', viewValue: 'כירורגיה פלסטית' },
      { value: 'כירורגיה לב חזה', viewValue: 'כירורגיה לב חזה' },
      { value: 'מלר"ד', viewValue: 'מלר"ד' },
      { value: 'מלר"ד ילדים', viewValue: 'מלר"ד ילדים' },
      { value: 'מעברים', viewValue: 'מעברים' },
      { value: 'מרפאה אורולוגיה', viewValue: 'מרפאה אורולוגיה' },
      { value: 'מרפאה אורטופידית', viewValue: 'מרפאה אורטופידית' },
      { value: 'מרפאה נשים', viewValue: 'מרפאה נשים' },
      { value: 'מרפאה עיניים', viewValue: 'מרפאה עיניים' },
      { value: 'מרפאה ראומטולוגיה', viewValue: 'מרפאה ראומטולוגיה' },
      { value: 'מרפאת חוץ', viewValue: 'מרפאת חוץ' },
      { value: 'משרד קבלת חולים', viewValue: 'משרד קבלת חולים' },
      { value: 'נוירולוגיה', viewValue: 'נוירולוגיה' },
      { value: 'נשים', viewValue: 'נשים' },
      { value: 'עיניים', viewValue: 'עיניים' },
      { value: 'פגייה', viewValue: 'פגייה' },
      { value: 'פה ולסת', viewValue: 'פה ולסת' },
      { value: 'פנימית א', viewValue: 'פנימית א' },
      { value: 'פנימית ב', viewValue: 'פנימית ב' },
      { value: 'קורונה', viewValue: 'קורונה' },
      { value: 'פגייה', viewValue: 'פגייה' },
      { value: 'קרדיולוגיה', viewValue: 'קרדיולוגיה' },
      { value: 'רנטגן', viewValue: 'רנטגן' },
      { value: 'רשומות ומידע רפואי', viewValue: 'רשומות ומידע רפואי' },
      { value: 'שבץ מוחי', viewValue: 'שבץ מוחי' },
      { value: 'שונות', viewValue: 'שונות' },
      { value: 'שינוע', viewValue: 'שינוע' },
      { value: 'שיקומית', viewValue: 'שיקומית' }
   ];

   constructor(private _snackBar: MatSnackBar,
      public dialog: MatDialog,
      private router: Router,
      private http: HttpClient,
      private fb: FormBuilder) { }

   pipe = new DatePipe("en-US");
   myDate = new Date();
   todaysYear: number = this.myDate.getFullYear();
   lineSearchForm: FormGroup;
   pieSearchForm: FormGroup;
   pieSearchForm2: FormGroup;
   barSearchForm: FormGroup;

   ngOnInit(): void {
      this.lineSearchForm = this.fb.group({
         lineType: new FormControl('', null),
         lineDepartments: new FormControl('', null)
      });
      this.pieSearchForm = this.fb.group({
         pieYears: new FormControl(this.todaysYear, null),
         pieDepartments: new FormControl('', null),
         piePercentSearch: new FormControl('inquiries', null)
      });
      this.pieSearchForm2 = this.fb.group({
         pieYears2: new FormControl(this.todaysYear, null),
         pieDepartments2: new FormControl('', null),
         piePercentSearch2: new FormControl('inquiries', null)
      });
      this.barSearchForm = this.fb.group({
         barYears: new FormControl(this.todaysYear, null),
         barDepartments: new FormControl('', null)
      });
      this.getLineChart();
      this.getPieChart();
      this.getPieChart2();
      this.getBarChart();
   }

   openSnackBar(message) {
      this._snackBar.open(message, 'X', {
         duration: 5000,
         horizontalPosition: this.horizontalPosition,
         verticalPosition: this.verticalPosition,
      });
   }

   // Line Chart
   Linetitle = 'מספר פניות לפי שנה';
   Linetype = 'LineChart';
   Linedata = [];
   Lineoptions = {
      hAxis: {
         title: 'שנה'
      },
      vAxis: {
         title: 'מספר פניות'
      },
      pointSize: 10
   };
   Linewidth = 650;
   Lineheight = 800;

   // Pie Chart
   Pietitle = 'פירוט עפ"י סוג פנייה';
   Pietype = 'PieChart';
   Piedata = [];
   Pieoptions = {
      is3D: true
   };
   Piewidth = 650;
   Pieheight = 800;
   
   // Pie Chart2
   Pietitle2 = 'פירוט עפ"י סוג פנייה';
   Pietype2 = 'PieChart';
   Piedata2 = [];
   Pieoptions2 = {
      is3D: true
   };
   Piewidth2 = 650;
   Pieheight2 = 800;

   // Bar Chart
   Bartitle = 'פירוט פניות עפ"י שנים';
   Bartype = 'BarChart';
   Bardata = [];
   Baroptions = {
      vAxis: {
         title: 'שנה'
      },
      hAxis: {
         title: 'מספר פניות לכל סוג',
         minValue: 0
      },
      isStacked: true
   };
   Barwidth = 650;
   Barheight = 800;


   getLineChart() {
      let type = this.lineSearchForm.controls['lineType'].value;
      let dept = this.lineSearchForm.controls['lineDepartments'].value;
      this.http
         .post("http://srv-apps/wsrfc/WebService.asmx/GetLineChart", {
            _lineType: type,
            _lineDept: dept
         })
         .subscribe((Response) => {
            let inquiriesStatLine = Response["d"];
            this.Linedata = [];
            for (let i = 0; i < inquiriesStatLine.length; i++) {
               this.Linedata.push([inquiriesStatLine[i].InquiriesYear, parseInt(inquiriesStatLine[i].NumOfInquiries)]);
            }
         });
   }

   getPieChart() {
      let year = this.pieSearchForm.controls['pieYears'].value;
      let dept = this.pieSearchForm.controls['pieDepartments'].value;
      let percent = this.pieSearchForm.controls['piePercentSearch'].value;
      if (percent == "patients" && dept == "") {
         this.openSnackBar("נא לבחור מחלקה");
      } else {
         this.http
            .post("http://srv-apps/wsrfc/WebService.asmx/GetPieChart", {
               _pieyear: year,
               _pieDept: dept,
               _percent: percent
            })
            .subscribe((Response) => {
               let inquiriesStatPie = Response["d"];
               this.Piedata = [];
               this.years = [];
               let yearsLength = this.todaysYear - 2019;
               for (let i = 0; i <= yearsLength; i++) {
                  this.years.push(this.todaysYear - i);
               }
               for (let i = 0; i < inquiriesStatPie.length; i++) {
                  this.Piedata.push([inquiriesStatPie[i].Comp_Type, parseInt(inquiriesStatPie[i].NumberOfCompType)]);
               }
            });
      }
   }
   
   getPieChart2() {
      let year = this.pieSearchForm2.controls['pieYears2'].value;
      let dept = this.pieSearchForm2.controls['pieDepartments2'].value;
      let percent = this.pieSearchForm2.controls['piePercentSearch2'].value;
      if (percent == "patients" && dept == "") {
         this.openSnackBar("נא לבחור מחלקה");
      } else {
         this.http
            .post("http://srv-apps/wsrfc/WebService.asmx/GetPieChart2", {
               _pieyear2: year,
               _pieDept2: dept,
               _percent2: percent
            })
            .subscribe((Response) => {
               let inquiriesStatPie = Response["d"];
               this.Piedata2 = [];
               this.years = [];
               let yearsLength = this.todaysYear - 2019;
               for (let i = 0; i <= yearsLength; i++) {
                  this.years.push(this.todaysYear - i);
               }
               for (let i = 0; i < inquiriesStatPie.length; i++) {
                  this.Piedata2.push([inquiriesStatPie[i].ComplaintSubject, parseInt(inquiriesStatPie[i].NumberOfCompSubject)]);
               }
            });
      }
   }

   getBarChart() {
      let year = this.barSearchForm.controls['barYears'].value;
      let dept = this.barSearchForm.controls['barDepartments'].value;
      this.http
         .post("http://srv-apps/wsrfc/WebService.asmx/GetBarChart", {
            _baryear: year,
            _barDept: dept
         })
         .subscribe((Response) => {
            let inquiriesStatBar = Response["d"];
            this.Bardata = [];
            for (let i = 0; i < inquiriesStatBar.length; i++) {
               this.Bardata.push([inquiriesStatBar[i].YEAR, parseInt(inquiriesStatBar[i].Inquiry), parseInt(inquiriesStatBar[i].Thank), parseInt(inquiriesStatBar[i].Complaint), parseInt(inquiriesStatBar[i].Job)]);
            }
         });
   }
}
