import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardiologyCalendarComponent } from './cardiology-calendar.component';

describe('CardiologyCalendarComponent', () => {
  let component: CardiologyCalendarComponent;
  let fixture: ComponentFixture<CardiologyCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardiologyCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardiologyCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
