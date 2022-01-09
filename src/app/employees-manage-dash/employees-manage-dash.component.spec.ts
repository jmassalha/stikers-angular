import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesManageDashComponent } from './employees-manage-dash.component';

describe('EmployeesManageDashComponent', () => {
  let component: EmployeesManageDashComponent;
  let fixture: ComponentFixture<EmployeesManageDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeesManageDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesManageDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
