import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditIpPointComponent } from './add-or-edit-ip-point.component';

describe('AddOrEditIpPointComponent', () => {
  let component: AddOrEditIpPointComponent;
  let fixture: ComponentFixture<AddOrEditIpPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrEditIpPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrEditIpPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
