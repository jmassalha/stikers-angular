import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurgeryCalendarComponent } from './eyes-surgery-calendar.component';

describe('SurgeryCalendarComponent', () => {
  let component: SurgeryCalendarComponent;
  let fixture: ComponentFixture<SurgeryCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurgeryCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurgeryCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
