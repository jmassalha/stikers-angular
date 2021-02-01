import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Covid19reportComponent } from './covid19report.component';

describe('Covid19reportComponent', () => {
  let component: Covid19reportComponent;
  let fixture: ComponentFixture<Covid19reportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Covid19reportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Covid19reportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
