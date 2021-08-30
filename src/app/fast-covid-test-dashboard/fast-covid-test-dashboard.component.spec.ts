import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FastCovidTestDashboardComponent } from './fast-covid-test-dashboard.component';

describe('FastCovidTestDashboardComponent', () => {
  let component: FastCovidTestDashboardComponent;
  let fixture: ComponentFixture<FastCovidTestDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FastCovidTestDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FastCovidTestDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
