import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EshbozComponent } from './eshboz.component';

describe('EshbozComponent', () => {
  let component: EshbozComponent;
  let fixture: ComponentFixture<EshbozComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EshbozComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EshbozComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
