import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfectionReportComponent } from './infection-report.component';

describe('InfectionReportComponent', () => {
  let component: InfectionReportComponent;
  let fixture: ComponentFixture<InfectionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfectionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
