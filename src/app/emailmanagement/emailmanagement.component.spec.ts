import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmailmanagementComponent } from './emailmanagement.component';

describe('EmailmanagementComponent', () => {
  let component: EmailmanagementComponent;
  let fixture: ComponentFixture<EmailmanagementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailmanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
