import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorsRegistrationComponent } from './visitors-registration.component';

describe('VisitorsRegistrationComponent', () => {
  let component: VisitorsRegistrationComponent;
  let fixture: ComponentFixture<VisitorsRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitorsRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorsRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
