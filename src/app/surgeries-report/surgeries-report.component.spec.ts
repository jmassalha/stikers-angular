import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurgeriesReportComponent } from './surgeries-report.component';

describe('SurgeriesReportComponent', () => {
  let component: SurgeriesReportComponent;
  let fixture: ComponentFixture<SurgeriesReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurgeriesReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurgeriesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
