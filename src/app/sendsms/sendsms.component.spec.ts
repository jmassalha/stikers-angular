import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SendsmsComponent } from './sendsms.component';

describe('SendsmsComponent', () => {
  let component: SendsmsComponent;
  let fixture: ComponentFixture<SendsmsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SendsmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendsmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
