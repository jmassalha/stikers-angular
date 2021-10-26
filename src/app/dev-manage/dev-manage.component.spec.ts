import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevManageComponent } from './dev-manage.component';

describe('DevManageComponent', () => {
  let component: DevManageComponent;
  let fixture: ComponentFixture<DevManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
