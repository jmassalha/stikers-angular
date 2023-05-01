import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalitPointsReportComponent } from './galit-points-report.component';

describe('GalitPointsReportComponent', () => {
  let component: GalitPointsReportComponent;
  let fixture: ComponentFixture<GalitPointsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalitPointsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalitPointsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
