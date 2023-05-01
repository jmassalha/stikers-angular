import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersToAppointmentsComponent } from './orders-to-appointments.component';

describe('OrdersToAppointmentsComponent', () => {
  let component: OrdersToAppointmentsComponent;
  let fixture: ComponentFixture<OrdersToAppointmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersToAppointmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersToAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
