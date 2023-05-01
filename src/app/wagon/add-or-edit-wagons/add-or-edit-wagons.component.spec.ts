import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditWagonsComponent } from './add-or-edit-wagons.component';

describe('AddOrEditWagonsComponent', () => {
  let component: AddOrEditWagonsComponent;
  let fixture: ComponentFixture<AddOrEditWagonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrEditWagonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrEditWagonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
