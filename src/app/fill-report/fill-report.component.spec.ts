import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { FillReportComponent } from './fill-report.component';

describe('FillReportComponent', () => {
  let component: FillReportComponent;
  let fixture: ComponentFixture<FillReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FillReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FillReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
