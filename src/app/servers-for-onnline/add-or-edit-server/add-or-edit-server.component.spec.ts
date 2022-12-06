import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditServerComponent } from './add-or-edit-server.component';

describe('AddOrEditServerComponent', () => {
  let component: AddOrEditServerComponent;
  let fixture: ComponentFixture<AddOrEditServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrEditServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrEditServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
