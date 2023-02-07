import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EyesSurgeryCalendarComponent } from './eyes-surgery-calendar.component';

describe('EyesSurgeryCalendarComponent', () => {
  let component: EyesSurgeryCalendarComponent;
  let fixture: ComponentFixture<EyesSurgeryCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EyesSurgeryCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EyesSurgeryCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
