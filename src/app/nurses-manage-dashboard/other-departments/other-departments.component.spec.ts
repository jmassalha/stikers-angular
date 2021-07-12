import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherDepartmentsComponent } from './other-departments.component';

describe('OtherDepartmentsComponent', () => {
  let component: OtherDepartmentsComponent;
  let fixture: ComponentFixture<OtherDepartmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherDepartmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
