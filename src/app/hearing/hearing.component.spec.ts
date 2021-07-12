import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HearingComponent } from './hearing.component';

describe('HearingComponent', () => {
  let component: HearingComponent;
  let fixture: ComponentFixture<HearingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HearingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HearingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
