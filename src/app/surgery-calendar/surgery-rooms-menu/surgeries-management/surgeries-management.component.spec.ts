import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurgeriesManagementComponent } from './surgeries-management.component';

describe('SurgeriesManagementComponent', () => {
  let component: SurgeriesManagementComponent;
  let fixture: ComponentFixture<SurgeriesManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurgeriesManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurgeriesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
