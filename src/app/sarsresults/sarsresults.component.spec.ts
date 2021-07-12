import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SarsresultsComponent } from './sarsresults.component';

describe('SarsresultsComponent', () => {
  let component: SarsresultsComponent;
  let fixture: ComponentFixture<SarsresultsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SarsresultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SarsresultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
