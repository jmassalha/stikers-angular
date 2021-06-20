import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckpatientinsmartclosetComponent } from './checkpatientinsmartcloset.component';

describe('CheckpatientinsmartclosetComponent', () => {
  let component: CheckpatientinsmartclosetComponent;
  let fixture: ComponentFixture<CheckpatientinsmartclosetComponent>;

  beforeEach(async(() => {
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
