import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NmrIframeComponent } from './nmr-iframe.component';

describe('NmrIframeComponent', () => {
  let component: NmrIframeComponent;
  let fixture: ComponentFixture<NmrIframeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NmrIframeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NmrIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
