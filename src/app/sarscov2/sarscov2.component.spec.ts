import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Sarscov2Component } from './sarscov2.component';

describe('Sarscov2Component', () => {
  let component: Sarscov2Component;
  let fixture: ComponentFixture<Sarscov2Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Sarscov2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sarscov2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
