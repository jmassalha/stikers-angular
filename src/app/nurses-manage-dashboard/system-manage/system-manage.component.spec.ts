import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemManageComponent } from './system-manage.component';

describe('SystemManageComponent', () => {
  let component: SystemManageComponent;
  let fixture: ComponentFixture<SystemManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
