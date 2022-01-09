import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesAddUpdateComponent } from './employees-add-update.component';

describe('EmployeesAddUpdateComponent', () => {
  let component: EmployeesAddUpdateComponent;
  let fixture: ComponentFixture<EmployeesAddUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeesAddUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesAddUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
