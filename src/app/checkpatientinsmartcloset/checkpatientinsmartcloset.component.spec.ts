import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CheckpatientinsmartclosetComponent } from './checkpatientinsmartcloset.component';

describe('CheckpatientinsmartclosetComponent', () => {
  let component: CheckpatientinsmartclosetComponent;
  let fixture: ComponentFixture<CheckpatientinsmartclosetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckpatientinsmartclosetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckpatientinsmartclosetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
