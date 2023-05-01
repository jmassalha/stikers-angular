import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FastCovidSendEamilComponent } from './fast-covid-send-eamil.component';

describe('FastCovidSendEamilComponent', () => {
  let component: FastCovidSendEamilComponent;
  let fixture: ComponentFixture<FastCovidSendEamilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FastCovidSendEamilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FastCovidSendEamilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
