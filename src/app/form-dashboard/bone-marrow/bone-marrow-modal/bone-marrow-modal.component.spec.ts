import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoneMarrowModalComponent } from './bone-marrow-modal.component';

describe('BoneMarrowModalComponent', () => {
  let component: BoneMarrowModalComponent;
  let fixture: ComponentFixture<BoneMarrowModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoneMarrowModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoneMarrowModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
