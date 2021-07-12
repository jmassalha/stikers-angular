import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PoriadepartsComponent } from './poriadeparts.component';

describe('PoriadepartsComponent', () => {
  let component: PoriadepartsComponent;
  let fixture: ComponentFixture<PoriadepartsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PoriadepartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoriadepartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
