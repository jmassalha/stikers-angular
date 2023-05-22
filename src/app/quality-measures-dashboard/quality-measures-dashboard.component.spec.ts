import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityMeasuresDashboardComponent } from './quality-measures-dashboard.component';

describe('QualityMeasuresDashboardComponent', () => {
  let component: QualityMeasuresDashboardComponent;
  let fixture: ComponentFixture<QualityMeasuresDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualityMeasuresDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityMeasuresDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
