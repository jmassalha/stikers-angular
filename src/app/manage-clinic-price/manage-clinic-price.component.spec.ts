import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageClinicPriceComponent } from './manage-clinic-price.component';

describe('ManageClinicPriceComponent', () => {
  let component: ManageClinicPriceComponent;
  let fixture: ComponentFixture<ManageClinicPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageClinicPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageClinicPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
