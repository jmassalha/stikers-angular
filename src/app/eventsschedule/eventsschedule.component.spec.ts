import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsscheduleComponent } from './eventsschedule.component';

describe('EventsscheduleComponent', () => {
  let component: EventsscheduleComponent;
  let fixture: ComponentFixture<EventsscheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsscheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsscheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
