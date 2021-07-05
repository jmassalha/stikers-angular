import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NursesDepartmentManageComponent } from './nurses-department-manage.component';

describe('NursesDepartmentManageComponent', () => {
  let component: NursesDepartmentManageComponent;
  let fixture: ComponentFixture<NursesDepartmentManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NursesDepartmentManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NursesDepartmentManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
