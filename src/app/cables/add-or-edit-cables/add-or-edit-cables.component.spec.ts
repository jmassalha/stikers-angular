import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditCablesComponent } from './add-or-edit-cables.component';

describe('AddOrEditCablesComponent', () => {
  let component: AddOrEditCablesComponent;
  let fixture: ComponentFixture<AddOrEditCablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrEditCablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrEditCablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
