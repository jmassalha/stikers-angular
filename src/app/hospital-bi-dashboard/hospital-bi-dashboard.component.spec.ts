import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalBIDashboardComponent } from './hospital-bi-dashboard.component';

describe('HospitalBIDashboardComponent', () => {
  let component: HospitalBIDashboardComponent;
  let fixture: ComponentFixture<HospitalBIDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HospitalBIDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalBIDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
