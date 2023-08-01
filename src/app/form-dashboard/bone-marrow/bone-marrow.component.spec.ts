import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoneMarrowComponent } from './bone-marrow.component';

describe('BoneMarrowComponent', () => {
  let component: BoneMarrowComponent;
  let fixture: ComponentFixture<BoneMarrowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoneMarrowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoneMarrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
