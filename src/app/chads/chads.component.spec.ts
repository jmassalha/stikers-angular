import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChadsComponent } from './chads.component';

describe('ChadsComponent', () => {
  let component: ChadsComponent;
  let fixture: ComponentFixture<ChadsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
