import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Covid19reportComponent } from './covid19report.component';

describe('Covid19reportComponent', () => {
  let component: Covid19reportComponent;
  let fixture: ComponentFixture<Covid19reportComponent>;

  beforeEach(waitForAsync(() => {
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
