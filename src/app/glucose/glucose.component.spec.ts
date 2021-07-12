import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GlucoseComponent } from './glucose.component';

describe('GlucoseComponent', () => {
  let component: GlucoseComponent;
  let fixture: ComponentFixture<GlucoseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GlucoseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlucoseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
