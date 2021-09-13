import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrgentSurgeriesComponent } from './urgent-surgeries.component';

describe('UrgentSurgeriesComponent', () => {
  let component: UrgentSurgeriesComponent;
  let fixture: ComponentFixture<UrgentSurgeriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrgentSurgeriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrgentSurgeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
