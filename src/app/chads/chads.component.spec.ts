import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChadsComponent } from './chads.component';

describe('ChadsComponent', () => {
  let component: ChadsComponent;
  let fixture: ComponentFixture<ChadsComponent>;

  beforeEach(async(() => {
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
