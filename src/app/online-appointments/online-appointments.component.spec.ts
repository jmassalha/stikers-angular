import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineAppointmentsComponent } from './online-appointments.component';

describe('OnlineAppointmentsComponent', () => {
  let component: OnlineAppointmentsComponent;
  let fixture: ComponentFixture<OnlineAppointmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineAppointmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
