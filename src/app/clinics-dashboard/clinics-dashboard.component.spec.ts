<<<<<<< HEAD
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
=======
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
>>>>>>> bb3bf51b888e879d0a307d92b8f751da93455712

import { ClinicsDashboardComponent } from './clinics-dashboard.component';

describe('ClinicsDashboardComponent', () => {
  let component: ClinicsDashboardComponent;
  let fixture: ComponentFixture<ClinicsDashboardComponent>;

<<<<<<< HEAD
  beforeEach(async(() => {
=======
  beforeEach(waitForAsync(() => {
>>>>>>> bb3bf51b888e879d0a307d92b8f751da93455712
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
