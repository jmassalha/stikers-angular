import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClinicsDashboardComponent } from './clinics-dashboard.component';

describe('ClinicsDashboardComponent', () => {
  let component: ClinicsDashboardComponent;
  let fixture: ComponentFixture<ClinicsDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
