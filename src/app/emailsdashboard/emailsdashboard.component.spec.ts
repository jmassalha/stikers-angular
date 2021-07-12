import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmailsdashboardComponent } from './emailsdashboard.component';

describe('EmailsdashboardComponent', () => {
  let component: EmailsdashboardComponent;
  let fixture: ComponentFixture<EmailsdashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailsdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailsdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
