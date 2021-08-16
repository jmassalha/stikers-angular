import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorsMonitoringComponent } from './visitors-monitoring.component';

describe('VisitorsMonitoringComponent', () => {
  let component: VisitorsMonitoringComponent;
  let fixture: ComponentFixture<VisitorsMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitorsMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorsMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
