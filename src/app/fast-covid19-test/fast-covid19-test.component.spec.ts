import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FastCovid19TestComponent } from './fast-covid19-test.component';

describe('FastCovid19TestComponent', () => {
  let component: FastCovid19TestComponent;
  let fixture: ComponentFixture<FastCovid19TestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FastCovid19TestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FastCovid19TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
